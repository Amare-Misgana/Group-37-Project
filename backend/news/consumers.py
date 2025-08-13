import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

class NewsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Handle WebSocket connection with role-based authentication"""
        # Get user from scope (set by auth middleware)
        self.user = self.scope.get('user')
        
        if not self.user or not self.user.is_authenticated:
            await self.close()
            return
        
        # Accept the connection
        await self.accept()
        
        # Add user to role-based groups
        await self.add_user_to_groups()
        
        # Send welcome message
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': f'Connected to news channel as {self.user.role}',
            'user_role': self.user.role,
            'user_id': self.user.id
        }))
    
    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        # Remove user from all groups
        await self.remove_user_from_groups()
    
    async def receive(self, text_data):
        """Handle incoming WebSocket messages"""
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'get_news':
                await self.send_news_to_user()
            elif message_type == 'send_news':
                await self.handle_send_news(data)
            else:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'Invalid message type'
                }))
                
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON format'
            }))
    
    @database_sync_to_async
    def add_user_to_groups(self):
        """Add user to role-based groups"""
        if self.user.role:
            # Add to role-specific group
            group_name = f"news_{self.user.role}"
            self.channel_layer.group_add(group_name, self.channel_name)
            
            # Add to general news group
            self.channel_layer.group_add("news_all", self.channel_name)
            
            # If mentor, add to mentor-specific group
            if self.user.role == 'mentor':
                mentor_group = f"mentor_{self.user.id}"
                self.channel_layer.group_add(mentor_group, self.channel_name)
            
            # If student, add to student-specific group
            elif self.user.role == 'student':
                student_group = f"student_{self.user.id}"
                self.channel_layer.group_add(student_group, self.channel_name)
    
    @database_sync_to_async
    def remove_user_from_groups(self):
        """Remove user from all groups"""
        if self.user.role:
            group_name = f"news_{self.user.role}"
            self.channel_layer.group_discard(group_name, self.channel_name)
            self.channel_layer.group_discard("news_all", self.channel_name)
            
            if self.user.role == 'mentor':
                mentor_group = f"mentor_{self.user.id}"
                self.channel_layer.group_discard(mentor_group, self.channel_name)
            elif self.user.role == 'student':
                student_group = f"student_{self.user.id}"
                self.channel_layer.group_discard(student_group, self.channel_name)
    
    async def handle_send_news(self, data):
        """Handle sending news based on user role"""
        if self.user.role == 'admin_staff':
            await self.admin_send_news(data)
        elif self.user.role == 'mentor':
            await self.mentor_send_news(data)
        else:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Students cannot send notifications'
            }))
    
    async def admin_send_news(self, data):
        """Admin can send to mentors, students, or all"""
        target_roles = data.get('target_roles', 'all')
        title = data.get('title', '')
        content = data.get('content', '')
        
        if not title or not content:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Title and content are required'
            }))
            return
        
        # Create news item in database
        news_item = await self.create_news_item(title, content, target_roles)
        
        # Prepare message
        message = {
            'type': 'new_news',
            'news': {
                'id': news_item.id,
                'title': title,
                'content': content,
                'author': f"{self.user.first_name} {self.user.last_name}",
                'target_roles': target_roles,
                'created_at': news_item.created_at.isoformat(),
                'sender_role': 'admin_staff'
            }
        }
        
        # Send to appropriate groups
        if target_roles == 'all':
            await self.channel_layer.group_send(
                "news_all",
                {
                    'type': 'news_message',
                    'message': message
                }
            )
        elif target_roles == 'mentor':
            await self.channel_layer.group_send(
                "news_mentor",
                {
                    'type': 'news_message',
                    'message': message
                }
            )
        elif target_roles == 'student':
            await self.channel_layer.group_send(
                "news_student",
                {
                    'type': 'news_message',
                    'message': message
                }
            )
        
        # Confirm to sender
        await self.send(text_data=json.dumps({
            'type': 'news_sent',
            'message': f'News sent to {target_roles}',
            'news_id': news_item.id
        }))
    
    async def mentor_send_news(self, data):
        """Mentor can only send to their grouped students"""
        title = data.get('title', '')
        content = data.get('content', '')
        target_student_ids = data.get('target_students', [])
        
        if not title or not content:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Title and content are required'
            }))
            return
        
        if not target_student_ids:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Please select target students'
            }))
            return
        
        # Create news item
        news_item = await self.create_news_item(title, content, 'student')
        
        # Prepare message
        message = {
            'type': 'new_news',
            'news': {
                'id': news_item.id,
                'title': title,
                'content': content,
                'author': f"{self.user.first_name} {self.user.last_name}",
                'target_roles': 'student',
                'created_at': news_item.created_at.isoformat(),
                'sender_role': 'mentor',
                'mentor_id': self.user.id
            }
        }
        
        # Send to specific students
        for student_id in target_student_ids:
            await self.channel_layer.group_send(
                f"student_{student_id}",
                {
                    'type': 'news_message',
                    'message': message
                }
            )
        
        # Confirm to sender
        await self.send(text_data=json.dumps({
            'type': 'news_sent',
            'message': f'News sent to {len(target_student_ids)} students',
            'news_id': news_item.id
        }))
    
    async def send_news_to_user(self):
        """Send relevant news to the connected user"""
        news_items = await self.get_user_news()
        
        await self.send(text_data=json.dumps({
            'type': 'news_list',
            'news': news_items
        }))
    
    @database_sync_to_async
    def get_user_news(self):
        """Get news relevant to the user's role"""
        # Import here to avoid Django settings issues
        from .models import News
        
        if self.user.role == 'admin_staff':
            # Admin staff can see all news
            news = News.objects.filter(is_published=True)
        else:
            # Other users see news for their role and general news
            news = News.objects.filter(
                is_published=True,
                target_roles__in=[self.user.role, 'all']
            )
        
        return [
            {
                'id': item.id,
                'title': item.title,
                'content': item.content,
                'author': f"{item.author.first_name} {item.author.last_name}",
                'target_roles': item.target_roles,
                'created_at': item.created_at.isoformat(),
            }
            for item in news[:20]  # Limit to 20 most recent
        ]
    
    @database_sync_to_async
    def create_news_item(self, title, content, target_roles):
        """Create a new news item in the database"""
        # Import here to avoid Django settings issues
        from .models import News
        
        return News.objects.create(
            title=title,
            content=content,
            author=self.user,
            target_roles=target_roles
        )
    
    async def news_message(self, event):
        """Send news message to WebSocket"""
        await self.send(text_data=json.dumps(event['message']))
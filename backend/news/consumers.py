import json
from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]

        # Accept connection only for authenticated users with valid roles
        if not self.user.is_authenticated:
            await self.close()
            return

       
        if self.user.role == "admin":
            self.group_name = "admins"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.channel_layer.group_add("all_users", self.channel_name)
            await self.accept()
        elif self.user.role == "mentor":
            self.group_name = f"mentor_{self.user.id}"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
        elif self.user.role == "student":
            self.group_name = f"student_{self.user.id}"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
        else:
            # Unknown role, reject connection
            await self.close()
            return

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
        if self.user.role == "admin":
            await self.channel_layer.group_discard("all_users", self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message", "")

        # Admins can send to all users
        if self.user.role == "admin":
            await self.channel_layer.group_send(
                "all_users",
                {
                    "type": "chat_message",
                    "message": message,
                    "sender_role": "admin",
                }
            )
        # Mentors can send to their students (assuming a group per mentor)
        elif self.user.role == "mentor":
            group_name = f"students_of_mentor_{self.user.id}"
            await self.channel_layer.group_send(
                group_name,
                {
                    "type": "chat_message",
                    "message": message,
                    "sender_role": "mentor",
                }
            )
        # Students cannot send messages in this model
        else:
            pass

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender_role": event["sender_role"],
        }))
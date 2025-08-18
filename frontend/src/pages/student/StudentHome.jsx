import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiFileText, FiCalendar, FiUser, FiClock, FiBell } from 'react-icons/fi';
import '../../styles/StudentHome.css';

const StudentHome = () => {
  const { user } = useAuth();
  const [newsFeed, setNewsFeed] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setNewsFeed([
      {
        id: 1,
        title: 'Welcome to INSA Summer Camp 2024!',
        content: 'Welcome all students to the INSA Summer Camp 2024! We are excited to have you here for an amazing learning experience. Please make sure to attend the orientation session tomorrow at 9 AM.',
        category: 'Announcement',
        priority: 'high',
        timestamp: '2 hours ago',
        author: 'Admin',
        isRead: false
      },
      {
        id: 2,
        title: 'Campus Event: Science Fair Registration',
        content: 'The annual science fair registration is now open! All students are encouraged to participate. Registration deadline is next Friday. Visit the admin office for more details.',
        category: 'Event',
        priority: 'medium',
        timestamp: '1 day ago',
        author: 'Admin',
        isRead: true
      },
      {
        id: 3,
        title: 'Important: QR Code System Update',
        content: 'We have updated our QR code system for better attendance tracking. Please ensure you have your student QR code ready for all classes and cafeteria visits.',
        category: 'System Update',
        priority: 'high',
        timestamp: '3 days ago',
        author: 'Admin',
        isRead: true
      },
      {
        id: 4,
        title: 'Cafeteria Menu for This Week',
        content: 'Check out this week\'s cafeteria menu featuring healthy and delicious meals. Special dietary requirements can be accommodated upon request.',
        category: 'Information',
        priority: 'low',
        timestamp: '5 days ago',
        author: 'Admin',
        isRead: true
      },
      {
        id: 5,
        title: 'Library Hours Extended',
        content: 'The library will now be open until 10 PM on weekdays to accommodate students who need extra study time. Please respect the quiet study areas.',
        category: 'Facility Update',
        priority: 'medium',
        timestamp: '1 week ago',
        author: 'Admin',
        isRead: true
      }
    ]);

    setRecentActivities([
      {
        id: 1,
        type: 'attendance_marked',
        message: 'Attendance marked for Mathematics class',
        timestamp: '1 hour ago',
        subject: 'Mathematics'
      },
      {
        id: 2,
        type: 'grade_received',
        message: 'Received grade for Physics Quiz: 85%',
        timestamp: '3 hours ago',
        subject: 'Physics'
      },
      {
        id: 3,
        type: 'assignment_submitted',
        message: 'Submitted Chemistry Assignment #3',
        timestamp: '1 day ago',
        subject: 'Chemistry'
      },
      {
        id: 4,
        type: 'meal_recorded',
        message: 'Lunch meal recorded at cafeteria',
        timestamp: '2 days ago',
        subject: 'Cafeteria'
      }
    ]);
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'attendance_marked':
        return <FiCalendar />;
      case 'grade_received':
        return <FiFileText />;
      case 'assignment_submitted':
        return <FiFileText />;
      case 'meal_recorded':
        return <FiBell />;
      default:
        return <FiFileText />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'attendance_marked':
        return '#3498db';
      case 'grade_received':
        return '#27ae60';
      case 'assignment_submitted':
        return '#f39c12';
      case 'meal_recorded':
        return '#9b59b6';
      default:
        return '#95a5a6';
    }
  };

  return (
    <div className="student-home">
      <div className="welcome-section">
        <h1>Welcome back, {user?.name || 'Student'}!</h1>
        <p>Stay updated with the latest news and announcements from the camp administration.</p>
      </div>

      <div className="news-section">
        <div className="section-header">
          <h2>
            <FiFileText />
            News & Announcements
          </h2>
          <p>Latest updates from the camp administration</p>
        </div>

        <div className="news-feed">
          {newsFeed.map(news => (
            <div key={news.id} className={`news-card ${!news.isRead ? 'unread' : ''}`}>
              <div className="news-header">
                <div className="news-title">
                  <h3>{news.title}</h3>
                  {!news.isRead && <span className="unread-indicator"></span>}
                </div>
                <div className="news-meta">
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(news.priority) }}
                  >
                    {news.priority}
                  </span>
                  <span className="category-badge">{news.category}</span>
                </div>
              </div>
              
              <div className="news-content">
                <p>{news.content}</p>
              </div>
              
              <div className="news-footer">
                <div className="news-author">
                  <FiUser />
                  <span>{news.author}</span>
                </div>
                <div className="news-time">
                  <FiClock />
                  <span>{news.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentHome; 
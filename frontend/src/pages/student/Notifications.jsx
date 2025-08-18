import React, { useState } from 'react';
import { FiBell, FiCheck, FiFilter } from 'react-icons/fi';
import '../../styles/Notifications.css';

const StudentNotifications = () => {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Assignment Posted',
      message: 'A new assignment has been posted for Mathematics class. Please check your assignments.',
      type: 'assignment',
      read: false,
      timestamp: '2024-01-15T10:30:00Z',
      sender: 'Dr. Smith'
    },
    {
      id: 2,
      title: 'Attendance Reminder',
      message: 'Please ensure you scan your QR code for attendance today.',
      type: 'reminder',
      read: true,
      timestamp: '2024-01-15T08:00:00Z',
      sender: 'System'
    },
    {
      id: 3,
      title: 'Grade Updated',
      message: 'Your grade for Physics assignment has been updated. Check your grades section.',
      type: 'grade',
      read: false,
      timestamp: '2024-01-14T16:45:00Z',
      sender: 'Prof. Johnson'
    },
    {
      id: 4,
      title: 'Café Menu Update',
      message: 'Today\'s lunch menu has been updated. Check the café section for details.',
      type: 'announcement',
      read: true,
      timestamp: '2024-01-14T12:00:00Z',
      sender: 'Admin'
    },
    {
      id: 5,
      title: 'Class Schedule Change',
      message: 'Tomorrow\'s Chemistry class has been rescheduled to 2:00 PM.',
      type: 'schedule',
      read: false,
      timestamp: '2024-01-14T09:15:00Z',
      sender: 'Dr. Brown'
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'assignment':
        return '📝';
      case 'grade':
        return '📊';
      case 'reminder':
        return '⏰';
      case 'announcement':
        return '📢';
      case 'schedule':
        return '📅';
      default:
        return '📌';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="student-notifications">
      <div className="notifications-header">
        <div className="header-left">
          <h1>Notifications</h1>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount} unread</span>
          )}
        </div>
        <div className="header-actions">
          <button 
            onClick={markAllAsRead}
            className="mark-all-read-btn"
            disabled={unreadCount === 0}
          >
            <FiCheck size={16} />
            Mark all as read
          </button>
        </div>
      </div>

      <div className="notifications-filters">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({notifications.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
          <button 
            className={`filter-btn ${filter === 'assignment' ? 'active' : ''}`}
            onClick={() => setFilter('assignment')}
          >
            Assignments
          </button>
          <button 
            className={`filter-btn ${filter === 'grade' ? 'active' : ''}`}
            onClick={() => setFilter('grade')}
          >
            Grades
          </button>
          <button 
            className={`filter-btn ${filter === 'announcement' ? 'active' : ''}`}
            onClick={() => setFilter('announcement')}
          >
            Announcements
          </button>
        </div>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <FiBell size={48} />
            <h3>No notifications</h3>
            <p>You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
            >
              <div className="notification-icon">
                {getTypeIcon(notification.type)}
              </div>
              
              <div className="notification-content">
                <div className="notification-header">
                  <h3>{notification.title}</h3>
                  <span className="timestamp">{formatTimestamp(notification.timestamp)}</span>
                </div>
                
                <p className="notification-message">{notification.message}</p>
                
                <div className="notification-meta">
                  <span className="sender">From: {notification.sender}</span>
                  <span className="type-badge">{notification.type}</span>
                </div>
              </div>
              
              {!notification.read && (
                <button 
                  onClick={() => markAsRead(notification.id)}
                  className="mark-read-btn"
                  title="Mark as read"
                >
                  <FiCheck size={16} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentNotifications; 
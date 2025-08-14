import React, { useState, useEffect } from 'react';
import { FiBell, FiMail, FiClock, FiUser } from 'react-icons/fi';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock data - replace with actual API calls
    setNotifications([
      {
        id: 1,
        title: 'New Assignment Posted',
        message: 'A new block chain assignment has been posted for your class.',
        type: 'assignment',
        sender: 'Admin',
        timestamp: '2 hours ago',
        read: false,
        priority: 'high'
      },
      {
        id: 2,
        title: 'Meeting Reminder',
        message: 'Staff meeting scheduled for tomorrow at 10:00 AM in the conference room.',
        type: 'meeting',
        sender: 'Admin',
        timestamp: '4 hours ago',
        read: true,
        priority: 'medium'
      },
      {
        id: 3,
        title: 'Grade Submission Deadline',
        message: 'Please submit all student grades by the end of this week.',
        type: 'reminder',
        sender: 'Admin',
        timestamp: '1 day ago',
        read: false,
        priority: 'high'
      },
      {
        id: 4,
        title: 'New Student Assigned',
        message: 'Ahmed Hassan has been assigned to your Class A.',
        type: 'student',
        sender: 'Admin',
        timestamp: '2 days ago',
        read: true,
        priority: 'low'
      }
    ]);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment': return <FiBell className="notification-icon assignment" />;
      case 'meeting': return <FiClock className="notification-icon meeting" />;
      case 'reminder': return <FiMail className="notification-icon reminder" />;
      case 'student': return <FiUser className="notification-icon student" />;
      default: return <FiBell className="notification-icon" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications">
      <div className="page-header">
        <h1>Notifications</h1>
        <div className="header-actions">
          <span className="unread-count">{unreadCount} unread</span>
          {unreadCount > 0 && (
            <button className="mark-all-read" onClick={markAllAsRead}>
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="notification-filters">
        <button 
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-button ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread
        </button>
        <button 
          className={`filter-button ${filter === 'assignment' ? 'active' : ''}`}
          onClick={() => setFilter('assignment')}
        >
          Assignments
        </button>
        <button 
          className={`filter-button ${filter === 'meeting' ? 'active' : ''}`}
          onClick={() => setFilter('meeting')}
        >
          Meetings
        </button>
        <button 
          className={`filter-button ${filter === 'reminder' ? 'active' : ''}`}
          onClick={() => setFilter('reminder')}
        >
          Reminders
        </button>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {filteredNotifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification-item ${!notification.read ? 'unread' : ''}`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="notification-icon-wrapper">
              {getNotificationIcon(notification.type)}
            </div>
            
            <div className="notification-content">
              <div className="notification-header">
                <h3 className="notification-title">{notification.title}</h3>
                <span className={`priority-badge ${getPriorityColor(notification.priority)}`}>
                  {notification.priority}
                </span>
              </div>
              
              <p className="notification-message">{notification.message}</p>
              
              <div className="notification-meta">
                <span className="notification-sender">
                  <FiUser />
                  {notification.sender}
                </span>
                <span className="notification-time">
                  <FiClock />
                  {notification.timestamp}
                </span>
              </div>
            </div>
            
            {!notification.read && <div className="unread-indicator" />}
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="no-notifications">
          <FiBell className="no-notifications-icon" />
          <p>No notifications found.</p>
        </div>
      )}
    </div>
  );
};

export default Notifications; 
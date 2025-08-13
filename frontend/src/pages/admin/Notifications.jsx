import React, { useState } from 'react';
import { FiSend, FiUsers, FiUser, FiBell, FiTrash2, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import '../../styles/Notifications.css';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('send');
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    recipients: 'all', // 'all', 'students', 'mentors'
    priority: 'normal' // 'low', 'normal', 'high'
  });

  // Mock data for notifications
  const [sentNotifications] = useState([
    {
      id: 1,
      title: 'Welcome to Summer Camp!',
      message: 'Welcome all students and mentors to the INSA Summer Camp 2024!',
      recipients: 'all',
      priority: 'high',
      sentAt: '2024-06-15 09:00',
      readCount: 45
    },
    {
      id: 2,
      title: 'Class Schedule Update',
      message: 'Please note that the afternoon classes have been rescheduled.',
      recipients: 'students',
      priority: 'normal',
      sentAt: '2024-06-14 14:30',
      readCount: 32
    },
    {
      id: 3,
      title: 'Mentor Meeting',
      message: 'All mentors are required to attend the weekly meeting tomorrow.',
      recipients: 'mentors',
      priority: 'high',
      sentAt: '2024-06-13 16:00',
      readCount: 8
    }
  ]);

  const [receivedNotifications] = useState([
    {
      id: 1,
      title: 'System Maintenance',
      message: 'The system will be under maintenance tonight from 10 PM to 2 AM.',
      from: 'System Admin',
      receivedAt: '2024-06-15 18:00',
      isRead: true
    },
    {
      id: 2,
      title: 'New Feature Available',
      message: 'QR code scanning feature is now available for all users.',
      from: 'Tech Team',
      receivedAt: '2024-06-14 10:00',
      isRead: false
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotificationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendNotification = (e) => {
    e.preventDefault();
    
    if (!notificationForm.title.trim() || !notificationForm.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Mock API call
    console.log('Sending notification:', notificationForm);
    
    // Simulate API delay
    setTimeout(() => {
      toast.success('Notification sent successfully!');
      setNotificationForm({
        title: '',
        message: '',
        recipients: 'all',
        priority: 'normal'
      });
    }, 1000);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'normal': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getRecipientsText = (recipients) => {
    switch (recipients) {
      case 'all': return 'All Users';
      case 'students': return 'Students Only';
      case 'mentors': return 'Mentors Only';
      default: return recipients;
    }
  };

  return (
    <div className="notifications-page">
      <div className="page-header">
        <h2>Notifications Management</h2>
        <p>Send notifications to students and mentors, view sent and received messages</p>
      </div>

      <div className="notifications-tabs">
        <button 
          className={`tab-button ${activeTab === 'send' ? 'active' : ''}`}
          onClick={() => setActiveTab('send')}
        >
          <FiSend />
          Send Notification
        </button>
        <button 
          className={`tab-button ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          <FiBell />
          Sent Notifications
        </button>
        <button 
          className={`tab-button ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          <FiEye />
          Received Notifications
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'send' && (
          <div className="send-notification">
            <div className="notification-form-card">
              <h3>Send New Notification</h3>
              <form onSubmit={handleSendNotification}>
                <div className="form-group">
                  <label htmlFor="title">Notification Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={notificationForm.title}
                    onChange={handleInputChange}
                    placeholder="Enter notification title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={notificationForm.message}
                    onChange={handleInputChange}
                    placeholder="Enter your message"
                    rows="4"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="recipients">Recipients</label>
                    <select
                      id="recipients"
                      name="recipients"
                      value={notificationForm.recipients}
                      onChange={handleInputChange}
                    >
                      <option value="all">All Users</option>
                      <option value="students">Students Only</option>
                      <option value="mentors">Mentors Only</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                      id="priority"
                      name="priority"
                      value={notificationForm.priority}
                      onChange={handleInputChange}
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="send-btn">
                    <FiSend />
                    Send Notification
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'sent' && (
          <div className="sent-notifications">
            <div className="notifications-list">
              {sentNotifications.map(notification => (
                <div key={notification.id} className="notification-card">
                  <div className="notification-header">
                    <div className="notification-title">
                      <h4>{notification.title}</h4>
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(notification.priority) }}
                      >
                        {notification.priority}
                      </span>
                    </div>
                    <div className="notification-meta">
                      <span className="recipients">
                        <FiUsers />
                        {getRecipientsText(notification.recipients)}
                      </span>
                      <span className="timestamp">{notification.sentAt}</span>
                    </div>
                  </div>
                  <div className="notification-content">
                    <p>{notification.message}</p>
                  </div>
                  <div className="notification-footer">
                    <span className="read-count">
                      <FiEye />
                      {notification.readCount} read
                    </span>
                    <button className="delete-btn">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'received' && (
          <div className="received-notifications">
            <div className="notifications-list">
              {receivedNotifications.map(notification => (
                <div key={notification.id} className={`notification-card ${!notification.isRead ? 'unread' : ''}`}>
                  <div className="notification-header">
                    <div className="notification-title">
                      <h4>{notification.title}</h4>
                      {!notification.isRead && <span className="unread-indicator"></span>}
                    </div>
                    <div className="notification-meta">
                      <span className="sender">
                        <FiUser />
                        {notification.from}
                      </span>
                      <span className="timestamp">{notification.receivedAt}</span>
                    </div>
                  </div>
                  <div className="notification-content">
                    <p>{notification.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications; 
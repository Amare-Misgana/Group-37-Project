import React, { useState, useEffect } from 'react';
import { FiSend, FiUser, FiClock, FiMessageSquare } from 'react-icons/fi';
import '../../styles/Messages.css';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [showCompose, setShowCompose] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Mock data - replace with actual API calls
    setMessages([
      {
        id: 1,
        sender: 'smework',
        recipient: 'You',
        content: 'Great work on the Mathematics assignment! Keep up the excellent progress.',
        timestamp: '2 hours ago',
        type: 'received',
        read: true
      },
      {
        id: 2,
        sender: 'You',
        recipient: 'hana tefera',
        content: 'I have a question about the Physics lab report. Can you help me understand the titration process?',
        timestamp: '1 day ago',
        type: 'sent',
        read: true
      },
      {
        id: 3,
        sender: 'Admin',
        recipient: 'You',
        content: 'Please submit your updated contact information by the end of this week.',
        timestamp: '2 days ago',
        type: 'received',
        read: false
      },
      {
        id: 4,
        sender: 'You',
        recipient: 'Admin',
        content: 'I would like to request a meeting to discuss my academic progress.',
        timestamp: '3 days ago',
        type: 'sent',
        read: true
      }
    ]);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!selectedRecipient || !newMessage.trim()) return;

    const message = {
      id: Date.now(),
      sender: 'You',
      recipient: selectedRecipient,
      content: newMessage,
      timestamp: 'Just now',
      type: 'sent',
      read: true
    };

    setMessages([message, ...messages]);
    setNewMessage('');
    setSelectedRecipient('');
    setShowCompose(false);
  };

  const markAsRead = (id) => {
    setMessages(messages.map(message =>
      message.id === id ? { ...message, read: true } : message
    ));
  };

  const unreadCount = messages.filter(m => !m.read && m.type === 'received').length;

  return (
    <div className="messages">
      <div className="page-header">
        <h1>Messages</h1>
        <div className="header-actions">
          {unreadCount > 0 && (
            <span className="unread-count">{unreadCount} unread</span>
          )}
          <button 
            className="compose-button"
            onClick={() => setShowCompose(true)}
          >
            <FiMessageSquare />
            New Message
          </button>
        </div>
      </div>

      {/* Compose Message */}
      {showCompose && (
        <div className="compose-section">
          <h3>Compose New Message</h3>
          <form onSubmit={handleSendMessage} className="compose-form">
            <div className="form-group">
              <label>To:</label>
              <select
                value={selectedRecipient}
                onChange={(e) => setSelectedRecipient(e.target.value)}
                required
              >
                <option value="">Select Recipient</option>
                <option value="Admin">Admin</option>
                <option value="Dr. Sarah Johnson">Dr. Sarah Johnson (Mathematics)</option>
                <option value="Dr. Ahmed Hassan">Dr. Ahmed Hassan (Physics)</option>
                <option value="Dr. Fatima Ali">Dr. Fatima Ali (Chemistry)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Message:</label>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                rows="4"
                required
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="send-button">
                <FiSend />
                Send Message
              </button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => {
                  setShowCompose(false);
                  setNewMessage('');
                  setSelectedRecipient('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Messages List */}
      <div className="messages-list">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message-item ${message.type} ${!message.read ? 'unread' : ''}`}
            onClick={() => message.type === 'received' && markAsRead(message.id)}
          >
            <div className="message-header">
              <div className="message-info">
                <span className="message-sender">
                  <FiUser className="fiUser" />
                  {' '}
                  {message.sender}
                  {' '}
                </span>
                <span className="message-recipient">
                  to {message.recipient}
                </span>
              </div>
              <span className="message-time">
                <FiClock />
                {message.timestamp}
              </span>
            </div>
            
            <div className="message-content">
              <p>{message.content}</p>
            </div>
            
            {!message.read && message.type === 'received' && (
              <div className="unread-indicator" />
            )}
          </div>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="no-messages">
          <FiMessageSquare className="no-messages-icon" />
          <p>No messages yet. Start a conversation!</p>
        </div>
      )}
    </div>
  );
};

export default Messages; 
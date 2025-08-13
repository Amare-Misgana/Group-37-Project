import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import '../../styles/NewsManagement.css';

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'normal'
  });

  useEffect(() => {
    // Mock data - replace with API call
    setNews([
      {
        id: 1,
        title: 'Welcome to INSA Summer Camp 2024!',
        content: 'We are excited to welcome all students to our annual summer camp. This year promises to be filled with amazing learning opportunities and fun activities.',
        category: 'announcement',
        priority: 'high',
        date: '2024-06-15',
        views: 156
      },
      {
        id: 2,
        title: 'New Computer Science Course Available',
        content: 'We are pleased to announce the addition of a new advanced computer science course starting next week.',
        category: 'academic',
        priority: 'normal',
        date: '2024-06-14',
        views: 89
      }
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingNews) {
      setNews(prev => prev.map(item => 
        item.id === editingNews.id 
          ? { ...item, ...formData, date: new Date().toISOString().split('T')[0] }
          : item
      ));
      toast.success('News updated successfully!');
    } else {
      const newItem = {
        id: Date.now(),
        ...formData,
        date: new Date().toISOString().split('T')[0],
        views: 0
      };
      setNews(prev => [newItem, ...prev]);
      toast.success('News posted successfully!');
    }
    
    handleCloseModal();
  };

  const handleEdit = (item) => {
    setEditingNews(item);
    setFormData({
      title: item.title,
      content: item.content,
      category: item.category,
      priority: item.priority
    });
    setShowModal(true);
  };

  const handleDelete = (newsId) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      setNews(prev => prev.filter(item => item.id !== newsId));
      toast.success('News deleted successfully!');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNews(null);
    setFormData({
      title: '',
      content: '',
      category: 'general',
      priority: 'normal'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'normal': return '#3498db';
      case 'low': return '#27ae60';
      default: return '#7f8c8d';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'announcement': return '#e67e22';
      case 'academic': return '#9b59b6';
      case 'event': return '#f39c12';
      default: return '#7f8c8d';
    }
  };

  return (
    <div className="news-management">
      <div className="page-header">
        <h1>News Management</h1>
        <button 
          className="add-button"
          onClick={() => setShowModal(true)}
        >
          <FiPlus /> Post News
        </button>
      </div>

      {/* News List */}
      <div className="news-list">
        {news.map(item => (
          <div key={item.id} className="news-card">
            <div className="news-header">
              <div className="news-meta">
                <h3>{item.title}</h3>
                <div className="news-tags">
                  <span 
                    className="priority-tag"
                    style={{ backgroundColor: getPriorityColor(item.priority) }}
                  >
                    {item.priority}
                  </span>
                  <span 
                    className="category-tag"
                    style={{ backgroundColor: getCategoryColor(item.category) }}
                  >
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="news-actions">
                <button 
                  className="action-btn view"
                  title="View"
                >
                  <FiEye />
                </button>
                <button 
                  onClick={() => handleEdit(item)}
                  className="action-btn edit"
                  title="Edit"
                >
                  <FiEdit />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="action-btn delete"
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
            
            <p className="news-content">{item.content}</p>
            
            <div className="news-footer">
              <span className="news-date">{item.date}</span>
              <span className="news-views">{item.views} views</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingNews ? 'Edit News' : 'Post News'}</h2>
              <button onClick={handleCloseModal} className="close-btn">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="news-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter news title"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="general">General</option>
                    <option value="announcement">Announcement</option>
                    <option value="academic">Academic</option>
                    <option value="event">Event</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter news content"
                  rows="6"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={handleCloseModal} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingNews ? 'Update' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsManagement; 
import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiMail, FiBell, FiUser, FiPhone, FiBookOpen, FiUsers, FiAward, FiStar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import '../../styles/MentorManagement.css';

const MentorManagement = () => {
  const [mentors, setMentors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMentor, setEditingMentor] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    assignedClass: '',
    photo: null,
    specialization: ''
  });

  const [notificationData, setNotificationData] = useState({
    subject: '',
    message: ''
  });

  // Department and Class structure
  const departments = {
    'Aerospace': ['Aerospace Engineering', 'Flight Dynamics', 'Space Systems'],
    'Cybersecurity': ['Network Security', 'Ethical Hacking', 'Digital Forensics'],
    'Development': ['Web Development', 'Mobile Development', 'Software Engineering'],
    'Embedded': ['Embedded Systems', 'IoT Development', 'Hardware Programming']
  };

  useEffect(() => {
    // Mock data - replace with API call
    setMentors([
      {
        id: 1,
        name: "Mr. Henok",
        email: 'henok123@insa.com',
        phone: '+251912345678',
        department: 'Aerospace',
        assignedClass: 'Aerospace Engineering',
        specialization: 'Aerospace Engineering',
        photo: 'https://www.shutterstock.com/image-photo/gasena-ethiopia-aug-2-ethiopian-260nw-137902043.jpg',
        studentsCount: 18,
        status: 'active'
      },
      {
        id: 2,
        name: 'samuel burka',
        email: 'sami@insa.com',
        phone: '+25123445',
        department: 'Cybersecurity',
        assignedClass: 'Network Security',
        specialization: 'Cybersecurity',
        photo: 'https://www.shutterstock.com/image-photo/gasena-ethiopia-aug-2-ethiopian-260nw-137902043.jpg',
        studentsCount: 22,
        status: 'active'
      },
      {
        id: 3,
        name: 'yadel selomon',
        email: 'yadel@insa.com',
        phone: '+251987654321',
        department: 'Development',
        assignedClass: 'Web Development',
        specialization: 'Software Development',
        photo: 'https://www.shutterstock.com/image-photo/gasena-ethiopia-aug-2-ethiopian-260nw-137902043.jpg',
        studentsCount: 15,
        status: 'active'
      },
      {
        id: 4,
        name: 'abinet tesfaye',
        email: 'abinet@insa.com',
        phone: '+1234567893',
        department: 'Embedded',
        assignedClass: 'Embedded Systems',
        specialization: 'Embedded Systems',
        photo: 'https://www.shutterstock.com/image-photo/gasena-ethiopia-aug-2-ethiopian-260nw-137902043.jpg',
        studentsCount: 19,
        status: 'active'
      }
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingMentor) {
      setMentors(prev => prev.map(mentor => 
        mentor.id === editingMentor.id 
          ? { ...mentor, ...formData }
          : mentor
      ));
      toast.success('Mentor updated successfully!');
    } else {
      const newMentor = {
        id: Date.now(),
        ...formData,
        photo: formData.photo ? URL.createObjectURL(formData.photo) : 'https://via.placeholder.com/150x150/667eea/ffffff?text=NM',
        studentsCount: 0,
        status: 'active'
      };
      setMentors(prev => [...prev, newMentor]);
      toast.success('Mentor registered successfully!');
    }
    
    handleCloseModal();
  };

  const handleEdit = (mentor) => {
    setEditingMentor(mentor);
    setFormData({
      name: mentor.name,
      email: mentor.email,
      phone: mentor.phone,
      assignedClass: mentor.assignedClass,
      photo: null,
      specialization: mentor.specialization
    });
    setShowModal(true);
  };

  const handleDelete = (mentorId) => {
    if (window.confirm('Are you sure you want to delete this mentor?')) {
      setMentors(prev => prev.filter(mentor => mentor.id !== mentorId));
      toast.success('Mentor deleted successfully!');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMentor(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      assignedClass: '',
      photo: null,
      specialization: ''
    });
  };

  const handleSendNotification = (mentor) => {
    setSelectedMentor(mentor);
    setShowNotificationModal(true);
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    toast.success(`Notification sent to ${selectedMentor.name}!`);
    setShowNotificationModal(false);
    setNotificationData({ subject: '', message: '' });
  };

  const getStatusColor = (status) => {
    return status === 'active' ? '#27ae60' : '#e74c3c';
  };

  const getSpecializationColor = (specialization) => {
    const colors = {
      'crypotocurency': '#667eea',
      'emerging technology': '#4facfe',
      'backend': '#f093fb',
      'frontend': '#43e97b'
    };
    return colors[specialization] || '#667eea';
  };

  return (
    <div className="mentor-management">
      <div className="page-header">
        <div className="header-content">
          <h1>Mentor Management</h1>
          <p>Manage and oversee all mentors in the summer camp</p>
        </div>
        <button 
          className="add-button"
          onClick={() => setShowModal(true)}
        >
          <FiPlus /> Add New Mentor
        </button>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">
            <FiUsers />
          </div>
          <div className="stat-content">
            <h3>{mentors.length}</h3>
            <p>Total Mentors</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiBookOpen />
          </div>
          <div className="stat-content">
            <h3>{mentors.reduce((sum, mentor) => sum + mentor.studentsCount, 0)}</h3>
            <p>Total Students</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiAward />
          </div>
          <div className="stat-content">
            <h3>{mentors.filter(m => m.status === 'active').length}</h3>
            <p>Active Mentors</p>
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="mentors-grid">
        {mentors.map(mentor => (
          <div key={mentor.id} className="mentor-card">
            <div className="mentor-header">
              <div className="mentor-photo">
                <img src={mentor.photo} alt={mentor.name} />
                <div className="status-indicator" style={{ backgroundColor: getStatusColor(mentor.status) }}></div>
              </div>
              
              <div className="mentor-info">
                <h3>{mentor.name}</h3>
                <p className="department" style={{ backgroundColor: getSpecializationColor(mentor.department) }}>
                  {mentor.department}
                </p>
                <p className="class" style={{ backgroundColor: getSpecializationColor(mentor.department) + '80' }}>
                  {mentor.assignedClass}
                </p>

              </div>
            </div>
            
            <div className="mentor-details">
              <div className="detail-item">
                <FiMail />
                <span>{mentor.email}</span>
              </div>
              <div className="detail-item">
                <FiPhone />
                <span>{mentor.phone}</span>
              </div>
              <div className="detail-item">
                <FiBookOpen />
                <span>{mentor.department} - {mentor.assignedClass}</span>
              </div>
              <div className="detail-item">
                <FiUsers />
                <span>{mentor.studentsCount} students</span>
              </div>

            </div>
            
            <div className="mentor-actions">
              <button 
                onClick={() => handleSendNotification(mentor)}
                className="action-btn notify"
                title="Send Notification"
              >
                <FiBell />
              </button>
              <button 
                onClick={() => handleEdit(mentor)}
                className="action-btn edit"
                title="Edit"
              >
                <FiEdit />
              </button>
              <button 
                onClick={() => handleDelete(mentor.id)}
                className="action-btn delete"
                title="Delete"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mentor Registration Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingMentor ? 'Edit Mentor' : 'Add New Mentor'}</h2>
              <button onClick={handleCloseModal} className="close-btn">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="mentor-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {Object.keys(departments).map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Assigned Class</label>
                  <select
                    name="assignedClass"
                    value={formData.assignedClass}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.department}
                  >
                    <option value="">Select Class</option>
                    {formData.department && departments[formData.department]?.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Photo</label>
                  <input
                    type="file"
                    name="photo"
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={handleCloseModal} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingMentor ? 'Update' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Send Notification to {selectedMentor?.name}</h2>
              <button onClick={() => setShowNotificationModal(false)} className="close-btn">&times;</button>
            </div>
            
            <form onSubmit={handleNotificationSubmit} className="notification-form">
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  value={notificationData.subject}
                  onChange={(e) => setNotificationData(prev => ({ ...prev, subject: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Message</label>
                <textarea
                  value={notificationData.message}
                  onChange={(e) => setNotificationData(prev => ({ ...prev, message: e.target.value }))}
                  required
                  rows="4"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowNotificationModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Send Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorManagement; 
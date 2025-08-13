import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiUsers } from 'react-icons/fi';
import { toast } from 'react-toastify';
import '../../styles/ManageClasses.css';

const ManageClasses = () => {
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mentor: '',
    maxStudents: '',
    schedule: '',
    room: ''
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
    setClasses([
      {
        id: 1,
        department: 'Aerospace',
        name: 'Aerospace Engineering',
        description: 'Advanced aerospace engineering concepts and flight dynamics',
        mentor: 'Dr. Sarah Wilson',
        maxStudents: 25,
        currentStudents: 18,
        schedule: 'Mon, Wed, Fri 9:00 AM - 11:00 AM',
        room: 'Room 101'
      },
      {
        id: 2,
        department: 'Cybersecurity',
        name: 'Network Security',
        description: 'Network security fundamentals and ethical hacking',
        mentor: 'Prof. Mike Chen',
        maxStudents: 30,
        currentStudents: 22,
        schedule: 'Tue, Thu 2:00 PM - 4:00 PM',
        room: 'Room 205'
      },
      {
        id: 3,
        department: 'Development',
        name: 'Web Development',
        description: 'Modern web development with React and Node.js',
        mentor: 'Dr. yobdar haile',
        maxStudents: 28,
        currentStudents: 15,
        schedule: 'Mon, Tue, Thu 1:00 PM - 3:00 PM',
        room: 'Room 103'
      },
      {
        id: 4,
        department: 'Embedded',
        name: 'Embedded Systems',
        description: 'Embedded systems programming and IoT development',
        mentor: 'haile mesfin',
        maxStudents: 20,
        currentStudents: 19,
        schedule: 'Wed, Fri 10:00 AM - 12:00 PM',
        room: 'Room 207'
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
    
    if (editingClass) {
      // Update existing class
      setClasses(prev => prev.map(cls => 
        cls.id === editingClass.id 
          ? { ...cls, ...formData, maxStudents: parseInt(formData.maxStudents) }
          : cls
      ));
      toast.success('Class updated successfully!');
    } else {
      // Add new class
      const newClass = {
        id: Date.now(),
        ...formData,
        maxStudents: parseInt(formData.maxStudents),
        currentStudents: 0
      };
      setClasses(prev => [...prev, newClass]);
      toast.success('Class created successfully!');
    }
    
    handleCloseModal();
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      description: cls.description,
      mentor: cls.mentor,
      maxStudents: cls.maxStudents.toString(),
      schedule: cls.schedule,
      room: cls.room
    });
    setShowModal(true);
  };

  const handleDelete = (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      setClasses(prev => prev.filter(cls => cls.id !== classId));
      toast.success('Class deleted successfully!');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClass(null);
    setFormData({
      name: '',
      description: '',
      mentor: '',
      maxStudents: '',
      schedule: '',
      room: ''
    });
  };

  return (
    <div className="manage-classes">
      <div className="page-header">
        <h1>Manage Classes</h1>
        <button 
          className="add-button"
          onClick={() => setShowModal(true)}
        >
          <FiPlus /> Add New Class
        </button>
      </div>

      {/* Classes Grid */}
      <div className="classes-grid">
        {classes.map(cls => (
          <div key={cls.id} className="class-card">
            <div className="class-header">
              <div className="class-title">
                <h3>{cls.name}</h3>
                <span className="department-badge">{cls.department}</span>
              </div>
              <div className="class-actions">
                <button 
                  onClick={() => handleEdit(cls)}
                  className="action-btn edit"
                  title="Edit"
                >
                  <FiEdit />
                </button>
                <button 
                  onClick={() => handleDelete(cls.id)}
                  className="action-btn delete"
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
            
            <p className="class-description">{cls.description}</p>
            
            <div className="class-details">
              <div className="detail-item">
                <strong>Mentor:</strong> {cls.mentor}
              </div>
              <div className="detail-item">
                <strong>Schedule:</strong> {cls.schedule}
              </div>
              <div className="detail-item">
                <strong>Room:</strong> {cls.room}
              </div>
              <div className="detail-item">
                <strong>Students:</strong> {cls.currentStudents}/{cls.maxStudents}
              </div>
            </div>
            
            <div className="enrollment-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(cls.currentStudents / cls.maxStudents) * 100}%` }}
                ></div>
              </div>
              <span className="progress-text">
                {Math.round((cls.currentStudents / cls.maxStudents) * 100)}% Full
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingClass ? 'Edit Class' : 'Add New Class'}</h2>
              <button onClick={handleCloseModal} className="close-btn">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="class-form">
              <div className="form-group">
                <label>Class Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter class name"
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter class description"
                  rows="3"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Mentor</label>
                  <input
                    type="text"
                    name="mentor"
                    value={formData.mentor}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter mentor name"
                  />
                </div>
                <div className="form-group">
                  <label>Max Students</label>
                  <input
                    type="number"
                    name="maxStudents"
                    value={formData.maxStudents}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="Enter max students"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Schedule</label>
                  <input
                    type="text"
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Mon, Wed, Fri 9:00 AM - 11:00 AM"
                  />
                </div>
                <div className="form-group">
                  <label>Room</label>
                  <input
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter room number"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={handleCloseModal} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingClass ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageClasses; 
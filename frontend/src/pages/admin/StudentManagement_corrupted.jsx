import React, { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiMaximize2, FiPrinter, FiDownload, FiUser, FiPhone, FiMail, FiBookOpen, FiAward, FiStar, FiUsers, FiTrendingUp, FiCalendar, FiClock } from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';
import '../../styles/StudentManagement.css';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterClass, setFilterClass] = useState('all');

  // Department and Class structure
  const departments = {
    'Aerospace': ['Aerospace Engineering', 'Flight Dynamics', 'Space Systems'],
    'Cybersecurity': ['Network Security', 'Ethical Hacking', 'Digital Forensics'],
    'Development': ['Web Development', 'Mobile Development', 'Software Engineering'],
    'Embedded': ['Embedded Systems', 'IoT Development', 'Hardware Programming']
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    class: '',
    photo: null,
    status: 'active'
  });

  // Sample student data
  useEffect(() => {
    setStudents([
      {
        id: 1,
        name: 'Ahmed Hassan',
        email: 'ahmed.hassan@insa.com',
        phone: '+251912345678',
        department: 'Aerospace',
        class: 'Aerospace Engineering',
        status: 'active',
        qrCode: 'STU001',
        photo: 'https://via.placeholder.com/150x200/667eea/ffffff?text=AH',
        totalScore: 85,
        attendance: 92,
        assignments: 8,
        lastActive: '2 hours ago',
        joinDate: '2024-06-01'
      },
      {
        id: 2,
        name: 'Sara Johnson',
        email: 'sara.johnson@insa.com',
        phone: '+251923456789',
        department: 'Cybersecurity',
        class: 'Network Security',
        status: 'active',
        qrCode: 'STU002',
        photo: 'https://via.placeholder.com/150x200/f093fb/ffffff?text=SJ',
        totalScore: 92,
        attendance: 88,
        assignments: 10,
        lastActive: '1 day ago',
        joinDate: '2024-06-15'
      },
      {
        id: 3,
        name: 'Michael Adams',
        email: 'michael.adams@insa.com',
        phone: '+251934567890',
        department: 'Development',
        class: 'Web Development',
        status: 'active',
        qrCode: 'STU003',
        photo: 'https://via.placeholder.com/150x200/4facfe/ffffff?text=MA',
        totalScore: 78,
        attendance: 95,
        assignments: 7,
        lastActive: '3 hours ago',
        joinDate: '2024-07-01'
      }
    ]);
  }, []);

  const handleAddStudent = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      class: '',
      photo: null,
      status: 'active'
    });
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      department: student.department,
      class: student.class,
      photo: student.photo,
      status: student.status
    });
    setShowModal(true);
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(s => s.id !== studentId));
      toast.success('Student deleted successfully');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStudent) {
      setStudents(students.map(s => 
        s.id === editingStudent.id 
          ? { ...s, ...formData }
          : s
      ));
      toast.success('Student updated successfully');
    } else {
      const newStudent = {
        id: Date.now(),
        ...formData,
        qrCode: `STU${String(students.length + 1).padStart(3, '0')}`,
        totalScore: 0,
        attendance: 0,
        assignments: 0,
        lastActive: 'Just now',
        joinDate: new Date().toISOString().split('T')[0]
      };
      setStudents([...students, newStudent]);
      toast.success('Student added successfully');
    }
    setShowModal(false);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || student.department === filterDepartment;
    const matchesClass = filterClass === 'all' || student.class === filterClass;
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesClass;
  });

  return (
    <div className="student-management">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Student Management</h1>
          <p>Manage student registrations, profiles, and QR codes</p>
        </div>
        <button className="btn-primary" onClick={handleAddStudent}>
          <FiPlus />
          Add Student
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FiUsers />
          </div>
          <div className="stat-content">
            <h3>{students.length}</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiStar />
          </div>
          <div className="stat-content">
            <h3>{students.filter(s => s.status === 'active').length}</h3>
            <p>Active Students</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiTrendingUp />
          </div>
          <div className="stat-content">
            <h3>{Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length || 0)}%</h3>
            <p>Avg Attendance</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiAward />
          </div>
          <div className="stat-content">
            <h3>{Math.round(students.reduce((acc, s) => acc + s.totalScore, 0) / students.length || 0)}</h3>
            <p>Avg Score</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          
          <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
            <option value="all">All Departments</option>
            {Object.keys(departments).map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
            <option value="all">All Classes</option>
            {filterDepartment !== 'all' && departments[filterDepartment]?.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="content-card">
        <div className="table-header">
          <h3>Students List ({filteredStudents.length})</h3>
          <div className="table-actions">
            <button className="btn-secondary">
              <FiDownload />
              Export
            </button>
            <button className="btn-secondary">
              <FiPrinter />
              Print IDs
            </button>
          </div>
        </div>
        
        <div className="table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Contact</th>
                <th>Department</th>
                <th>Class</th>
                <th>Performance</th>
                <th>Status</th>
                <th>QR Code</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>
                    <div className="student-info">
                      <img 
                        src={student.photo} 
                        alt={student.name}
                        className="student-avatar"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/40x40/667eea/ffffff?text=${student.name.split(' ').map(n => n[0]).join('')}`;
                        }}
                      />
                      <div>
                        <strong>{student.name}</strong>
                        <small>ID: {student.qrCode}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div><FiMail /> {student.email}</div>
                      <div><FiPhone /> {student.phone}</div>
                    </div>
                  </td>
                  <td>
                    <span className="department-badge">{student.department}</span>
                  </td>
                  <td>{student.class}</td>
                  <td>
                    <div className="performance-info">
                      <div>Score: {student.totalScore}%</div>
                      <div>Attendance: {student.attendance}%</div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${student.status}`}>
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <div className="qr-code-cell">
                      <QRCodeSVG 
                        value={student.qrCode} 
                        size={40}
                        level="M"
                      />
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon"
                        onClick={() => handleEditStudent(student)}
                        title="Edit"
                      >
                        <FiEdit />
                      </button>
                      <button 
                        className="btn-icon"
                        onClick={() => handleDeleteStudent(student.id)}
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                      <button 
                        className="btn-icon"
                        title="View Details"
                      >
                        <FiMaximize2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="student-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value, class: ''})}
                    required
                  >
                    <option value="">Select Department</option>
                    {Object.keys(departments).map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Class</label>
                  <select
                    value={formData.class}
                    onChange={(e) => setFormData({...formData, class: e.target.value})}
                    required
                    disabled={!formData.department}
                  >
                    <option value="">Select Class</option>
                    {formData.department && departments[formData.department]?.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingStudent ? 'Update Student' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
              <div className="student-photo">
                <img src={student.photo} alt={student.name} />
                <div className="status-indicator" style={{ backgroundColor: getStatusColor(student.status) }}></div>
                <div className="online-indicator"></div>
              </div>
              
              <div className="student-info">
                <h3>{student.name}</h3>
                <p className="department-name" style={{ backgroundColor: getDepartmentColor(student.department) }}>
                  {student.department}
                </p>
                <p className="class-name" style={{ backgroundColor: getDepartmentColor(student.department) + '80' }}>
                  {student.class}
                </p>
                <div className="score-badge" style={{ backgroundColor: getScoreColor(student.totalScore) }}>
                  {student.totalScore}%
                </div>
              </div>
            </div>
            
            <div className="student-stats">
              <div className="stat-item">
                <FiTrendingUp />
                <span>Progress: {student.progress}%</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${student.progress}%`, 
                      backgroundColor: getProgressColor(student.progress) 
                    }}
                  ></div>
                </div>
              </div>
              <div className="stat-item">
                <FiCalendar />
                <span>Streak: {student.streak} days</span>
                <div className="streak-badge" style={{ backgroundColor: getStreakColor(student.streak) }}>
                  {student.streak}
                </div>
              </div>
            </div>
            
            <div className="student-details">
              <div className="detail-item">
                <FiMail />
                <span>{student.email}</span>
              </div>
              <div className="detail-item">
                <FiPhone />
                <span>{student.phone}</span>
              </div>
              <div className="detail-item">
                <FiBookOpen />
                <span>{student.department} - {student.class}</span>
              </div>
              <div className="detail-item">
                <FiAward />
                <span>{student.attendance}% attendance</span>
              </div>
              <div className="detail-item">
                <FiStar />
                <span>{student.assignments} assignments</span>
              </div>
              <div className="detail-item">
                <FiClock />
                <span>Last active: {student.lastActive}</span>
              </div>
            </div>
            
            <div className="qr-section">
              <div className="qr-code-container">
                <QRCode 
                  id={`qr-${student.id}`}
                  value={student.qrCode} 
                  size={60}
                />
              </div>
              <p className="qr-label">Student QR Code</p>
            </div>
            
            <div className="student-actions">
              <button 
                onClick={() => handleEdit(student)}
                className="action-btn edit"
                title="Edit"
              >
                <FiEdit />
              </button>
              <button 
                onClick={() => printStudentCard(student)}
                className="action-btn print"
                title="Print ID Card"
              >
                <FiPrinter />
              </button>
              <button 
                onClick={() => handleDelete(student.id)}
                className="action-btn delete"
                title="Delete"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
              <button onClick={handleCloseModal} className="close-btn">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="student-form">
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
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Class</label>
                  <select
                    name="class"
                    value={formData.class}
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
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
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
                  {formData.photo && (
                    <div className="photo-preview">
                      <img src={formData.photo} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Generated QR Code</label>
                  <div className="qr-preview">
                    <QRCodeSVG 
                      value={formData.name ? `STU${String(students.length + 1).padStart(3, '0')}_${formData.name.replace(/\s+/g, '_').toUpperCase()}` : 'STU001'} 
                      size={80}
                    />
                    <p style={{ fontSize: '12px', marginTop: '5px', color: '#666' }}>
                      {formData.name ? `STU${String(students.length + 1).padStart(3, '0')}_${formData.name.replace(/\s+/g, '_').toUpperCase()}` : 'STU001'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={handleCloseModal} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingStudent ? 'Update' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement; 
import React, { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiMaximize2, FiUsers, FiAward, FiStar, FiBookOpen, FiX } from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterClass, setFilterClass] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    class: '',
    photo: null,
    status: 'active'
  });

  const departments = {
    'Aerospace': ['Aerospace Engineering', 'Flight Dynamics', 'Propulsion Systems'],
    'Cybersecurity': ['Network Security', 'Ethical Hacking', 'Digital Forensics'],
    'Development': ['Web Development', 'Mobile Development', 'Software Engineering'],
    'Embedded': ['Embedded Systems', 'IoT Development', 'Hardware Programming']
  };

  useEffect(() => {
    // Initialize with sample data
    setStudents([
      {
        id: 1,
        name: 'Eyob Belayneh',
        email: 'eyob.belayneh@insa.com',
        phone: '+251912345678',
        department: 'Aerospace',
        class: 'Aerospace Engineering',
        status: 'active',
        qrCode: 'STU001',
        photo: 'https://www.shutterstock.com/image-photo/gasena-ethiopia-aug-2-ethiopian-260nw-137902043.jpg',
        totalScore: 85,
        attendance: 92,
        assignments: 8,
        lastActive: '2 hours ago',
        joinDate: '2024-06-01',
        progress: 75,
        streak: 5
      },
      {
        id: 2,
        name: 'Kidus Asrat',
        email: 'kidus.asrat@insa.com',
        phone: '+251912345679',
        department: 'Cybersecurity',
        class: 'Network Security',
        status: 'active',
        qrCode: 'STU002',
        photo: 'https://www.shutterstock.com/image-photo/gasena-ethiopia-aug-2-ethiopian-260nw-137902043.jpg',
        totalScore: 92,
        attendance: 95,
        assignments: 10,
        lastActive: '1 hour ago',
        joinDate: '2024-06-01',
        progress: 88,
        streak: 7
      },
      {
        id: 3,
        name: 'Arya',
        email: 'arya@insa.com',
        phone: '+251912345680',
        department: 'Development',
        class: 'Web Development',
        status: 'active',
        qrCode: 'STU003',
        photo: 'https://www.shutterstock.com/image-photo/gasena-ethiopia-aug-2-ethiopian-260nw-137902043.jpg',
        totalScore: 78,
        attendance: 88,
        assignments: 7,
        lastActive: '30 minutes ago',
        joinDate: '2024-06-02',
        progress: 62,
        streak: 3
      },
      {
        id: 4,
        name: 'Asamenew',
        email: 'asamenew@insa.com',
        phone: '+251912345681',
        department: 'Embedded',
        class: 'Embedded Systems',
        status: 'active',
        qrCode: 'STU004',
        photo: 'https://www.shutterstock.com/image-photo/gasena-ethiopia-aug-2-ethiopia-260nw-137902043.jpg',
        totalScore: 89,
        attendance: 90,
        assignments: 9,
        lastActive: '5 minutes ago',
        joinDate: '2024-06-01',
        progress: 82,
        streak: 6
      }
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'photo' && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          [name]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingStudent) {
      setStudents(prev => prev.map(student => 
        student.id === editingStudent.id 
          ? { ...student, ...formData }
          : student
      ));
      toast.success('Student updated successfully!');
    } else {
      const newStudent = {
        id: Date.now(),
        ...formData,
        qrCode: `STU${String(students.length + 1).padStart(3, '0')}`,
        photo: formData.photo || 'https://via.placeholder.com/150x150/667eea/ffffff?text=NS',
        totalScore: 0,
        attendance: 0,
        assignments: 0,
        lastActive: 'Just now',
        joinDate: new Date().toISOString().split('T')[0],
        progress: 0,
        streak: 0
      };
      setStudents(prev => [...prev, newStudent]);
      toast.success('Student registered successfully!');
    }
    
    handleCloseModal();
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      department: student.department,
      class: student.class,
      photo: null,
      status: student.status
    });
    setShowModal(true);
  };

  const handleDelete = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(prev => prev.filter(student => student.id !== studentId));
      toast.success('Student deleted successfully!');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || student.department === filterDepartment;
    const matchesClass = filterClass === 'all' || student.class === filterClass;
    return matchesSearch && matchesStatus && matchesDepartment && matchesClass;
  });

  const getStatusColor = (status) => {
    return status === 'active' ? '#27ae60' : '#e74c3c';
  };

  const getDepartmentColor = (department) => {
    const colors = {
      'Aerospace': '#667eea',
      'Cybersecurity': '#4facfe',
      'Development': '#f093fb',
      'Embedded': '#43e97b'
    };
    return colors[department] || '#667eea';
  };

  return (
    <div className="student-management">
      <div className="page-header">
        <div className="header-content">
          <h1>Student Management</h1>
          <p>Register and manage all students in the summer camp</p>
        </div>
        <button 
          className="add-button"
          onClick={() => setShowModal(true)}
        >
          <FiPlus /> Add New Student
        </button>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
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
            <FiAward />
          </div>
          <div className="stat-content">
            <h3>{students.filter(s => s.status === 'active').length}</h3>
            <p>Active Students</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiStar />
          </div>
          <div className="stat-content">
            <h3>{students.length > 0 ? Math.round(students.reduce((sum, student) => sum + student.totalScore, 0) / students.length) : 0}%</h3>
            <p>Average Score</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiBookOpen />
          </div>
          <div className="stat-content">
            <h3>{students.length > 0 ? Math.round(students.reduce((sum, student) => sum + student.attendance, 0) / students.length) : 0}%</h3>
            <p>Average Attendance</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select 
          value={filterDepartment} 
          onChange={(e) => {
            setFilterDepartment(e.target.value);
            setFilterClass('all');
          }}
          className="department-filter"
        >
          <option value="all">All Departments</option>
          {Object.keys(departments).map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <select 
          value={filterClass} 
          onChange={(e) => setFilterClass(e.target.value)}
          className="class-filter"
        >
          <option value="all">All Classes</option>
          {filterDepartment !== 'all' && departments[filterDepartment]?.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>

      {/* Students Grid */}
      <div className="students-grid">
        {filteredStudents.map(student => (
          <div key={student.id} className="student-card">
            <div className="student-header">
              <div className="student-photo">
                <img src={student.photo} alt={student.name} />
                <div className="status-indicator" style={{ backgroundColor: getStatusColor(student.status) }}></div>
              </div>
              <div className="student-actions">
                <button onClick={() => handleEdit(student)} className="edit-btn">
                  <FiEdit />
                </button>
                <button onClick={() => handleDelete(student.id)} className="delete-btn">
                  <FiTrash2 />
                </button>
              </div>
            </div>
            
            <div className="student-info">
              <h3>{student.name}</h3>
              <p className="email">{student.email}</p>
              <p className="phone">{student.phone}</p>
              
              <div className="department-badge" style={{ backgroundColor: getDepartmentColor(student.department) }}>
                {student.department}
              </div>
              
              <div className="class-info">
                <strong>Class:</strong> {student.class}
              </div>
              
              <div className="stats-row">
                <div className="stat">
                  <span className="label">Score:</span>
                  <span className="value">{student.totalScore}%</span>
                </div>
                <div className="stat">
                  <span className="label">Attendance:</span>
                  <span className="value">{student.attendance}%</span>
                </div>
              </div>
              
              <div className="qr-section">
                <QRCodeSVG 
                  value={student.qrCode} 
                  size={60}
                  id={`qr-${student.id}`}
                />
                <span className="qr-code">{student.qrCode}</span>
              </div>
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
              <button onClick={handleCloseModal} className="close-btn">
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="student-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
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
                  <label>Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={(e) => {
                      handleInputChange(e);
                      setFormData(prev => ({ ...prev, class: '' }));
                    }}
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
              </div>
              
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
                    <img src={formData.photo} alt="Preview" />
                  </div>
                )}
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={handleCloseModal} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
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

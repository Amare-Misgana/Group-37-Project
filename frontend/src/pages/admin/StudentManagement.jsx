import React, { useState } from 'react';
import { FiPlus, FiSearch, FiUsers, FiX, FiEdit, FiTrash2, FiPrinter, FiAward } from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';

const StudentManagement = () => {
  const [students, setStudents] = useState([
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
      joinDate: '2024-06-01'
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
      joinDate: '2024-06-01'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
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

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        joinDate: new Date().toISOString().split('T')[0]
      };
      setStudents(prev => [...prev, newStudent]);
      toast.success('Student registered successfully!');
    }
    
    handleCloseModal();
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

  const toggleStudentStatus = (studentId) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, status: student.status === 'active' ? 'inactive' : 'active' }
        : student
    ));
    toast.success('Student status updated!');
  };

  const printStudentCard = (student) => {
    const printWindow = window.open('', '_blank');
    
    // Get the QR code SVG from the existing element
    const qrElement = document.querySelector(`#qr-${student.id}`);
    const qrSvg = qrElement ? qrElement.outerHTML : '';
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Student ID Card - ${student.name}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: #f5f5f5; 
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .card { 
              width: 400px; 
              height: 250px; 
              border: 3px solid #333; 
              padding: 20px; 
              background: white;
              border-radius: 15px;
              box-shadow: 0 8px 16px rgba(0,0,0,0.2);
              position: relative;
            }
            .card::before {
              content: '';
              position: absolute;
              top: 10px;
              left: 10px;
              right: 10px;
              bottom: 10px;
              border: 1px solid #667eea;
              border-radius: 10px;
            }
            .header { 
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 20px; 
              border-bottom: 2px solid #667eea;
              padding-bottom: 10px;
              position: relative;
            }
            .header-logo {
              width: 40px;
              height: 40px;
              margin-right: 15px;
            }
            .header-text {
              text-align: center;
            }
            .header h2 { 
              margin: 0; 
              color: #667eea; 
              font-size: 20px; 
              font-weight: bold;
            }
            .header h3 { 
              margin: 5px 0 0 0; 
              color: #333; 
              font-size: 14px; 
              font-style: italic;
            }
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              opacity: 0.1;
              width: 200px;
              height: 200px;
              z-index: 0;
            }
            .content {
              position: relative;
              z-index: 1;
            }
            .content { 
              display: flex; 
              gap: 20px; 
              align-items: flex-start; 
            }
            .photo { 
              width: 80px; 
              height: 80px; 
              border-radius: 50%; 
              object-fit: cover; 
              border: 3px solid #667eea;
            }
            .info { 
              flex: 1; 
              font-size: 13px;
            }
            .info p { 
              margin: 3px 0; 
              line-height: 1.4;
            }
            .info strong {
              color: #333;
            }
            .qr-section { 
              text-align: center; 
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .qr-section svg { 
              width: 90px; 
              height: 90px; 
              border: 2px solid #667eea;
              border-radius: 8px;
              padding: 5px;
              background: white;
            }
            .qr-text { 
              font-size: 11px; 
              margin-top: 8px; 
              font-weight: bold; 
              color: #667eea;
              letter-spacing: 1px;
            }
            .status-badge {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: bold;
              color: white;
              background: ${student.status === 'active' ? '#27ae60' : '#e74c3c'};
            }
          </style>
        </head>
        <body>
          <div class="card">
            <!-- Watermark -->
            <img src="/insa-logo.png" class="watermark" alt="INSA Logo Watermark" />
            
            <div class="header">
              <img src="/insa-logo.png" class="header-logo" alt="INSA Logo" />
              <div class="header-text">
                <h2>INSA Summer Camp</h2>
                <h3>Student ID Card</h3>
              </div>
            </div>
            <div class="content">
              <img src="${student.photo}" class="photo" alt="Student Photo" />
              <div class="info">
                <p><strong>Name:</strong> ${student.name}</p>
                <p><strong>Student ID:</strong> ${student.qrCode}</p>
                <p><strong>Department:</strong> ${student.department}</p>
                <p><strong>Class:</strong> ${student.class}</p>
                <p><strong>Status:</strong> <span class="status-badge">${student.status.toUpperCase()}</span></p>
                <p><strong>Join Date:</strong> ${student.joinDate}</p>
                <p><strong>Email:</strong> ${student.email}</p>
              </div>
              <div class="qr-section">
                ${qrSvg}
                <div class="qr-text">${student.qrCode}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const printCertificate = (student) => {
    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Summer Camp Certificate - ${student.name}</title>
          <style>
            body { 
              font-family: 'Times New Roman', serif; 
              margin: 0; 
              padding: 40px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .certificate { 
              width: 800px; 
              height: 600px; 
              background: white;
              border: 10px solid #d4af37;
              border-radius: 20px;
              padding: 60px;
              text-align: center;
              box-shadow: 0 10px 30px rgba(0,0,0,0.3);
              position: relative;
            }
            .certificate::before {
              content: '';
              position: absolute;
              top: 20px;
              left: 20px;
              right: 20px;
              bottom: 20px;
              border: 3px solid #d4af37;
              border-radius: 10px;
            }
            .header { margin-bottom: 40px; }
            .title { 
              font-size: 48px; 
              color: #d4af37; 
              font-weight: bold; 
              margin: 0;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            }
            .subtitle { 
              font-size: 24px; 
              color: #333; 
              margin: 10px 0;
              font-style: italic;
            }
            .content { margin: 40px 0; }
            .student-name { 
              font-size: 36px; 
              color: #667eea; 
              font-weight: bold; 
              margin: 20px 0;
              text-decoration: underline;
            }
            .description { 
              font-size: 18px; 
              line-height: 1.6; 
              color: #333; 
              margin: 30px 0;
            }
            .details { 
              display: flex; 
              justify-content: space-between; 
              margin-top: 50px;
              font-size: 16px;
            }
            .signature-section { 
              text-align: center; 
              border-top: 2px solid #333; 
              padding-top: 10px; 
              width: 200px;
            }
            .date { color: #666; }
            .seal {
              position: absolute;
              bottom: 30px;
              right: 30px;
              width: 80px;
              height: 80px;
              border: 3px solid #d4af37;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #fff;
              font-size: 12px;
              font-weight: bold;
              color: #d4af37;
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="header">
              <h1 class="title">CERTIFICATE OF COMPLETION</h1>
              <p class="subtitle">INSA Summer Camp 2024</p>
            </div>
            
            <div class="content">
              <p style="font-size: 20px; margin-bottom: 10px;">This is to certify that</p>
              <div class="student-name">${student.name}</div>
              <p class="description">
                has successfully completed the <strong>${student.class}</strong> program 
                in the <strong>${student.department}</strong> department with outstanding 
                performance and dedication.
              </p>
              <p class="description">
                <strong>Final Score:</strong> ${student.totalScore}% | 
                <strong>Attendance:</strong> ${student.attendance}%
              </p>
            </div>
            
            <div class="details">
              <div class="signature-section">
                <div style="margin-bottom: 40px;"></div>
                <div>Director</div>
                <div style="font-size: 14px; color: #666;">INSA Summer Camp</div>
              </div>
              
              <div class="date">
                <strong>Date:</strong><br>
                ${currentDate}
              </div>
              
              <div class="signature-section">
                <div style="margin-bottom: 40px;"></div>
                <div>Instructor</div>
                <div style="font-size: 14px; color: #666;">${student.department} Dept.</div>
              </div>
            </div>
            
            <div class="seal">
              INSA<br>SEAL
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
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
            <FiUsers />
          </div>
          <div className="stat-content">
            <h3>{students.filter(s => s.status === 'active').length}</h3>
            <p>Active Students</p>
          </div>
        </div>
      </div>

      {/* Search */}
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
      </div>

      {/* Students List */}
      <div className="students-grid">
        {filteredStudents.map(student => (
          <div key={student.id} className="student-card">
            <div className="student-header">
              <div className="student-photo">
                <img src={student.photo} alt={student.name} />
                <div className={`status-indicator ${student.status}`}></div>
              </div>
              <div className="student-actions">
                <button 
                  onClick={() => handleEdit(student)} 
                  className="action-btn edit-btn"
                  title="Edit Student"
                >
                  <FiEdit />
                </button>
                <button 
                  onClick={() => printStudentCard(student)} 
                  className="action-btn print-btn"
                  title="Print ID Card"
                >
                  <FiPrinter />
                </button>
                <button 
                  onClick={() => printCertificate(student)} 
                  className="action-btn certificate-btn"
                  title="Print Certificate"
                >
                  <FiAward />
                </button>
                <button 
                  onClick={() => toggleStudentStatus(student.id)} 
                  className={`action-btn status-btn ${student.status}`}
                  title={`${student.status === 'active' ? 'Deactivate' : 'Activate'} Student`}
                >
                  {student.status === 'active' ? '✓' : '✗'}
                </button>
                <button 
                  onClick={() => handleDelete(student.id)} 
                  className="action-btn delete-btn"
                  title="Delete Student"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
            
            <div className="student-info">
              <h3>{student.name}</h3>
              <p className="email">{student.email}</p>
              <p className="phone">{student.phone}</p>
              
              <div className="department-badge">
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

      {/* Registration Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingStudent ? 'Edit Student' : 'Register New Student'}</h2>
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
                    placeholder="Enter student's full name"
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
                    placeholder="student@insa.com"
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
                    placeholder="+251912345678"
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
                <label>Student Photo</label>
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
                  {editingStudent ? 'Update Student' : 'Register Student'}
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

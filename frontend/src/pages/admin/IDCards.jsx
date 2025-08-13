import React, { useState, useRef } from 'react';
import { FiSearch, FiDownload, FiPrinter, FiEye, FiUser, FiBookOpen, FiMaximize2 } from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';
import '../../styles/IDCards.css';

const IDCards = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const printRef = useRef();

  // Mock students data
  const students = [
    {
      id: 1,
      name: 'hana shferaw',
      photo: 'https://via.placeholder.com/150x200/667eea/ffffff?text=AH',
      department: 'Computer Science',
      class: 'CS-2024',
      qrCode: 'STUDENT_001_hana_shferaw_CS2024',
      status: 'active'
    },
    {
      id: 2,
      name: 'sara hadgu',
      photo: 'https://via.placeholder.com/150x200/f093fb/ffffff?text=SJ',
      department: 'Mathematics',
      class: 'MATH-2024',
      qrCode: 'STUDENT_002_sara_hadgu_MATH2024',
      status: 'active'
    },
    {
      id: 3,
      name: 'Mohammed abubeker',
      photo: 'https://via.placeholder.com/150x200/4facfe/ffffff?text=MA',
      department: 'Physics',
      class: 'PHY-2024',
      qrCode: 'STUDENT_003_MOHAMMED_abubeker_PHY2024',
      status: 'active'
    },
    {
      id: 4,
      name: 'eyob belayneh',
      photo: 'https://via.placeholder.com/150x200/43e97b/ffffff?text=ED',
      department: 'Chemistry',
      class: 'CHEM-2024',
      qrCode: 'STUDENT_004_Eyob_Belayneh_CHEM2024',
      status: 'active'
    }
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setIsPreviewVisible(true);
  };

  const handlePrint = () => {
    if (!selectedStudent) {
      toast.error('Please select a student first');
      return;
    }

    const printWindow = window.open('', '_blank');
    const printContent = printRef.current.innerHTML;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Student ID Card - ${selectedStudent.name}</title>
          <style>
            @media print {
              body { 
                margin: 0; 
                padding: 0; 
                font-family: Arial, sans-serif; 
                background: white;
              }
              .id-card-print {
                width: 350px;
                height: 220px;
                border: 2px solid #667eea;
                border-radius: 15px;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                position: relative;
                overflow: hidden;
                margin: 20px auto;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              }
              .id-card-print::before {
                content: '';
                position: absolute;
                top: -50%;
                right: -50%;
                width: 200px;
              height: 200px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 50%;
            }
            .id-header {
              text-align: center;
              margin-bottom: 15px;
            }
            .id-header h2 {
              margin: 0;
              font-size: 18px;
              font-weight: bold;
            }
            .id-header p {
              margin: 5px 0 0 0;
              font-size: 12px;
              opacity: 0.9;
            }
            .id-content {
              display: flex;
              gap: 15px;
              align-items: center;
            }
            .student-photo {
              width: 80px;
              height: 100px;
              border-radius: 8px;
              object-fit: cover;
              border: 2px solid rgba(255, 255, 255, 0.3);
            }
            .student-info {
              flex: 1;
            }
            .student-name {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 8px;
            }
            .student-details {
              font-size: 12px;
              margin-bottom: 5px;
            }
            .qr-section {
              text-align: center;
            }
            .qr-code {
              width: 60px;
              height: 60px;
              background: white;
              padding: 5px;
              border-radius: 8px;
            }
            @media print {
              body { margin: 0; }
              .id-card-print { 
                box-shadow: none; 
                border: 2px solid #667eea;
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    
    toast.success('ID card sent to printer');
  };

  const handleDownload = () => {
    if (!selectedStudent) {
      toast.error('Please select a student first');
      return;
    }
    
    // In a real application, you would generate a PDF here
    toast.success('ID card downloaded successfully');
  };

  return (
    <div className="id-cards">
      <div className="page-header">
        <h2>Student ID Cards</h2>
        <p>Generate and print individual student ID cards</p>
      </div>

      <div className="id-cards-container">
        {/* Student Selection */}
        <div className="student-selection">
          <div className="search-section">
            <div className="search-box">
              <FiSearch />
              <input
                type="text"
                placeholder="Search students by name, department, or class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="students-grid">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className={`student-card ${selectedStudent?.id === student.id ? 'selected' : ''}`}
                onClick={() => handleStudentSelect(student)}
              >
                <div className="student-photo">
                  <img src={student.photo} alt={student.name} />
                </div>
                <div className="student-info">
                  <h4>{student.name}</h4>
                  <p><FiBookOpen /> {student.department}</p>
                  <p><FiUser /> {student.class}</p>
                  <span className={`status ${student.status}`}>
                    {student.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ID Card Preview */}
        {selectedStudent && (
          <div className="id-card-preview">
            <div className="preview-header">
              <h3>ID Card Preview</h3>
              <div className="preview-actions">
                <button 
                  className="action-btn preview-btn"
                  onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                >
                  <FiEye />
                  {isPreviewVisible ? 'Hide' : 'Show'} Preview
                </button>
                <button 
                  className="action-btn download-btn"
                  onClick={handleDownload}
                >
                  <FiDownload />
                  Download
                </button>
                <button 
                  className="action-btn print-btn"
                  onClick={handlePrint}
                >
                  <FiPrinter />
                  Print
                </button>
              </div>
            </div>

            {isPreviewVisible && (
              <div className="preview-container" ref={printRef}>
                <div className="id-card">
                  <div className="id-header">
                    <h2>INSA Summer Camp</h2>
                    <p>Student ID Card</p>
                  </div>
                  
                  <div className="id-content">
                    <div className="student-photo">
                      <img src={selectedStudent.photo} alt={selectedStudent.name} />
                    </div>
                    
                    <div className="student-info">
                      <div className="student-name">{selectedStudent.name}</div>
                      <div className="student-details">
                        <p><FiBookOpen /> {selectedStudent.department}</p>
                        <p><FiUser /> {selectedStudent.class}</p>
                      </div>
                    </div>
                    
                    <div className="qr-section">
                      <div className="qr-code">
                        <QRCodeSVG 
                          value={selectedStudent.qrCode}
                          size={50}
                          level="M"
                        />
                      </div>
                      <p className="qr-label">Student QR</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IDCards; 
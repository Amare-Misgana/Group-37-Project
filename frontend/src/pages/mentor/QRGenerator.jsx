import React, { useState } from 'react';
import { FiMaximize2, FiDownload, FiCopy, FiRefreshCw, FiClock, FiUsers } from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';
import '../../styles/QRGenerator.css';

const QRGenerator = () => {
  const [qrData, setQrData] = useState({
    classId: '',
    className: '',
    mentorId: '',
    expiryHours: 24,
    purpose: 'attendance'
  });
  
  const [generatedQR, setGeneratedQR] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock data for classes
  const [classes] = useState([
    { id: 'Cse', name: 'Introduction to Computer Science', mentorId: 'mentor1' },
    { id: 'cry', name: 'cryptography', mentorId: 'mentor1' },
    { id: 'python', name: 'Python', mentorId: 'mentor1' },
    { id: 'js', name: 'javascript', mentorId: 'mentor1' }
  ]);

  const [recentQRCodes] = useState([
    {
      id: 1,
      classId: 'CSe',
      className: 'Introduction to Computer Science',
      generatedAt: '2024-06-15 09:00',
      expiresAt: '2024-06-16 09:00',
      scans: 25,
      purpose: 'attendance'
    },
    {
      id: 2,
      classId: 'cry',
      className: 'Advanced Mathematics',
      generatedAt: '2024-06-14 14:00',
      expiresAt: '2024-06-15 14:00',
      scans: 18,
      purpose: 'attendance'
    },
    {
      id: 3,
      classId: 'python',
      className: 'Physics Fundamentals',
      generatedAt: '2024-06-13 10:00',
      expiresAt: '2024-06-14 10:00',
      scans: 22,
      purpose: 'attendance'
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQrData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateQRCode = () => {
    if (!qrData.classId || !qrData.className) {
      toast.error('Please select a class and enter class name');
      return;
    }

    setIsGenerating(true);

    // Simulate API call
    setTimeout(() => {
      const qrContent = JSON.stringify({
        type: 'class_attendance',
        classId: qrData.classId,
        className: qrData.className,
        mentorId: qrData.mentorId,
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + qrData.expiryHours * 60 * 60 * 1000).toISOString(),
        purpose: qrData.purpose
      });

      setGeneratedQR({
        content: qrContent,
        classId: qrData.classId,
        className: qrData.className,
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + qrData.expiryHours * 60 * 60 * 1000).toISOString()
      });

      toast.success('QR Code generated successfully!');
      setIsGenerating(false);
    }, 1500);
  };

  const downloadQRCode = () => {
    if (!generatedQR) return;

    const canvas = document.createElement('canvas');
    const svg = document.querySelector('.qr-code svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 300, 300);
      ctx.drawImage(img, 0, 0, 300, 300);
      
      const link = document.createElement('a');
      link.download = `qr-${generatedQR.classId}-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const copyQRData = () => {
    if (!generatedQR) return;
    
    navigator.clipboard.writeText(generatedQR.content).then(() => {
      toast.success('QR Code data copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy QR Code data');
    });
  };

  const isQRExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="qr-generator-page">
      <div className="page-header">
        <h2>QR Code Generator</h2>
        <p>Generate QR codes for class attendance tracking</p>
      </div>

      <div className="qr-generator-container">
        <div className="qr-generator-section">
          <div className="generator-form-card">
            <h3>Generate New QR Code</h3>
            
            <div className="form-group">
              <label htmlFor="classId">Select Class</label>
              <select
                id="classId"
                name="classId"
                value={qrData.classId}
                onChange={handleInputChange}
              >
                <option value="">Choose a class...</option>
                {classes.map(classItem => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.id} - {classItem.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="className">Class Name</label>
              <input
                type="text"
                id="className"
                name="className"
                value={qrData.className}
                onChange={handleInputChange}
                placeholder="Enter class name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="expiryHours">Expiry Time (Hours)</label>
              <input
                type="number"
                id="expiryHours"
                name="expiryHours"
                value={qrData.expiryHours}
                onChange={handleInputChange}
                min="1"
                max="168"
                placeholder="24"
              />
            </div>

            <div className="form-group">
              <label htmlFor="purpose">Purpose</label>
              <select
                id="purpose"
                name="purpose"
                value={qrData.purpose}
                onChange={handleInputChange}
              >
                <option value="attendance">Attendance</option>
                <option value="assignment">Assignment Submission</option>
                <option value="feedback">Feedback Collection</option>
              </select>
            </div>

            <button 
              className="generate-btn"
              onClick={generateQRCode}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <FiRefreshCw className="spinning" />
                  Generating...
                </>
              ) : (
                <>
                  <FiMaximize2 />
                  Generate QR Code
                </>
              )}
            </button>
          </div>
        </div>

        <div className="qr-display-section">
          {generatedQR ? (
            <div className="qr-display-card">
              <h3>Generated QR Code</h3>
              <div className="qr-info">
                <div className="qr-info-item">
                  <strong>Class:</strong> {generatedQR.className}
                </div>
                <div className="qr-info-item">
                  <strong>Generated:</strong> {formatDateTime(generatedQR.generatedAt)}
                </div>
                <div className="qr-info-item">
                  <strong>Expires:</strong> {formatDateTime(generatedQR.expiresAt)}
                </div>
              </div>
              
              <div className="qr-code">
                <QRCodeSVG
                  value={generatedQR.content}
                  size={200}
                  level="M"
                  includeMargin={true}
                />
              </div>
              
              <div className="qr-actions">
                <button className="action-btn download-btn" onClick={downloadQRCode}>
                  <FiDownload />
                  Download
                </button>
                <button className="action-btn copy-btn" onClick={copyQRData}>
                  <FiCopy />
                  Copy Data
                </button>
              </div>
            </div>
          ) : (
            <div className="qr-placeholder">
              <FiMaximize2 />
              <p>Generate a QR code to display it here</p>
            </div>
          )}
        </div>
      </div>

      <div className="recent-qr-section">
        <h3>Recent QR Codes</h3>
        <div className="recent-qr-list">
          {recentQRCodes.map(qr => (
            <div key={qr.id} className="recent-qr-card">
              <div className="qr-card-header">
                <div className="qr-card-title">
                  <h4>{qr.className}</h4>
                  <span className={`status-badge ${isQRExpired(qr.expiresAt) ? 'expired' : 'active'}`}>
                    {isQRExpired(qr.expiresAt) ? 'Expired' : 'Active'}
                  </span>
                </div>
                <div className="qr-card-meta">
                  <span className="meta-item">
                    <FiClock />
                    {formatDateTime(qr.generatedAt)}
                  </span>
                  <span className="meta-item">
                    <FiUsers />
                    {qr.scans} scans
                  </span>
                </div>
              </div>
              <div className="qr-card-content">
                <p><strong>Class ID:</strong> {qr.classId}</p>
                <p><strong>Purpose:</strong> {qr.purpose}</p>
                <p><strong>Expires:</strong> {formatDateTime(qr.expiresAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QRGenerator; 
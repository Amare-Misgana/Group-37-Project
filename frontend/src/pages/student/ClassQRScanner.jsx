import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { FiMaximize2, FiCheckCircle, FiXCircle, FiClock, FiUser, FiBookOpen } from 'react-icons/fi';
import { toast } from 'react-toastify';
import '../../styles/QRScanner.css';

const ClassQRScanner = () => {
  const [scanner, setScanner] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [scanner]);

  const startScanner = () => {
    if (isScanning) return;

    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      false
    );

    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    setScanner(html5QrcodeScanner);
    setIsScanning(true);
    setScanResult(null);
  };

  const stopScanner = () => {
    if (scanner) {
      scanner.clear();
      setScanner(null);
    }
    setIsScanning(false);
  };

  const onScanSuccess = (decodedText, decodedResult) => {
    try {
      const qrData = JSON.parse(decodedText);
      
      // Validate QR code data
      if (qrData.type !== 'class_attendance') {
        toast.error('Invalid QR code type. This QR code is not for class attendance.');
        return;
      }

      // Check if QR code is expired
      const expiresAt = new Date(qrData.expiresAt);
      if (expiresAt < new Date()) {
        toast.error('This QR code has expired.');
        return;
      }

      // Simulate API call to record attendance
      recordAttendance(qrData);
      
    } catch (error) {
      toast.error('Invalid QR code format.');
    }
  };

  const onScanFailure = (error) => {
    // Handle scan failure silently
    console.log('QR scan failed:', error);
  };

  const recordAttendance = async (qrData) => {
    try {
      // Mock API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Attendance recorded successfully!',
            data: {
              classId: qrData.classId,
              className: qrData.className,
              timestamp: new Date().toISOString(),
              studentId: 'student123',
              studentName: 'John Doe'
            }
          });
        }, 1000);
      });

      if (response.success) {
        setScanResult(response.data);
        
        // Add to scan history
        const newScan = {
          id: Date.now(),
          classId: qrData.classId,
          className: qrData.className,
          timestamp: new Date().toISOString(),
          status: 'success'
        };
        
        setScanHistory(prev => [newScan, ...prev.slice(0, 9)]); // Keep last 10 scans
        toast.success(response.message);
        
        // Stop scanner after successful scan
        stopScanner();
      }
    } catch (error) {
      toast.error('Failed to record attendance. Please try again.');
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="qr-scanner-page">
      <div className="page-header">
        <h2>Class QR Scanner</h2>
        <p>Scan mentor-generated QR codes to mark your attendance</p>
      </div>

      <div className="scanner-container">
        <div className="scanner-section">
          <div className="scanner-card">
            <div className="scanner-header">
              <h3>
                <FiMaximize2 />
                Class Attendance Scanner
              </h3>
              <p>Point your camera at the QR code displayed by your mentor</p>
            </div>

            <div className="scanner-controls">
              {!isScanning ? (
                <button className="start-btn" onClick={startScanner}>
                  <FiMaximize2 />
                  Start Scanner
                </button>
              ) : (
                <button className="stop-btn" onClick={stopScanner}>
                  <FiXCircle />
                  Stop Scanner
                </button>
              )}
            </div>

            <div id="qr-reader" className="qr-reader-container"></div>

            {scanResult && (
              <div className="scan-result success">
                <div className="result-header">
                  <FiCheckCircle />
                  <h4>Attendance Recorded!</h4>
                </div>
                <div className="result-details">
                  <div className="result-item">
                    <FiBookOpen />
                    <span><strong>Class:</strong> {scanResult.className}</span>
                  </div>
                  <div className="result-item">
                    <FiUser />
                    <span><strong>Student:</strong> {scanResult.studentName}</span>
                  </div>
                  <div className="result-item">
                    <FiClock />
                    <span><strong>Time:</strong> {formatDateTime(scanResult.timestamp)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="scan-history-section">
          <div className="history-card">
            <h3>Recent Scans</h3>
            <div className="scan-history-list">
              {scanHistory.length === 0 ? (
                <div className="empty-history">
                  <FiMaximize2 />
                  <p>No recent scans</p>
                  <span>Your scan history will appear here</span>
                </div>
              ) : (
                scanHistory.map(scan => (
                  <div key={scan.id} className="scan-history-item">
                    <div className="scan-item-header">
                      <div className="scan-item-title">
                        <h4>{scan.className}</h4>
                        <span className={`status-badge ${scan.status}`}>
                          {scan.status === 'success' ? 'Success' : 'Failed'}
                        </span>
                      </div>
                      <span className="scan-time">{formatDateTime(scan.timestamp)}</span>
                    </div>
                    <div className="scan-item-details">
                      <span className="class-id">Class ID: {scan.classId}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="scanner-instructions">
        <h3>How to use the scanner:</h3>
        <div className="instructions-list">
          <div className="instruction-item">
            <div className="instruction-number">1</div>
            <div className="instruction-content">
              <h4>Wait for your mentor</h4>
              <p>Your mentor will display a QR code on the screen or board</p>
            </div>
          </div>
          <div className="instruction-item">
            <div className="instruction-number">2</div>
            <div className="instruction-content">
              <h4>Start the scanner</h4>
              <p>Click "Start Scanner" and allow camera access when prompted</p>
            </div>
          </div>
          <div className="instruction-item">
            <div className="instruction-number">3</div>
            <div className="instruction-content">
              <h4>Point at the QR code</h4>
              <p>Hold your device steady and point the camera at the QR code</p>
            </div>
          </div>
          <div className="instruction-item">
            <div className="instruction-number">4</div>
            <div className="instruction-content">
              <h4>Confirm attendance</h4>
              <p>Once scanned successfully, your attendance will be recorded automatically</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassQRScanner; 
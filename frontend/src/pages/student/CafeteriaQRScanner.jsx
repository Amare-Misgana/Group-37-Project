import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { FiCamera, FiCheckCircle, FiXCircle, FiClock, FiUser, FiCoffee } from 'react-icons/fi';
import { toast } from 'react-toastify';
import '../../styles/QRScanner.css';

const CafeteriaQRScanner = () => {
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
      "cafeteria-qr-reader",
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
      if (qrData.type !== 'student_meal') {
        toast.error('Invalid QR code type. This QR code is not for cafeteria meals.');
        return;
      }

      // Simulate API call to record meal
      recordMeal(qrData);
      
    } catch (error) {
      toast.error('Invalid QR code format.');
    }
  };

  const onScanFailure = (error) => {
    // Handle scan failure silently
    console.log('QR scan failed:', error);
  };

  const recordMeal = async (qrData) => {
    try {
      // Mock API call to get student data
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Meal recorded successfully!',
            data: {
              studentId: qrData.studentId,
              studentName: 'John Doe',
              studentPhoto: 'https://via.placeholder.com/150x150/4facfe/ffffff?text=JD',
              mealType: 'Lunch',
              timestamp: new Date().toISOString(),
              mealCount: 1,
              status: 'approved'
            }
          });
        }, 1000);
      });

      if (response.success) {
        setScanResult(response.data);
        
        // Add to scan history
        const newScan = {
          id: Date.now(),
          studentId: qrData.studentId,
          studentName: response.data.studentName,
          studentPhoto: response.data.studentPhoto,
          timestamp: new Date().toISOString(),
          mealType: response.data.mealType,
          status: 'success'
        };
        
        setScanHistory(prev => [newScan, ...prev.slice(0, 9)]); // Keep last 10 scans
        toast.success(response.message);
        
        // Stop scanner after successful scan
        stopScanner();
      }
    } catch (error) {
      toast.error('Failed to record meal. Please try again.');
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="qr-scanner-page">
      <div className="page-header">
        <h2>Cafeteria QR Scanner</h2>
        <p>Scan student QR codes to record cafeteria meal usage</p>
      </div>

      <div className="scanner-container">
        <div className="scanner-section">
          <div className="scanner-card">
            <div className="scanner-header">
              <h3>
                <FiCamera />
                Cafeteria Meal Scanner
              </h3>
              <p>Scan student QR codes to record meal usage</p>
            </div>

            <div className="scanner-controls">
              {!isScanning ? (
                <button className="start-btn" onClick={startScanner}>
                  <FiCamera />
                  Start Scanner
                </button>
              ) : (
                <button className="stop-btn" onClick={stopScanner}>
                  <FiXCircle />
                  Stop Scanner
                </button>
              )}
            </div>

            <div id="cafeteria-qr-reader" className="qr-reader-container"></div>

            {scanResult && (
              <div className="scan-result success">
                <div className="result-header">
                  <FiCheckCircle />
                  <h4>Meal Recorded!</h4>
                </div>
                <div className="student-info">
                  <div className="student-photo">
                    <img src={scanResult.studentPhoto} alt={scanResult.studentName} />
                  </div>
                  <div className="student-details">
                    <h5>{scanResult.studentName}</h5>
                    <p>Student ID: {scanResult.studentId}</p>
                  </div>
                </div>
                <div className="result-details">
                  <div className="result-item">
                    <FiCoffee />
                    <span><strong>Meal Type:</strong> {scanResult.mealType}</span>
                  </div>
                  <div className="result-item">
                    <FiClock />
                    <span><strong>Time:</strong> {formatDateTime(scanResult.timestamp)}</span>
                  </div>
                  <div className="result-item">
                    <FiUser />
                    <span><strong>Status:</strong> {scanResult.status}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="scan-history-section">
          <div className="history-card">
            <h3>Recent Meal Scans</h3>
            <div className="scan-history-list">
              {scanHistory.length === 0 ? (
                <div className="empty-history">
                  <FiCamera />
                  <p>No recent scans</p>
                  <span>Meal scan history will appear here</span>
                </div>
              ) : (
                scanHistory.map(scan => (
                  <div key={scan.id} className="scan-history-item">
                    <div className="scan-item-header">
                      <div className="scan-item-title">
                        <div className="student-info-compact">
                          <img src={scan.studentPhoto} alt={scan.studentName} />
                          <div>
                            <h4>{scan.studentName}</h4>
                            <span className="meal-type">{scan.mealType}</span>
                          </div>
                        </div>
                        <span className={`status-badge ${scan.status}`}>
                          {scan.status === 'success' ? 'Success' : 'Failed'}
                        </span>
                      </div>
                      <span className="scan-time">{formatDateTime(scan.timestamp)}</span>
                    </div>
                    <div className="scan-item-details">
                      <span className="student-id">Student ID: {scan.studentId}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="scanner-instructions">
        <h3>How to use the cafeteria scanner:</h3>
        <div className="instructions-list">
          <div className="instruction-item">
            <div className="instruction-number">1</div>
            <div className="instruction-content">
              <h4>Student presents QR code</h4>
              <p>Student shows their permanent QR code on their device or ID card</p>
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
              <h4>Scan the QR code</h4>
              <p>Point the camera at the student's QR code</p>
            </div>
          </div>
          <div className="instruction-item">
            <div className="instruction-number">4</div>
            <div className="instruction-content">
              <h4>Verify student</h4>
              <p>Check the student photo and details that appear</p>
            </div>
          </div>
          <div className="instruction-item">
            <div className="instruction-number">5</div>
            <div className="instruction-content">
              <h4>Record meal</h4>
              <p>Once verified, the meal will be recorded automatically</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafeteriaQRScanner; 
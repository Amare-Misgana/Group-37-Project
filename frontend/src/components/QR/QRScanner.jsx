import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { FiCamera, FiUser, FiCheck, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import "./QRScanner.css";

const QRScanner = () => {
  const [scanner, setScanner] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [scanMode, setScanMode] = useState("attendance"); // 'attendance' or 'mealing'
  const [isScanning, setIsScanning] = useState(false);

  // Mock student database - replace with API call
  const students = [
    {
      id: "STU001",
      name: "eyob bbelayneh",
      email: "eyob@example.com",
      class: "blockchain",
      photo: "https://via.placeholder.com/150",
      status: "active",
      lastAttendance: null,
      mealsToday: 0,
    },
    {
      id: "STU002",
      name: "hermela",
      email: "eyob@example.com",
      class: "Computer Science",
      photo: "https://via.placeholder.com/150",
      status: "active",
      lastAttendance: null,
      mealsToday: 0,
    },
  ];

  useEffect(() => {
    if (isScanning) {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false
      );

      html5QrcodeScanner.render(onScanSuccess, onScanFailure);
      setScanner(html5QrcodeScanner);

      return () => {
        if (html5QrcodeScanner) {
          html5QrcodeScanner.clear();
        }
      };
    }
  }, [isScanning]);

  const onScanSuccess = (decodedText, decodedResult) => {
    setScannedData(decodedText);

    // Find student by QR code
    const student = students.find((s) => s.id === decodedText);

    if (student) {
      setStudentInfo(student);

      if (scanMode === "attendance") {
        handleAttendance(student);
      } else {
        handleMealing(student);
      }
    } else {
      toast.error("Student not found!");
    }

    // Stop scanning after successful scan
    setIsScanning(false);
  };

  const onScanFailure = (error) => {
    // Handle scan failure silently
    console.warn(`QR scan error = ${error}`);
  };

  const handleAttendance = (student) => {
    const now = new Date();
    const today = now.toDateString();

    if (student.lastAttendance === today) {
      toast.warning(`${student.name} already marked present today!`);
    } else {
      // Update attendance - replace with API call
      toast.success(`Attendance marked for ${student.name}!`);
      setStudentInfo((prev) => ({
        ...prev,
        lastAttendance: today,
      }));
    }
  };

  const handleMealing = (student) => {
    if (student.mealsToday >= 3) {
      toast.error(`${student.name} has already taken 3 meals today!`);
    } else {
      // Update meal count - replace with API call
      toast.success(`Meal approved for ${student.name}!`);
      setStudentInfo((prev) => ({
        ...prev,
        mealsToday: prev.mealsToday + 1,
      }));
    }
  };

  const startScanning = () => {
    setIsScanning(true);
    setScannedData(null);
    setStudentInfo(null);
  };

  const stopScanning = () => {
    setIsScanning(false);
    if (scanner) {
      scanner.clear();
    }
  };

  const resetScanner = () => {
    setScannedData(null);
    setStudentInfo(null);
    setIsScanning(false);
    if (scanner) {
      scanner.clear();
    }
  };

  return (
    <div className="qr-scanner">
      <div className="scanner-header">
        <h1>QR Code Scanner</h1>
        <p>
          Scan student QR codes for{" "}
          {scanMode === "attendance" ? "attendance" : "mealing"}
        </p>
      </div>

      {/* Mode Selection */}
      <div className="mode-selector">
        <button
          className={`mode-btn ${scanMode === "attendance" ? "active" : ""}`}
          onClick={() => setScanMode("attendance")}
        >
          <FiUser />
          Attendance
        </button>
        <button
          className={`mode-btn ${scanMode === "mealing" ? "active" : ""}`}
          onClick={() => setScanMode("mealing")}
        >
          <FiCheck />
          Mealing
        </button>
      </div>

      {/* Scanner Controls */}
      <div className="scanner-controls">
        {!isScanning ? (
          <button onClick={startScanning} className="start-btn">
            <FiCamera />
            Start Scanning
          </button>
        ) : (
          <button onClick={stopScanning} className="stop-btn">
            <FiX />
            Stop Scanning
          </button>
        )}
      </div>

      {/* QR Scanner */}
      {isScanning && (
        <div className="scanner-container">
          <div id="qr-reader"></div>
        </div>
      )}

      {/* Student Information Display */}
      {studentInfo && (
        <div className="student-info">
          <div className="student-card">
            <div className="student-photo">
              <img src={studentInfo.photo} alt={studentInfo.name} />
            </div>
            <div className="student-details">
              <h3>{studentInfo.name}</h3>
              <p>
                <strong>ID:</strong> {studentInfo.id}
              </p>
              <p>
                <strong>Class:</strong> {studentInfo.class}
              </p>
              <p>
                <strong>Status:</strong>
                <span className={`status ${studentInfo.status}`}>
                  {studentInfo.status}
                </span>
              </p>

              {scanMode === "attendance" && (
                <p>
                  <strong>Last Attendance:</strong>
                  {studentInfo.lastAttendance
                    ? new Date(studentInfo.lastAttendance).toLocaleDateString()
                    : "Not marked yet"}
                </p>
              )}

              {scanMode === "mealing" && (
                <p>
                  <strong>Meals Today:</strong> {studentInfo.mealsToday}/3
                </p>
              )}
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={resetScanner} className="reset-btn">
              Scan Another
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!studentInfo && !isScanning && (
        <div className="instructions">
          <h3>Instructions</h3>
          <ul>
            <li>Select the scanning mode (Attendance or Mealing)</li>
            <li>Click "Start Scanning" to activate the camera</li>
            <li>Point the camera at a student's QR code</li>
            <li>The system will automatically process the scan</li>
            <li>Student information will be displayed after scanning</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default QRScanner;

import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiEdit,
  FiEye,
  FiUser,
  FiMail,
  FiPhone,
  FiBookOpen,
  FiTrendingUp,
  FiAward,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("all");

  useEffect(() => {
    // Mock data - replace with actual API calls
    setStudents([
      {
        id: 1,
        name: "Ahmed Hassan",
        class: "Class A",
        attendance: 95,
        averageGrade: 88,
        assignments: 8,
        lastSeen: "2 hours ago",
        photo: "https://via.placeholder.com/80/667eea/fff?text=AH",
        email: "ahmed.hassan@email.com",
        phone: "+2519667290004",
        progress: 80,
        streak: 5,
      },
      {
        id: 2,
        name: "kidus asrat",
        class: "Class A",
        attendance: 92,
        averageGrade: 91,
        assignments: 7,
        lastSeen: "1 hour ago",
        photo: "https://via.placeholder.com/80/4facfe/fff?text=FA",
        email: "kidus.asrat@email.com",
        phone: "+2519667290005",
        progress: 92,
        streak: 8,
      },
      {
        id: 3,
        name: "belachew",
        class: "Class B",
        attendance: 88,
        averageGrade: 85,
        assignments: 6,
        lastSeen: "3 hours ago",
        photo: "https://via.placeholder.com/80/f093fb/fff?text=OK",
        email: "belachew@email.com",
        phone: "+25179999",
        progress: 70,
        streak: 3,
      },
      {
        id: 4,
        name: "Layla Ahmed",
        class: "Class B",
        attendance: 96,
        averageGrade: 93,
        assignments: 9,
        lastSeen: "30 minutes ago",
        photo: "https://via.placeholder.com/80/43e97b/fff?text=LA",
        email: "layla.ahmed@email.com",
        phone: "+251966729003",
        progress: 98,
        streak: 10,
      },
    ]);
  }, []);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === "all" || student.class === filterClass;
    return matchesSearch && matchesClass;
  });

  const addGrade = (studentId) => {
    // Mock function - replace with actual API call
    console.log("Adding grade for student:", studentId);
  };

  const viewDetails = (studentId) => {
    // Mock function - replace with actual navigation
    console.log("Viewing details for student:", studentId);
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return "#27ae60";
    if (progress >= 75) return "#f39c12";
    if (progress >= 60) return "#e67e22";
    return "#e74c3c";
  };

  const getStreakColor = (streak) => {
    if (streak >= 8) return "#27ae60";
    if (streak >= 5) return "#f39c12";
    if (streak >= 3) return "#e67e22";
    return "#e74c3c";
  };

  return (
    <div className="mentor-student-management">
      <div className="page-header">
        <h1>Student Management</h1>
        <p>Manage your assigned students and their grades</p>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <FiFilter className="filter-icon" />
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            >
              <option value="all">All Classes</option>
              <option value="Class A">Class A</option>
              <option value="Class B">Class B</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="students-grid mentor-students-grid">
        {filteredStudents.map((student) => (
          <div key={student.id} className="student-card mentor-student-card">
            <div className="student-header">
              <div className="student-photo mentor-student-photo">
                <img src={student.photo} alt={student.name} />
                <div
                  className="status-indicator"
                  style={{
                    backgroundColor:
                      student.attendance > 90 ? "#27ae60" : "#f39c12",
                  }}
                ></div>
              </div>
              <div className="student-info">
                <h3>{student.name}</h3>
                <p className="student-class">
                  <FiBookOpen /> {student.class}
                </p>
                <p className="student-email">
                  <FiMail /> {student.email}
                </p>
                <p className="student-phone">
                  <FiPhone /> {student.phone}
                </p>
              </div>
            </div>

            <div className="mentor-student-stats">
              <div className="mentor-stat-row">
                <span className="mentor-stat-label">
                  <FiTrendingUp /> Progress:
                </span>
                <span className="mentor-stat-value">{student.progress}%</span>
                <div className="mentor-progress-bar">
                  <div
                    className="mentor-progress-fill"
                    style={{
                      width: `${student.progress}%`,
                      backgroundColor: getProgressColor(student.progress),
                    }}
                  ></div>
                </div>
              </div>
              <div className="mentor-stat-row">
                <span className="mentor-stat-label">
                  <FiAward /> Streak:
                </span>
                <span className="mentor-stat-value">{student.streak} days</span>
                <div
                  className="mentor-streak-badge"
                  style={{ backgroundColor: getStreakColor(student.streak) }}
                >
                  {student.streak}
                </div>
              </div>
              <div className="mentor-stat-row">
                <span className="mentor-stat-label">
                  <FiCheckCircle /> Attendance:
                </span>
                <span className="mentor-stat-value">{student.attendance}%</span>
              </div>
              <div className="mentor-stat-row">
                <span className="mentor-stat-label">
                  <FiEdit /> Avg. Grade:
                </span>
                <span className="mentor-stat-value">
                  {student.averageGrade}%
                </span>
              </div>
              <div className="mentor-stat-row">
                <span className="mentor-stat-label">
                  <FiEye /> Assignments:
                </span>
                <span className="mentor-stat-value">
                  {student.assignments}/10
                </span>
              </div>
              <div className="mentor-stat-row">
                <span className="mentor-stat-label">
                  <FiClock /> Last Seen:
                </span>
                <span className="mentor-stat-value">{student.lastSeen}</span>
              </div>
            </div>

            <div className="student-actions mentor-student-actions">
              <button
                className="action-button add-grade"
                onClick={() => addGrade(student.id)}
              >
                <FiEdit />
                Add Grade
              </button>
              <button
                className="action-button view-details"
                onClick={() => viewDetails(student.id)}
              >
                <FiEye />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="no-results">
          <p>No students found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;

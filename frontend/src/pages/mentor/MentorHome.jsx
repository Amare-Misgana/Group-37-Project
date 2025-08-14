import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FiUsers, FiBookOpen, FiCalendar, FiTrendingUp } from "react-icons/fi";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const MentorHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeClasses: 0,
    averageAttendance: 0,
    pendingAssignments: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setStats({
      totalStudents: 24,
      activeClasses: 3,
      averageAttendance: 87,
      pendingAssignments: 5,
    });

    setRecentActivities([
      {
        id: 1,
        type: "grade_added",
        message: "Added grades for blockchain Assignment #3",
        timestamp: "2 hours ago",
        student: "Ahmed ",
      },
      {
        id: 2,
        type: "attendance_marked",
        message: "Marked attendance for Class A - cybersecurity",
        timestamp: "4 hours ago",
        student: "Class A",
      },
      {
        id: 3,
        type: "assignment_posted",
        message: "Posted new assignment: vf",
        timestamp: "1 day ago",
        student: "All Students",
      },
      {
        id: 4,
        type: "notification_sent",
        message: "Sent reminder about upcoming exam",
        timestamp: "2 days ago",
        student: "Class B",
      },
    ]);

    setAssignedStudents([
      {
        id: 1,
        name: "Ahmed Hassan",
        class: "Class A",
        attendance: 95,
        averageGrade: 88,
        lastSeen: "2 hours ago",
        photo: "https://via.placeholder.com/50",
      },
      {
        id: 2,
        name: "abubeker Ali",
        class: "Class A",
        attendance: 92,
        averageGrade: 91,
        lastSeen: "1 hour ago",
        photo: "https://via.placeholder.com/50",
      },
      {
        id: 3,
        name: "abebe gzaw",
        class: "Class B",
        attendance: 88,
        averageGrade: 85,
        lastSeen: "3 hours ago",
        photo: "https://via.placeholder.com/50",
      },
      {
        id: 4,
        name: "Layla shfa",
        class: "Class B",
        attendance: 96,
        averageGrade: 93,
        lastSeen: "30 minutes ago",
        photo: "https://via.placeholder.com/50",
      },
    ]);
  }, []);

  const attendanceData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Class A",
        data: [95, 92, 88, 96, 94, 90, 87],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
      {
        label: "Class B",
        data: [88, 85, 92, 89, 91, 87, 84],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
    ],
  };

  const gradeTrendData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
    datasets: [
      {
        label: "Average Grade",
        data: [82, 85, 87, 89, 88],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "grade_added":
        return <FiTrendingUp className="activity-icon grade" />;
      case "attendance_marked":
        return <FiCalendar className="activity-icon attendance" />;
      case "assignment_posted":
        return <FiBookOpen className="activity-icon assignment" />;
      case "notification_sent":
        return <FiUsers className="activity-icon notification" />;
      default:
        return <FiUsers className="activity-icon" />;
    }
  };

  return (
    <div className="mentor-home">
      <div className="welcome-section">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Here's what's happening with your classes today.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FiUsers />
          </div>
          <div className="stat-content">
            <h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiBookOpen />
          </div>
          <div className="stat-content">
            <h3>{stats.activeClasses}</h3>
            <p>Active Classes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiCalendar />
          </div>
          <div className="stat-content">
            <h3>{stats.averageAttendance}%</h3>
            <p>Avg. Attendance</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiTrendingUp />
          </div>
          <div className="stat-content">
            <h3>{stats.pendingAssignments}</h3>
            <p>Pending Tasks</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-card">
            <h3>Weekly Attendance</h3>
            <div className="chart-container">
              <Bar data={attendanceData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-card">
            <h3>Grade Trends</h3>
            <div className="chart-container">
              <Line data={gradeTrendData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="bottom-section">
          {/* Assigned Students */}
          <div className="students-section">
            <h3>Your Students</h3>
            <div className="students-grid">
              {assignedStudents.map((student) => (
                <div key={student.id} className="student-card">
                  <div className="student-header">
                    <img
                      src={student.photo}
                      alt={student.name}
                      className="student-photo"
                    />
                    <div className="student-info">
                      <h4>{student.name}</h4>
                      <p>{student.class}</p>
                    </div>
                  </div>
                  <div className="student-stats">
                    <div className="stat-item">
                      <span className="stat-label">Attendance:</span>
                      <span className="stat-value">{student.attendance}%</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Avg Grade:</span>
                      <span className="stat-value">
                        {student.averageGrade}%
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Last Seen:</span>
                      <span className="stat-value">{student.lastSeen}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="activities-section">
            <h3>Recent Activities</h3>
            <div className="activities-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon-wrapper">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-content">
                    <p className="activity-message">{activity.message}</p>
                    <div className="activity-meta">
                      <span className="activity-student">
                        {activity.student}
                      </span>
                      <span className="activity-time">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorHome;

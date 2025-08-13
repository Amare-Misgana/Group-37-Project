import React from 'react';
import { FiBookOpen, FiUsers, FiUserCheck, FiCoffee, FiTrendingUp, FiTrendingDown, FiPlus, FiBell, FiBarChart2, FiSettings } from 'react-icons/fi';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../../styles/AdminHome.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminHome = () => {
  // Mock data
  const stats = [
    {
      id: 1,
      title: 'Total Classes',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: FiBookOpen,
      type: 'classes'
    },
    {
      id: 2,
      title: 'Active Students',
      value: '156',
      change: '+12',
      changeType: 'positive',
      icon: FiUsers,
      type: 'students'
    },
    {
      id: 3,
      title: 'Mentors',
      value: '8',
      change: '+1',
      changeType: 'positive',
      icon: FiUserCheck,
      type: 'mentors'
    },
    {
      id: 4,
      title: 'Café Users Today',
      value: '89',
      change: '-5',
      changeType: 'negative',
      icon: FiCoffee,
      type: 'cafe'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      message: 'New student registered: Ahmed Hassan',
      user: 'System',
      time: '2 minutes ago',
      icon: FiUsers
    },
    {
      id: 2,
      message: 'Attendance marked for Mathematics class',
      user: 'Dr. Smith',
      time: '15 minutes ago',
      icon: FiUserCheck
    },
    {
      id: 3,
      message: 'New assignment posted in Physics',
      user: 'Prof. Johnson',
      time: '1 hour ago',
      icon: FiBookOpen
    },
    {
      id: 4,
      message: 'Café meal served to 45 students',
      user: 'Café Staff',
      time: '2 hours ago',
      icon: FiCoffee
    }
  ];

  const quickActions = [
    {
      id: 1,
      title: 'Add New Student',
      description: 'Register a new student to the system',
      icon: FiPlus,
      action: () => console.log('Add student')
    },
    {
      id: 2,
      title: 'Send Notification',
      description: 'Send announcement to all users',
      icon: FiBell,
      action: () => console.log('Send notification')
    },
    {
      id: 3,
      title: 'Generate Report',
      description: 'Create detailed analytics report',
      icon: FiBarChart2,
      action: () => console.log('Generate report')
    },
    {
      id: 4,
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: FiSettings,
      action: () => console.log('Open settings')
    }
  ];

  // Chart data
  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Attendance',
        data: [95, 88, 92, 85, 90, 78, 82],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const cafeData = {
    labels: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'],
    datasets: [
      {
        label: 'Meals Served',
        data: [45, 89, 67, 34],
        backgroundColor: [
          '#667eea',
          '#f093fb',
          '#4facfe',
          '#43e97b'
        ],
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="admin-home">
      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className={`stat-card ${stat.type}`}>
              <div className="stat-icon">
                <Icon />
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.title}</div>
              <div className={`stat-change ${stat.changeType}`}>
                {stat.changeType === 'positive' ? <FiTrendingUp /> : <FiTrendingDown />}
                {stat.change} from last week
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <h3>Weekly Attendance Trend</h3>
          <div className="chart-container">
            <Line data={attendanceData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Today's Café Usage</h3>
          <div className="chart-container">
            <Bar data={cafeData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="recent-activities">
        <h3>Recent Activities</h3>
        {recentActivities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                <Icon />
              </div>
              <div className="activity-content">
                <div className="activity-message">{activity.message}</div>
                <div className="activity-meta">
                  <span className="activity-user">{activity.user}</span>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <div key={action.id} className="action-card" onClick={action.action}>
              <div className="action-icon">
                <Icon />
              </div>
              <div className="action-title">{action.title}</div>
              <div className="action-description">{action.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminHome; 
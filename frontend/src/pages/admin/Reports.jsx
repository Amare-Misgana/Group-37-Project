import React, { useState, useEffect } from 'react';
import { FiDownload, FiFilter, FiCalendar, FiBarChart2, FiTrendingUp, FiUsers, FiCoffee, FiAward, FiActivity } from 'react-icons/fi';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import '../../styles/Reports.css';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('attendance');
  const [dateRange, setDateRange] = useState('week');
  const [selectedClass, setSelectedClass] = useState('all');

  const [attendanceData, setAttendanceData] = useState({
    labels: [],
    datasets: []
  });

  const [cafeData, setCafeData] = useState({
    labels: [],
    datasets: []
  });

  const [studentMealData, setStudentMealData] = useState({
    labels: [],
    datasets: []
  });

  const [classPerformanceData, setClassPerformanceData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    // Mock data - replace with API calls
    generateAttendanceData();
    generateCafeData();
    generateStudentMealData();
    generateClassPerformanceData();
  }, [dateRange, selectedClass]);

  const generateAttendanceData = () => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = [145, 152, 148, 155, 149, 142, 138];
    
    setAttendanceData({
      labels,
      datasets: [{
        label: 'Daily Attendance',
        data,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6
      }]
    });
  };

  const generateCafeData = () => {
    const labels = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
    const data = [89, 142, 98, 45];
    
    setCafeData({
      labels,
      datasets: [{
        label: 'Meals Served',
        data,
        backgroundColor: [
          'rgba(102, 126, 234, 0.8)',
          'rgba(79, 172, 254, 0.8)',
          'rgba(240, 147, 251, 0.8)',
          'rgba(67, 233, 123, 0.8)'
        ],
        borderColor: [
          'rgba(102, 126, 234, 1)',
          'rgba(79, 172, 254, 1)',
          'rgba(240, 147, 251, 1)',
          'rgba(67, 233, 123, 1)'
        ],
        borderWidth: 2
      }]
    });
  };

  const generateStudentMealData = () => {
    const labels = ['Sarah Johnson', 'Mike Chen', 'Emma Davis', 'Alex Brown', 'David Kim'];
    const data = [12, 15, 8, 10, 13];
    
    setStudentMealData({
      labels,
      datasets: [{
        label: 'Meals Taken',
        data,
        backgroundColor: [
          'rgba(231, 76, 60, 0.8)',
          'rgba(52, 152, 219, 0.8)',
          'rgba(46, 204, 113, 0.8)',
          'rgba(155, 89, 182, 0.8)',
          'rgba(241, 196, 15, 0.8)'
        ],
        borderColor: [
          'rgba(231, 76, 60, 1)',
          'rgba(52, 152, 219, 1)',
          'rgba(46, 204, 113, 1)',
          'rgba(155, 89, 182, 1)',
          'rgba(241, 196, 15, 1)'
        ],
        borderWidth: 2
      }]
    });
  };

  const generateClassPerformanceData = () => {
    const labels = ['Advanced Math', 'Computer Science', 'Physics', 'Chemistry'];
    const attendanceData = [95, 88, 92, 85];
    const performanceData = [87, 91, 78, 82];
    
    setClassPerformanceData({
      labels,
      datasets: [
        {
          label: 'Attendance Rate (%)',
          data: attendanceData,
          backgroundColor: 'rgba(102, 126, 234, 0.6)',
          borderColor: '#667eea',
          borderWidth: 2
        },
        {
          label: 'Performance Score (%)',
          data: performanceData,
          backgroundColor: 'rgba(79, 172, 254, 0.6)',
          borderColor: '#4facfe',
          borderWidth: 2
        }
      ]
    });
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    },
    elements: {
      point: {
        hoverRadius: 8
      }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
    }
  };

  const exportReport = () => {
    // Mock export functionality
    const link = document.createElement('a');
    link.download = `${selectedReport}_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.href = 'data:text/csv;charset=utf-8,';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getReportStats = () => {
    switch (selectedReport) {
      case 'attendance':
        return [
          { icon: FiUsers, label: 'Total Attendance', value: '1,029', color: '#667eea' },
          { icon: FiTrendingUp, label: 'Average Daily', value: '147', color: '#4facfe' },
          { icon: FiAward, label: 'Attendance Rate', value: '94.2%', color: '#43e97b' },
          { icon: FiActivity, label: 'Peak Day', value: 'Thursday', color: '#f093fb' }
        ];
      case 'cafe':
        return [
          { icon: FiCoffee, label: 'Total Meals', value: '374', color: '#667eea' },
          { icon: FiBarChart2, label: 'Most Popular', value: 'Lunch', color: '#4facfe' },
          { icon: FiTrendingUp, label: 'Average Daily', value: '53', color: '#43e97b' },
          { icon: FiAward, label: 'Efficiency', value: '98.5%', color: '#f093fb' }
        ];
      case 'student-meals':
        return [
          { icon: FiUsers, label: 'Total Students', value: '5', color: '#667eea' },
          { icon: FiCoffee, label: 'Total Meals', value: '58', color: '#4facfe' },
          { icon: FiTrendingUp, label: 'Average per Student', value: '11.6', color: '#43e97b' },
          { icon: FiAward, label: 'Top Student', value: 'Mike Chen', color: '#f093fb' }
        ];
      case 'class-performance':
        return [
          { icon: FiUsers, label: 'Total Classes', value: '4', color: '#667eea' },
          { icon: FiTrendingUp, label: 'Best Attendance', value: 'Advanced Math', color: '#4facfe' },
          { icon: FiAward, label: 'Best Performance', value: 'Computer Science', color: '#43e97b' },
          { icon: FiActivity, label: 'Overall Average', value: '87.5%', color: '#f093fb' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="reports">
      <div className="page-header">
        <div className="header-content">
          <h1>Reports & Analytics</h1>
          <p>Comprehensive insights and data visualization for the summer camp</p>
        </div>
        <button onClick={exportReport} className="export-button">
          <FiDownload /> Export Report
        </button>
      </div>

      {/* Report Controls */}
      <div className="report-controls">
        <div className="control-group">
          <label>Report Type:</label>
          <select 
            value={selectedReport} 
            onChange={(e) => setSelectedReport(e.target.value)}
            className="report-select"
          >
            <option value="attendance">Attendance Report</option>
            <option value="cafe">Café Usage Report</option>
            <option value="student-meals">Student Meal Report</option>
            <option value="class-performance">Class Performance Report</option>
          </select>
        </div>

        <div className="control-group">
          <label>Date Range:</label>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="report-select"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>

        <div className="control-group">
          <label>Class:</label>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="report-select"
          >
            <option value="all">All Classes</option>
            <option value="math">Advanced Mathematics</option>
            <option value="cs">Computer Science</option>
            <option value="physics">Physics</option>
          </select>
        </div>
      </div>

      {/* Report Stats */}
      <div className="report-stats">
        {getReportStats().map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              <stat.icon />
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Report Content */}
      <div className="report-content">
        {selectedReport === 'attendance' && (
          <div className="report-section">
            <div className="section-header">
              <h2>Attendance Report</h2>
              <p>Daily attendance trends and patterns</p>
            </div>
            <div className="chart-container">
              <Line data={attendanceData} options={chartOptions} />
            </div>
          </div>
        )}

        {selectedReport === 'cafe' && (
          <div className="report-section">
            <div className="section-header">
              <h2>Café Usage Report</h2>
              <p>Meal distribution and cafeteria usage statistics</p>
            </div>
            <div className="chart-container">
              <Bar data={cafeData} options={chartOptions} />
            </div>
          </div>
        )}

        {selectedReport === 'student-meals' && (
          <div className="report-section">
            <div className="section-header">
              <h2>Student Meal Report</h2>
              <p>Individual student meal consumption patterns</p>
            </div>
            <div className="chart-container">
              <Doughnut data={studentMealData} options={pieOptions} />
            </div>
          </div>
        )}

        {selectedReport === 'class-performance' && (
          <div className="report-section">
            <div className="section-header">
              <h2>Class Performance Report</h2>
              <p>Comparative analysis of class attendance and performance</p>
            </div>
            <div className="chart-container">
              <Bar data={classPerformanceData} options={chartOptions} />
            </div>
          </div>
        )}
      </div>

      {/* Detailed Table */}
      <div className="report-table">
        <div className="table-header">
          <h3>Detailed Data</h3>
          <p>Comprehensive breakdown of all metrics</p>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Class</th>
                <th>Students Present</th>
                <th>Meals Served</th>
                <th>Performance</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2024-06-15</td>
                <td>Advanced Mathematics</td>
                <td>18/25</td>
                <td>15</td>
                <td>92%</td>
                <td>Excellent participation</td>
              </tr>
              <tr>
                <td>2024-06-15</td>
                <td>Computer Science</td>
                <td>22/30</td>
                <td>18</td>
                <td>88%</td>
                <td>Good engagement</td>
              </tr>
              <tr>
                <td>2024-06-14</td>
                <td>Advanced Mathematics</td>
                <td>20/25</td>
                <td>16</td>
                <td>95%</td>
                <td>Outstanding performance</td>
              </tr>
              <tr>
                <td>2024-06-14</td>
                <td>Physics</td>
                <td>16/20</td>
                <td>12</td>
                <td>85%</td>
                <td>Steady progress</td>
              </tr>
              <tr>
                <td>2024-06-13</td>
                <td>Chemistry</td>
                <td>14/18</td>
                <td>11</td>
                <td>82%</td>
                <td>Improving attendance</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports; 
import React, { useState, useEffect } from 'react';
import { FiBookOpen, FiCalendar, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import '../../styles/Grades.css';

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [overallStats, setOverallStats] = useState({
    averageGrade: 0,
    totalAssignments: 0,
    highestGrade: 0,
    lowestGrade: 0
  });

  useEffect(() => {
    // Mock data - replace with actual API calls
    setGrades([
      {
        id: 1,
        subject: 'Mathematics',
        assignments: [
          { name: 'Assignment #1', grade: 85, maxGrade: 100, date: '2024-01-05', type: 'Assignment' },
          { name: 'Assignment #2', grade: 92, maxGrade: 100, date: '2024-01-12', type: 'Assignment' },
          { name: 'Quiz #1', grade: 88, maxGrade: 100, date: '2024-01-15', type: 'Quiz' },
          { name: 'Assignment #3', grade: 90, maxGrade: 100, date: '2024-01-20', type: 'Assignment' },
          { name: 'Midterm Exam', grade: 87, maxGrade: 100, date: '2024-01-25', type: 'Exam' }
        ],
        average: 88.4
      },
      {
        id: 2,
        subject: 'blockchain',
        assignments: [
          { name: 'Lab Report #1', grade: 87, maxGrade: 100, date: '2024-01-08', type: 'Lab Report' },
          { name: 'Quiz #1', grade: 85, maxGrade: 100, date: '2024-01-14', type: 'Quiz' },
          { name: 'Assignment #1', grade: 89, maxGrade: 100, date: '2024-01-18', type: 'Assignment' },
          { name: 'Lab Report #2', grade: 91, maxGrade: 100, date: '2024-01-22', type: 'Lab Report' },
          { name: 'Project #1', grade: 94, maxGrade: 100, date: '2024-01-28', type: 'Project' }
        ],
        average: 89.2
      },
      {
        id: 3,
        subject: 'javascript',
        assignments: [
          { name: 'Assignment #1', grade: 82, maxGrade: 100, date: '2024-01-06', type: 'Assignment' },
          { name: 'Lab Report #1', grade: 88, maxGrade: 100, date: '2024-01-13', type: 'Lab Report' },
          { name: 'Quiz #1', grade: 85, maxGrade: 100, date: '2024-01-16', type: 'Quiz' },
          { name: 'Assignment #2', grade: 90, maxGrade: 100, date: '2024-01-21', type: 'Assignment' },
          { name: 'Lab Report #2', grade: 86, maxGrade: 100, date: '2024-01-27', type: 'Lab Report' }
        ],
        average: 86.2
      },
      {
        id: 4,
        subject: 'django',
        assignments: [
          { name: 'Essay #1', grade: 89, maxGrade: 100, date: '2024-01-07', type: 'Essay' },
          { name: 'Reading Quiz', grade: 92, maxGrade: 100, date: '2024-01-11', type: 'Quiz' },
          { name: 'Essay #2', grade: 87, maxGrade: 100, date: '2024-01-17', type: 'Essay' },
          { name: 'Presentation', grade: 91, maxGrade: 100, date: '2024-01-23', type: 'Presentation' }
        ],
        average: 89.75
      }
    ]);

    setOverallStats({
      averageGrade: 88.39,
      totalAssignments: 19,
      highestGrade: 94,
      lowestGrade: 82
    });
  }, []);

  const filteredGrades = selectedSubject === 'all' 
    ? grades 
    : grades.filter(grade => grade.subject === selectedSubject);

  const getGradeColor = (grade) => {
    if (grade >= 90) return '#27ae60';
    if (grade >= 80) return '#f39c12';
    if (grade >= 70) return '#e67e22';
    return '#e74c3c';
  };

  const getGradeLetter = (grade) => {
    if (grade >= 90) return 'A';
    if (grade >= 80) return 'B';
    if (grade >= 70) return 'C';
    if (grade >= 60) return 'D';
    return 'F';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Assignment': return '#3498db';
      case 'Quiz': return '#9b59b6';
      case 'Exam': return '#e74c3c';
      case 'Lab Report': return '#f39c12';
      case 'Project': return '#27ae60';
      case 'Essay': return '#1abc9c';
      case 'Presentation': return '#e67e22';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="grades-page">
      <div className="page-header">
        <h2>My Grades</h2>
        <p>View your academic performance across all subjects</p>
      </div>

      <div className="grades-overview">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FiTrendingUp />
            </div>
            <div className="stat-content">
              <h3>{overallStats.averageGrade.toFixed(1)}%</h3>
              <p>Overall Average</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FiBookOpen />
            </div>
            <div className="stat-content">
              <h3>{overallStats.totalAssignments}</h3>
              <p>Total Assignments</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FiTrendingUp />
            </div>
            <div className="stat-content">
              <h3>{overallStats.highestGrade}%</h3>
              <p>Highest Grade</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FiTrendingDown />
            </div>
            <div className="stat-content">
              <h3>{overallStats.lowestGrade}%</h3>
              <p>Lowest Grade</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grades-content">
        <div className="filters-section">
          <div className="filter-group">
            <label htmlFor="subject-filter">Filter by Subject:</label>
            <select
              id="subject-filter"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="all">All Subjects</option>
              {grades.map(subject => (
                <option key={subject.id} value={subject.subject}>
                  {subject.subject}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grades-table-container">
          {filteredGrades.map(subject => (
            <div key={subject.id} className="subject-section">
              <div className="subject-header">
                <h3>{subject.subject}</h3>
                <div className="subject-average">
                  <span className="average-label">Average:</span>
                  <span 
                    className="average-grade"
                    style={{ color: getGradeColor(subject.average) }}
                  >
                    {subject.average.toFixed(1)}% ({getGradeLetter(subject.average)})
                  </span>
                </div>
              </div>

              <div className="table-container">
                <table className="grades-table">
                  <thead>
                    <tr>
                      <th>Assignment</th>
                      <th>Type</th>
                      <th>Grade</th>
                      <th>Percentage</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subject.assignments.map((assignment, index) => (
                      <tr key={index}>
                        <td className="assignment-name">{assignment.name}</td>
                        <td>
                          <span 
                            className="type-badge"
                            style={{ backgroundColor: getTypeColor(assignment.type) }}
                          >
                            {assignment.type}
                          </span>
                        </td>
                        <td className="grade-cell">
                          <span 
                            className="grade-value"
                            style={{ color: getGradeColor(assignment.grade) }}
                          >
                            {assignment.grade}/{assignment.maxGrade}
                          </span>
                        </td>
                        <td className="percentage-cell">
                          <span 
                            className="percentage-value"
                            style={{ color: getGradeColor(assignment.grade) }}
                          >
                            {((assignment.grade / assignment.maxGrade) * 100).toFixed(1)}%
                          </span>
                        </td>
                        <td className="date-cell">
                          <FiCalendar />
                          {formatDate(assignment.date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Grades; 
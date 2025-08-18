import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome,
  FiUsers,
  FiBookOpen,
  FiBell,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiMessageSquare,
  FiCamera,
  FiMenu,
  FiX,
  FiUser,
  FiFileText,
  FiCreditCard,
  FiMaximize2
} from 'react-icons/fi';
import './StudentDashboard.css';

// Import student pages
import StudentHome from './StudentHome';
import Grades from './Grades';
import Notifications from './Notifications';
import Messages from './Messages';
import Profile from './Profile';
import ClassQRScanner from './ClassQRScanner';
import CafeteriaQRScanner from './CafeteriaQRScanner';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/student', icon: FiHome, label: 'Home (News)' },
    { path: '/student/grades', icon: FiBookOpen, label: 'Grades' },
    { path: '/student/notifications', icon: FiBell, label: 'Notifications' },
    { path: '/student/messages', icon: FiMessageSquare, label: 'Messages' },
    { path: '/student/class-scanner', icon: FiMaximize2, label: 'Class Scanner' },
    { path: '/student/cafeteria-scanner', icon: FiCamera, label: 'Cafeteria Scanner' },
    { path: '/student/profile', icon: FiUser, label: 'Profile' }
  ];

  const handleLogout = () => {
    logout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="student-dashboard">
      {/* Mobile Overlay */}
      <div
        className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      />

      {/* Sidebar */}
      <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>INSA Summer Camp</h2>
          <p>Student Dashboard</p>
        </div>

        <div className="user-info">
          <div className="user-avatar">
            {getUserInitials(user?.name || 'Student')}
          </div>
          <div className="user-details">
            <h4>{user?.name || 'Student User'}</h4>
            <p>{user?.role || 'student'}</p>
          </div>
        </div>

        <nav className="nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <div key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <Icon />
                  {item.label}
                </Link>
              </div>
            );
          })}
        </nav>
      </div>

      <div className="main-content">
        <div className="content-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={toggleMobileMenu} className="mobile-menu-toggle">
              {isMobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
            <h1>Welcome back, {user?.name || 'Student'}!</h1>
          </div>
          <div className="header-actions">
            <button onClick={handleLogout} className="logout-btn">
              <FiLogOut />
              Logout
            </button>
          </div>
        </div>

        <div className="content-area">
          <Routes>
            <Route path="/" element={<StudentHome />} />
            <Route path="/grades" element={<Grades />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/class-scanner" element={<ClassQRScanner />} />
            <Route path="/cafeteria-scanner" element={<CafeteriaQRScanner />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 
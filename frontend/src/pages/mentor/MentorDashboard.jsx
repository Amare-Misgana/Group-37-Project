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
  FiMenu,
  FiX,
  FiUser,
  FiFileText,
  FiCreditCard,
  FiMaximize2
} from 'react-icons/fi';
import './MentorDashboard.css';

// Import mentor pages
import MentorHome from './MentorHome';
import StudentManagement from './StudentManagement';
import Assignments from './Assignments';
import Notifications from './Notifications';
import Profile from './Profile';
import QRGenerator from './QRGenerator';

const MentorDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/mentor', icon: FiHome, label: 'Home' },
    { path: '/mentor/students', icon: FiUsers, label: 'Students' },
    { path: '/mentor/assignments', icon: FiBookOpen, label: 'Assignments' },
    { path: '/mentor/notifications', icon: FiBell, label: 'Notifications' },
    { path: '/mentor/profile', icon: FiUser, label: 'Profile' },
    { path: '/mentor/qr-generator', icon: FiMaximize2, label: 'QR Generator' }
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
    <div className="mentor-dashboard">
      {/* Mobile Overlay */}
      <div
        className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      />

      {/* Sidebar */}
      <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>INSA Summer Camp</h2>
          <p>Mentor Dashboard</p>
        </div>

        <div className="user-info">
          <div className="user-avatar">
            {getUserInitials(user?.name || 'Mentor')}
          </div>
          <div className="user-details">
            <h4>{user?.name || 'Mentor User'}</h4>
            <p>{user?.role || 'mentor'}</p>
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
            <h1>Welcome back, {user?.name || 'Mentor'}!</h1>
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
            <Route path="/" element={<MentorHome />} />
            <Route path="/students" element={<StudentManagement />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/qr-generator" element={<QRGenerator />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard; 
import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiHome, 
  FiUsers, 
  FiBookOpen, 
  FiBell, 
  FiUserCheck, 
  FiBarChart2, 
  FiSettings, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiUser,
  FiFileText,
  FiCreditCard
} from 'react-icons/fi';
import './AdminDashboard.css';

// Import admin pages
import AdminHome from './AdminHome';
import ManageClasses from './ManageClasses';
import StudentManagement from './StudentManagement';
import MentorManagement from './MentorManagement';
import NewsManagement from './NewsManagement';
import Notifications from './Notifications';
import Reports from './Reports';
import IDCards from './IDCards';
import Settings from './Settings';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '', icon: FiHome, label: 'Home' },
    { path: 'classes', icon: FiBookOpen, label: 'Classes' },
    { path: 'students', icon: FiUserCheck, label: 'Students' },
    { path: 'mentors', icon: FiUsers, label: 'Mentors' },
    { path: 'news', icon: FiFileText, label: 'News' },
    { path: 'notifications', icon: FiBell, label: 'Notifications' },
    { path: 'reports', icon: FiBarChart2, label: 'Reports' },
    { path: 'id-cards', icon: FiCreditCard, label: 'ID Cards' },
    { path: 'settings', icon: FiSettings, label: 'Settings' }
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
    <div className="admin-dashboard">
      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      />

      {/* Sidebar */}
      <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>INSA Summer Camp</h2>
          <p>Admin Dashboard</p>
        </div>

        <div className="user-info">
          <div className="user-avatar">
            {getUserInitials(user?.name || 'Admin')}
          </div>
          <div className="user-details">
            <h4>{user?.name || 'Admin User'}</h4>
            <p>{user?.role || 'admin'}</p>
          </div>
        </div>

        <nav className="nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const fullPath = item.path === '' ? '/admin' : `/admin/${item.path}`;
            const isActive = location.pathname === fullPath;
            
            return (
              <div key={item.path || 'home'} className="nav-item">
                <Link
                  to={fullPath}
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
            <h1>Welcome back, {user?.name || 'Admin'}!</h1>
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
            <Route path="/" element={<AdminHome />} />
            <Route path="classes" element={<ManageClasses />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="mentors" element={<MentorManagement />} />
            <Route path="news" element={<NewsManagement />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="reports" element={<Reports />} />
            <Route path="id-cards" element={<IDCards />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    setLoading(false);
  }, []);

  const login = async (username, password, role) => {
    try {
      console.log('AuthContext login called with:', { username, password, role });
      
      // Mock authentication - replace with actual Django API endpoint
      const mockUsers = {
        admin: { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User', email: 'admin@insa.com' },
        mentor: { username: 'mentor', password: 'mentor123', role: 'mentor', name: 'Mentor User', email: 'mentor@insa.com' },
        student: { username: 'student', password: 'student123', role: 'student', name: 'Student User', email: 'student@insa.com' }
      };

      // Check if credentials match
      const userKey = username.toLowerCase();
      const mockUser = mockUsers[userKey];
      console.log('Looking for user:', userKey, 'Found:', mockUser);
      
      if (mockUser && mockUser.password === password && mockUser.role === role) {
        const token = `mock-token-${Date.now()}`;
        const userData = {
          id: 1,
          username: mockUser.username,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role
        };
        
        console.log('Setting user data:', userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        setIsAuthenticated(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        console.log('Authentication successful, returning success');
        return { success: true };
      } else {
        console.log('Authentication failed - credentials or role mismatch');
        return { success: false, error: 'Invalid credentials or role mismatch' };
      }
    } catch (error) {
      console.error('AuthContext error:', error);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
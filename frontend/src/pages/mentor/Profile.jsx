import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiCamera, FiSave, FiEdit } from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    photo: '',
    department: '',
    experience: ''
  });

  useEffect(() => {
    // Mock data - replace with actual API calls
    setProfileData({
      name: user?.name || 'Dr. mitiku',
      email: user?.email || 'mitiku.mitiku@insa.edu',
      phone: '+251966729004',
      bio: 'Experienced educator with 8 years of teaching Mathematics and Physics. Passionate about making complex concepts accessible to students.',
      photo: 'https://via.placeholder.com/150',
      department: 'cyber security',
      experience: '8 years'
    });
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock API call - replace with actual API call
    console.log('Updating profile:', profileData);
    setIsEditing(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData({ ...profileData, photo: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile">
      <div className="page-header">
        <h1>Profile</h1>
        <button 
          className={`edit-button ${isEditing ? 'cancel' : ''}`}
          onClick={() => setIsEditing(!isEditing)}
        >
          <FiEdit />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="profile-content">
        {/* Profile Photo Section */}
        <div className="profile-photo-section">
          <div className="photo-container">
            <img src={profileData.photo} alt="Profile" className="profile-photo" />
            {isEditing && (
              <div className="photo-overlay">
                <label htmlFor="photo-upload" className="upload-label">
                  <FiCamera />
                  Change Photo
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h3>Personal Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>
                  <FiUser />
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  disabled={!isEditing}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>
                  <FiMail />
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>
                  <FiPhone />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  value={profileData.department}
                  onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Years of Experience</label>
              <input
                type="text"
                value={profileData.experience}
                onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            
            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                disabled={!isEditing}
                rows="4"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          {/* Security Section */}
          <div className="form-section">
            <h3>Security</h3>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                disabled={!isEditing}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  disabled={!isEditing}
                />
              </div>
              
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="form-section">
            <h3>Preferences</h3>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  disabled={!isEditing}
                  defaultChecked
                />
                Receive email notifications
              </label>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  disabled={!isEditing}
                  defaultChecked
                />
                Receive SMS notifications
              </label>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  disabled={!isEditing}
                />
                Public profile
              </label>
            </div>
          </div>

          {isEditing && (
            <div className="form-actions">
              <button type="submit" className="save-button">
                <FiSave />
                Save Changes
              </button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile; 
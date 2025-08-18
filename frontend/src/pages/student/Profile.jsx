import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiEdit2, FiSave, FiX, FiCamera } from 'react-icons/fi';
import '../../styles/Profile.css';

const StudentProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Eyob BelaYneh',
    email: 'eyob.belayneh@student.insa.edu.eg',
    phone: '+251966729004',
    dateOfBirth: '2005-03-15',
    address: 'addis, ethiopia',
    studentId: 'STU2024001',
    class: 'Mathematics & Computer Science',
    enrollmentDate: '2024-01-15',
    photo: 'https://via.placeholder.com/150/3498db/ffffff?text=AH',
    emergencyContact: {
      name: 'feven mesfin',
      phone: '+25192346788',
      relationship: 'Mother'
    }
  });

  const [formData, setFormData] = useState(profile);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [name]: value
      }
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
    // Here you would typically make an API call to update the profile
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const handlePasswordUpdate = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    // Here you would typically make an API call to update the password
    alert('Password updated successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          photo: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="student-profile">
      <div className="profile-header">
        <h1>My Profile</h1>
        <div className="header-actions">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              <FiEdit2 size={16} />
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button onClick={handleSave} className="save-btn">
                <FiSave size={16} />
                Save
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                <FiX size={16} />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <div className="profile-photo-section">
            <div className="profile-photo">
              <img src={formData.photo} alt="Profile" />
              {isEditing && (
                <div className="photo-overlay">
                  <label htmlFor="photo-upload" className="photo-upload-btn">
                    <FiCamera size={20} />
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
            <div className="photo-info">
              <h3>{formData.name}</h3>
              <p className="student-id">ID: {formData.studentId}</p>
              <p className="class-info">{formData.class}</p>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                />
              ) : (
                <p>{profile.name}</p>
              )}
            </div>

            <div className="info-item">
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                />
              ) : (
                <p>{profile.email}</p>
              )}
            </div>

            <div className="info-item">
              <label>Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                />
              ) : (
                <p>{profile.phone}</p>
              )}
            </div>

            <div className="info-item">
              <label>Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="form-input"
                />
              ) : (
                <p>{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
              )}
            </div>

            <div className="info-item">
              <label>Address</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-input"
                />
              ) : (
                <p>{profile.address}</p>
              )}
            </div>

            <div className="info-item">
              <label>Enrollment Date</label>
              <p>{new Date(profile.enrollmentDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Emergency Contact</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Contact Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.emergencyContact.name}
                  onChange={handleEmergencyContactChange}
                  className="form-input"
                />
              ) : (
                <p>{profile.emergencyContact.name}</p>
              )}
            </div>

            <div className="info-item">
              <label>Contact Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.emergencyContact.phone}
                  onChange={handleEmergencyContactChange}
                  className="form-input"
                />
              ) : (
                <p>{profile.emergencyContact.phone}</p>
              )}
            </div>

            <div className="info-item">
              <label>Relationship</label>
              {isEditing ? (
                <input
                  type="text"
                  name="relationship"
                  value={formData.emergencyContact.relationship}
                  onChange={handleEmergencyContactChange}
                  className="form-input"
                />
              ) : (
                <p>{profile.emergencyContact.relationship}</p>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Change Password</h2>
          <div className="password-form">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="form-input"
                placeholder="Enter current password"
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="form-input"
                placeholder="Enter new password"
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="form-input"
                placeholder="Confirm new password"
              />
            </div>

            <button onClick={handlePasswordUpdate} className="update-password-btn">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile; 
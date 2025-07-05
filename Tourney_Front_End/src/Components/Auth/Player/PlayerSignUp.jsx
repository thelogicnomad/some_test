import React, { useState } from 'react';
import '../CSS/PlayerSignUp.css';
import { IoChevronBack, IoCloudUploadOutline, IoCalendarOutline } from 'react-icons/io5';

import {useNavigate} from 'react-router-dom';


const PlayerSignUp = () => {

  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    dateOfBirth: '',
    aadhaarCard: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        aadhaarCard: file
      }));
      setUploadedFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Player registration:', formData);
      setIsSubmitting(false);
    }, 1500);
  };



  const isFormValid = () => {
    return formData.fullName.trim() && 
           formData.email.trim() && 
           formData.password.trim() && 
           formData.phoneNumber.trim() && 
           formData.dateOfBirth.trim();
  };

  return (
    <div className="player-registration-container">
      <div className="player-registration-wrapper">
        <button className="player-reg-back-button" onClick={()=>{navigate('/roleSelection')}}>
          <IoChevronBack className="player-reg-back-icon" />
          Back to role selection
        </button>

        <div className="player-registration-card">
          <div className="player-registration-header">
            <h1 className="player-registration-title">Player Registration</h1>
          </div>

          <form onSubmit={handleSubmit} className="player-registration-form">
            <div className="player-reg-form-group">
              <label htmlFor="fullName" className="player-reg-form-label">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="player-reg-form-input"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="player-reg-form-group">
              <label htmlFor="email" className="player-reg-form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="player-reg-form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="player-reg-form-group">
              <label htmlFor="password" className="player-reg-form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="player-reg-form-input"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="player-reg-form-group">
              <label htmlFor="phoneNumber" className="player-reg-form-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="player-reg-form-input"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="player-reg-form-group">
              <label htmlFor="dateOfBirth" className="player-reg-form-label">
                Date of Birth
              </label>
              <label className="player-reg-date-input-wrapper" htmlFor='dateOfBirth'>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="player-reg-form-input player-reg-date-input"
                  placeholder="mm/dd/yyyy"
                  required
                />
                <IoCalendarOutline className="player-reg-date-icon" />
              </label>
            </div>

            <div className="player-reg-form-group">
              <label htmlFor="aadhaarCard" className="player-reg-form-label">
                Aadhaar Card
              </label>
              <div className="player-reg-file-upload-wrapper">
                <input
                  type="file"
                  id="aadhaarCard"
                  name="aadhaarCard"
                  onChange={handleFileUpload}
                  className="player-reg-file-input"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label htmlFor="aadhaarCard" className="player-reg-file-upload-label">
                  <IoCloudUploadOutline className="player-reg-upload-icon" />
                  <span className="player-reg-upload-text">
                    {uploadedFileName || 'Upload Aadhaar Card'}
                  </span>
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              className="player-reg-create-button"
              disabled={isSubmitting || !isFormValid()}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="player-reg-signin-prompt">
              <span className="player-reg-signin-text">Already have an account? </span>
              <button 
                type="button" 
                className="player-reg-signin-link"
                onClick={()=>{navigate('/login/player')}}
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlayerSignUp;

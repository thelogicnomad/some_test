import React, { useState } from 'react';
import '../CSS/OrganizerSignUp.css';
import { IoChevronBack, IoLogoGoogle } from 'react-icons/io5';

import { useNavigate } from 'react-router-dom';

const OrganizerSignUp = () => {

  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    organizationName: '',
    email: '',
    password: '',
    mobileNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOTP] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.organizationName.trim() || !formData.email.trim() || !formData.password.trim() || !formData.mobileNumber.trim()) return;

    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('http://localhost:8000/api/organizer/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(data.message);
        setShowOTPModal(true);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setIsVerifying(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/api/organizer/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          OTP: otp,
          organizerMail: formData.email
        }),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(data.message);
        setTimeout(() => {
          navigate('/organizer/home');
        }, 1500);
      } else {
        setError(data.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Network error occurred. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGoogleSignUp = () => {
    // Handle Google signup
    console.log('Google signup initiated');
  };


  const isFormValid = () => {
    return formData.organizationName.trim() && 
           formData.email.trim() && 
           formData.password.trim() &&
           formData.mobileNumber.trim();
  };

  return (
    <div className="organizer-signup-container">
      <div className="organizer-signup-wrapper">
        <button className="organizer-signup-back-button" onClick={()=>{ navigate('/roleSelection') }}>
          <IoChevronBack className="organizer-signup-back-icon" />
          Back to role selection
        </button>

        <div className="organizer-signup-card">
          <div className="organizer-signup-header">
            <h1 className="organizer-signup-title">Organizer Registration</h1>
          </div>

          {error && (
            <div className="error-message" style={{color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#ffe6e6', borderRadius: '4px'}}>
              {error}
            </div>
          )}
          
          {success && !showOTPModal && (
            <div className="success-message" style={{color: 'green', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e6ffe6', borderRadius: '4px'}}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="organizer-signup-form">
            <div className="organizer-signup-form-group">
              <label htmlFor="organizerOrgName" className="organizer-signup-form-label">
                Organization Name
              </label>
              <input
                type="text"
                id="organizerOrgName"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleInputChange}
                className="organizer-signup-form-input"
                placeholder="Enter your organization name"
                required
              />
            </div>

            <div className="organizer-signup-form-group">
              <label htmlFor="organizerEmail" className="organizer-signup-form-label">
                Email
              </label>
              <input
                type="email"
                id="organizerEmail"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="organizer-signup-form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="organizer-signup-form-group">
              <label htmlFor="organizerMobile" className="organizer-signup-form-label">
                Mobile Number
              </label>
              <input
                type="tel"
                id="organizerMobile"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className="organizer-signup-form-input"
                placeholder="Enter your mobile number"
                required
              />
            </div>

            <div className="organizer-signup-form-group">
              <label htmlFor="organizerPassword" className="organizer-signup-form-label">
                Password
              </label>
              <input
                type="password"
                id="organizerPassword"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="organizer-signup-form-input"
                placeholder="Enter your password (min 8 characters)"
                required
                minLength="8"
              />
            </div>

            <button 
              type="submit" 
              className="organizer-signup-create-button"
              disabled={isSubmitting || !isFormValid()}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="organizer-signup-divider">
              <span className="organizer-signup-divider-line"></span>
              <span className="organizer-signup-divider-text">or</span>
              <span className="organizer-signup-divider-line"></span>
            </div>

            <button 
              type="button" 
              className="organizer-signup-google-button"
              onClick={handleGoogleSignUp}
            >
              <IoLogoGoogle className="organizer-signup-google-icon" />
              Continue with Google
            </button>

            <div className="organizer-signup-signin-prompt">
              <span className="organizer-signup-signin-text">Already have an account? </span>
              <button 
                type="button" 
                className="organizer-signup-signin-link"
                onClick={()=>{ navigate('/login/organizer') }}
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Verify Your Email</h2>
            <p style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#666' }}>
              We've sent a verification code to {formData.email}
            </p>
            
            {error && (
              <div className="error-message" style={{color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#ffe6e6', borderRadius: '4px'}}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleOTPVerification}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label htmlFor="otp" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  required
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowOTPModal(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                  disabled={isVerifying}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                  disabled={isVerifying || !otp.trim()}
                >
                  {isVerifying ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerSignUp;

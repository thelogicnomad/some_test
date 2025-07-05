import React from 'react'

import '../CSS/PlayerLogin.css';

import {useState} from 'react';
import { IoChevronBack, IoLogoGoogle } from 'react-icons/io5';

import {useNavigate} from 'react-router-dom';

const PlayerLogin = () => {

  const navigate = useNavigate();

  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Player login:', formData);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleGoogleLogin = () => {
    // Handle Google login
    console.log('Google login initiated');
  };

  

 

  return (
    <div className="player-login-container">
      <div className="player-login-wrapper">
        <button className="player-back-button" onClick={()=>{navigate('/roleSelection')}}>
          <IoChevronBack className="player-back-icon" />
          Back to role selection
        </button>

        <div className="player-login-card">
          <div className="player-login-header">
            <h1 className="player-login-title">Player Login</h1>
          </div>

          <form onSubmit={handleSubmit} className="player-login-form">
            <div className="player-form-group">
              <label htmlFor="playerEmail" className="player-form-label">
                Email
              </label>
              <input
                type="email"
                id="playerEmail"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="player-form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="player-form-group">
              <label htmlFor="playerPassword" className="player-form-label">
                Password
              </label>
              <input
                type="password"
                id="playerPassword"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="player-form-input"
                placeholder="Enter your password"
                required
              />
            </div>

            <button 
              type="submit" 
              className="player-signin-button"
              disabled={isSubmitting || !formData.email.trim() || !formData.password.trim()}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="player-login-divider">
              <span className="player-divider-line"></span>
              <span className="player-divider-text">or</span>
              <span className="player-divider-line"></span>
            </div>

            <button 
              type="button" 
              className="player-google-login-button"
              onClick={handleGoogleLogin}
            >
              <IoLogoGoogle className="player-google-icon" />
              Continue with Google
            </button>

            <div className="player-signup-prompt">
              <span className="player-signup-text">Don't have an account? </span>
              <button 
                type="button" 
                className="player-signup-link"
                onClick={()=>{ navigate('/signup/player') }}
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PlayerLogin

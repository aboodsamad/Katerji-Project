import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../config/api';
import '../styles/auth.css';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
  setError('');
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  // Validation
  if (formData.password !== formData.confirmPassword) {
    setError('Passwords do not match');
    setIsLoading(false);
    return;
  }

  if (formData.password.length < 3) {
    setError('Password must be at least 3 characters long');
    setIsLoading(false);
    return;
  }

  // Prepare payload
  const payload = {
    username: formData.username.trim(),
    email: formData.email.trim(),
    password: formData.password
  };

  console.log('🚀 Sending signup request:', payload);

  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('📡 Response status:', response.status);
    
    // Parse response
    const data = await response.json();
    console.log('📦 Response data:', data);

    // ✅ Check for success in response body, not just status
    if (data.success === true) {
      console.log('✅ Signup successful!');
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      // ❌ Handle any error
      console.error('❌ Signup failed:', data);
      setError(data.message || 'Signup failed. Please try again.');
    }
  } catch (err) {
    console.error('🔥 Signup error:', err);
    
    if (err.message === 'Failed to fetch') {
      setError('Cannot connect to server. Make sure the backend is running on port 5000.');
    } else {
      setError('Network error. Please check your connection and try again.');
    }
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-visual-section">
            <div className="visual-content">
              <div className="floating-card card-1">
                <span className="card-icon">🗺️</span>
                <span className="card-text">Explore Places</span>
              </div>
              <div className="floating-card card-2">
                <span className="card-icon">⭐</span>
                <span className="card-text">Top Rated</span>
              </div>
              <div className="floating-card card-3">
                <span className="card-icon">🎯</span>
                <span className="card-text">Smart Search</span>
              </div>
              
              <div className="visual-text">
                <h2>Join TravelMate</h2>
                <p>Start your journey to discover the beauty of Lebanon</p>
              </div>
            </div>
          </div>

          <div className="auth-form-section">
            <div className="auth-logo">
              <span className="logo-icon">🇱🇧</span>
              <span className="logo-text">TravelMate</span>
            </div>

            <div className="auth-header">
              <h1>Create Account</h1>
              <p>Sign up to start exploring amazing places</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {error && (
                <div className="error-message">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="success-message">
                  <span>✅</span>
                  <span>Account created! Redirecting to login...</span>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span>I agree to the Terms & Conditions</span>
                </label>
              </div>

              <button 
                type="submit" 
                className="auth-button"
                disabled={isLoading || success}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Creating account...</span>
                  </>
                ) : success ? (
                  <>
                    <span>✓ Success!</span>
                  </>
                ) : (
                  <>
                    <span>Sign Up</span>
                    <span>→</span>
                  </>
                )}
              </button>

              <div className="auth-footer">
                <p>Already have an account? <Link to="/login">Login</Link></p>
              </div>
            </form>
          </div>
        </div>

        <div className="guest-access">
          <p>Want to browse first? <Link to="/dashboard">Continue as guest →</Link></p>
        </div>
      </div>
    </div>
  );
}
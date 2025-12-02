import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error. Please make sure the server is running.');
      console.error(err);
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

          {/* LEFT SECTION */}
          <div className="auth-form-section">
            <div className="auth-logo">
              <span className="logo-icon">🇱🇧</span>
              <span className="logo-text">TravelMate</span>
            </div>

            <div className="auth-header">
              <h1>Welcome Back!</h1>
              <p>Login to explore amazing places in Lebanon</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {error && (
                <div className="error-message">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

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
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
               
              </div>

              <button type="submit" className="auth-button" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <span>→</span>
                  </>
                )}
              </button>

              <div className="auth-footer">
                <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
              </div>
            </form>
          </div>

          {/* RIGHT SECTION */}
          <div className="auth-visual-section">
            <div className="visual-content">
              <div className="floating-card card-1">
                <span className="card-icon">🏔️</span>
                <span className="card-text">Explore Historical Places</span>
              </div>

              <div className="floating-card card-2">
                <span className="card-icon">🏖️</span>
                <span className="card-text">Beautiful Beaches</span>
              </div>

              <div className="floating-card card-3">
                <span className="card-icon">🍽️</span>
                <span className="card-text">Amazing Food</span>
              </div>

              <div className="visual-text">
                <h2>Discover Lebanon</h2>
                <p>Access thousands of amazing places, restaurants, and experiences</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

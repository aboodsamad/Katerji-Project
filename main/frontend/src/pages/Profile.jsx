import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/userApi';
import { getUser, clearAuth } from '../config/auth';
import '../styles/Profile.css';
import AIChatHistory from '../components/AIChatHistory';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());
  const [logs, setLogs] = useState([]);
  const [likedPlaces, setLikedPlaces] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [logsPage, setLogsPage] = useState(1);
  const [hasMoreLogs, setHasMoreLogs] = useState(true);

  // Form state for editing profile
  const [formData, setFormData] = useState({
    name: user?.name || user?.username || '',
    email: user?.email || ''
  });

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
    fetchUserLogs(1);
    fetchLikedPlaces();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const profileData = await userAPI.getProfile();
      setUser(profileData.user);
      setFormData({
        name: profileData.user.name || '',
        email: profileData.user.email || ''
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLogs = async (page) => {
    try {
      const logsData = await userAPI.getUserLogs({ page, limit: 20 });
      if (page === 1) {
        setLogs(logsData.logs);
      } else {
        setLogs(prev => [...prev, ...logsData.logs]);
      }
      setHasMoreLogs(logsData.logs.length === 20);
      setLogsPage(page);
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  const fetchLikedPlaces = async () => {
    try {
      const placesData = await userAPI.getLikedPlaces();
      setLikedPlaces(placesData.places || []);
    } catch (err) {
      console.error('Error fetching liked places:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await userAPI.updateProfile(formData);
      setUser(updatedUser.user);
      setIsEditing(false);
      localStorage.setItem('user', JSON.stringify(updatedUser.user));
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message);
    }
  };

  const loadMoreLogs = () => {
    fetchUserLogs(logsPage + 1);
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'USER_SIGNUP': return '✨';
      case 'USER_LOGIN': return '🔐';
      case 'USER_LOGOUT': return '👋';
      case 'PROFILE_UPDATE': return '📝';
      case 'PLACE_LIKED': return '⭐';
      case 'PLACE_UNLIKED': return '💔';
      case 'AI_CHAT': return '🤖';
      default: return '📌';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'USER_SIGNUP': return '#10b981';
      case 'USER_LOGIN': return '#3b82f6';
      case 'USER_LOGOUT': return '#f59e0b';
      case 'PROFILE_UPDATE': return '#8b5cf6';
      case 'PLACE_LIKED': return '#ec4899';
      case 'PLACE_UNLIKED': return '#6b7280';
      case 'AI_CHAT': return '#06b6d4';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !user) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        {/* Header Section */}
        <div className="profile-header-modern">
          <div className="profile-info-modern">
            <h1>{user?.name || user?.username || 'User'}</h1>
            <p className="profile-email-modern">{user?.email}</p>
            <span className="member-badge">
              Member since {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {error && (
          <div className="error-alert">
            ⚠️ {error}
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="tabs-modern">
          <button
            className={`tab-modern ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-modern ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            Activity
          </button>
          <button
            className={`tab-modern ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            Rated Places
          </button>
          <button
            className={`tab-modern ${activeTab === 'ai-chats' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-chats')}
          >
            🤖 AI Chat History
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content-modern">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="card-modern">
                <div className="card-header-modern">
                  <h2>Profile Information</h2>
                  {!isEditing && (
                    <button className="btn-edit-modern" onClick={() => setIsEditing(true)}>
                      Edit
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="edit-form-modern">
                    <div className="form-field-modern">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        required
                      />
                    </div>

                    <div className="form-field-modern">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div className="form-actions-modern">
                      <button type="submit" className="btn-save-modern">
                        Save Changes
                      </button>
                      <button 
                        type="button" 
                        className="btn-cancel-modern" 
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: user?.name || user?.username || '',
                            email: user?.email || ''
                          });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-details-modern">
                    <div className="detail-row-modern">
                      <span className="detail-label">Name</span>
                      <span className="detail-value">{user?.name || user?.username}</span>
                    </div>
                    <div className="detail-row-modern">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">{user?.email}</span>
                    </div>
                    <div className="detail-row-modern">
                      <span className="detail-label">Joined</span>
                      <span className="detail-value">
                        {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <h3>{logs.length}</h3>
                    <p>Activities</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-info">
                    <h3>{likedPlaces.length}</h3>
                    <p>Favorites</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="activity-section">
              <div className="card-modern">
                <div className="card-header-modern">
                  <h2>Recent Activity</h2>
                  <span className="count-badge">{logs.length} activities</span>
                </div>

                {logs.length === 0 ? (
                  <div className="empty-state-modern">
                    <div className="empty-icon">📊</div>
                    <h3>No activity yet</h3>
                    <p>Your activities will appear here</p>
                  </div>
                ) : (
                  <>
                    <div className="activity-list">
                      {logs.map((log) => (
                        <div key={log.id} className="activity-item">
                          <div 
                            className="activity-icon"
                            style={{ backgroundColor: getActionColor(log.action) }}
                          >
                            {getActionIcon(log.action)}
                          </div>
                          <div className="activity-content">
                            <p className="activity-description">{log.description}</p>
                            <span className="activity-time">{formatDate(log.created_at)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {hasMoreLogs && (
                      <button className="btn-load-more-modern" onClick={loadMoreLogs}>
                        Load More
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="favorites-section">
              {likedPlaces.length === 0 ? (
                <div className="empty-state-modern">
                  <div className="empty-icon">⭐</div>
                  <h3>No favorites yet</h3>
                  <p>Start exploring and save your favorite places</p>
                  <button 
                    className="btn-explore-modern"
                    onClick={() => navigate('/dashboard')}
                  >
                    Explore Places
                  </button>
                </div>
              ) : (
                <div className="places-grid">
                  {likedPlaces.map((place) => (
                    <div key={place.id} className="place-card-modern">
                      <div className="place-info-modern">
                        <h3>{place.name}</h3>
                        <p className="place-location">📍 {place.address}</p>
                        <div className="place-footer">
                          <span className="place-rating">⭐ {place.rating}</span>
                          <span className="place-category">{place.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AI Chat History Tab */}
          {activeTab === 'ai-chats' && (
            <AIChatHistory />
          )}

        </div>
      </div>
    </div>
  );
}
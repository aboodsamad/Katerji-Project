import React, { useState, useEffect } from 'react';
import '../styles/AIChatHistory.css';

export default function AIChatHistory() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedChat, setExpandedChat] = useState(null);

  useEffect(() => {
    fetchChatHistory();
  }, [page]);

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/gemini/history?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }

      const data = await response.json();
      setChats(data.chats || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error('Error fetching chat history:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteChat = async (chatId) => {
    if (!window.confirm('Are you sure you want to delete this chat?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/gemini/history/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete chat');
      }

      // Refresh the list
      fetchChatHistory();
    } catch (err) {
      console.error('Error deleting chat:', err);
      alert('Failed to delete chat: ' + err.message);
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

  const toggleExpand = (chatId) => {
    setExpandedChat(expandedChat === chatId ? null : chatId);
  };

  if (loading && chats.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="loading-spinner"></div>
        <p>Loading chat history...</p>
      </div>
    );
  }

  return (
    <div className="ai-chat-history">
      <div className="card-modern">
        <div className="card-header-modern">
          <h2>🤖 AI Chat History</h2>
          <span className="count-badge">{chats.length} conversations</span>
        </div>

        {error && (
          <div className="error-alert">
            ⚠️ {error}
          </div>
        )}

        {chats.length === 0 ? (
          <div className="empty-state-modern">
            <div className="empty-icon">🤖</div>
            <h3>No chat history yet</h3>
            <p>Start chatting with our AI assistant to see your conversations here</p>
          </div>
        ) : (
          <>
            <div className="chat-history-list">
              {chats.map((chat) => (
                <div key={chat.id} className="chat-history-item">
                  <div className="chat-item-header">
                    <span className="chat-time">{formatDate(chat.created_at)}</span>
                    <button 
                      className="btn-delete-chat"
                      onClick={() => deleteChat(chat.id)}
                      title="Delete this chat"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="chat-prompt">
                    <strong>You:</strong> {chat.prompt}
                  </div>

                  <div className="chat-response">
                    <strong>AI:</strong>{' '}
                    {expandedChat === chat.id ? (
                      <span>{chat.response}</span>
                    ) : (
                      <span>
                        {chat.response.length > 150 
                          ? chat.response.substring(0, 150) + '...' 
                          : chat.response}
                      </span>
                    )}
                    
                    {chat.response.length > 150 && (
                      <button 
                        className="btn-expand"
                        onClick={() => toggleExpand(chat.id)}
                      >
                        {expandedChat === chat.id ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-controls">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-page"
                >
                  ← Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-page"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>


    </div>
  );
}
import React, { useState } from 'react';
import axios from 'axios';

interface Message {
    _id: string;
    username: string;
    email: string;
    project_Type: string;
    message: string;
    createdAt: string;
    read: boolean;
    status: 'new' | 'replied' | 'archived';
    phone?: string;
    budget?: string;
    timeline?: string;
    fileImages?: string[];
}

interface DashboardMessagesProps {
    messages: Message[];
    onMarkAsRead: (id: string) => void;
    onDeleteMessage: (id: string) => void;
    onUpdateMessageStatus: (id: string, status: string) => void;
}

const DashboardMessages: React.FC<DashboardMessagesProps> = ({
    messages,
    onMarkAsRead,
    onDeleteMessage,
    onUpdateMessageStatus
}) => {
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
    const [filter, setFilter] = useState<'all' | 'new' | 'replied' | 'archived'>('all');

    // Direct API URL
    const API_BASE_URL = 'https://lenodev-production.up.railway.app';

    const getAuthToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }
        return token;
    };

    const handleViewMessage = (message: Message) => {
        setSelectedMessage(message);
        setViewMode('detail');
        
        if (!message.read) {
            handleMarkAsRead(message._id);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            const token = getAuthToken();
            await axios.put(
                `${API_BASE_URL}/api/users/${id}`,
                { read: true },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            onMarkAsRead(id);
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    };

    const handleBackToList = () => {
        setSelectedMessage(null);
        setViewMode('list');
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                const token = getAuthToken();
                
                await axios.delete(`${API_BASE_URL}/api/users/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                onDeleteMessage(id);
                handleBackToList();
            } catch (error) {
                console.error('Error deleting message:', error);
                alert('Failed to delete message');
            }
        }
    };

    const handleStatusChange = async (id: string, status: string) => {
        try {
            const token = getAuthToken();
            
            await axios.put(
                `${API_BASE_URL}/api/users/${id}`, 
                { status },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            onUpdateMessageStatus(id, status);
        } catch (error) {
            console.error('Error updating message status:', error);
            alert('Failed to update message status');
        }
    };

    const filteredMessages = messages.filter(message => {
        if (filter === 'all') return true;
        if (filter === 'new') return message.status === 'new';
        if (filter === 'replied') return message.status === 'replied';
        if (filter === 'archived') return message.status === 'archived';
        return true;
    });

    // Detail View
    if (viewMode === 'detail' && selectedMessage) {
        return (
            <div className="message-detail-view">
                <div className="detail-header">
                    <button className="btn-back" onClick={handleBackToList}>
                        <i className="fas fa-arrow-left"></i> Back to Messages
                    </button>
                    <div className="message-actions">
                        <select 
                            value={selectedMessage.status}
                            onChange={(e) => handleStatusChange(selectedMessage._id, e.target.value)}
                            className="status-select"
                        >
                            <option value="new">New</option>
                            <option value="replied">Replied</option>
                            <option value="archived">Archived</option>
                        </select>
                        <button 
                            className="btn-delete"
                            onClick={() => handleDelete(selectedMessage._id)}
                        >
                            <i className="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>

                <div className="message-detail-content">
                    <div className="message-header">
                        <div className="message-sender">
                            <div className="sender-avatar">
                                {selectedMessage.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3>{selectedMessage.username}</h3>
                                <p className="sender-email">{selectedMessage.email}</p>
                            </div>
                        </div>
                        <div className="message-meta">
                            <span className={`status-badge status-${selectedMessage.status}`}>
                                {selectedMessage.status}
                            </span>
                            <span className="message-date">
                                {new Date(selectedMessage.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    <div className="message-info-grid">
                        <div className="info-item">
                            <label>Project Type</label>
                            <p>{selectedMessage.project_Type}</p>
                        </div>
                        <div className="info-item">
                            <label>Phone</label>
                            <p>{selectedMessage.phone || 'Not provided'}</p>
                        </div>
                        <div className="info-item">
                            <label>Budget</label>
                            <p>{selectedMessage.budget || 'Not specified'}</p>
                        </div>
                        <div className="info-item">
                            <label>Timeline</label>
                            <p>{selectedMessage.timeline || 'Not specified'}</p>
                        </div>
                    </div>

                    <div className="message-body">
                        <label>Message</label>
                        <div className="message-text">
                            {selectedMessage.message}
                        </div>
                    </div>

                    {selectedMessage.fileImages && selectedMessage.fileImages.length > 0 && (
                        <div className="message-attachments">
                            <label>Attachments ({selectedMessage.fileImages.length})</label>
                            <div className="attachments-grid">
                                {selectedMessage.fileImages.map((file, index) => (
                                    <div key={index} className="attachment-item">
                                        <i className="fas fa-paperclip"></i>
                                        <span className="attachment-name">
                                            {file.split('/').pop()}
                                        </span>
                                        <a 
                                            href={`${API_BASE_URL}${file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="attachment-download"
                                        >
                                            <i className="fas fa-download"></i>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // List View
    return (
        <div className="dashboard-messages">
            <div className="messages-header">
                <h3>Client Messages ({filteredMessages.length})</h3>
                <div className="messages-controls">
                    <div className="filter-tabs">
                        <button 
                            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All ({messages.length})
                        </button>
                        <button 
                            className={`filter-tab ${filter === 'new' ? 'active' : ''}`}
                            onClick={() => setFilter('new')}
                        >
                            New ({messages.filter(m => m.status === 'new').length})
                        </button>
                        <button 
                            className={`filter-tab ${filter === 'replied' ? 'active' : ''}`}
                            onClick={() => setFilter('replied')}
                        >
                            Replied ({messages.filter(m => m.status === 'replied').length})
                        </button>
                        <button 
                            className={`filter-tab ${filter === 'archived' ? 'active' : ''}`}
                            onClick={() => setFilter('archived')}
                        >
                            Archived ({messages.filter(m => m.status === 'archived').length})
                        </button>
                    </div>
                </div>
            </div>

            <div className="messages-list">
                {filteredMessages.length === 0 ? (
                    <div className="no-messages">
                        <i className="fas fa-comments"></i>
                        <p>No messages found</p>
                    </div>
                ) : (
                    filteredMessages.map(message => (
                        <div 
                            key={message._id} 
                            className={`message-item ${!message.read ? 'unread' : ''}`}
                            onClick={() => handleViewMessage(message)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="message-item-header">
                                <div className="message-sender-info">
                                    <div className="sender-avatar">
                                        {message.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4>{message.username}</h4>
                                        <p className="message-preview">
                                            {message.message.length > 80 
                                                ? `${message.message.substring(0, 80)}...`
                                                : message.message}
                                        </p>
                                    </div>
                                </div>
                                <div className="message-item-meta">
                                    <span className={`message-status status-${message.status}`}>
                                        {message.status}
                                    </span>
                                    <span className="message-time">
                                        {new Date(message.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="message-type">
                                        {message.project_Type}
                                    </span>
                                </div>
                            </div>
                            <div className="message-item-footer">
                                <div className="message-tags">
                                    <span className="message-email">{message.email}</span>
                                    {message.budget && (
                                        <span className="message-budget">{message.budget}</span>
                                    )}
                                </div>
                                <div className="message-item-actions">
                                    {message.fileImages && message.fileImages.length > 0 && (
                                        <span className="attachment-indicator">
                                            <i className="fas fa-paperclip"></i> {message.fileImages.length}
                                        </span>
                                    )}
                                    {!message.read && (
                                        <span className="unread-indicator">
                                            <i className="fas fa-circle"></i>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DashboardMessages;
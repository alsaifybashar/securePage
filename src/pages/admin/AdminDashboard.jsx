/**
 * Admin Dashboard
 * Shows website analytics, visitors, clicks, and contact submissions
 */

import React, { useState, useEffect } from 'react';
import {
    getDashboardStats,
    getContacts,
    updateContactStatus,
    getChartData,
    adminLogout,
    changePassword,
    updateUsername
} from '../../services/api';
import './AdminStyles.css';

const AdminDashboard = ({ user, onLogout }) => {
    const [stats, setStats] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [chartData, setChartData] = useState([]);
    const [settingsMsg, setSettingsMsg] = useState({ type: '', text: '' });

    // Settings Forms State
    const [usernameForm, setUsernameForm] = useState({
        currentPassword: '',
        newUsername: ''
    });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [statsResponse, contactsResponse, chartResponse] = await Promise.all([
                getDashboardStats(),
                getContacts({ limit: 50 }),
                getChartData('visitors', 30)
            ]);

            // Map API response to UI expected structure
            if (statsResponse.success) {
                const s = statsResponse.stats;
                setStats({
                    overview: {
                        totalVisitors: s.totalVisitors || 0,
                        visitorsToday: 0, // Not implemented in API yet
                        totalPageViews: s.pageViews || 0,
                        pageViewsToday: 0, // Not implemented in API yet
                        avgSessionDuration: s.avgSessionDuration || 0,
                        totalContacts: s.totalLeads || 0,
                        newContacts: s.newLeads || 0,
                        contactedLeads: s.contactedLeads || 0,
                        convertedLeads: s.convertedLeads || 0,
                        contactsThisWeek: s.leadsThisWeek || 0,
                        contactsWeek: s.leadsThisWeek || 0,
                        visitorsWeek: 0 // Not implemented in API yet
                    }
                });
            }
            if (contactsResponse.success) {
                // Defensive check to ensure contacts is an array
                const contactsList = Array.isArray(contactsResponse.contacts)
                    ? contactsResponse.contacts
                    : [];
                setContacts(contactsList);
            }
            if (chartResponse.success) {
                setChartData(chartResponse.data || []);
            }
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (contactId, newStatus) => {
        try {
            await updateContactStatus(contactId, newStatus);
            // Refresh contacts
            const response = await getContacts({ limit: 50 });
            if (response.success) {
                setContacts(response.contacts || []);
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleLogout = () => {
        adminLogout();
        onLogout();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '0s';
        if (seconds < 60) return `${seconds}s`;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const handleUpdateUsername = async (e) => {
        e.preventDefault();
        setSettingsMsg({ type: '', text: '' });

        if (!usernameForm.newUsername || !usernameForm.currentPassword) {
            setSettingsMsg({ type: 'error', text: 'All fields are required' });
            return;
        }

        try {
            const response = await updateUsername(usernameForm.currentPassword, usernameForm.newUsername);
            if (response.success) {
                setSettingsMsg({ type: 'success', text: 'Username updated successfully!' });
                setUsernameForm({ currentPassword: '', newUsername: '' });
                // If user object returned, could update local user state if we had one passed down from App
            } else {
                setSettingsMsg({ type: 'error', text: response.error || 'Failed to update username' });
            }
        } catch (error) {
            setSettingsMsg({ type: 'error', text: error.message || 'An error occurred' });
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setSettingsMsg({ type: '', text: '' });

        if (!passwordForm.newPassword || !passwordForm.currentPassword || !passwordForm.confirmPassword) {
            setSettingsMsg({ type: 'error', text: 'All fields are required' });
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setSettingsMsg({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setSettingsMsg({ type: 'error', text: 'Password must be at least 8 characters' });
            return;
        }

        try {
            const response = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
            if (response.success) {
                setSettingsMsg({ type: 'success', text: 'Password changed successfully!' });
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setSettingsMsg({ type: 'error', text: response.error || 'Failed to change password' });
            }
        } catch (error) {
            setSettingsMsg({ type: 'error', text: error.message || 'An error occurred' });
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="admin-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <header className="admin-header">
                <div className="admin-header-left">
                    <h1>SecurePent Dashboard</h1>
                    <span className="admin-user">Welcome, {user?.username}</span>
                </div>
                <div className="admin-header-right">
                    <button onClick={loadDashboardData} className="admin-btn-refresh">
                        ↻ Refresh
                    </button>
                    <button onClick={handleLogout} className="admin-btn-logout">
                        Logout
                    </button>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="admin-tabs">
                <button
                    className={activeTab === 'overview' ? 'active' : ''}
                    onClick={() => setActiveTab('overview')}
                >
                    📊 Overview
                </button>
                <button
                    className={activeTab === 'contacts' ? 'active' : ''}
                    onClick={() => setActiveTab('contacts')}
                >
                    📧 Contacts {stats?.overview?.newContacts > 0 && (
                        <span className="badge">{stats.overview.newContacts}</span>
                    )}
                </button>
                <button
                    className={activeTab === 'analytics' ? 'active' : ''}
                    onClick={() => setActiveTab('analytics')}
                >
                    📈 Analytics
                </button>
                <button
                    className={activeTab === 'settings' ? 'active' : ''}
                    onClick={() => setActiveTab('settings')}
                >
                    ⚙️ Settings
                </button>
            </nav>

            {/* Overview Tab */}
            {activeTab === 'overview' && stats && (
                <div className="admin-content">
                    {/* Stats Cards */}
                    <div className="admin-stats-grid">
                        <div className="admin-stat-card">
                            <div className="stat-icon">👥</div>
                            <div className="stat-content">
                                <h3>Total Visitors</h3>
                                <p className="stat-value">{stats.overview.totalVisitors}</p>
                                <span className="stat-sub">Today: {stats.overview.visitorsToday}</span>
                            </div>
                        </div>

                        <div className="admin-stat-card">
                            <div className="stat-icon">👁️</div>
                            <div className="stat-content">
                                <h3>Page Views</h3>
                                <p className="stat-value">{stats.overview.totalPageViews}</p>
                                <span className="stat-sub">Today: {stats.overview.pageViewsToday}</span>
                            </div>
                        </div>

                        <div className="admin-stat-card">
                            <div className="stat-icon">⏱️</div>
                            <div className="stat-content">
                                <h3>Avg. Session</h3>
                                <p className="stat-value">{formatDuration(stats.overview.avgSessionDuration)}</p>
                                <span className="stat-sub">Time on site</span>
                            </div>
                        </div>

                        <div className="admin-stat-card highlight">
                            <div className="stat-icon">✉️</div>
                            <div className="stat-content">
                                <h3>Contacts</h3>
                                <p className="stat-value">{stats.overview.totalContacts}</p>
                                <span className="stat-sub">New: {stats.overview.newContacts}</span>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="admin-charts-row">
                        {/* Visitors Chart */}
                        <div className="admin-chart-card">
                            <h3>Visitors (Last 30 Days)</h3>
                            <div className="chart-container">
                                <div className="simple-chart">
                                    {chartData.map((item, index) => (
                                        <div
                                            key={index}
                                            className="chart-bar"
                                            style={{
                                                height: `${Math.max(10, (item.value / Math.max(...chartData.map(d => d.value))) * 100)}%`
                                            }}
                                            title={`${item.date}: ${item.value} visitors`}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Device Breakdown */}
                        <div className="admin-chart-card">
                            <h3>Devices</h3>
                            <div className="breakdown-list">
                                {stats.devices.map((device, index) => (
                                    <div key={index} className="breakdown-item">
                                        <span className="breakdown-label">
                                            {device.device_type === 'desktop' && '💻'}
                                            {device.device_type === 'mobile' && '📱'}
                                            {device.device_type === 'tablet' && '📲'}
                                            {device.device_type || 'Unknown'}
                                        </span>
                                        <span className="breakdown-value">{device.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Browser Breakdown */}
                        <div className="admin-chart-card">
                            <h3>Browsers</h3>
                            <div className="breakdown-list">
                                {stats.browsers.map((browser, index) => (
                                    <div key={index} className="breakdown-item">
                                        <span className="breakdown-label">{browser.browser}</span>
                                        <span className="breakdown-value">{browser.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Top Pages */}
                    <div className="admin-section">
                        <h3>Top Pages</h3>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Page</th>
                                    <th>Views</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.topPages.slice(0, 5).map((page, index) => (
                                    <tr key={index}>
                                        <td>{page.page_url || '/'}</td>
                                        <td>{page.views}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Contacts Tab */}
            {activeTab === 'contacts' && (
                <div className="admin-content">
                    <div className="admin-contacts-layout">
                        {/* Contacts List */}
                        <div className="admin-contacts-list">
                            <h3>Contact Submissions</h3>
                            {contacts.length === 0 ? (
                                <p className="no-data">No contacts yet</p>
                            ) : (
                                <div className="contacts-scroll">
                                    {contacts.map(contact => (
                                        <div
                                            key={contact.id}
                                            className={`contact-item ${contact.status} ${selectedContact?.id === contact.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedContact(contact)}
                                        >
                                            <div className="contact-header">
                                                <span className="contact-name">
                                                    {contact.first_name} {contact.last_name}
                                                </span>
                                                <span className={`contact-status ${contact.status}`}>
                                                    {contact.status}
                                                </span>
                                            </div>
                                            <div className="contact-meta">
                                                <span>{contact.email}</span>
                                                <span>{formatDate(contact.created_at)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Contact Detail */}
                        <div className="admin-contact-detail">
                            {selectedContact ? (
                                <>
                                    <div className="contact-detail-header">
                                        <h3>{selectedContact.first_name} {selectedContact.last_name}</h3>
                                        <select
                                            value={selectedContact.status}
                                            onChange={(e) => handleStatusChange(selectedContact.id, e.target.value)}
                                            className="status-select"
                                        >
                                            <option value="new">New</option>
                                            <option value="read">Read</option>
                                            <option value="replied">Replied</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                    </div>

                                    <div className="contact-detail-body">
                                        <div className="detail-row">
                                            <label>Email:</label>
                                            <a href={`mailto:${selectedContact.email}`}>{selectedContact.email}</a>
                                        </div>
                                        <div className="detail-row">
                                            <label>Company:</label>
                                            <span>{selectedContact.company || 'N/A'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <label>Job Title:</label>
                                            <span>{selectedContact.job_title || 'N/A'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <label>Submitted:</label>
                                            <span>{formatDate(selectedContact.created_at)}</span>
                                        </div>
                                        <div className="detail-row">
                                            <label>IP Address:</label>
                                            <span className="code">{selectedContact.ip_address || 'N/A'}</span>
                                        </div>
                                        <div className="detail-message">
                                            <label>Message:</label>
                                            <p>{selectedContact.message}</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="no-selection">
                                    <p>Select a contact to view details</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && stats && (
                <div className="admin-content">
                    <div className="admin-section">
                        <h3>This Week's Activity</h3>
                        <div className="admin-stats-grid small">
                            <div className="admin-stat-card small">
                                <h4>Visitors (7 days)</h4>
                                <p className="stat-value">{stats.overview.visitorsWeek}</p>
                            </div>
                            <div className="admin-stat-card small">
                                <h4>Contacts (7 days)</h4>
                                <p className="stat-value">{stats.overview.contactsWeek}</p>
                            </div>
                        </div>
                    </div>

                    <div className="admin-section">
                        <h3>Click Heatmap Data</h3>
                        <p className="section-desc">
                            The system is tracking clicks on buttons and links. View detailed click data in the database.
                        </p>
                    </div>
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="admin-content">
                    <div className="admin-section settings-section">
                        <h3>Profile Settings</h3>

                        {settingsMsg.text && (
                            <div className={`settings-alert ${settingsMsg.type}`}>
                                {settingsMsg.text}
                            </div>
                        )}

                        <div className="settings-grid">
                            {/* Change Username */}
                            <div className="settings-card">
                                <h4>Change Username</h4>
                                <form onSubmit={handleUpdateUsername}>
                                    <div className="form-group">
                                        <label>New Username</label>
                                        <input
                                            type="text"
                                            value={usernameForm.newUsername}
                                            onChange={(e) => setUsernameForm({ ...usernameForm, newUsername: e.target.value })}
                                            placeholder="Enter new username"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Current Password</label>
                                        <input
                                            type="password"
                                            value={usernameForm.currentPassword}
                                            onChange={(e) => setUsernameForm({ ...usernameForm, currentPassword: e.target.value })}
                                            placeholder="Verify with password"
                                        />
                                    </div>
                                    <button type="submit" className="admin-btn-primary">Update Username</button>
                                </form>
                            </div>

                            {/* Change Password */}
                            <div className="settings-card">
                                <h4>Change Password</h4>
                                <form onSubmit={handleChangePassword}>
                                    <div className="form-group">
                                        <label>Current Password</label>
                                        <input
                                            type="password"
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                            placeholder="Current password"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>New Password</label>
                                        <input
                                            type="password"
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                            placeholder="Min 8 characters"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                    <button type="submit" className="admin-btn-primary">Change Password</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

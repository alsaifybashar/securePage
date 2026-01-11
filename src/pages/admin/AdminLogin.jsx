/**
 * Admin Login Page
 * Hidden login page for admin dashboard access
 */

import React, { useState } from 'react';
import { adminLogin } from '../../services/api';
import './AdminStyles.css';

const AdminLogin = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await adminLogin(username, password);
            if (response.success) {
                onLoginSuccess(response.user);
            } else {
                setError(response.error || 'Login failed');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <div className="admin-login-header">
                    <h1>🔒</h1>
                    <h2>Admin Access</h2>
                    <p>Authorized personnel only</p>
                </div>

                <form onSubmit={handleSubmit} className="admin-login-form">
                    {error && (
                        <div className="admin-error">
                            {error}
                        </div>
                    )}

                    <div className="admin-input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                            disabled={loading}
                        />
                    </div>

                    <div className="admin-input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="admin-submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Login'}
                    </button>
                </form>

                <div className="admin-login-footer">
                    <p>SecurePent Admin Portal</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;

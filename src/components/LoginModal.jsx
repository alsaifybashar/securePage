import React, { useState, useEffect } from 'react';
import { validateInput, sanitizeInput } from '../utils/security';

const LoginModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [attempts, setAttempts] = useState(0);
    const [lockedUntil, setLockedUntil] = useState(null);

    // Clear state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setEmail('');
            setPassword('');
            setError(null);
        }
    }, [isOpen]);

    // Handle lock check
    const isLocked = lockedUntil && new Date() < lockedUntil;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        // 1. Check Rate Limiting (Brute Force Protection)
        if (isLocked) {
            const secondsLeft = Math.ceil((lockedUntil - new Date()) / 1000);
            setError(`Too many failed attempts. Temporary Lockout: ${secondsLeft}s`);
            return;
        }

        // 2. Validate Inputs (Injection Protection)
        if (!validateInput(email, 'email') && !validateInput(email, 'text')) {
            setError("Invalid Identifier format.");
            return;
        }

        // 3. Simulate Network Request
        setIsLoading(true);

        // Simulating heavy hashing work factor
        setTimeout(() => {
            const sanitizedEmail = sanitizeInput(email);

            // Demo Logic
            if (sanitizedEmail === 'demo@securepent.com' && password === 'secure123') {
                alert("Access Granted. Redirecting to Client Dashboard...");
                // In a real app, you would set a secure HttpOnly cookie here
                onClose();
                setAttempts(0);
            } else {
                setAttempts(prev => prev + 1);

                // Brute Force Lockout Logic
                if (attempts + 1 >= 3) {
                    setLockedUntil(new Date(Date.now() + 30000)); // 30s lock
                    setError("Security Alert: Multiple failed auth attempts. Account locked for 30s.");
                } else {
                    setError("Credentials Invalid. Attempt logged.");
                }
            }
            setIsLoading(false);
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Secure <span className="text-gradient">Portal</span></h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="security-status">
                    <div className={`status-indicator ${isLocked ? 'locked' : 'secure'}`}>
                        {isLocked ? 'SYSTEM LOCKDOWN' : 'ENCRYPTED CONNECTION ESTABLISHED'}
                    </div>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Client ID</label>
                        <input
                            type="text"
                            placeholder="user@organization.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLocked || isLoading}
                            autoComplete="off"
                        />
                    </div>
                    <div className="input-group">
                        <label>Passphrase</label>
                        <input
                            type="password"
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLocked || isLoading}
                        />
                    </div>

                    {error && <div className="error-banner">{error}</div>}

                    <div className="actions">
                        <a href="#" className="forgot-pass" onClick={(e) => {
                            e.preventDefault();
                            alert("Security Policy: Contact Admin to reset credentials.");
                        }}>Lost Credentials?</a>

                        <button type="submit" className="login-btn" disabled={isLocked || isLoading}>
                            {isLoading ? 'Verifying Identity...' : 'Authenticate'}
                        </button>
                    </div>
                </form>

                <div className="mfa-hint">
                    <small>MFA Device Check: <span>Ready</span></small>
                </div>
            </div>

            <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: rgba(0,0,0,0.8);
                    backdrop-filter: blur(5px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    animation: fadeIn 0.3s ease;
                }
                .modal-content {
                    width: 100%;
                    max-width: 400px;
                    padding: 2.5rem;
                    border-radius: var(--radius-lg);
                    background: rgba(15, 23, 42, 0.95);
                    border: 1px solid var(--glass-stroke);
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    position: relative;
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .modal-header h3 {
                    font-size: 1.5rem;
                    margin: 0;
                }
                .close-btn {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    font-size: 2rem;
                    cursor: pointer;
                    line-height: 1;
                }
                .close-btn:hover { color: #fff; }

                .security-status {
                    margin-bottom: 1.5rem;
                    text-align: center;
                }
                .status-indicator {
                    display: inline-block;
                    font-size: 0.7rem;
                    font-weight: 700;
                    letter-spacing: 1px;
                    padding: 0.25rem 0.75rem;
                    border-radius: 99px;
                }
                .status-indicator.secure {
                    color: #10b981;
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.2);
                }
                .status-indicator.locked {
                    color: #ef4444;
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    animation: pulse 2s infinite;
                }

                .input-group {
                    margin-bottom: 1.25rem;
                }
                .input-group label {
                    display: block;
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    margin-bottom: 0.5rem;
                    text-transform: uppercase;
                }
                .input-group input {
                    width: 100%;
                    padding: 0.8rem 1rem;
                    background: rgba(0,0,0,0.3);
                    border: 1px solid var(--card-border);
                    border-radius: var(--radius-sm);
                    color: #fff;
                    font-family: monospace;
                    transition: border 0.3s;
                }
                .input-group input:focus {
                    outline: none;
                    border-color: var(--accent-primary);
                }
                .input-group input:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .error-banner {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    font-size: 0.85rem;
                    margin-bottom: 1.25rem;
                    text-align: center;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                }

                .actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 1.5rem;
                }
                .forgot-pass {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    text-decoration: none;
                }
                .forgot-pass:hover { color: var(--accent-primary); }

                .login-btn {
                    background: var(--gradient-main);
                    color: #fff;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: var(--radius-sm);
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(6, 182, 212, 0.2);
                    transition: transform 0.2s;
                }
                .login-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(6, 182, 212, 0.4);
                }
                .login-btn:disabled {
                    background: var(--text-muted);
                    cursor: not-allowed;
                    box-shadow: none;
                }

                .mfa-hint {
                    margin-top: 2rem;
                    text-align: center;
                    opacity: 0.5;
                    font-size: 0.75rem;
                    border-top: 1px solid var(--card-border);
                    padding-top: 1rem;
                }
                .mfa-hint span { color: #10b981; }

                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.6; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default LoginModal;

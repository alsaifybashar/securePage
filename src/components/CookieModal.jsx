import React, { useState, useEffect } from 'react';
import './CookieModal.css';
import { saveCookiePreferences } from '../services/api';

const CookieModal = ({ isOpen, onClose }) => {
    const [preferences, setPreferences] = useState({
        necessary: true,
        analytics: false,
        marketing: false,
        preferences: false
    });

    useEffect(() => {
        // Load saved preferences
        const saved = localStorage.getItem('cookiePreferences');
        if (saved) {
            setPreferences(JSON.parse(saved));
        }
    }, []);

    const handleToggle = (key) => {
        if (key === 'necessary') return; // Cannot disable necessary cookies
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const savePreferencesToBackend = async (prefs) => {
        // Save to localStorage first (immediate)
        localStorage.setItem('cookiePreferences', JSON.stringify(prefs));
        localStorage.setItem('cookieConsent', 'true');

        // Sync to backend (async, non-blocking)
        try {
            await saveCookiePreferences({
                analytics: prefs.analytics,
                marketing: prefs.marketing,
                preferences: prefs.preferences
            });
        } catch (error) {
            // Silent fail - localStorage is the primary store
            console.warn('Failed to sync cookie preferences to server:', error);
        }
    };

    const handleSave = () => {
        savePreferencesToBackend(preferences);
        onClose();
    };

    const handleAcceptAll = () => {
        const allAccepted = {
            necessary: true,
            analytics: true,
            marketing: true,
            preferences: true
        };
        setPreferences(allAccepted);
        savePreferencesToBackend(allAccepted);
        onClose();
    };

    const handleRejectAll = () => {
        const onlyNecessary = {
            necessary: true,
            analytics: false,
            marketing: false,
            preferences: false
        };
        setPreferences(onlyNecessary);
        savePreferencesToBackend(onlyNecessary);
        onClose();
    };

    if (!isOpen) return null;

    const cookieTypes = [
        {
            key: 'necessary',
            title: 'Necessary Cookies',
            description: 'Essential for the website to function properly. Cannot be disabled.',
            required: true
        },
        {
            key: 'analytics',
            title: 'Analytics Cookies',
            description: 'Help us understand how visitors interact with our website.'
        },
        {
            key: 'marketing',
            title: 'Marketing Cookies',
            description: 'Used to track visitors across websites for advertising purposes.'
        },
        {
            key: 'preferences',
            title: 'Preference Cookies',
            description: 'Remember your settings and preferences for a better experience.'
        }
    ];

    return (
        <div className="cookie-modal-overlay" onClick={onClose}>
            <div className="cookie-modal glass-panel" onClick={e => e.stopPropagation()}>
                <div className="cookie-modal-header">
                    <h2>Cookie Settings</h2>
                    <button className="close-btn" onClick={onClose} aria-label="Close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6L18 18" />
                        </svg>
                    </button>
                </div>

                <div className="cookie-modal-content">
                    <p className="cookie-intro">
                        We use cookies to enhance your browsing experience and analyze our traffic.
                        Please choose which cookies you'd like to accept.
                    </p>

                    <div className="cookie-options">
                        {cookieTypes.map(cookie => (
                            <div key={cookie.key} className="cookie-option">
                                <div className="cookie-info">
                                    <h3>{cookie.title}</h3>
                                    <p>{cookie.description}</p>
                                </div>
                                <label className={`toggle ${cookie.required ? 'disabled' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={preferences[cookie.key]}
                                        onChange={() => handleToggle(cookie.key)}
                                        disabled={cookie.required}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="cookie-modal-footer">
                    <button className="btn-reject" onClick={handleRejectAll}>
                        Reject All
                    </button>
                    <button className="btn-save" onClick={handleSave}>
                        Save Preferences
                    </button>
                    <button className="btn-accept" onClick={handleAcceptAll}>
                        Accept All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieModal;

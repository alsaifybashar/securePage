import React, { useState, useEffect } from 'react';
import './CookieModal.css';

const CookieModal = ({ isOpen, onClose }) => {
    const [preferences, setPreferences] = useState({
        necessary: true,
        statistics: false,
        marketing: false,
        preferences: false
    });

    useEffect(() => {
        // Load saved preferences
        const saved = localStorage.getItem('cookiePreferences');
        if (saved) {
            try {
                setPreferences(JSON.parse(saved));
            } catch (e) {
                // Invalid JSON, use defaults
            }
        }
    }, [isOpen]);

    const handleToggle = (key) => {
        if (key === 'necessary') return; // Cannot disable necessary cookies
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const savePreferences = (prefs) => {
        // Save to localStorage
        localStorage.setItem('cookiePreferences', JSON.stringify(prefs));

        // Also update cookieConsent with timestamp
        const consentData = {
            timestamp: new Date().toISOString(),
            preferences: prefs
        };
        localStorage.setItem('cookieConsent', JSON.stringify(consentData));

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
            detail: prefs
        }));
    };

    const handleSave = () => {
        savePreferences(preferences);
        onClose();
    };

    const handleAcceptAll = () => {
        const allAccepted = {
            necessary: true,
            statistics: true,
            marketing: true,
            preferences: true
        };
        setPreferences(allAccepted);
        savePreferences(allAccepted);
        onClose();
    };

    const handleRejectAll = () => {
        const onlyNecessary = {
            necessary: true,
            statistics: false,
            marketing: false,
            preferences: false
        };
        setPreferences(onlyNecessary);
        savePreferences(onlyNecessary);
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
            key: 'statistics',
            title: 'Statistics Cookies',
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

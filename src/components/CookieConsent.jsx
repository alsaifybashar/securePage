import React, { useState, useEffect } from 'react';
import './CookieConsent.css';

const CookieConsent = ({ onConsentGiven }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('consent');
    const [preferences, setPreferences] = useState({
        necessary: true, // Always enabled, cannot be disabled
        preferences: true, // Enabled by default
        statistics: true, // Enabled by default
        marketing: false // Disabled by default
    });

    useEffect(() => {
        // Check if user has already given consent
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setIsVisible(true);
        } else {
            // Load saved preferences
            const savedPrefs = localStorage.getItem('cookiePreferences');
            if (savedPrefs) {
                setPreferences(JSON.parse(savedPrefs));
            }
        }
    }, []);

    const handleToggle = (key) => {
        if (key === 'necessary') return; // Cannot disable necessary cookies
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const saveConsent = (prefs) => {
        const consentData = {
            timestamp: new Date().toISOString(),
            preferences: prefs,
            userAgent: navigator.userAgent
        };

        localStorage.setItem('cookieConsent', JSON.stringify(consentData));
        localStorage.setItem('cookiePreferences', JSON.stringify(prefs));

        // Dispatch custom event for other components to listen to
        window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
            detail: prefs
        }));

        if (onConsentGiven) {
            onConsentGiven(prefs);
        }

        setIsVisible(false);
    };

    const handleDeny = () => {
        const minimalPrefs = {
            necessary: true,
            preferences: false,
            statistics: false,
            marketing: false
        };
        setPreferences(minimalPrefs);
        saveConsent(minimalPrefs);
    };

    const handleAllowSelection = () => {
        saveConsent(preferences);
    };

    const handleAllowAll = () => {
        const allPrefs = {
            necessary: true,
            preferences: true,
            statistics: true,
            marketing: true
        };
        setPreferences(allPrefs);
        saveConsent(allPrefs);
    };

    if (!isVisible) return null;

    const cookieCategories = [
        {
            key: 'necessary',
            label: 'Necessary',
            description: 'Necessary cookies help make a website usable by enabling basic functions like page navigation and access to secure areas of the website. The website cannot function properly without these cookies.',
            required: true
        },
        {
            key: 'preferences',
            label: 'Preferences',
            description: 'Preference cookies enable a website to remember information that changes the way the website behaves or looks, like your preferred language or the region that you are in.'
        },
        {
            key: 'statistics',
            label: 'Statistics',
            description: 'Statistic cookies help website owners to understand how visitors interact with websites by collecting and reporting information anonymously.'
        },
        {
            key: 'marketing',
            label: 'Marketing',
            description: 'Marketing cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third party advertisers.'
        }
    ];

    return (
        <div className="cookie-consent-overlay">
            <div className="cookie-consent-modal">
                {/* Tabs */}
                <div className="cookie-tabs">
                    <button
                        className={`cookie-tab ${activeTab === 'consent' ? 'active' : ''}`}
                        onClick={() => setActiveTab('consent')}
                    >
                        Consent
                    </button>
                    <button
                        className={`cookie-tab ${activeTab === 'details' ? 'active' : ''}`}
                        onClick={() => setActiveTab('details')}
                    >
                        Details
                    </button>
                    <button
                        className={`cookie-tab ${activeTab === 'about' ? 'active' : ''}`}
                        onClick={() => setActiveTab('about')}
                    >
                        About
                    </button>
                </div>

                {/* Tab Content */}
                <div className="cookie-content">
                    {activeTab === 'consent' && (
                        <div className="consent-tab">
                            <h3>This website uses cookies</h3>
                            <p>
                                We use cookies to personalise content and ads, to provide social media features and to analyse our traffic.
                                We also share information about your use of our site with our social media, advertising and analytics partners
                                who may combine it with other information that you've provided to them or that they've collected from your use of their services.
                            </p>

                            <div className="cookie-toggles">
                                {cookieCategories.map(cat => (
                                    <div key={cat.key} className="cookie-toggle-item">
                                        <span className="toggle-label">{cat.label}</span>
                                        <label className={`toggle-switch ${cat.required ? 'disabled' : ''}`}>
                                            <input
                                                type="checkbox"
                                                checked={preferences[cat.key]}
                                                onChange={() => handleToggle(cat.key)}
                                                disabled={cat.required}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'details' && (
                        <div className="details-tab">
                            <h3>Cookie Details</h3>
                            <p className="details-intro">
                                Below you can read about the different cookie categories we use and what they're for.
                            </p>

                            <div className="cookie-details-list">
                                {cookieCategories.map(cat => (
                                    <div key={cat.key} className="cookie-detail-item">
                                        <div className="detail-header">
                                            <span className="detail-label">{cat.label}</span>
                                            <span className={`detail-status ${preferences[cat.key] ? 'enabled' : 'disabled'}`}>
                                                {preferences[cat.key] ? 'Enabled' : 'Disabled'}
                                            </span>
                                        </div>
                                        <p className="detail-description">{cat.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'about' && (
                        <div className="about-tab">
                            <h3>About Cookies</h3>
                            <p>
                                Cookies are small text files that can be used by websites to make a user's experience more efficient.
                            </p>
                            <p>
                                The law states that we can store cookies on your device if they are strictly necessary for the operation
                                of this site. For all other types of cookies we need your permission.
                            </p>
                            <p>
                                This site uses different types of cookies. Some cookies are placed by third party services that appear on our pages.
                            </p>
                            <p>
                                You can at any time change or withdraw your consent from the Cookie Declaration on our website.
                            </p>
                            <p>
                                Learn more about who we are, how you can contact us and how we process personal data in our Privacy Policy.
                            </p>
                            <div className="about-info">
                                <p><strong>Your consent applies to the following domains:</strong></p>
                                <p className="domain-list">securepent.com</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="cookie-actions">
                    <button className="cookie-btn deny" onClick={handleDeny}>
                        Deny
                    </button>
                    <button className="cookie-btn allow-selection" onClick={handleAllowSelection}>
                        Allow selection
                    </button>
                    <button className="cookie-btn allow-all" onClick={handleAllowAll}>
                        Allow all
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;

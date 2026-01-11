/**
 * Cookie Consent Utilities
 * Helper functions to check and manage cookie consent throughout the application
 */

// Cookie category types
export const COOKIE_CATEGORIES = {
    NECESSARY: 'necessary',
    PREFERENCES: 'preferences',
    STATISTICS: 'statistics',
    MARKETING: 'marketing'
};

/**
 * Check if user has given consent
 * @returns {boolean}
 */
export const hasConsentBeenGiven = () => {
    return localStorage.getItem('cookieConsent') !== null;
};

/**
 * Get the current cookie preferences
 * @returns {Object|null}
 */
export const getCookiePreferences = () => {
    const prefs = localStorage.getItem('cookiePreferences');
    if (prefs) {
        return JSON.parse(prefs);
    }
    return null;
};

/**
 * Check if a specific cookie category is allowed
 * @param {string} category - One of COOKIE_CATEGORIES
 * @returns {boolean}
 */
export const isCategoryAllowed = (category) => {
    const prefs = getCookiePreferences();
    if (!prefs) return false;
    return prefs[category] === true;
};

/**
 * Get the full consent data including timestamp
 * @returns {Object|null}
 */
export const getConsentData = () => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
        return JSON.parse(consent);
    }
    return null;
};

/**
 * Revoke all consent and clear preferences
 */
export const revokeConsent = () => {
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('cookiePreferences');
    window.dispatchEvent(new CustomEvent('cookieConsentRevoked'));
};

/**
 * Update a specific category preference
 * @param {string} category - Category to update
 * @param {boolean} enabled - New value
 */
export const updateCategoryPreference = (category, enabled) => {
    const prefs = getCookiePreferences() || {
        necessary: true,
        preferences: false,
        statistics: false,
        marketing: false
    };

    if (category !== 'necessary') {
        prefs[category] = enabled;
    }

    localStorage.setItem('cookiePreferences', JSON.stringify(prefs));

    const consentData = getConsentData() || {};
    consentData.preferences = prefs;
    consentData.lastUpdated = new Date().toISOString();
    localStorage.setItem('cookieConsent', JSON.stringify(consentData));

    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
        detail: prefs
    }));
};

/**
 * React hook to listen for consent changes
 * Usage: useCookieConsent((prefs) => console.log(prefs))
 */
export const useCookieConsentListener = (callback) => {
    if (typeof window !== 'undefined') {
        window.addEventListener('cookieConsentUpdated', (e) => callback(e.detail));
        return () => window.removeEventListener('cookieConsentUpdated', callback);
    }
};

/**
 * Microsoft Clarity Analytics Service
 * Provides user behavior analytics (heatmaps, session recordings, insights)
 * Only initializes when user has consented to statistics cookies
 */

import Clarity from '@microsoft/clarity';

// Your Clarity Project ID - Get this from https://clarity.microsoft.com
// TODO: Replace with your actual Clarity Project ID
const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID || 'YOUR_CLARITY_PROJECT_ID';

let isInitialized = false;

/**
 * Initialize Microsoft Clarity
 * Should only be called when statistics cookies are accepted
 */
export const initClarity = () => {
    if (isInitialized) {
        console.log('📊 Clarity already initialized');
        return;
    }

    if (!CLARITY_PROJECT_ID || CLARITY_PROJECT_ID === 'YOUR_CLARITY_PROJECT_ID') {
        console.warn('⚠️ Clarity Project ID not configured. Set VITE_CLARITY_PROJECT_ID in your .env file.');
        return;
    }

    try {
        Clarity.init(CLARITY_PROJECT_ID);
        isInitialized = true;
        console.log('📊 Microsoft Clarity initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize Clarity:', error);
    }
};

/**
 * Check if Clarity has been initialized
 */
export const isClarityInitialized = () => isInitialized;

/**
 * Set custom user ID for session tracking
 * Useful for identifying logged-in users
 * @param {string} userId - Unique user identifier
 * @param {string} sessionId - Optional session identifier
 * @param {string} pageId - Optional page identifier
 */
export const setClarityUser = (userId, sessionId, pageId) => {
    if (!isInitialized) {
        console.warn('⚠️ Clarity not initialized. Cannot set user.');
        return;
    }

    try {
        Clarity.identify(userId, sessionId, pageId);
        console.log('📊 Clarity user identified:', userId);
    } catch (error) {
        console.error('❌ Failed to set Clarity user:', error);
    }
};

/**
 * Set custom tags for better filtering in Clarity dashboard
 * @param {string} key - Tag key
 * @param {string|string[]} value - Tag value(s)
 */
export const setClarityTag = (key, value) => {
    if (!isInitialized) {
        console.warn('⚠️ Clarity not initialized. Cannot set tag.');
        return;
    }

    try {
        Clarity.setTag(key, value);
        console.log(`📊 Clarity tag set: ${key}=${value}`);
    } catch (error) {
        console.error('❌ Failed to set Clarity tag:', error);
    }
};

/**
 * Upgrade the current session priority
 * Use this for important user sessions you want to prioritize in recordings
 * @param {string} reason - Reason for upgrading (e.g., 'contact_form_submitted')
 */
export const upgradeClaritySession = (reason) => {
    if (!isInitialized) {
        console.warn('⚠️ Clarity not initialized. Cannot upgrade session.');
        return;
    }

    try {
        Clarity.upgrade(reason);
        console.log('📊 Clarity session upgraded:', reason);
    } catch (error) {
        console.error('❌ Failed to upgrade Clarity session:', error);
    }
};

/**
 * Track consent status
 * Call this when user grants or revokes consent
 * @param {boolean} hasConsent - Whether user has given consent
 */
export const setClarityConsent = (hasConsent) => {
    if (!isInitialized) {
        console.warn('⚠️ Clarity not initialized. Cannot set consent.');
        return;
    }

    try {
        Clarity.consent(hasConsent);
        console.log('📊 Clarity consent set:', hasConsent);
    } catch (error) {
        console.error('❌ Failed to set Clarity consent:', error);
    }
};

/**
 * Get the current Clarity session ID
 * Useful for debugging or linking with other analytics
 */
export const getClaritySessionId = (callback) => {
    if (!isInitialized) {
        console.warn('⚠️ Clarity not initialized. Cannot get session ID.');
        return null;
    }

    try {
        Clarity.currentSessionId(callback);
    } catch (error) {
        console.error('❌ Failed to get Clarity session ID:', error);
    }
};

export default {
    init: initClarity,
    isInitialized: isClarityInitialized,
    identify: setClarityUser,
    setTag: setClarityTag,
    upgrade: upgradeClaritySession,
    consent: setClarityConsent,
    getSessionId: getClaritySessionId
};

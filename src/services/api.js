/**
 * API Client Service
 * Handles all communication with the backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Make an API request
 * @param {string} endpoint - API endpoint (e.g., '/leads')
 * @param {object} options - Fetch options
 * @returns {Promise<object>}
 */
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers,
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new ApiError(
                data.error || data.message || 'Request failed',
                response.status,
                data
            );
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Network error', 0, { originalError: error.message });
    }
};

/**
 * Custom API Error class
 */
class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

// ===========================================
// LEADS API
// ===========================================

/**
 * Submit contact form / lead
 * @param {object} formData - { firstName, lastName, email, company, jobTitle, message, privacyAgreed }
 */
export const submitLead = async (formData) => {
    return apiRequest('/leads', {
        method: 'POST',
        body: JSON.stringify(formData),
    });
};

// ===========================================
// COOKIE PREFERENCES API
// ===========================================

/**
 * Save cookie preferences to server
 * @param {object} preferences - { analytics, marketing, preferences }
 */
export const saveCookiePreferences = async (preferences) => {
    const visitorId = getOrCreateVisitorId();

    return apiRequest('/cookies/preferences', {
        method: 'POST',
        body: JSON.stringify({
            visitorId,
            ...preferences,
        }),
    });
};

/**
 * Get cookie preferences from server
 */
export const getCookiePreferences = async () => {
    const visitorId = localStorage.getItem('visitorId');
    if (!visitorId) return null;

    try {
        const response = await apiRequest(`/cookies/preferences/${visitorId}`);
        return response.found ? response.preferences : null;
    } catch (error) {
        return null;
    }
};

/**
 * Get or create visitor ID for cookie tracking
 */
const getOrCreateVisitorId = () => {
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem('visitorId', visitorId);
    }
    return visitorId;
};

// ===========================================
// HEALTH CHECK
// ===========================================

/**
 * Check if API is available
 */
export const checkApiHealth = async () => {
    try {
        const response = await apiRequest('/health');
        return response.status === 'healthy';
    } catch (error) {
        return false;
    }
};

export { ApiError };

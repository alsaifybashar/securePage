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

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

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
 * @param {object} formData - { name, email, message, company?, serviceTier? }
 */
export const submitLead = async (formData) => {
    return apiRequest('/leads', {
        method: 'POST',
        body: JSON.stringify(formData),
    });
};

// ===========================================
// AUTH API
// ===========================================

/**
 * Login user
 * @param {string} email 
 * @param {string} password 
 */
export const login = async (email, password) => {
    const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });

    // Store token
    if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
};

/**
 * Register new user
 * @param {object} userData - { email, password, name, company? }
 */
export const register = async (userData) => {
    return apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

/**
 * Verify current session
 */
export const verifySession = async () => {
    try {
        return await apiRequest('/auth/session');
    } catch (error) {
        // Clear invalid token
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        return { authenticated: false };
    }
};

/**
 * Logout user
 */
export const logout = async () => {
    try {
        await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem('authToken');
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

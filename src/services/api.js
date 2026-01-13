/**
 * API Service
 * Centralized API calls to the backend
 */

// Backend API URL - uses relative path, proxied by Nginx in production
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Make an API request with error handling
 */
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = localStorage.getItem('adminToken');
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    // Add session ID for analytics
    const sessionId = sessionStorage.getItem('sessionId');
    if (sessionId) {
        defaultHeaders['X-Session-ID'] = sessionId;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error.message);
        throw error;
    }
};

/**
 * Contact Form API
 */
export const submitLead = async (formData) => {
    return apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
    });
};

export const checkContactStatus = async (uuid) => {
    return apiRequest(`/contact/status/${uuid}`);
};

/**
 * Analytics API
 */
export const createSession = async (landingPage) => {
    return apiRequest('/analytics/session', {
        method: 'POST',
        body: JSON.stringify({ landingPage }),
    });
};

export const trackEvent = async (eventData) => {
    const sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) return;

    return apiRequest('/analytics/track', {
        method: 'POST',
        body: JSON.stringify({
            sessionId,
            ...eventData,
        }),
    });
};

export const sendHeartbeat = async (timeOnPage) => {
    const sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) return;

    return apiRequest('/analytics/heartbeat', {
        method: 'POST',
        body: JSON.stringify({ sessionId, timeOnPage }),
    });
};

export default {
    submitLead,
    createSession,
    trackEvent,
    sendHeartbeat
};

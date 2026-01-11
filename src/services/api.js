/**
 * API Service
 * Centralized API calls to the backend
 */

// Backend API URL - use relative path for production (via Nginx) or Vite proxy
const API_BASE_URL = '/api';

// Debug log (remove in production)
console.log('API Base URL:', API_BASE_URL);

/**
 * Make an API request with error handling
 */
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Making request to:', url); // Debug log

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

/**
 * Auth API
 */
export const adminLogin = async (username, password) => {
    const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });

    if (response.success && response.token) {
        localStorage.setItem('adminToken', response.token);
        localStorage.setItem('adminUser', JSON.stringify(response.user));
    }

    return response;
};

export const adminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
};

export const changePassword = async (currentPassword, newPassword) => {
    return apiRequest('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
    });
};

export const updateUsername = async (currentPassword, newUsername) => {
    return apiRequest('/auth/update-username', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newUsername }),
    });
};

/**
 * Admin Dashboard API
 */
export const getDashboardStats = async () => {
    return apiRequest('/admin/dashboard');
};

export const getContacts = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/contacts?${queryString}`);
};

export const getContact = async (id) => {
    return apiRequest(`/admin/contacts/${id}`);
};

export const updateContactStatus = async (id, status) => {
    return apiRequest(`/admin/contacts/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    });
};

export const getSessions = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/analytics/sessions?${queryString}`);
};

export const getEvents = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/analytics/events?${queryString}`);
};

export const getClickData = async (days = 7) => {
    return apiRequest(`/admin/analytics/clicks?days=${days}`);
};

export const getChartData = async (metric = 'visitors', days = 30) => {
    return apiRequest(`/admin/analytics/chart-data?metric=${metric}&days=${days}`);
};

export default {
    submitLead,
    checkContactStatus,
    createSession,
    trackEvent,
    sendHeartbeat,
    adminLogin,
    adminLogout,
    getDashboardStats,
    getContacts,
    getContact,
    updateContactStatus,
    getSessions,
    getEvents,
    getClickData,
    getChartData,
};

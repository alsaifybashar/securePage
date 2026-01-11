/**
 * Analytics Tracker
 * Tracks user behavior for the admin dashboard
 * Respects cookie consent preferences
 */

import { createSession, trackEvent, sendHeartbeat } from './api';
import { isCategoryAllowed, COOKIE_CATEGORIES } from '../utils/cookieConsent';

class AnalyticsTracker {
    constructor() {
        this.sessionId = null;
        this.visitorId = null;
        this.startTime = Date.now();
        this.lastActivity = Date.now();
        this.heartbeatInterval = null;
        this.initialized = false;
    }

    /**
     * Initialize the tracker
     */
    async init() {
        // Check if statistics cookies are allowed
        if (!isCategoryAllowed(COOKIE_CATEGORIES.STATISTICS)) {
            console.log('Analytics: Statistics cookies not allowed');
            return;
        }

        try {
            // Check for existing session
            this.sessionId = sessionStorage.getItem('sessionId');
            this.visitorId = localStorage.getItem('visitorId');

            if (!this.sessionId) {
                // Create new session
                const response = await createSession(window.location.pathname);
                if (response.success) {
                    this.sessionId = response.sessionId;
                    this.visitorId = response.visitorId;
                    sessionStorage.setItem('sessionId', this.sessionId);
                    localStorage.setItem('visitorId', this.visitorId);
                }
            }

            if (this.sessionId) {
                this.initialized = true;
                this.setupEventListeners();
                this.startHeartbeat();
                this.trackPageView();
                console.log('Analytics: Initialized');
            }
        } catch (error) {
            console.error('Analytics: Failed to initialize', error);
        }
    }

    /**
     * Track page view
     */
    async trackPageView() {
        if (!this.initialized) return;

        try {
            await trackEvent({
                eventType: 'page_view',
                pageUrl: window.location.pathname,
            });
        } catch (error) {
            console.error('Analytics: Failed to track page view', error);
        }
    }

    /**
     * Track click event
     */
    async trackClick(event) {
        if (!this.initialized) return;

        const target = event.target;

        // Get element info
        const elementId = target.id || null;
        const elementClass = target.className?.toString()?.substring(0, 200) || null;
        const elementText = target.textContent?.substring(0, 100)?.trim() || null;

        try {
            await trackEvent({
                eventType: 'click',
                pageUrl: window.location.pathname,
                elementId,
                elementClass,
                elementText,
                xPosition: event.clientX,
                yPosition: event.clientY,
            });
        } catch (error) {
            // Silently fail for non-critical tracking
        }
    }

    /**
     * Track scroll depth
     */
    trackScroll = (() => {
        let maxScrollDepth = 0;
        let scrollTimeout = null;

        return () => {
            if (!this.initialized) return;

            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((scrollTop / docHeight) * 100);

            if (scrollPercent > maxScrollDepth) {
                maxScrollDepth = scrollPercent;

                // Debounce scroll tracking
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(async () => {
                    try {
                        await trackEvent({
                            eventType: 'scroll',
                            pageUrl: window.location.pathname,
                            scrollDepth: maxScrollDepth,
                        });
                    } catch (error) {
                        // Silently fail
                    }
                }, 1000);
            }
        };
    })();

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Track clicks on important elements
        document.addEventListener('click', (e) => {
            const target = e.target;

            // Only track clicks on interactive elements
            const isInteractive =
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList.contains('btn') ||
                target.closest('.btn');

            if (isInteractive) {
                this.trackClick(e);
            }
        });

        // Track scroll depth
        window.addEventListener('scroll', this.trackScroll, { passive: true });

        // Track when user leaves
        window.addEventListener('beforeunload', () => {
            this.trackExit();
        });

        // Track visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.sendHeartbeatNow();
            }
        });
    }

    /**
     * Start heartbeat to track time on page
     */
    startHeartbeat() {
        // Send heartbeat every 30 seconds
        this.heartbeatInterval = setInterval(() => {
            this.sendHeartbeatNow();
        }, 30000);
    }

    /**
     * Send heartbeat immediately
     */
    async sendHeartbeatNow() {
        if (!this.initialized) return;

        const timeOnPage = Math.round((Date.now() - this.startTime) / 1000);

        try {
            await sendHeartbeat(timeOnPage);
        } catch (error) {
            // Silently fail
        }
    }

    /**
     * Track exit
     */
    async trackExit() {
        if (!this.initialized) return;

        const timeOnPage = Math.round((Date.now() - this.startTime) / 1000);

        try {
            // Use sendBeacon for reliability on page unload
            const data = JSON.stringify({
                sessionId: this.sessionId,
                eventType: 'exit',
                pageUrl: window.location.pathname,
                eventData: { timeOnPage }
            });

            navigator.sendBeacon(
                `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/analytics/track`,
                new Blob([data], { type: 'application/json' })
            );
        } catch (error) {
            // Silently fail
        }
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        window.removeEventListener('scroll', this.trackScroll);
        this.initialized = false;
    }
}

// Export singleton instance
export const analyticsTracker = new AnalyticsTracker();
export default analyticsTracker;

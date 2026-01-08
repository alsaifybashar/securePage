import React, { useEffect, useState } from 'react';
import './CookieButton.css';

const CookieButton = ({ onClick }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Fade in after 1.5 seconds
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <button
            className={`cookie-settings-button ${isVisible ? 'fade-in' : ''}`}
            onClick={onClick}
            aria-label="Cookie Settings"
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="10" />
                <circle cx="8" cy="10" r="1" fill="currentColor" />
                <circle cx="16" cy="10" r="1" fill="currentColor" />
                <circle cx="12" cy="16" r="1" fill="currentColor" />
                <circle cx="7" cy="15" r="1" fill="currentColor" />
                <circle cx="17" cy="15" r="1" fill="currentColor" />
            </svg>
            <span>Cookie Settings</span>
        </button>
    );
};

export default CookieButton;

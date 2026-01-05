import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            padding: '2rem',
            textAlign: 'center',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--border-color)',
            marginTop: '4rem'
        }}>
            <p>&copy; {new Date().getFullYear()} SecurePent. All systems operational.</p>
        </footer>
    );
};

export default Footer;

import React from 'react';

const Footer = () => {
    return (
        <footer className="footer glass-panel">
            <div className="footer-content">
                <div className="footer-brand">
                    <h3>SECURE<span className="text-gradient">PENT</span></h3>
                    <p>Advanced Security Infrastructure</p>
                </div>
                <div className="footer-socials">
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">LinkedIn</a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">Twitter</a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">GitHub</a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} SecurePent. All systems operational.</p>
            </div>

            <style>{`
                .footer {
                    margin-top: 4rem;
                    padding: 3rem 2rem;
                    border-top: 1px solid var(--card-border);
                }
                .footer-content {
                    max-width: 1280px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .footer-brand h3 {
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
                }
                .footer-socials {
                    display: flex;
                    gap: 1.5rem;
                }
                .footer-socials a {
                    color: var(--text-muted);
                    text-decoration: none;
                    transition: color 0.3s;
                }
                .footer-socials a:hover {
                    color: var(--accent-primary);
                }
                .footer-bottom {
                    text-align: center;
                    border-top: 1px solid var(--glass-stroke);
                    padding-top: 2rem;
                    font-size: 0.9rem;
                    color: var(--text-muted);
                }
            `}</style>
        </footer>
    );
};

export default Footer;

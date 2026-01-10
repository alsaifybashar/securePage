import React, { useState } from 'react';
import PrivacyPolicyModal from './PrivacyPolicyModal';

const Footer = () => {
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

    return (
        <footer className="footer glass-panel">
            <PrivacyPolicyModal
                isOpen={isPrivacyModalOpen}
                onClose={() => setIsPrivacyModalOpen(false)}
            />

            <div className="footer-content">
                {/* Left: Logo */}
                <div className="footer-brand">
                    <h3>SECURE<span className="text-gradient">PENT</span></h3>
                </div>

                {/* Right: Info Sections */}
                <div className="footer-info-grid">
                    <div className="footer-section">
                        <h4>COMPANY INFO</h4>
                        <p className="company-name">SECUREPENT AB</p>
                        <p className="company-address">
                            Box 24016, 104 50 Stockholm, Sweden
                        </p>
                        <button
                            className="privacy-link"
                            onClick={() => setIsPrivacyModalOpen(true)}
                        >
                            Privacy policy
                        </button>
                        <p className="copyright">Copyright © {new Date().getFullYear()} SECUREPENT AB</p>
                    </div>

                    <div className="footer-section">
                        <h4>CONTACT</h4>
                        <div className="contact-item">
                            <span className="contact-label">Job opportunities</span>
                            <a href="mailto:career@securepent.com">career@securepent.com</a>
                        </div>
                        <div className="contact-item">
                            <span className="contact-label">Investor inquiries</span>
                            <a href="mailto:invest@securepent.com">invest@securepent.com</a>
                        </div>
                        <div className="contact-item">
                            <span className="contact-label">General inquiries</span>
                            <a href="mailto:contact@securepent.com">contact@securepent.com</a>
                        </div>
                    </div>
                </div>
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
                    display: grid;
                    grid-template-columns: 300px 1fr;
                    gap: 4rem;
                    align-items: start;
                }

                .footer-brand h3 {
                    font-size: 2rem;
                    font-weight: 700;
                    letter-spacing: 2px;
                    color: var(--text-main);
                }

                .footer-info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 3rem;
                }

                .footer-section h4 {
                    color: var(--text-main);
                    font-size: 0.75rem;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                }

                .company-name {
                    font-weight: 600;
                    color: var(--text-main);
                    margin-bottom: 0.5rem;
                    font-size: 0.95rem;
                }

                .company-address {
                    color: var(--text-secondary);
                    line-height: 1.6;
                    margin-bottom: 1rem;
                    font-size: 0.9rem;
                }

                .privacy-link {
                    background: none;
                    border: none;
                    color: var(--accent-primary);
                    text-decoration: underline;
                    cursor: pointer;
                    padding: 0;
                    font-size: 0.9rem;
                    transition: color 0.3s;
                    display: block;
                    margin-bottom: 1.5rem;
                }

                .privacy-link:hover {
                    color: var(--text-main);
                }

                .copyright {
                    color: var(--text-muted);
                    font-size: 0.85rem;
                    margin-top: 1rem;
                }

                .contact-item {
                    margin-bottom: 1.25rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .contact-label {
                    font-size: 0.85rem;
                    color: var(--text-main);
                    font-weight: 500;
                }

                .contact-item a {
                    color: var(--accent-primary);
                    text-decoration: none;
                    transition: color 0.3s;
                    font-size: 0.9rem;
                }

                .contact-item a:hover {
                    color: var(--text-main);
                    text-decoration: underline;
                }

                @media (max-width: 968px) {
                    .footer-content {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }
                    
                    .footer-info-grid {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }
                }

                @media (max-width: 600px) {
                    .footer-info-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;

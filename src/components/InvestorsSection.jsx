import React from 'react';

const InvestorsSection = () => {
    const trustItems = [
        {
            iconType: 'shield',
            title: 'Ethical Standards',
            desc: 'We follow strict ethical guidelines and sign NDAs. Your data stays confidential.'
        },
        {
            iconType: 'clipboard',
            title: 'OWASP Methodology',
            desc: 'Our testing follows OWASP and PTES industry standards for comprehensive coverage.'
        },
        {
            iconType: 'lock',
            title: 'Proof of Concept',
            desc: 'Every vulnerability comes with a PoC exploit so you can verify and understand the risk.'
        },
        {
            iconType: 'chart',
            title: 'Detailed Reports',
            desc: 'Clear, actionable reports with severity ratings and step-by-step remediation guides.'
        }
    ];

    // Professional SVG Icons
    const icons = {
        shield: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
                    stroke="url(#shieldGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12L11 14L15 10"
                    stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                    <linearGradient id="shieldGrad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="var(--accent-primary)" />
                        <stop offset="1" stopColor="var(--accent-cyan)" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        clipboard: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="4" width="14" height="17" rx="2"
                    stroke="url(#clipGrad)" strokeWidth="2" />
                <path d="M9 2H15V4C15 4.55228 14.5523 5 14 5H10C9.44772 5 9 4.55228 9 4V2Z"
                    fill="var(--accent-primary)" stroke="var(--accent-primary)" strokeWidth="1.5" />
                <line x1="8" y1="10" x2="16" y2="10" stroke="var(--accent-cyan)" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="8" y1="14" x2="14" y2="14" stroke="var(--accent-cyan)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                <line x1="8" y1="18" x2="12" y2="18" stroke="var(--accent-cyan)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                <defs>
                    <linearGradient id="clipGrad" x1="5" y1="4" x2="19" y2="21" gradientUnits="userSpaceOnUse">
                        <stop stopColor="var(--accent-primary)" />
                        <stop offset="1" stopColor="var(--accent-cyan)" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        lock: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="11" width="14" height="10" rx="2"
                    stroke="url(#lockGrad)" strokeWidth="2" />
                <circle cx="12" cy="16" r="1.5" fill="var(--accent-primary)" />
                <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11"
                    stroke="var(--accent-cyan)" strokeWidth="2" strokeLinecap="round" />
                <defs>
                    <linearGradient id="lockGrad" x1="5" y1="11" x2="19" y2="21" gradientUnits="userSpaceOnUse">
                        <stop stopColor="var(--accent-primary)" />
                        <stop offset="1" stopColor="var(--accent-cyan)" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        chart: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="16" height="16" rx="2"
                    stroke="url(#chartGrad)" strokeWidth="2" />
                <rect x="7" y="12" width="3" height="5" rx="0.5" fill="var(--accent-primary)" />
                <rect x="10.5" y="9" width="3" height="8" rx="0.5" fill="var(--accent-cyan)" />
                <rect x="14" y="6" width="3" height="11" rx="0.5" fill="var(--accent-primary)" opacity="0.8" />
                <defs>
                    <linearGradient id="chartGrad" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                        <stop stopColor="var(--accent-primary)" />
                        <stop offset="1" stopColor="var(--accent-cyan)" />
                    </linearGradient>
                </defs>
            </svg>
        )
    };

    return (
        <div className="trust-content">
            <div className="header-wrapper">
                <span className="section-label">Why Choose Us</span>
                <h2 className="section-title">Built on <span className="text-gradient">Trust</span></h2>
                <p className="section-subtitle">Professional, ethical, and thorough security assessments.</p>
            </div>

            <div className="trust-grid">
                {trustItems.map((item, i) => (
                    <div key={i} className="trust-card glass-panel">
                        <div className="trust-icon-wrapper">
                            {icons[item.iconType]}
                        </div>
                        <h3>{item.title}</h3>
                        <p>{item.desc}</p>
                    </div>
                ))}
            </div>

            <style>{`
                .trust-content {
                    max-width: 1100px;
                    margin: 0 auto;
                }
                .header-wrapper {
                    text-align: center;
                    margin-bottom: 4rem;
                }
                .section-label {
                    color: var(--accent-primary);
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                    display: block;
                }
                .section-subtitle {
                    max-width: 600px;
                    margin: 1rem auto;
                }
                .trust-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 2rem;
                }
                .trust-card {
                    padding: 2rem;
                    border-radius: var(--radius-lg);
                    text-align: center;
                    transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
                }
                .trust-card:hover {
                    transform: translateY(-5px);
                    border-color: var(--accent-primary);
                    box-shadow: 0 20px 40px -10px rgba(56, 189, 248, 0.15);
                }
                .trust-icon-wrapper {
                    width: 56px;
                    height: 56px;
                    margin: 0 auto 1.25rem auto;
                    background: rgba(56, 189, 248, 0.08);
                    border-radius: 12px;
                    padding: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.3s ease, transform 0.3s ease;
                }
                .trust-card:hover .trust-icon-wrapper {
                    background: rgba(56, 189, 248, 0.15);
                    transform: scale(1.05);
                }
                .trust-icon-wrapper svg {
                    width: 100%;
                    height: 100%;
                }
                .trust-card h3 {
                    font-size: 1rem;
                    margin-bottom: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .trust-card p {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    line-height: 1.6;
                }
                @media (max-width: 900px) {
                    .trust-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (max-width: 500px) {
                    .trust-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default InvestorsSection;

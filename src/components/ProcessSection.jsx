import React from 'react';

const ProcessSection = () => {
    const steps = [
        {
            number: '01',
            title: 'Consultation',
            desc: 'We discuss your WordPress site, security concerns, and define the scope of the assessment.',
            icon: 'chat'
        },
        {
            number: '02',
            title: 'Analysis',
            desc: 'Our team performs a thorough security assessment based on your selected service tier.',
            icon: 'search'
        },
        {
            number: '03',
            title: 'Report',
            desc: 'You receive a detailed report with all findings, severity ratings, and PoC exploits.',
            icon: 'doc'
        },
        {
            number: '04',
            title: 'Remediation',
            desc: 'We provide step-by-step guidance to fix vulnerabilities and harden your site.',
            icon: 'shield'
        },
    ];

    const icons = {
        chat: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 11.5C21 16.1944 16.9706 20 12 20C10.8053 20 9.66461 19.7992 8.61456 19.4297L4 21L5.3382 17.3211C4.50026 16.1165 4 14.6658 4 13.1C4 8.40558 8.02944 5 13 5"
                    stroke="url(#chatGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="18" cy="5" r="3" fill="var(--accent-primary)" opacity="0.8" />
                <defs>
                    <linearGradient id="chatGrad" x1="4" y1="5" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                        <stop stopColor="var(--accent-primary)" />
                        <stop offset="1" stopColor="var(--accent-cyan)" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        search: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="7" stroke="url(#searchGrad)" strokeWidth="2" />
                <path d="M21 21L16.5 16.5" stroke="var(--accent-cyan)" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 11H14" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M11 8V14" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" />
                <defs>
                    <linearGradient id="searchGrad" x1="4" y1="4" x2="18" y2="18" gradientUnits="userSpaceOnUse">
                        <stop stopColor="var(--accent-primary)" />
                        <stop offset="1" stopColor="var(--accent-cyan)" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        doc: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                    stroke="url(#docGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 2V8H20" stroke="var(--accent-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="8" y1="13" x2="16" y2="13" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                <line x1="8" y1="17" x2="14" y2="17" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                <defs>
                    <linearGradient id="docGrad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="var(--accent-primary)" />
                        <stop offset="1" stopColor="var(--accent-cyan)" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        shield: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
                    stroke="url(#shieldGrad2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12L11 14L15 10" stroke="var(--accent-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                    <linearGradient id="shieldGrad2" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="var(--accent-primary)" />
                        <stop offset="1" stopColor="var(--accent-cyan)" />
                    </linearGradient>
                </defs>
            </svg>
        )
    };

    return (
        <div className="process-container">
            <div className="header-wrapper">
                <span className="section-label">How It Works</span>
                <h2>Our <span className="text-gradient">Process</span></h2>
                <p className="section-subtitle">
                    A straightforward path from vulnerability to resilience.
                </p>
            </div>

            <div className="process-timeline">
                {steps.map((step, i) => (
                    <div key={i} className="process-step">
                        <div className="step-icon-wrapper">
                            {icons[step.icon]}
                        </div>
                        <div className="step-content">
                            <div className="step-number">{step.number}</div>
                            <h3>{step.title}</h3>
                            <p>{step.desc}</p>
                        </div>
                        {i < steps.length - 1 && <div className="step-connector"></div>}
                    </div>
                ))}
            </div>

            <style>{`
                .process-container {
                    max-width: 1000px;
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
                    max-width: 500px;
                    margin: 1rem auto;
                }
                
                .process-timeline {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 2rem;
                    position: relative;
                }
                
                .process-step {
                    text-align: center;
                    position: relative;
                    padding: 0 1rem;
                }
                
                .step-icon-wrapper {
                    width: 64px;
                    height: 64px;
                    margin: 0 auto 1.5rem auto;
                    background: rgba(56, 189, 248, 0.08);
                    border-radius: 16px;
                    padding: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    border: 1px solid transparent;
                }
                
                .process-step:hover .step-icon-wrapper {
                    background: rgba(56, 189, 248, 0.15);
                    border-color: var(--accent-primary);
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px -10px rgba(56, 189, 248, 0.3);
                }
                
                .step-icon-wrapper svg {
                    width: 100%;
                    height: 100%;
                }
                
                .step-number {
                    font-family: var(--font-display);
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--accent-primary);
                    opacity: 0.7;
                    margin-bottom: 0.5rem;
                }
                
                .step-content h3 {
                    font-size: 1.2rem;
                    margin-bottom: 0.75rem;
                    font-weight: 600;
                }
                
                .step-content p {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    line-height: 1.6;
                }
                
                .step-connector {
                    position: absolute;
                    top: 32px;
                    right: -1rem;
                    width: calc(2rem);
                    height: 2px;
                    background: linear-gradient(to right, var(--accent-primary), transparent);
                    opacity: 0.3;
                }

                @media (max-width: 900px) {
                    .process-timeline {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .step-connector {
                        display: none;
                    }
                }
                
                @media (max-width: 500px) {
                    .process-timeline {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProcessSection;

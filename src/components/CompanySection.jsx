import React from 'react';

const CompanySection = () => {
    return (
        <div className="company-container">
            <div className="content-col">
                <span className="decoration-line"></span>
                <h2>Guardians of <br />Your WordPress</h2>
                <div className="stats-row">
                    <div className="stat">
                        <span className="stat-num">500+</span>
                        <span className="stat-label">Audits Completed</span>
                    </div>
                    <div className="stat">
                        <span className="stat-num">2000+</span>
                        <span className="stat-label">Vulnerabilities Found</span>
                    </div>
                </div>
            </div>

            <div className="text-col">
                <p className="lead">
                    WordPress powers 43% of all websites — making it the #1 target for hackers. Is your site secure?
                </p>
                <p>
                    <strong style={{ color: 'var(--text-main)' }}>SecurePent</strong> specializes in WordPress security analysis. We're ethical hackers who think like attackers — finding vulnerabilities before malicious actors do.
                </p>
                <p>
                    Unlike automated scanners, we provide proof-of-concept exploits that demonstrate real risk. When we find a vulnerability, we show you exactly how it can be exploited and precisely how to fix it.
                </p>
            </div>

            <style>{`
                .company-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                    align-items: start;
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 0 1rem;
                }
                
                .content-col h2 {
                    font-size: clamp(2rem, 5vw, 3.5rem);
                    line-height: 1;
                    margin-bottom: 2rem;
                    position: relative;
                }
                
                .decoration-line {
                    display: block;
                    width: 60px;
                    height: 4px;
                    background: var(--accent-primary);
                    margin-bottom: 1.5rem;
                }

                .lead {
                    font-size: clamp(1.1rem, 2.5vw, 1.35rem);
                    color: var(--text-main);
                    margin-bottom: 1.5rem;
                    line-height: 1.5;
                }
                
                .text-col p {
                    margin-bottom: 1.25rem;
                    font-size: clamp(0.95rem, 2vw, 1.05rem);
                }
                
                .stats-row {
                    display: flex;
                    gap: 2rem;
                    margin-top: 2rem;
                    border-top: 1px solid var(--card-border);
                    padding-top: 1.5rem;
                    flex-wrap: wrap;
                }
                
                .stat {
                    display: flex;
                    flex-direction: column;
                    min-width: 100px;
                }
                .stat-num {
                    font-family: var(--font-display);
                    font-size: clamp(1.5rem, 4vw, 2rem);
                    color: var(--accent-primary);
                }
                .stat-label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: var(--text-secondary);
                }

                @media (max-width: 900px) {
                    .company-container {
                        gap: 3rem;
                    }
                }

                @media (max-width: 768px) {
                    .company-container {
                        grid-template-columns: 1fr;
                        gap: 2.5rem;
                        text-align: center;
                    }
                    .decoration-line {
                        margin: 0 auto 1.5rem;
                    }
                    .content-col h2 br {
                        display: none;
                    }
                    .stats-row {
                        justify-content: center;
                    }
                }

                @media (max-width: 480px) {
                    .stats-row {
                        gap: 1.5rem;
                    }
                    .stat {
                        min-width: 80px;
                    }
                }
            `}</style>
        </div>
    );
};

export default CompanySection;

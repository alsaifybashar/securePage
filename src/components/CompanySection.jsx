import React from 'react';

const CompanySection = () => {
    return (
        <div className="company-container">
            <div className="content-col">
                <span className="decoration-line"></span>
                <h2>Guardians of <br /> The Digital Age</h2>
                <div className="stats-row">
                    <div className="stat">
                        <span className="stat-num">Real-time</span>
                        <span className="stat-label">Intelligence</span>
                    </div>
                    <div className="stat">
                        <span className="stat-num">Advanced</span>
                        <span className="stat-label">Simulation</span>
                    </div>
                </div>
            </div>

            <div className="text-col">
                <p className="lead">
                    Attackers are getting faster. Automation and AI let them scan, adapt and exploit at a pace no human team can match.
                </p>
                <p>
                    <strong style={{ color: 'var(--text-main)' }}>SecurePent</strong> changes the equation. We augment human pentesters with AI instead of replacing them – giving them continuous context. The same experts, in the same time, can cover more ground and find deeper issues.
                </p>
                <p>
                    CISOs often drown in scanners and reports. We provide a clear, live picture of where you are exposed. Pentesters remain the sharp edge of security.
                </p>
            </div>

            <style>{`
                .company-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 6rem;
                    align-items: start;
                    max-width: 1100px;
                    margin: 0 auto;
                }
                
                .content-col h2 {
                    font-size: 3.5rem;
                    line-height: 1;
                    margin-bottom: 3rem;
                    position: relative;
                }
                
                .decoration-line {
                    display: block;
                    width: 60px;
                    height: 4px;
                    background: var(--accent-primary);
                    margin-bottom: 2rem;
                }

                .lead {
                    font-size: 1.35rem;
                    color: var(--text-main);
                    margin-bottom: 1.5rem;
                    line-height: 1.5;
                }
                
                .text-col p {
                    margin-bottom: 1.5rem;
                }
                
                .stats-row {
                    display: flex;
                    gap: 3rem;
                    margin-top: 2rem;
                    border-top: 1px solid var(--card-border);
                    padding-top: 2rem;
                }
                
                .stat {
                    display: flex;
                    flex-direction: column;
                }
                .stat-num {
                    font-family: var(--font-display);
                    font-size: 2rem;
                    color: var(--accent-primary);
                }
                .stat-label {
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                @media (max-width: 768px) {
                    .company-container {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                    }
                    .content-col h2 {
                        font-size: 2.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default CompanySection;

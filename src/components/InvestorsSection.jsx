import React from 'react';

const InvestorsSection = () => {
    return (
        <div className="investors-content">
            <h2 className="section-title">THE INVEST<span style={{ color: 'var(--accent-primary)' }}>Ø</span>RS</h2>
            <div className="logo-grid">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="logo-placeholder">PARTNER {i}</div>
                ))}
            </div>
            <style>{`
                .investors-content {
                    text-align: center;
                }
                .logo-grid {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 3rem;
                    margin-top: 3rem;
                    align-items: center;
                }
                .logo-placeholder {
                    font-family: var(--font-header);
                    font-size: 1.5rem;
                    color: var(--text-muted);
                    opacity: 0.5;
                }
            `}</style>
        </div>
    );
};

export default InvestorsSection;

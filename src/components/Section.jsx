import React from 'react';

const Section = ({ id, children, className = '' }) => {
    return (
        <section id={id} className={`section ${className}`}>
            <div className="section-container">
                {children}
            </div>
            <style>{`
            .section {
                min-height: auto;
                padding: 5rem 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                border-bottom: 1px solid var(--glass-stroke);
            }
            .section-container {
                max-width: 1280px;
                margin: 0 auto;
                padding: 0 1.5rem;
                width: 100%;
            }
            
            @media (max-width: 768px) {
                .section {
                    padding: 3.5rem 0;
                }
                .section-container {
                    padding: 0 1rem;
                }
            }
            
            @media (max-width: 480px) {
                .section {
                    padding: 3rem 0;
                }
            }
        `}</style>
        </section>
    );
};

export default Section;

import React from 'react';

const Section = ({ id, children, className = '' }) => {
    return (
        <section id={id} className={`section ${className}`}>
            <div className="container">
                {children}
            </div>
            <style>{`
            .section {
                min-height: 80vh;
                padding: 6rem 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                border-bottom: 1px solid rgba(255,255,255,0.05);
            }
        `}</style>
        </section>
    );
};

export default Section;

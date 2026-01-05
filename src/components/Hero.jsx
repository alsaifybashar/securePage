import React from 'react';

const Hero = () => {
    return (
        <section className="hero">
            {/* Animated Background Mesh opacity tweaked for blue theme */}
            <div className="bg-mesh"></div>
            <div className="bg-gradient-overlay"></div>

            <div className="hero-content">
                <div className="status-badge">
                    <span className="pulsing-dot"></span> System Status: SECURE
                </div>
                <h1>
                    Supercharging <br />
                    <span className="text-gradient">Unknown Vulnerabilities</span>
                </h1>
                <p className="subtitle">
                    We develop human-in-the-loop AI tools, helping pentesters turn risk into resilience.
                    The future of offensive security is here.
                </p>
                <div className="cta-group">
                    <button className="btn btn-primary">Request Details</button>
                    <button className="btn btn-ghost">Meet The Team</button>
                </div>
            </div>

            <style>{`
            .hero {
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                overflow: hidden;
                padding-top: 80px; 
            }
            .bg-mesh {
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                background-image: 
                    linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px);
                background-size: 50px 50px;
                mask-image: radial-gradient(circle at center, black 40%, transparent 90%);
                z-index: 0;
            }
            .bg-gradient-overlay {
                position: absolute;
                top: -50%;
                left: -20%;
                width: 140%;
                height: 140%;
                background: radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.08), transparent 60%);
                z-index: 1;
                animation: pulseGlow 10s infinite alternate;
            }
            
            .hero-content {
                z-index: 2;
                max-width: 900px;
                text-align: center;
                padding: 0 1.5rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2rem;
                animation: slideUp 1s cubic-bezier(0.2, 0.8, 0.2, 1);
            }

            .status-badge {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                background: rgba(16, 185, 129, 0.1);
                border: 1px solid rgba(16, 185, 129, 0.2);
                color: var(--accent-green);
                font-size: 0.8rem;
                font-weight: 600;
                letter-spacing: 1px;
                text-transform: uppercase;
            }
            .pulsing-dot {
                width: 8px; height: 8px;
                background: var(--accent-green);
                border-radius: 50%;
                box-shadow: 0 0 0 rgba(16, 185, 129, 0.4);
                animation: pulse 2s infinite;
            }

            h1 {
                font-size: clamp(3rem, 6vw, 5rem);
                line-height: 1.1;
                letter-spacing: -0.02em;
            }
            
            .subtitle {
                font-size: 1.25rem;
                color: var(--text-secondary);
                max-width: 650px;
                margin-top: -0.5rem;
            }

            .cta-group {
                display: flex;
                gap: 1.5rem;
                margin-top: 1rem;
            }
            
            .btn {
                padding: 1rem 2.5rem;
                border-radius: var(--radius-md);
                font-weight: 600;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                letter-spacing: 0.5px;
            }
            
            .btn-primary {
                background: var(--text-main);
                color: var(--bg-darker);
                border: none;
            }
            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px -5px rgba(56, 189, 248, 0.4);
            }
            
            .btn-ghost {
                background: transparent;
                border: 1px solid var(--glass-stroke);
                color: var(--text-main);
            }
            .btn-ghost:hover {
                background: rgba(255,255,255,0.05);
                border-color: var(--text-main);
                color: var(--accent-primary);
            }

            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
            }
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes pulseGlow {
                0% { opacity: 0.4; transform: scale(1); }
                100% { opacity: 0.6; transform: scale(1.05); }
            }
        `}</style>
        </section>
    );
};

export default Hero;

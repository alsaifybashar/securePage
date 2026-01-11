import React from 'react';

const Hero = () => {
    return (
        <section className="hero">
            {/* Animated Background Mesh */}
            <div className="bg-mesh"></div>
            <div className="bg-gradient-overlay"></div>

            <div className="hero-content">
                <div className="status-badge">
                    <span className="pulsing-dot"></span> Ethical Security Experts
                </div>
                <h1>
                    WordPress <br />
                    <span className="text-gradient">Security Analysis</span>
                </h1>
                <p className="subtitle">
                    Professional penetration testing and security audits for WordPress websites.
                    We find vulnerabilities before attackers do — and show you exactly how to fix them.
                </p>
                <div className="cta-group">
                    <a href="#contact" className="btn btn-primary">Get a Security Audit</a>
                    <a href="#product" className="btn btn-ghost">Our Services</a>
                </div>
            </div>

            <div className="scroll-indicator" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                </svg>
            </div>

            <style>{`
            .hero {
                min-height: 100vh;
                min-height: 100dvh; /* Dynamic viewport height for mobile */
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                overflow: hidden;
                padding: 100px 1rem 60px;
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
                padding: 0 1rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1.5rem;
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
                font-size: 0.75rem;
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
                font-size: clamp(2.5rem, 8vw, 5rem);
                line-height: 1.1;
                letter-spacing: -0.02em;
                margin: 0;
            }
            
            .subtitle {
                font-size: clamp(1rem, 3vw, 1.25rem);
                color: var(--text-secondary);
                max-width: 650px;
                line-height: 1.6;
            }

            .cta-group {
                display: flex;
                gap: 1rem;
                margin-top: 0.5rem;
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .btn {
                padding: 1rem 2rem;
                border-radius: var(--radius-md);
                font-weight: 600;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                letter-spacing: 0.5px;
                text-decoration: none;
                display: inline-block;
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
            
            .scroll-indicator {
                position: absolute;
                bottom: 2rem;
                left: 50%;
                transform: translateX(-50%);
                color: var(--text-muted);
                cursor: pointer;
                animation: bounce 2s infinite;
                z-index: 10;
                opacity: 0.7;
                transition: all 0.3s;
            }
            .scroll-indicator:hover {
                color: var(--accent-primary);
                opacity: 1;
            }
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translate(-50%, 0); }
                40% { transform: translate(-50%, -10px); }
                60% { transform: translate(-50%, -5px); }
            }

            /* Mobile Styles */
            @media (max-width: 768px) {
                .hero {
                    padding: 90px 1rem 50px;
                }
                .hero-content {
                    gap: 1.25rem;
                }
                .status-badge {
                    font-size: 0.65rem;
                    padding: 0.4rem 0.8rem;
                }
                .btn {
                    padding: 0.875rem 1.5rem;
                    font-size: 0.9rem;
                    width: 100%;
                    max-width: 280px;
                    text-align: center;
                }
                .cta-group {
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                }
                .scroll-indicator {
                    bottom: 1.5rem;
                }
            }

            @media (max-width: 480px) {
                h1 {
                    font-size: 2.25rem;
                }
                .subtitle {
                    font-size: 0.95rem;
                }
            }
        `}</style>
        </section>
    );
};

export default Hero;

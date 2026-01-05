import React from 'react';

const ProductSection = () => {
    const features = [
        {
            title: 'CLI Integration',
            desc: 'Seamlessly slides into the Pentester’s workflow. No context switching required.',
            icon: 'Terminal'
        },
        {
            title: 'Agent Chat',
            desc: 'Interactive AI assistance for complex exploit chains and strategy formulation.',
            icon: 'MessageSquare'
        },
        {
            title: 'Asset Mapping',
            desc: 'Real-time context graph generation mapping discovered assets and relationships.',
            icon: 'Share2'
        },
        {
            title: 'Vulnerability Prioritization',
            desc: 'Automated triage highlighting critical paths driven by attack simulation data.',
            icon: 'AlertCircle'
        },
    ];

    return (
        <div className="content-container">
            <div className="header-wrapper">
                <span className="section-label">Capabilities</span>
                <h2>The Pr<span className="text-gradient">o</span>duct</h2>
                <p className="section-subtitle">Augmenting ethical hackers with real-time guidance and dynamic planning.</p>
            </div>

            <div className="features-grid">
                {features.map((f, i) => (
                    <div key={i} className="feature-card glass-panel">
                        <div className="card-gradient"></div>
                        <div className="icon-wrapper">
                            {/* Simple CSS Icon placeholders intended to look technical */}
                            <div className={`ico ico-${i}`}></div>
                        </div>
                        <h3>{f.title}</h3>
                        <p>{f.desc}</p>
                    </div>
                ))}
            </div>

            <style>{`
                .content-container {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .header-wrapper {
                    text-align: center;
                    margin-bottom: 5rem;
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
                
                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 2rem;
                }
                
                .feature-card {
                    padding: 2.5rem;
                    border-radius: var(--radius-lg);
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.3s ease, border-color 0.3s ease;
                }
                .feature-card:hover {
                    transform: translateY(-5px);
                    border-color: var(--accent-primary);
                }
                
                .card-gradient {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 5px;
                    background: var(--gradient-main);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .feature-card:hover .card-gradient {
                    opacity: 1;
                }

                .icon-wrapper {
                    width: 48px;
                    height: 48px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                    color: var(--accent-primary);
                }
                
                .feature-card h3 {
                    margin-bottom: 1rem;
                    font-size: 1.3rem;
                    letter-spacing: 0;
                    font-family: var(--font-main);
                    font-weight: 600;
                }
                
                /* Simple CSS Geometrics for icons */
                .ico { width: 20px; height: 20px; border: 2px solid currentColor; }
                .ico-0 { border-radius: 2px; position: relative; } /* Terminal box */
                .ico-0::after { content:'>_'; position:absolute; top:-4px; left:2px; font-size:12px; font-weight:bold; }
                
                .ico-1 { border-radius: 50% 50% 2px 50%; } /* Bubble */
                
                .ico-2 { border: none; background: currentColor; width: 6px; height: 6px; box-shadow: 10px -5px 0 currentColor, -10px 10px 0 currentColor; border-radius: 50%; } /* Nodes */
                
                .ico-3 { border-radius: 50%; border-width: 2px; position: relative; } /* Alert */
                .ico-3::after { content:'!'; position:absolute; left: 7px; top: 1px; font-weight:bold; font-size:12px;}

            `}</style>
        </div>
    );
};

export default ProductSection;

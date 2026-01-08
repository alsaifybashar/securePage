import React from 'react';

const MindsSection = () => {
    const team = [
        { role: 'Chief Scientist', name: 'Dr. A. Vance' },
        { role: 'Lead Exploiter', name: 'M. Chen' },
        { role: 'AI Architect', name: 'S. Kova' }
    ];

    return (
        <div className="container-minds">
            <div className="header-side">
                <span className="section-label">Our DNA</span>
                <h2>The Minds <br /><span style={{ fontWeight: 300, color: 'var(--text-secondary)' }}>& Founders</span></h2>
                <p>
                    We are a gathering of machine learning experts and ethical hacking specialists from top-tier tech giants.
                    Our vision is to keep the digital future safe.
                </p>
                <button className="btn-link">View all members &rarr;</button>
            </div>

            <div className="grid-side">
                {team.map((m, i) => (
                    <div key={i} className="mind-card">
                        <div className="card-image"></div>
                        <div className="card-info">
                            <span className="role">{m.role}</span>
                            <h4>{m.name}</h4>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .container-minds {
                    display: grid;
                    grid-template-columns: 1fr 1.5fr;
                    gap: 4rem;
                    max-width: 1200px;
                    margin: 0 auto;
                    align-items: center;
                }
                
                .header-side h2 {
                    font-size: 3rem;
                    margin: 1rem 0;
                }
                .header-side p {
                    margin-bottom: 2rem;
                    max-width: 400px;
                }
                
                .btn-link {
                    background: none;
                    border: none;
                    color: var(--accent-primary);
                    font-size: 1rem;
                    cursor: pointer;
                    padding: 0;
                    text-decoration: underline;
                    text-underline-offset: 4px;
                }
                
                .grid-side {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                }
                
                .mind-card {
                    height: 350px;
                    border-radius: var(--radius-sm);
                    overflow: hidden;
                    position: relative;
                    background: var(--bg-dark);
                    /* Interactive filter effect */
                    filter: grayscale(100%);
                    transition: all 0.5s ease;
                }
                .mind-card:hover {
                    filter: grayscale(0%);
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px -10px var(--accent-glow);
                }
                
                .card-image {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(to bottom, transparent, var(--bg-darker)), url('https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop'); 
                    background-size: cover;
                    background-position: center;
                }
                /* Use CSS nth-child to vary images if possible, or just keep generic for now */
                .mind-card:nth-child(2) .card-image { background-image: linear-gradient(to bottom, transparent, var(--bg-darker)), url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop'); }
                .mind-card:nth-child(3) .card-image { background-image: linear-gradient(to bottom, transparent, var(--bg-darker)), url('https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=600&auto=format&fit=crop'); }

                .card-info {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    padding: 1.5rem;
                }
                .role {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: var(--accent-primary);
                    display: block;
                    margin-bottom: 0.5rem;
                }
                .card-info h4 {
                    font-size: 1.25rem;
                    margin: 0;
                }

                @media (max-width: 900px) {
                    .container-minds {
                        grid-template-columns: 1fr;
                    }
                    .grid-side {
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    }
                }
            `}</style>
        </div>
    );
};

export default MindsSection;

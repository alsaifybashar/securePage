import React from 'react';

const MindsSection = () => {
    const team = [
        { role: 'Lead Pentester', name: 'K. Andersson' },
        { role: 'Security Analyst', name: 'R. Lindqvist' },
        { role: 'CEO', name: 'B. Al-Saify' }
    ];

    return (
        <div className="container-minds">
            <div className="header-side">
                <span className="section-label">Our Team</span>
                <h2>The Experts <br /><span style={{ fontWeight: 300, color: 'var(--text-secondary)' }}>Behind The Shield</span></h2>
                <p>
                    Our security professionals bring years of experience in ethical hacking, vulnerability research, and WordPress security.
                    We think like attackers to keep you safe.
                </p>
                <a href="#contact" className="btn-link">Work with us →</a>
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
                    gap: 3rem;
                    max-width: 1200px;
                    margin: 0 auto;
                    align-items: center;
                    padding: 0 1rem;
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
                
                .header-side h2 {
                    font-size: clamp(2rem, 5vw, 3rem);
                    margin: 1rem 0;
                    line-height: 1.1;
                }
                .header-side p {
                    margin-bottom: 1.5rem;
                    max-width: 400px;
                    font-size: clamp(0.95rem, 2vw, 1.05rem);
                }
                
                .btn-link {
                    background: none;
                    border: none;
                    color: var(--accent-primary);
                    font-size: 1rem;
                    cursor: pointer;
                    padding: 0;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: gap 0.2s ease;
                }
                .btn-link:hover {
                    gap: 0.75rem;
                }
                
                .grid-side {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                }
                
                .mind-card {
                    height: 280px;
                    border-radius: var(--radius-sm);
                    overflow: hidden;
                    position: relative;
                    background: var(--bg-dark);
                    filter: grayscale(100%);
                    transition: all 0.5s ease;
                }
                .mind-card:hover {
                    filter: grayscale(0%);
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px -10px var(--accent-glow);
                }
                
                .card-image {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(to bottom, transparent, var(--bg-darker)), url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop'); 
                    background-size: cover;
                    background-position: center;
                }
                .mind-card:nth-child(2) .card-image { background-image: linear-gradient(to bottom, transparent, var(--bg-darker)), url('https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=600&auto=format&fit=crop'); }
                .mind-card:nth-child(3) .card-image { background-image: linear-gradient(to bottom, transparent, var(--bg-darker)), url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop'); }

                .card-info {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    padding: 1.25rem;
                }
                .role {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: var(--accent-primary);
                    display: block;
                    margin-bottom: 0.25rem;
                }
                .card-info h4 {
                    font-size: 1.1rem;
                    margin: 0;
                }

                @media (max-width: 900px) {
                    .container-minds {
                        grid-template-columns: 1fr;
                        text-align: center;
                        gap: 2.5rem;
                    }
                    .header-side p {
                        max-width: 100%;
                    }
                    .grid-side {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                @media (max-width: 768px) {
                    .grid-side {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1rem;
                    }
                    .mind-card {
                        height: 220px;
                    }
                    .mind-card:nth-child(3) {
                        grid-column: span 2;
                        max-width: 50%;
                        margin: 0 auto;
                    }
                }

                @media (max-width: 500px) {
                    .grid-side {
                        grid-template-columns: 1fr;
                    }
                    .mind-card {
                        height: 200px;
                    }
                    .mind-card:nth-child(3) {
                        grid-column: span 1;
                        max-width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default MindsSection;

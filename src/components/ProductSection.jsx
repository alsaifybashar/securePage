import React from 'react';

const ProductSection = () => {
    const services = [
        {
            tier: 'Tier 1',
            title: 'External Analysis',
            tagline: 'No Access Required',
            price: 'Contact for Quote',
            features: [
                'Attack surface mapping',
                'Entry point identification (login, XML-RPC, REST API)',
                'Plugin & theme vulnerability scan',
                'Version detection & CVE matching',
                'robots.txt & sitemap analysis',
                'OWASP Top 10 assessment',
            ],
            deliverable: 'Detailed report with findings & remediation advice',
            popular: false,
        },
        {
            tier: 'Tier 2',
            title: 'Internal Audit',
            tagline: 'Full Access Assessment',
            price: 'Contact for Quote',
            features: [
                'Everything in External Analysis, plus:',
                'Admin panel security review',
                'User role & permission analysis',
                'Plugin code quality assessment',
                'Database security evaluation',
                'Server configuration check',
                'Custom vulnerability testing',
            ],
            deliverable: 'Comprehensive report with PoC exploits & remediation steps',
            popular: true,
        },
    ];

    // Professional checkmark icon
    const CheckIcon = () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="7" stroke="var(--accent-green)" strokeWidth="1.5" opacity="0.3" />
            <path d="M5 8L7 10L11 6" stroke="var(--accent-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    return (
        <div className="content-container">
            <div className="header-wrapper">
                <span className="section-label">Services</span>
                <h2>Choose Your <span className="text-gradient">Security Level</span></h2>
                <p className="section-subtitle">
                    Two service tiers designed to match your security needs and budget.
                </p>
            </div>

            <div className="services-grid">
                {services.map((service, i) => (
                    <div key={i} className={`service-card glass-panel ${service.popular ? 'popular' : ''}`}>
                        {service.popular && <div className="popular-badge">Most Popular</div>}
                        <div className="card-gradient"></div>
                        <div className="tier-badge">{service.tier}</div>
                        <h3>{service.title}</h3>
                        <p className="tagline">{service.tagline}</p>
                        <div className="price">{service.price}</div>
                        <ul className="features-list">
                            {service.features.map((feature, j) => (
                                <li key={j}>
                                    <span className="check-icon"><CheckIcon /></span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <div className="deliverable">
                            <strong>Deliverable:</strong> {service.deliverable}
                        </div>
                        <a href="#contact" className="btn-service">Request This Service</a>
                    </div>
                ))}
            </div>

            <style>{`
                .content-container {
                    max-width: 1100px;
                    margin: 0 auto;
                }
                .header-wrapper {
                    text-align: center;
                    margin-bottom: 4rem;
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
                
                .services-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 2.5rem;
                }
                
                .service-card {
                    padding: 2.5rem;
                    border-radius: var(--radius-lg);
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.3s ease, border-color 0.3s ease;
                    display: flex;
                    flex-direction: column;
                }
                .service-card:hover {
                    transform: translateY(-5px);
                    border-color: var(--accent-primary);
                }
                
                .service-card.popular {
                    border-color: var(--accent-primary);
                    box-shadow: 0 0 40px rgba(56, 189, 248, 0.1);
                }
                
                .popular-badge {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    background: var(--accent-primary);
                    color: var(--bg-darker);
                    padding: 0.3rem 0.8rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .card-gradient {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 5px;
                    background: var(--gradient-main);
                }
                
                .tier-badge {
                    color: var(--accent-primary);
                    font-size: 0.8rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 0.5rem;
                }

                .service-card h3 {
                    margin-bottom: 0.5rem;
                    font-size: 1.8rem;
                    letter-spacing: 0;
                    font-family: var(--font-main);
                    font-weight: 600;
                }
                
                .tagline {
                    color: var(--text-secondary);
                    font-size: 0.95rem;
                    margin-bottom: 1.5rem;
                }
                
                .price {
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: var(--accent-primary);
                    margin-bottom: 2rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid var(--glass-stroke);
                }
                
                .features-list {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 2rem 0;
                    flex-grow: 1;
                }
                
                .features-list li {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    margin-bottom: 0.75rem;
                    font-size: 0.95rem;
                    color: var(--text-secondary);
                }
                
                .check-icon {
                    flex-shrink: 0;
                    margin-top: 2px;
                }
                
                .deliverable {
                    background: rgba(255,255,255,0.03);
                    padding: 1rem;
                    border-radius: var(--radius-md);
                    font-size: 0.9rem;
                    margin-bottom: 1.5rem;
                    color: var(--text-secondary);
                }
                
                .deliverable strong {
                    color: var(--text-main);
                }
                
                .btn-service {
                    display: block;
                    text-align: center;
                    padding: 1rem 2rem;
                    background: transparent;
                    border: 1px solid var(--accent-primary);
                    color: var(--accent-primary);
                    border-radius: var(--radius-md);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                }
                
                .btn-service:hover {
                    background: var(--accent-primary);
                    color: var(--bg-darker);
                }
                
                .service-card.popular .btn-service {
                    background: var(--accent-primary);
                    color: var(--bg-darker);
                }
                
                .service-card.popular .btn-service:hover {
                    background: var(--accent-cyan);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 20px rgba(56, 189, 248, 0.3);
                }

                @media (max-width: 768px) {
                    .services-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductSection;

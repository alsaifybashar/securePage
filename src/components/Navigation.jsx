import React, { useState, useEffect } from 'react';

const Navigation = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    const scrollToSection = (id) => {
        setMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const navItems = [
        { label: 'About', id: 'company' },
        { label: 'Services', id: 'product' },
        { label: 'Process', id: 'process' },
        { label: 'Team', id: 'minds' },
    ];

    return (
        <>
            <nav className={`navigation ${scrolled ? 'scrolled glass-panel' : ''}`}>
                <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    SECURE<span className="text-gradient">PENT</span>
                </div>

                {/* Desktop Navigation */}
                <ul className="nav-links desktop-only">
                    {navItems.map((item) => (
                        <li key={item.id}>
                            <button onClick={() => scrollToSection(item.id)}>
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="nav-actions desktop-only">
                    <button className="btn-nav-cta" onClick={() => scrollToSection('contact')}>Contact us</button>
                </div>

                {/* Mobile Hamburger Button */}
                <button
                    className={`hamburger-btn ${mobileMenuOpen ? 'open' : ''}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                <ul className="mobile-nav-links">
                    {navItems.map((item) => (
                        <li key={item.id}>
                            <button onClick={() => scrollToSection(item.id)}>
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
                <button className="btn-mobile-cta" onClick={() => scrollToSection('contact')}>
                    Contact Us
                </button>
            </div>

            <style>{`
                .navigation {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 80px;
                    padding: 0 3rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    z-index: 1000;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    background: transparent;
                }
                .navigation.scrolled {
                    height: 70px;
                    background: var(--card-surface);
                    border-bottom: 1px solid var(--card-border);
                }
                .nav-brand {
                    font-family: var(--font-display);
                    font-size: 1.75rem;
                    font-weight: 700;
                    cursor: pointer;
                    letter-spacing: 2px;
                    color: var(--text-main);
                    z-index: 1001;
                }
                
                .nav-links {
                    display: flex;
                    gap: 2.5rem;
                    align-items: center;
                    list-style: none;
                }
                .nav-links button {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    font-family: var(--font-main);
                    font-size: 0.95rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                }
                .nav-links button:hover {
                    color: var(--text-main);
                }
                .nav-links button::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 2px;
                    bottom: -4px;
                    left: 0;
                    background: var(--gradient-main);
                    transition: width 0.3s ease;
                }
                .nav-links button:hover::after {
                    width: 100%;
                }

                .nav-actions {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .btn-nav-cta {
                    background: var(--card-surface) !important;
                    padding: 0.6rem 1.2rem;
                    border-radius: var(--radius-sm);
                    color: var(--text-main) !important;
                    border: 1px solid var(--glass-stroke) !important;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .btn-nav-cta:hover {
                    background: var(--accent-primary) !important;
                    border-color: var(--accent-primary) !important;
                    color: var(--bg-darker) !important;
                    box-shadow: 0 0 15px var(--accent-glow);
                }

                /* Hamburger Button */
                .hamburger-btn {
                    display: none;
                    flex-direction: column;
                    justify-content: center;
                    gap: 5px;
                    width: 32px;
                    height: 32px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    z-index: 1001;
                    padding: 0;
                }
                .hamburger-btn span {
                    display: block;
                    width: 24px;
                    height: 2px;
                    background: var(--text-main);
                    transition: all 0.3s ease;
                    transform-origin: center;
                }
                .hamburger-btn.open span:nth-child(1) {
                    transform: rotate(45deg) translate(5px, 5px);
                }
                .hamburger-btn.open span:nth-child(2) {
                    opacity: 0;
                }
                .hamburger-btn.open span:nth-child(3) {
                    transform: rotate(-45deg) translate(5px, -5px);
                }

                /* Mobile Menu Overlay */
                .mobile-menu-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    z-index: 998;
                }
                .mobile-menu-overlay.open {
                    opacity: 1;
                    visibility: visible;
                }

                /* Mobile Menu */
                .mobile-menu {
                    position: fixed;
                    top: 0;
                    right: -100%;
                    width: 80%;
                    max-width: 320px;
                    height: 100%;
                    background: var(--bg-darker);
                    border-left: 1px solid var(--card-border);
                    z-index: 999;
                    transition: right 0.3s ease;
                    padding: 100px 2rem 2rem;
                    display: flex;
                    flex-direction: column;
                }
                .mobile-menu.open {
                    right: 0;
                }
                .mobile-nav-links {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .mobile-nav-links li {
                    margin-bottom: 0.5rem;
                }
                .mobile-nav-links button {
                    display: block;
                    width: 100%;
                    text-align: left;
                    padding: 1rem;
                    background: none;
                    border: none;
                    color: var(--text-main);
                    font-family: var(--font-main);
                    font-size: 1.1rem;
                    font-weight: 500;
                    cursor: pointer;
                    border-radius: var(--radius-sm);
                    transition: all 0.2s ease;
                }
                .mobile-nav-links button:hover {
                    background: rgba(56, 189, 248, 0.1);
                    color: var(--accent-primary);
                }
                .btn-mobile-cta {
                    margin-top: auto;
                    padding: 1rem;
                    background: var(--accent-primary);
                    border: none;
                    border-radius: var(--radius-md);
                    color: var(--bg-darker);
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .btn-mobile-cta:hover {
                    background: var(--accent-cyan);
                }

                /* Responsive */
                @media (max-width: 900px) {
                    .navigation {
                        padding: 0 1.5rem;
                    }
                    .nav-links {
                        gap: 1.5rem;
                    }
                }

                @media (max-width: 768px) {
                    .desktop-only {
                        display: none !important;
                    }
                    .hamburger-btn {
                        display: flex;
                    }
                    .navigation {
                        padding: 0 1rem;
                        height: 70px;
                    }
                    .nav-brand {
                        font-size: 1.5rem;
                    }
                }
            `}</style>
        </>
    );
};

export default Navigation;

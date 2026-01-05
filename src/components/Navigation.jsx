import React, { useState, useEffect } from 'react';
import LoginModal from './LoginModal';

const Navigation = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80; // height of header
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
        { label: 'Company', id: 'company' },
        { label: 'Product', id: 'product' },
        { label: 'Team', id: 'minds' },
        { label: 'Contact', id: 'contact' },
    ];

    const [showLogin, setShowLogin] = useState(false);

    return (
        <nav className={`navigation ${scrolled ? 'scrolled glass-panel' : ''}`}>
            {/* Modal Portal */}
            <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />

            <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                SECURE<span className="text-gradient">PENT</span>
            </div>
            <ul className="nav-links">
                {navItems.map((item) => (
                    <li key={item.id}>
                        <button onClick={() => scrollToSection(item.id)}>
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="nav-actions">
                <button className="btn-login" onClick={() => setShowLogin(true)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Client Portal</span>
                </button>
                <button className="btn-nav-cta" onClick={() => scrollToSection('contact')}>Contact us</button>
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
            background: rgba(3, 3, 4, 0); /* Transparent start */
        }
        .navigation.scrolled {
            height: 70px;
            background: rgba(3, 3, 4, 0.85); /* Dark semi-transparent */
            border-bottom: 1px solid var(--card-border);
        }
        .nav-brand {
            font-family: var(--font-display);
            font-size: 1.75rem;
            font-weight: 700;
            cursor: pointer;
            letter-spacing: 2px;
            color: #fff;
        }
        
        .nav-links {
            display: flex;
            gap: 2.5rem;
            align-items: center;
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
        .nav-links button:not(.btn-nav-cta):hover {
            color: #fff;
        }
        /* Underline animation */
        .nav-links button:not(.btn-nav-cta)::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -4px;
            left: 0;
            background: var(--gradient-main);
            transition: width 0.3s ease;
        }
        .nav-links button:not(.btn-nav-cta):hover::after {
            width: 100%;
        }

        .nav-actions {
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }

        .btn-login {
            background: none;
            border: none;
            color: var(--text-main);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        .btn-login:hover {
            opacity: 1;
            color: var(--accent-primary);
        }

        .btn-nav-cta {
            background: rgba(255,255,255,0.1) !important;
            padding: 0.6rem 1.2rem;
            border-radius: var(--radius-sm);
            color: #fff !important;
            border: 1px solid var(--glass-stroke) !important;
            cursor: pointer;
        }
        .btn-nav-cta:hover {
            background: var(--accent-primary) !important;
            border-color: var(--accent-primary) !important;
            color: #000 !important;
            box-shadow: 0 0 15px var(--accent-glow);
        }
      `}</style>
        </nav>
    );
};

export default Navigation;

import React, { useState, useEffect } from 'react';

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

    return (
        <nav className={`navigation ${scrolled ? 'scrolled glass-panel' : ''}`}>
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
                <li>
                    <button className="btn-nav-cta">Contact us</button>
                </li>
            </ul>

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

        .btn-nav-cta {
            background: rgba(255,255,255,0.1) !important;
            padding: 0.6rem 1.2rem;
            border-radius: var(--radius-sm);
            color: #fff !important;
            border: 1px solid var(--glass-stroke) !important;
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

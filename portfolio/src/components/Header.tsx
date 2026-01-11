import { useState, useEffect } from 'react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Scroll detection for hide/show header
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down
                setIsHeaderVisible(false);
            } else if (currentScrollY < lastScrollY) {
                // Scrolling up
                setIsHeaderVisible(true);
            }
            
            setLastScrollY(currentScrollY);
        };

        // Throttle scroll events for better performance
        let ticking = false;
        const throttledScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });
        
        return () => {
            window.removeEventListener('scroll', throttledScroll);
        };
    }, [lastScrollY]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isMenuOpen &&
                !(event.target as HTMLElement).closest('.mobile-nav') &&
                !(event.target as HTMLElement).closest('.menu-toggle')
            ) {
                closeMenu();
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <header className={`header-container ${isHeaderVisible ? 'visible' : 'hidden'}`}>
            <div className="header-content">
                <h1 className="logo">Leno,Dev</h1>
                
                {/* Desktop Navigation */}
                <nav className="desktop-nav">
                    <ul>
                        <li><a href="#home" onClick={closeMenu}>Home</a></li>
                        <li><a href="#about" onClick={closeMenu}>About</a></li>
                        <li><a href="#project" onClick={closeMenu}>Project</a></li>
                        <li><a href="#contact" onClick={closeMenu}>Contact</a></li>
                    </ul>
                </nav>
                
                {/* Mobile Menu Button */}
                <button 
                    className="menu-toggle" 
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                    aria-expanded={isMenuOpen}
                >
                    <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
                </button>
                
                {/* Mobile Navigation Overlay */}
                <div className={`mobile-nav-overlay ${isMenuOpen ? 'open' : ''}`} onClick={closeMenu}></div>
                
                {/* Mobile Navigation Menu */}
                <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
                    <ul>
                        <li><a href="#home" onClick={closeMenu}>Home</a></li>
                        <li><a href="#about" onClick={closeMenu}>About</a></li>
                        <li><a href="#project" onClick={closeMenu}>Project</a></li>
                        <li><a href="#contact" onClick={closeMenu}>Contact</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
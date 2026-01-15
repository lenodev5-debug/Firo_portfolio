import { useState, useEffect } from 'react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Check login status on mount and when token changes
    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
            
            setIsLoggedIn(!!token);
            if (userData) {
                try {
                    setUser(JSON.parse(userData));
                } catch (error) {
                    console.error('Error parsing user data:', error);
                }
            }
        };

        // Initial check
        checkLoginStatus();

        // Listen for storage changes (e.g., login/logout from other tabs)
        const handleStorageChange = () => {
            checkLoginStatus();
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Check on every render (simpler approach)
        const interval = setInterval(checkLoginStatus, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

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

    const handleDashboardClick = () => {
        closeMenu();
        window.location.href = '/dashboard';
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
                        <li><a href="" onClick={closeMenu}>Home</a></li>
                        <li><a href="about" onClick={closeMenu}>About</a></li>
                        <li><a href="project" onClick={closeMenu}>Project</a></li>
                        <li><a href="contact" onClick={closeMenu}>Contact</a></li>
                        
                        {/* Dashboard/Login buttons for desktop */}
                        {isLoggedIn ? (
                            <>
                                <li>
                                    <button 
                                        className="header-btn dashboard-btn"
                                        onClick={handleDashboardClick}
                                    >
                                        <i className="fas fa-tachometer-alt"></i> Dashboard
                                    </button>
                                </li>
                            </>
                        ) : (
                           null
                        )}
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
                
                <div className={`mobile-nav-overlay ${isMenuOpen ? 'open' : ''}`} onClick={closeMenu}></div>
                
                <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
                    <ul>
                        <li><a href="#home" onClick={closeMenu}>Home</a></li>
                        <li><a href="#about" onClick={closeMenu}>About</a></li>
                        <li><a href="#project" onClick={closeMenu}>Project</a></li>
                        <li><a href="#contact" onClick={closeMenu}>Contact</a></li>
                        
                        <li className="menu-separator"></li>
                        
                        {isLoggedIn ? (
                            <>
                                <li>
                                    <button 
                                        className="header-btn mobile-header-btn dashboard-btn"
                                        onClick={handleDashboardClick}
                                    >
                                        <i className="fas fa-tachometer-alt"></i> Dashboard
                                    </button>
                                </li>
                            </>
                        ) : (
                           null
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
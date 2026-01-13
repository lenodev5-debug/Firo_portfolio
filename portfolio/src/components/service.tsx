import { useEffect, useRef, useState } from 'react';
import CodeIcon from '../assets/icon/web.png';
import DesignIcon from '../assets/icon/graphic-design.png';
import MobileIcon from '../assets/icon/smartphone (2).png';
import DatabaseIcon from '../assets/icon/menu.png';
import ProfileImage from '../assets/icon/ECX_1617_Domain_Hero.png';
import { useMemo } from 'react';

export default function Service() {
    const [animatedHeights, setAnimatedHeights] = useState([0, 0, 0, 0]);
    const chartRefs = useRef<(HTMLDivElement | null)[]>([]);

    const sidebarSkills = [
        { icon: DatabaseIcon, text: "Menu", color: "#4facfe" },
        { icon: CodeIcon, text: "Web", color: "#667eea" },
        { icon: DesignIcon, text: "UI/UX", color: "#764ba2" },
        { icon: MobileIcon, text: "Mobile", color: "#f093fb" }
    ];

    const skills = useMemo(() => [
        { name: "React", level: 95, icon: "⚛️", color: "#FF416C" },
        { name: "TypeScript", level: 60, icon: "📘", color: "#834d9b" },
        { name: "Node.js", level: 89, icon: "🟢", color: "#00b09b" },
        { name: "UI/UX", level: 84, icon: "✨", color: "#8A2387" }
    ], []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            setAnimatedHeights(prev => {
                                const newHeights = [...prev];
                                newHeights[index] = skills[index].level;
                                return newHeights;
                            });
                        }, index * 200);
                    }
                });
            },
            { threshold: 0.5, rootMargin: "0px 0px -100px 0px" }
        );

        chartRefs.current.forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [skills]);

    return (
        <div className="services-container">
            <div className="services-sidebar">
                {sidebarSkills.map((skill, index) => (
                    <div key={index} className="service-sidebar-icon">
                        <img src={skill.icon} alt={skill.text} className="service-icon-img" />
                        <span className="service-icon-text">{skill.text}</span>
                    </div>
                ))}
            </div>

            {/* Main content */}
            <div className="services-main">
                {/* Left side - Profile & Skills */}
                <div className="services-profile-section">
                    <div className="services-profile-circle">
                        <img src={ProfileImage} alt="Firomsa Misagana" />
                    </div>
                    <h1 className="services-profile-name">Firomsa Misagana</h1>
                    <p className="services-profile-title">Full Stack Developer & UI/UX Designer</p>
                    
                    <div className="services-skills-charts">
                        {skills.map((skill, index) => (
                            <div key={index} className="services-chart-item" ref={el => { chartRefs.current[index] = el; }}>
                                <div className="services-skill-bar" data-level={skill.level}>
                                    <div className="services-skill-bar" style={{ height: '200px' }}>
                                        <div 
                                            className="services-skill-fill"
                                            style={{ 
                                                background: skill.color,
                                                height: `${skill.level}%`
                                            }}
                                        ></div>
                                    </div>
                                    <span className="services-skill-level">{skill.level}%</span>
                                </div>
                                <div className="services-skill-name">
                                    <span className="services-skill-icon-emoji">{skill.icon}</span>
                                    <span>{skill.name}</span>
                                </div>
                                <div className="services-skill-dot"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right side - Services Content */}
                <div className="services-content-section">
                    <div className="services-header">
                        <h2>My Services</h2>
                        <p>What I can do for you</p>
                    </div>
                    
                    <div className="services-description">
                        <h1 className="services-main-title">Web Development Services</h1>
                        <p className="services-subtitle">
                            Professional web solutions to help your business grow online.
                        </p>
                        
                        <div className="services-grid">
                            <div className="service-card">
                                <h3>
                                    <span className="service-icon">🌐</span> Frontend
                                </h3>
                                <ul>
                                    <li>Responsive websites</li>
                                    <li>React & Vue.js apps</li>
                                    <li>Mobile design</li>
                                </ul>
                            </div>
                            
                            <div className="service-card">
                                <h3>
                                    <span className="service-icon">⚙️</span> Backend
                                </h3>
                                <ul>
                                    <li>API development</li>
                                    <li>Database setup</li>
                                    <li>Server management</li>
                                </ul>
                            </div>
                            
                            <div className="service-card">
                                <h3>
                                    <span className="service-icon">🔄</span> Full-Stack
                                </h3>
                                <ul>
                                    <li>Complete web apps</li>
                                    <li>E-commerce sites</li>
                                    <li>Custom solutions</li>
                                </ul>
                            </div>
                            
                            <div className="service-card">
                                <h3>
                                    <span className="service-icon">🔧</span> Maintenance
                                </h3>
                                <ul>
                                    <li>Updates & fixes</li>
                                    <li>Performance boost</li>
                                    <li>Security updates</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="services-cta">
                            <p className="cta-text">Need a website, web app or project?</p>
                            <button className="cta-button">Let's talk →</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
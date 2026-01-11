import { useEffect, useRef, useState } from 'react';
import CodeIcon from '../assets/icon/web.png';
import DesignIcon from '../assets/icon/graphic-design.png';
import MobileIcon from '../assets/icon/smartphone (2).png';
import DatabaseIcon from '../assets/icon/menu.png';
import ProfileImage from '../assets/icon/ECX_1617_Domain_Hero.png';

import { useMemo } from 'react';
export default function Service() {
    const [animatedHeights, setAnimatedHeights] = useState([0, 0, 0, 0, 0, 0]);
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
        <div className="about-container">
            <div className="about-sidebar">
                {sidebarSkills.map((skill, index) => (
                    <div key={index} className="skill-icon">
                        <img src={skill.icon} alt={skill.text} className="icon-image" />
                        <span className="icon-text">{skill.text}</span>
                    </div>
                ))}
            </div>

            {/* Main content */}
            <div className="about-main">
                {/* Left side - Profile & Skills */}
                <div className="profile-section">
                    <div className="profile-circle">
                        <img src={ProfileImage} alt="Firomsa Misagana" />
                    </div>
                    <h1 className="profile-name">Firomsa Misagana</h1>
                    <p className="profile-title">Full Stack Developer & UI/UX Designer</p>
                    
                    <div className="skills-charts">
    {skills.map((skill, index) => (
        <div key={index} className="chart-item" ref={el => { chartRefs.current[index] = el; }}>
            <div className="skill-bar" data-level={skill.level}>
<div className="skill-bar" style={{ height: '200px' }}>
    <div 
        className="skill-fill"
        style={{ 
            background: skill.color,
            height: `${skill.level}%` /* Static height, animated by scaleY */
        }}
    ></div>
</div>
                <span className="skill-level">{skill.level}%</span>
            </div>
            <div className="skill-name">
                <span className="skill-icon-emoji">{skill.icon}</span>
                <span>{skill.name}</span>
            </div>
            <div className="skill-dot"></div>
        </div>
    ))}
</div>
                </div>

                {/* Right side - Projects & Info */}
                <div className="projects-section">
    <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '10px' }}>My Services</h2>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>What I can do for you</p>
    </div>
    
    <div className="desc" style={{ padding: '0 20px' }}>
        <h1 style={{ 
            fontSize: '2rem', 
            color: '#222', 
            marginBottom: '15px',
            textAlign: 'center'
        }}>
            Web Development Services
        </h1>
        <p style={{
            color: '#555',
            fontSize: '1rem',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto 40px',
            textAlign: 'center'
        }}>
            Professional web solutions to help your business grow online.
        </p>
        
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '25px',
            marginBottom: '50px'
        }}>
            <div style={{
                background: '#f8f9fa',
                padding: '25px',
                borderRadius: '10px',
                border: '1px solid #eaeaea',
                transition: 'transform 0.3s ease'
            }}>
                <h3 style={{
                    fontSize: '1.3rem',
                    color: '#667eea',
                    marginBottom: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ fontSize: '1.5rem' }}>🌐</span> Frontend Development
                </h3>
                <ul style={{
                    listStyle: 'none',
                    padding: '0',
                    margin: '0'
                }}>
                    <li style={{ padding: '5px 0', color: '#555' }}>• Responsive websites</li>
                    <li style={{ padding: '5px 0', color: '#555' }}>• React & Vue.js apps</li>
                    <li style={{ padding: '5px 0', color: '#555' }}>• Mobile-friendly design</li>
                </ul>
            </div>
            
            <div style={{
                background: '#f8f9fa',
                padding: '25px',
                borderRadius: '10px',
                border: '1px solid #eaeaea',
                transition: 'transform 0.3s ease'
            }}>
                <h3 style={{
                    fontSize: '1.3rem',
                    color: '#764ba2',
                    marginBottom: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ fontSize: '1.5rem' }}>⚙️</span> Backend Development
                </h3>
                <ul style={{
                    listStyle: 'none',
                    padding: '0',
                    margin: '0'
                }}>
                    <li style={{ padding: '5px 0', color: '#555' }}>• API development</li>
                    <li style={{ padding: '5px 0', color: '#555' }}>• Database setup</li>
                    <li style={{ padding: '5px 0', color: '#555' }}>• Server management</li>
                </ul>
            </div>
            
            <div style={{
                background: '#f8f9fa',
                padding: '25px',
                borderRadius: '10px',
                border: '1px solid #eaeaea',
                transition: 'transform 0.3s ease'
            }}>
                <h3 style={{
                    fontSize: '1.3rem',
                    color: '#00b09b',
                    marginBottom: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ fontSize: '1.5rem' }}>🔄</span> Full-Stack Apps
                </h3>
                <ul style={{
                    listStyle: 'none',
                    padding: '0',
                    margin: '0'
                }}>
                    <li style={{ padding: '5px 0', color: '#555' }}>• Complete web apps</li>
                    <li style={{ padding: '5px 0', color: '#555' }}>• E-commerce sites</li>
                    <li style={{ padding: '5px 0', color: '#555' }}>• Custom solutions</li>
                </ul>
            </div>
            
            <div style={{
                background: '#f8f9fa',
                padding: '25px',
                borderRadius: '10px',
                border: '1px solid #eaeaea',
                transition: 'transform 0.3s ease'
            }}>
                <h3 style={{
                    fontSize: '1.3rem',
                    color: '#f093fb',
                    marginBottom: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ fontSize: '1.5rem' }}>🔧</span> Website Maintenance
                </h3>
                <ul style={{
                    listStyle: 'none',
                    padding: '0',
                    margin: '0'
                }}>
                    <li style={{ padding: '5px 0', color: '#555' }}>• Updates & fixes</li>
                    <li style={{ padding: '5px 0', color: '#555' }}>• Performance boost</li>
                    <li style={{ padding: '5px 0', color: '#555' }}>• Security updates</li>
                </ul>
            </div>
        </div>
        
        <div style={{
            textAlign: 'center',
            padding: '30px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '15px',
            color: 'white'
        }}>
            <p style={{
                fontSize: '1.2rem',
                marginBottom: '20px'
            }}>
                Need a website or web app?
            </p>
            <button style={{
                padding: '12px 35px',
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.3s ease'
            }}>
                Let's talk →
            </button>
        </div>
    </div>
</div>
            </div>
        </div>
    );
}
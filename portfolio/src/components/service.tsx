import { useEffect, useRef, useState } from 'react';
import CodeIcon from '../assets/icon/web.png';
import DesignIcon from '../assets/icon/graphic-design.png';
import MobileIcon from '../assets/icon/smartphone (2).png';
import DatabaseIcon from '../assets/icon/menu.png';
import ProfileImage from '../assets/icon/ECX_1617_Domain_Hero.png';

export default function Service({ serviceData }) {
    const [activeTab, setActiveTab] = useState('menu'); // Default to 'menu'
    const [animatedHeights, setAnimatedHeights] = useState([0, 0, 0, 0]);
    const chartRefs = useRef([]);

    const sidebarSkills = [
        { icon: DatabaseIcon, text: "Menu", color: "#4facfe", key: "menu" },
        { icon: CodeIcon, text: "Web", color: "#667eea", key: "web" },
        { icon: DesignIcon, text: "UI/UX", color: "#764ba2", key: "uiux" },
        { icon: MobileIcon, text: "Mobile", color: "#f093fb", key: "mobile" }
    ];

    // Define content for each tab
    const tabContent = {
        menu: {
            title: "My Services",
            subtitle: "What I can do for you",
            mainTitle: "Full Stack Development Services",
            subTitle: "Comprehensive digital solutions to transform your business.",
            skills: [
                { name: "React", level: 95, icon: "⚛️", color: "#FF416C" },
                { name: "TypeScript", level: 60, icon: "📘", color: "#834d9b" },
                { name: "Node.js", level: 89, icon: "🟢", color: "#00b09b" },
                { name: "UI/UX", level: 84, icon: "✨", color: "#8A2387" }
            ],
            services: [
                {
                    title: "🌐 Frontend",
                    items: ["Responsive websites", "React & Vue.js apps", "Mobile design"]
                },
                {
                    title: "⚙️ Backend",
                    items: ["API development", "Database setup", "Server management"]
                },
                {
                    title: "🔄 Full-Stack",
                    items: ["Complete web apps", "E-commerce sites", "Custom solutions"]
                },
                {
                    title: "🔧 Maintenance",
                    items: ["Updates & fixes", "Performance boost", "Security updates"]
                }
            ],
            profileTitle: "Full Stack Developer & UI/UX Designer",
            ctaText: "Need a website, web app or project?",
            buttonText: "Let's talk →"
        },
        web: {
            title: "Web Development",
            subtitle: "Modern web solutions",
            mainTitle: "Web Development Services",
            subTitle: "Professional web solutions to help your business grow online.",
            skills: [
                { name: "HTML/CSS", level: 98, icon: "🎨", color: "#FF416C" },
                { name: "JavaScript", level: 95, icon: "📜", color: "#834d9b" },
                { name: "React", level: 90, icon: "⚛️", color: "#00b09b" },
                // { name: "Next.js", level: 85, icon: "▲", color: "#8A2387" }
            ],
            services: [
                {
                    title: "🌐 Frontend Development",
                    items: ["Responsive Design", "SPA Applications", "Interactive UI"]
                },
                {
                    title: "⚡ Performance",
                    items: ["Fast Loading", "SEO Optimized", "Clean Code"]
                },
                {
                    title: "📱 Mobile Web",
                    items: ["PWA Apps", "Mobile First", "Cross-Browser"]
                },
                {
                    title: "🔗 Integration",
                    items: ["API Integration", "Third-party APIs", "CMS Setup"]
                }
            ],
            profileTitle: "Web Developer & Frontend Specialist",
            ctaText: "Need a professional website?",
            buttonText: "Get a Quote →"
        },
        uiux: {
            title: "UI/UX Design",
            subtitle: "Beautiful user experiences",
            mainTitle: "UI/UX Design Services",
            subTitle: "Creating intuitive and beautiful user interfaces that convert visitors.",
            skills: [
                { name: "Figma", level: 92, icon: "🎨", color: "#FF416C" },
                { name: "Prototyping", level: 88, icon: "✏️", color: "#834d9b" },
                { name: "Wireframing", level: 90, icon: "📐", color: "#00b09b" },
                // { name: "User Research", level: 85, icon: "🔍", color: "#8A2387" }
            ],
            services: [
                {
                    title: "🎨 UI Design",
                    items: ["Modern Interfaces", "Visual Design", "Brand Consistency"]
                },
                {
                    title: "👥 UX Design",
                    items: ["User Research", "User Testing", "Information Architecture"]
                },
                {
                    title: "📱 Mobile UI",
                    items: ["Mobile Apps UI", "Tablet Design", "Touch Optimization"]
                },
                {
                    title: "🔄 Prototyping",
                    items: ["Interactive Prototypes", "User Flows", "Animation Design"]
                }
            ],
            profileTitle: "UI/UX Designer & Product Designer",
            ctaText: "Need a beautiful user interface?",
            buttonText: "Start Project →"
        },
        mobile: {
            title: "Mobile Development",
            subtitle: "Native & cross-platform apps",
            mainTitle: "Mobile App Development",
            subTitle: "Building high-performance mobile applications for iOS and Android.",
            skills: [
                { name: "React Native", level: 90, icon: "⚛️", color: "#FF416C" },
                // { name: "Flutter", level: 80, icon: "🎯", color: "#834d9b" },
                { name: "iOS", level: 75, icon: "📱", color: "#00b09b" },
                { name: "Android", level: 78, icon: "🤖", color: "#8A2387" }
            ],
            services: [
                {
                    title: "📱 Native Apps",
                    items: ["iOS Development", "Android Development", "App Store Deployment"]
                },
                {
                    title: "⚛️ Cross-Platform",
                    items: ["React Native", "Flutter Apps", "Single Codebase"]
                },
                {
                    title: "🔧 App Features",
                    items: ["Push Notifications", "In-App Purchases", "Social Integration"]
                },
                {
                    title: "🔄 Maintenance",
                    items: ["App Updates", "Bug Fixing", "Performance Monitoring"]
                }
            ],
            profileTitle: "Mobile App Developer",
            ctaText: "Need a mobile application?",
            buttonText: "Build App →"
        }
    };

    const currentContent = tabContent[activeTab];
    const skills = currentContent.skills;

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
    }, [skills, activeTab]);

    return (
        <div className="services-container">
            <div className="services-sidebar">
                {sidebarSkills.map((skill, index) => (
                    <div 
                        key={index} 
                        className="service-sidebar-icon"
                        onClick={() => setActiveTab(skill.key)}
                        style={{
                            background: activeTab === skill.key ? skill.color : 'rgba(255, 255, 255, 0)',
                            borderColor: activeTab === skill.key ? skill.color : 'rgba(0, 0, 0, 0.083)',
                            transform: activeTab === skill.key ? 'translateY(-4px)' : 'none'
                        }}
                    >
                        <img 
                            src={skill.icon} 
                            alt={skill.text} 
                            className="service-icon-img" 
                            style={{
                                filter: activeTab === skill.key ? 'brightness(0) invert(1)' : 'brightness(0) invert(1)'
                            }}
                        />
                        <span 
                            className="service-icon-text"
                            style={{
                                opacity: activeTab === skill.key ? 1 : 0,
                                transform: activeTab === skill.key ? 'translateY(0)' : 'translateY(8px)'
                            }}
                        >
                            {skill.text}
                        </span>
                    </div>
                ))}
            </div>

            <div className="services-main" style={{width: "70%", margin: "0 10% 0 100px"}}>
                <div className="services-profile-section">
                    <div className="services-profile-circle">
                        <img src={ProfileImage} alt="Firomsa Misagana" />
                    </div>
                    <h1 className="services-profile-name">Firomsa Misagana</h1>
                    <p className="services-profile-title">{currentContent.profileTitle}</p>
                    
                    <div className="services-skills-charts">
                        {skills.map((skill, index) => (
                            <div key={index} className="services-chart-item" ref={el => { chartRefs.current[index] = el; }}>
                                <div 
                                    className="services-skill-bar" 
                                    data-level={skill.level}
                                    style={{ height: '150px' }}
                                >
                                    <div 
                                        className="services-skill-fill"
                                        style={{ 
                                            background: skill.color,
                                            height: `${animatedHeights[index]}%`,
                                            transition: 'height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                        }}
                                    ></div>
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

                <div className="services-content-section">
                    <div className="services-header">
                        <h2>{currentContent.title}</h2>
                        <p>{currentContent.subtitle}</p>
                    </div>
                    
                    <div className="services-description">
                        <h1 className="services-main-title">{currentContent.mainTitle}</h1>
                        <p className="services-subtitle">
                            {currentContent.subTitle}
                        </p>
                        
                        <div className="services-grid" >
                            {currentContent.services.map((service, index) => (
                                <div key={index} className="service-card" style={{backgroundColor: "#ffffff"}}>
                                    <h3>
                                        <span className="service-icon">{service.title.split(' ')[0]}</span> {service.title.split(' ').slice(1).join(' ')}
                                    </h3>
                                    <ul>
                                        {service.items.map((item, itemIndex) => (
                                            <li key={itemIndex}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        
                        <div className="services-cta">
                            <p className="cta-text">{currentContent.ctaText}</p>
                            <button className="cta-button">{currentContent.buttonText}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
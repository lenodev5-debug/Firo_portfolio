import { useState } from 'react';

export default function About() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const experiences = [
        { skill: 'HTML', years: 4, description: 'Semantic markup, accessibility, modern HTML5 features' },
        { skill: 'CSS', years: 4, description: 'Responsive design, CSS Grid, Flexbox, animations' },
        { skill: 'JavaScript', years: 3, description: 'ES6+, async programming, modern frameworks' },
        { skill: 'React', years: 2, description: 'Hooks, Context API, React Router, state management' },
        { skill: 'Node.js', years: 2, description: 'Backend development, REST APIs, Express.js' },
        { skill: 'Express', years: 2, description: 'Middleware, routing, API development' },
    ];

    return (
        <div className="about-container">
            <div className="section-about">
                <div className="profile-image"></div>
                <h1>Leno,dev</h1>
                <p className="tagline" style={{textAlign: "center", color:"#ffffff"}}>Full-stack Developer & UI/UX Enthusiast</p>
                <div className="contact-icons">
                    <a href="#" className="social-link">
                        <img src="../src/assets/icon/socialmedia/instagram (1).png" alt="Instagram" />
                    </a>
                    <a href="#" className="social-link">
                        <img src="../src/assets/icon/socialmedia/facebook.png" alt="Facebook" />
                    </a>
                    <a href="#" className="social-link">
                        <img src="../src/assets/icon/socialmedia/linkedin (1).png" alt="LinkedIn" />
                    </a>
                </div>
            </div>
            <div className="section-about">
                <h1 className="h1-two">About Me</h1>
                <p className="description" style={{ width:"100%"}}>
                    I'm a passionate frontend developer with over 4 years of experience creating 
                    engaging, user-centered web applications. I specialize in translating design 
                    concepts into seamless, performant digital experiences using modern web technologies. 
                    My approach combines technical expertise with an eye for detail to deliver 
                    solutions that are both functional and aesthetically pleasing.
                </p>
                <div className="experience-grid">
                    {experiences.map((exp, index) => (
                        <div 
                            key={index}
                            className="experience-card"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onFocus={() => setHoveredIndex(index)}
                            onBlur={() => setHoveredIndex(null)}
                            tabIndex={0}
                        >
                            <div className="card-content">
                                <div className="skill-header">
                                    <h3>{exp.skill}</h3>
                                    <span className="years-badge">{exp.years} years</span>
                                </div>
                                <div className={`card-expand ${hoveredIndex === index ? 'expanded' : ''}`} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                                    <p className="skill-description">{exp.description}</p>
                                    <div className="years-progress">
                                        <div 
                                            className="progress-fill" 
                                            style={{ width: `${(exp.years / 4) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="contact-btn">Contact me</button>
            </div>
        </div>
    );
}
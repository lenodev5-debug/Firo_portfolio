
import { useState } from "react";

import IG from "../assets/icon/socialmedia/instagram (1).png";
import FB from "../assets/icon/socialmedia/facebook.png";
import LD from "../assets/icon/socialmedia/linkedin (1).png";
import "../style/about.css";

const experiences = [
    {
        skill: "HTML",
        years: 4,
        description: "Semantic markup, accessibility, and modern HTML5 features.",
    },
    {
        skill: "CSS",
        years: 4,
        description: "Responsive design, CSS Grid, Flexbox, and animations.",
    },
    {
        skill: "JavaScript",
        years: 3,
        description: "ES6+, asynchronous programming, and modern JavaScript.",
    },
    {
        skill: "React",
        years: 2,
        description: "Hooks, Context API, React Router, and state management.",
    },
    {
        skill: "Node.js",
        years: 2,
        description: "Backend development, REST APIs, and server-side JavaScript.",
    },
    {
        skill: "Express",
        years: 2,
        description: "Middleware, routing, and REST API development.",
    },
];

export default function About() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section className="ab-container" id="about">
            <aside className="ab-profile">
                <div className="ab-profile-image" aria-label="Profile initials">
                    <span>FM</span>
                </div>

                <p className="ab-profile-label">ABOUT THE DEVELOPER</p>

                <h1 className="ab-profile-name">Leno,dev</h1>

                <p className="ab-tagline">
                    Full-Stack Developer
                    <span className="ab-tagline-divider">·</span>
                    UI/UX Enthusiast
                </p>

                <p className="ab-profile-summary">
                    I build practical digital experiences by combining
                    creative design with reliable web technologies.
                </p>

                <div className="ab-contact-icons" aria-label="Social media links">
                    <a href="#" className="ab-social-link" aria-label="Instagram" title="Instagram">
                        <img src={IG} alt="" />
                    </a>

                    <a href="#" className="ab-social-link" aria-label="Facebook" title="Facebook">
                        <img src={FB} alt="" />
                    </a>

                    <a href="#" className="ab-social-link" aria-label="LinkedIn" title="LinkedIn">
                        <img src={LD} alt="" />
                    </a>
                </div>

                <div className="ab-profile-divider" />

                <div className="ab-profile-stat">
                    <span className="ab-profile-stat-number">06</span>
                    <span className="ab-profile-stat-label">
                        Core technologies
                    </span>
                </div>
            </aside>

            <div className="ab-details">
                <header className="ab-heading">
                    <p className="ab-eyebrow">GET TO KNOW ME</p>

                    <h2 className="ab-title">
                        About <span>Me.</span>
                    </h2>

                    <p className="ab-description">
                        I'm a passionate developer focused on creating
                        engaging, user-centered web applications. I enjoy
                        turning ideas and design concepts into responsive,
                        accessible, and performant digital experiences.

                        My approach combines technical problem-solving with
                        attention to detail to build products that look good
                        and work reliably.
                    </p>
                </header>

                <div className="ab-skills-heading">
                    <div>
                        <p className="ab-eyebrow">MY TOOLKIT</p>
                        <h3>Experience &amp; Skills</h3>
                    </div>

                    <span className="ab-skills-count">06 skills</span>
                </div>

                <div className="ab-experience-grid">
                    {experiences.map((exp, index) => (
                        <article
                            key={exp.skill}
                            className={`ab-experience-card ${
                                hoveredIndex === index ? "ab-is-active" : ""
                            }`}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onFocus={() => setHoveredIndex(index)}
                            onBlur={(event) => {
                                if (
                                    !event.currentTarget.contains(
                                        event.relatedTarget as Node | null
                                    )
                                ) {
                                    setHoveredIndex(null);
                                }
                            }}
                            tabIndex={0}
                        >
                            <div className="ab-skill-header">
                                <h4>{exp.skill}</h4>

                                <span className="ab-years-badge">
                                    {exp.years}{" "}
                                    {exp.years === 1 ? "year" : "years"}
                                </span>
                            </div>

                            <p className="ab-skill-description">
                                {exp.description}
                            </p>

                            <div
                                className="ab-years-progress"
                                role="progressbar"
                                aria-label={`${exp.skill} experience`}
                                aria-valuemin={0}
                                aria-valuemax={4}
                                aria-valuenow={exp.years}
                            >
                                <div
                                    className="ab-progress-fill"
                                    style={{
                                        width: `${(exp.years / 4) * 100}%`,
                                    }}
                                />
                            </div>
                        </article>
                    ))}
                </div>

                <footer className="ab-footer">
                    <p>
                        Have a project in mind? Let's build something
                        meaningful.
                    </p>

                    <a className="ab-contact-btn" href="#contact">
                        Contact me
                        <span aria-hidden="true">↗</span>
                    </a>
                </footer>
            </div>
        </section>
    );
}

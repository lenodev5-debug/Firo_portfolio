import { useState, useEffect } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        projectType: 'web',
        budget: '',
        timeline: '',
        message: ''
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [activeFaq, setActiveFaq] = useState(null);

    useEffect(() => {
        // Create animated background particles
        const container = document.querySelector('.contact-bg-animation');
        if (container) {
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'contact-particle';
                particle.style.width = `${Math.random() * 100 + 50}px`;
                particle.style.height = particle.style.width;
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 20}s`;
                particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
                container.appendChild(particle);
            }
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({
            name: '',
            email: '',
            phone: '',
            projectType: 'web',
            budget: '',
            timeline: '',
            message: ''
        });
        
        setTimeout(() => setSubmitSuccess(false), 5000);
    };

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    const faqItems = [
        {
            question: "What's your typical response time?",
            answer: "I usually respond within 24 hours during business days. For urgent inquiries, please mention 'URGENT' in your subject line."
        },
        {
            question: "Do you work with international clients?",
            answer: "Yes! I've worked with clients from over 15 countries. Timezone differences aren't an issue with proper planning and communication."
        },
        {
            question: "What's your design process?",
            answer: "I follow a 5-step process: Discovery → Research → Design → Development → Launch & Support. Each phase includes client collaboration."
        },
        {
            question: "Do you provide ongoing support?",
            answer: "Absolutely! I offer maintenance packages and retainer agreements for clients who need ongoing support and updates."
        },
        {
            question: "What design tools do you use?",
            answer: "My primary tools are Figma, Adobe Creative Suite, VS Code, and various prototyping tools. I'm tool-agnostic and adapt to project needs."
        }
    ];

    return (
        <div className="contact-container">
            <div className="contact-bg-animation"></div>
            
            <div className="contact-content">
                {/* Header */}
                <div className="contact-header">
                    <p className="contact-subtitle">Get In Touch</p>
                    <p className="contact-description">
                        Have a project in mind? Let's collaborate and bring your ideas to life. 
                        Whether it's a website, mobile app, or brand design, I'm here to help.
                    </p>
                </div>

                <div className="contact-grid">
                    {/* Contact Information */}
                    <div className="contact-info">
                        <div className="info-cards">
                            <div className="info-card">     
                                <div className="card-icon">
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <h3 className="card-title">Email Me</h3>
                                <p className="card-content">For project inquiries, collaboration, or just to say hello</p>
                                <a href="mailto:hello@yourportfolio.com" className="card-link">
                                    hello@yourportfolio.com
                                    <i className="fas fa-arrow-right"></i>
                                </a>
                            </div>

                            <div className="info-card">
                                <div className="card-icon">
                                    <i className="fas fa-phone"></i>
                                </div>
                                <h3 className="card-title">Call Me</h3>
                                <p className="card-content">Available for calls Monday to Friday, 9 AM - 6 PM EST</p>
                                <a href="tel:+15551234567" className="card-link">
                                    +1 (555) 123-4567
                                    <i className="fas fa-arrow-right"></i>
                                </a>
                            </div>

                            <div className="info-card">
                                <div className="card-icon">
                                    <i className="fas fa-map-marker-alt"></i>
                                </div>
                                <h3 className="card-title">Location</h3>
                                <p className="card-content">Based in San Francisco, CA<br />Working with clients worldwide</p>
                                <a href="#" className="card-link">
                                    View on Map
                                    <i className="fas fa-arrow-right"></i>
                                </a>
                            </div>

                            <div className="info-card">
                                <div className="card-icon">
                                    <i className="fas fa-calendar-alt"></i>
                                </div>
                                <h3 className="card-title">Schedule a Call</h3>
                                <p className="card-content">Book a 30-minute discovery call to discuss your project</p>
                                <a href="#" className="card-link">
                                    Book Now
                                    <i className="fas fa-arrow-right"></i>
                                </a>
                            </div>
                        </div>

                        {/* Availability Status */}
                        <div className="availability">
                            <div className="status-indicator">
                                <div className="status-dot"></div>
                                <span className="status-text">Currently Available for New Projects</span>
                            </div>
                            <p className="status-note">Response time: Within 24 hours</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-section">
                        <div className="form-header">
                            <h3>Start Your Project</h3>
                            <p>Fill out the form below and I'll get back to you as soon as possible.</p>
                        </div>

                        {submitSuccess ? (
                            <div className="success-message">
                                <div className="success-icon">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <h3>Message Sent Successfully!</h3>
                                <p>Thank you for reaching out. I'll review your message and get back to you within 24 hours.</p>
                            </div>
                        ) : (
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Your Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label className="form-label">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label className="form-label">Project Type *</label>
                                        <div className="project-types">
                                            {['web', 'mobile', 'branding'].map(type => (
                                                <div key={type} className="type-option">
                                                    <input
                                                        type="radio"
                                                        id={type}
                                                        name="projectType"
                                                        value={type}
                                                        checked={formData.projectType === type}
                                                        onChange={handleInputChange}
                                                        className="type-radio"
                                                    />
                                                    <label htmlFor={type} className="type-label">
                                                        {type === 'web' && 'Web Design'}
                                                        {type === 'mobile' && 'Mobile App'}
                                                        {type === 'branding' && 'Branding'}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Budget Range</label>
                                        <select
                                            name="budget"
                                            value={formData.budget}
                                            onChange={handleInputChange}
                                            className="form-input"
                                        >
                                            <option value="">Select budget</option>
                                            <option value="$1k-5k">$1,000 - $5,000</option>
                                            <option value="$5k-15k">$5,000 - $15,000</option>
                                            <option value="$15k-30k">$15,000 - $30,000</option>
                                            <option value="$30k+">$30,000+</option>
                                        </select>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label className="form-label">Timeline</label>
                                        <select
                                            name="timeline"
                                            value={formData.timeline}
                                            onChange={handleInputChange}
                                            className="form-input"
                                        >
                                            <option value="">Select timeline</option>
                                            <option value="ASAP">ASAP</option>
                                            <option value="1-2months">1-2 Months</option>
                                            <option value="3-6months">3-6 Months</option>
                                            <option value="6+months">6+ Months</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Project Details *</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className="form-textarea"
                                        placeholder="Tell me about your project, goals, and any specific requirements..."
                                        required
                                    ></textarea>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Attach Files (Optional)</label>
                                    <input
                                        type="file"
                                        className="form-input"
                                        multiple
                                        accept=".pdf,.jpg,.png,.fig,.psd,.ai,.xd"
                                    />
                                    <small className="form-note">Accepted: PDF, JPG, PNG, FIG, PSD, AI, XD (Max 10MB each)</small>
                                </div>

                                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <span className="form-loading"></span>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-paper-plane"></i>
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="contact-faq">
                    <h3 className="faq-title">Frequently Asked Questions</h3>
                    <div className="faq-grid">
                        {faqItems.map((item, index) => (
                            <div 
                                key={index} 
                                className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                                onClick={() => toggleFaq(index)}
                            >
                                <div className="faq-question">
                                    <span>{item.question}</span>
                                    <span className="faq-toggle">
                                        <i className="fas fa-plus"></i>
                                    </span>
                                </div>
                                <div className="faq-answer">
                                    <p>{item.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Social Links */}
                <div className="contact-social-footer">
                    <p className="social-footer-title">Or connect with me on</p>
                    <div className="social-footer-links">
                        <a href="https://dribbble.com" className="social-footer-link" aria-label="Dribbble">
                            <i className="fab fa-dribbble"></i>
                        </a>
                        <a href="https://github.com" className="social-footer-link" aria-label="GitHub">
                            <i className="fab fa-github"></i>
                        </a>
                        <a href="https://behance.net" className="social-footer-link" aria-label="Behance">
                            <i className="fab fa-behance"></i>
                        </a>
                        <a href="https://linkedin.com" className="social-footer-link" aria-label="LinkedIn">
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                        <a href="https://twitter.com" className="social-footer-link" aria-label="Twitter">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="https://instagram.com" className="social-footer-link" aria-label="Instagram">
                            <i className="fab fa-instagram"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
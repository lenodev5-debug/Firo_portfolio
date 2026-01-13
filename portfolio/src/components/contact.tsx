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
    
    const [files, setFiles] = useState<FileList | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    // Animated background particles
    useEffect(() => {
        const createParticles = () => {
            const container = document.querySelector('.contact-bg-animation');
            if (!container) return;

            // Clear existing particles
            container.innerHTML = '';

            // Create 20 particles
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'contact-particle';
                particle.style.width = `${Math.random() * 100 + 50}px`;
                particle.style.height = particle.style.width;
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 20}s`;
                particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
                container.appendChild(particle);
            }
        };

        createParticles();
        
        // Recreate particles on window resize
        const handleResize = () => createParticles();
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(e.target.files);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        try {
            // Validate required fields
            if (!formData.name || !formData.email || !formData.message) {
                throw new Error('Please fill in all required fields');
            }

            // Create FormData object
            const formDataToSend = new FormData();
            
            // Append form data
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('projectType', formData.projectType);
            formDataToSend.append('budget', formData.budget);
            formDataToSend.append('timeline', formData.timeline);
            formDataToSend.append('message', formData.message);
            
            // Append files if any
            if (files) {
                // Validate file size (max 10MB each)
                for (let i = 0; i < files.length; i++) {
                    if (files[i].size > 10 * 1024 * 1024) {
                        throw new Error(`File "${files[i].name}" exceeds 10MB limit`);
                    }
                    formDataToSend.append('files', files[i]);
                }
            }

            // Send POST request to backend
            const response = await fetch('http://localhost:4444/api/users/contact', {
                method: 'POST',
                body: formDataToSend,
                // Note: Don't set Content-Type header for FormData
            });

            // Check if server is reachable
            if (!response.ok) {
                if (response.status === 0) {
                    throw new Error('Cannot connect to server. Please make sure the backend is running on port 4444.');
                }
                
                let errorData;
                try {
                    errorData = await response.json();
                } catch {
                    errorData = { message: `Server error: ${response.status}` };
                }
                throw new Error(errorData.message || `Server error: ${response.status}`);
            }

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || 'Failed to send message');
            }

            // Success
            setIsSubmitting(false);
            setSubmitSuccess(true);
            
            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                projectType: 'web',
                budget: '',
                timeline: '',
                message: ''
            });
            
            // Reset file input
            setFiles(null);
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) {
                fileInput.value = '';
            }
            
            // Auto-hide success message after 5 seconds
            setTimeout(() => setSubmitSuccess(false), 5000);
            
        } catch (error) {
            console.error('Error submitting form:', error);
            setIsSubmitting(false);
            
            // Show user-friendly error messages
            let errorMessage = 'Failed to send message. Please try again.';
            
            if (error instanceof Error) {
                if (error.message.includes('Failed to fetch') || 
                    error.message.includes('CONNECTION_REFUSED') ||
                    error.message.includes('Cannot connect to server')) {
                    errorMessage = 'Cannot connect to server. Please make sure:';
                } else if (error.message.includes('Network request failed')) {
                    errorMessage = 'Network error. Please check your internet connection.';
                } else {
                    errorMessage = error.message;
                }
            }
            
            setError(errorMessage);
            
            // Auto-hide error after 8 seconds
            setTimeout(() => setError(null), 8000);
        }
    };

    const toggleFaq = (index: number) => {
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

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            projectType: e.target.value
        }));
    };

    return (
        <div className="contact-container">
            <div className="contact-bg-animation"></div>
            
            {/* Error Message Display */}
            {error && (
                <div className="error-message">
                    <div className="error-icon">
                        <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <div className="error-content">
                        <h4 className="error-title">Error Sending Message</h4>
                        <p className="error-text">{error}</p>
                        {error.includes('Cannot connect to server') && (
                            <div className="error-suggestions">
                                <ul>
                                    <li>Make sure backend server is running</li>
                                    <li>Check if MongoDB is running</li>
                                    <li>Verify port 4444 is available</li>
                                    <li>Try restarting the backend server</li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <button className="error-close" onClick={() => setError(null)}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            )}
            
            <div className="contact-content">
                {/* Header */}
                <div className="contact-header">
                    <h1 className="contact-title">Get In Touch</h1>
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
                                <a href="mailto:firomsa.misagana@example.com" className="card-link">
                                    firomsa.misagana@example.com
                                    <i className="fas fa-arrow-right"></i>
                                </a>
                            </div>

                            <div className="info-card">
                                <div className="card-icon">
                                    <i className="fas fa-phone"></i>
                                </div>
                                <h3 className="card-title">Call Me</h3>
                                <p className="card-content">Available for calls Monday to Friday, 9 AM - 6 PM EST</p>
                                <a href="tel:+251912345678" className="card-link">
                                    +251 912 345 678
                                    <i className="fas fa-arrow-right"></i>
                                </a>
                            </div>

                            <div className="info-card">
                                <div className="card-icon">
                                    <i className="fas fa-map-marker-alt"></i>
                                </div>
                                <h3 className="card-title">Location</h3>
                                <p className="card-content">Based in Addis Ababa, Ethiopia<br />Working with clients worldwide</p>
                                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="card-link">
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
                                <a href="#" className="card-link" onClick={(e) => {
                                    e.preventDefault();
                                    alert('Schedule call feature coming soon!');
                                }}>
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
                                <button 
                                    className="back-to-form-btn"
                                    onClick={() => setSubmitSuccess(false)}
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form className="contact-form" onSubmit={handleSubmit} noValidate>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Your Name <span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            placeholder="John Doe"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label className="form-label">
                                            Email Address <span className="required">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            placeholder="john@example.com"
                                            required
                                            disabled={isSubmitting}
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
                                            placeholder="+251 912 345 678"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label className="form-label">
                                            Project Type <span className="required">*</span>
                                        </label>
                                        <div className="project-types">
                                            <div className="type-option">
                                                <input
                                                    type="radio"
                                                    id="web"
                                                    name="projectType"
                                                    value="web"
                                                    checked={formData.projectType === 'web'}
                                                    onChange={handleRadioChange}
                                                    className="type-radio"
                                                    disabled={isSubmitting}
                                                />
                                                <label htmlFor="web" className="type-label">
                                                    Web Design
                                                </label>
                                            </div>
                                            <div className="type-option">
                                                <input
                                                    type="radio"
                                                    id="mobile"
                                                    name="projectType"
                                                    value="mobile"
                                                    checked={formData.projectType === 'mobile'}
                                                    onChange={handleRadioChange}
                                                    className="type-radio"
                                                    disabled={isSubmitting}
                                                />
                                                <label htmlFor="mobile" className="type-label">
                                                    Mobile App
                                                </label>
                                            </div>
                                            <div className="type-option">
                                                <input
                                                    type="radio"
                                                    id="branding"
                                                    name="projectType"
                                                    value="branding"
                                                    checked={formData.projectType === 'branding'}
                                                    onChange={handleRadioChange}
                                                    className="type-radio"
                                                    disabled={isSubmitting}
                                                />
                                                <label htmlFor="branding" className="type-label">
                                                    Branding
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Budget Range <span className="required">*</span>
                                        </label>
                                        <select
                                            name="budget"
                                            value={formData.budget}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            required
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Select budget</option>
                                            <option value="$1k-5k">$1,000 - $5,000</option>
                                            <option value="$5k-15k">$5,000 - $15,000</option>
                                            <option value="$15k-30k">$15,000 - $30,000</option>
                                            <option value="$30k+">$30,000+</option>
                                        </select>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label className="form-label">
                                            Timeline <span className="required">*</span>
                                        </label>
                                        <select
                                            name="timeline"
                                            value={formData.timeline}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            required
                                            disabled={isSubmitting}
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
                                    <label className="form-label">
                                        Project Details <span className="required">*</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className="form-textarea"
                                        placeholder="Tell me about your project, goals, and any specific requirements..."
                                        rows={4}
                                        required
                                        disabled={isSubmitting}
                                    ></textarea>
                                    <small className="char-count">
                                        {formData.message.length}/500 characters
                                    </small>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Attach Files (Optional)</label>
                                    <input
                                        type="file"
                                        className="form-input-file"
                                        multiple
                                        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.fig,.psd,.ai,.xd,.doc,.docx,.txt"
                                        onChange={handleFileChange}
                                        disabled={isSubmitting}
                                    />
                                    <small className="form-note">
                                        Accepted: PDF, Images, Design files (Max 10MB each, up to 3 files)
                                        {files && files.length > 0 && (
                                            <span className="file-count"> - {files.length} file(s) selected</span>
                                        )}
                                    </small>
                                </div>

                                <button 
                                    type="submit" 
                                    className="submit-btn" 
                                    disabled={isSubmitting}
                                >
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
                                        <i className={`fas ${activeFaq === index ? 'fa-minus' : 'fa-plus'}`}></i>
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
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-footer-link" aria-label="GitHub">
                            <i className="fab fa-github"></i>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-footer-link" aria-label="LinkedIn">
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-footer-link" aria-label="Twitter">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-footer-link" aria-label="Instagram">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" className="social-footer-link" aria-label="Dribbble">
                            <i className="fab fa-dribbble"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
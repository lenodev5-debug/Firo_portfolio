export default function ContactPage() {
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Message sent successfully! We\'ll get back to you soon.');
  };

  return (
    <div className="contact-container">
      {/* Hero Section */}
      <div className="contact-hero">
        <h1 className="hero-title">Let's Create Something Amazing Together</h1>
        <p className="hero-subtitle">Get in touch with our team of web, software, and design experts</p>
      </div>

      <div className="contact-content">
        {/* Contact Info Cards */}
        <div className="contact-info-grid">
          <div className="info-card">
            <div className="card-icon">📧</div>
            <h3>Email Us</h3>
            <p>For general inquiries</p>
            <a href="mailto:info@creativestudio.com" className="contact-link">info@creativestudio.com</a>
            <a href="mailto:support@creativestudio.com" className="contact-link">support@creativestudio.com</a>
          </div>

          <div className="info-card">
            <div className="card-icon">📱</div>
            <h3>Call Us</h3>
            <p>Mon-Fri, 9AM-6PM EST</p>
            <a href="tel:+15551234567" className="contact-link">+1 (555) 123-4567</a>
            <p className="small-text">Emergency: +1 (555) 987-6543</p>
          </div>

          <div className="info-card">
            <div className="card-icon">📍</div>
            <h3>Visit Us</h3>
            <p>Our studio location</p>
            <address>
              123 Design Avenue<br />
              Creative District<br />
              San Francisco, CA 94107
            </address>
          </div>

          <div className="info-card">
            <div className="card-icon">💬</div>
            <h3>Live Chat</h3>
            <p>Available 24/7</p>
            <button className="chat-button">Start Live Chat</button>
            <p className="small-text">Average response: 2 minutes</p>
          </div>
        </div>

        {/* Main Contact Section */}
        <div className="contact-main">
          {/* Contact Form */}
          <div className="contact-form-container">
            <h2>Send Us a Message</h2>
            <p className="form-description">
              Have a project in mind? Fill out the form below and we'll get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    required 
                    placeholder="John"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    required 
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  placeholder="john@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">Company Name</label>
                <input 
                  type="text" 
                  id="company" 
                  name="company" 
                  placeholder="Your Company Inc."
                />
              </div>

              <div className="form-group">
                <label htmlFor="service">Service Interested In *</label>
                <select id="service" name="service" required>
                  <option value="">Select a service</option>
                  <option value="web">Web Development</option>
                  <option value="software">Software Solutions</option>
                  <option value="design">Graphic Design</option>
                  <option value="full">Full Package</option>
                  <option value="consultation">Consultation</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="budget">Project Budget *</label>
                <div className="budget-options">
                  <label className="budget-option">
                    <input type="radio" name="budget" value="1-5k" required />
                    <span>$1K - $5K</span>
                  </label>
                  <label className="budget-option">
                    <input type="radio" name="budget" value="5-15k" />
                    <span>$5K - $15K</span>
                  </label>
                  <label className="budget-option">
                    <input type="radio" name="budget" value="15-50k" />
                    <span>$15K - $50K</span>
                  </label>
                  <label className="budget-option">
                    <input type="radio" name="budget" value="50k+" />
                    <span>$50K+</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Project Details *</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="6" 
                  required 
                  placeholder="Tell us about your project, timeline, and any specific requirements..."
                ></textarea>
              </div>

              <div className="form-group">
                <label className="file-upload">
                  <input type="file" name="attachment" multiple />
                  <span>📎 Attach Files (Optional)</span>
                  <small>Upload design files, briefs, or references (Max: 10MB)</small>
                </label>
              </div>

              <div className="form-group checkbox-group">
                <input type="checkbox" id="newsletter" name="newsletter" />
                <label htmlFor="newsletter">Subscribe to our newsletter for design tips and updates</label>
              </div>

              <button type="submit" className="submit-button">
                Send Message
                <span className="arrow">→</span>
              </button>
            </form>
          </div>

          {/* Sidebar - Team & FAQ */}
          <div className="contact-sidebar">
            {/* Team Section */}
            <div className="team-section">
              <h3>Our Core Team</h3>
              <div className="team-members">
                <div className="team-member">
                  <div className="member-avatar">👨‍💻</div>
                  <div className="member-info">
                    <h4>Alex Morgan</h4>
                    <p>Lead Web Developer</p>
                  </div>
                </div>
                <div className="team-member">
                  <div className="member-avatar">👩‍🎨</div>
                  <div className="member-info">
                    <h4>Sarah Chen</h4>
                    <p>Creative Director</p>
                  </div>
                </div>
                <div className="team-member">
                  <div className="member-avatar">👨‍💼</div>
                  <div className="member-info">
                    <h4>Michael Rodriguez</h4>
                    <p>Software Architect</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="faq-section">
              <h3>Quick Answers</h3>
              <div className="faq-item">
                <h4>What's your typical response time?</h4>
                <p>We respond to all inquiries within 24 hours during business days.</p>
              </div>
              <div className="faq-item">
                <h4>Do you offer free consultations?</h4>
                <p>Yes! We offer a 30-minute free consultation for new projects.</p>
              </div>
              <div className="faq-item">
                <h4>What industries do you work with?</h4>
                <p>Startups, SaaS, E-commerce, Healthcare, Education, and more.</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="social-section">
              <h3>Connect With Us</h3>
              <div className="social-links">
                <a href="#" className="social-link">𝕏 Twitter</a>
                <a href="#" className="social-link">📘 Facebook</a>
                <a href="#" className="social-link">📷 Instagram</a>
                <a href="#" className="social-link">💼 LinkedIn</a>
                <a href="#" className="social-link">📺 YouTube</a>
                <a href="#" className="social-link">🐙 GitHub</a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <h2>Find Our Studio</h2>
          <div className="map-placeholder">
            <div className="map-content">
              <div className="map-marker">📍</div>
              <h3>Creative Studio HQ</h3>
              <p>123 Design Avenue, Creative District</p>
              <p>San Francisco, CA 94107</p>
              <button className="directions-button">Get Directions</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .contact-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .contact-hero {
          text-align: center;
          padding: 60px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          margin-bottom: 60px;
          color: white;
        }

        .hero-title {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .hero-subtitle {
          font-size: 20px;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        .contact-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          margin-bottom: 60px;
        }

        .info-card {
          background: white;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-align: center;
        }

        .info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .card-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .info-card h3 {
          font-size: 22px;
          margin-bottom: 10px;
          color: #333;
        }

        .info-card p {
          color: #666;
          margin-bottom: 15px;
        }

        .contact-link {
          display: block;
          color: #667eea;
          text-decoration: none;
          margin: 8px 0;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .contact-link:hover {
          color: #764ba2;
        }

        .small-text {
          font-size: 14px;
          color: #888;
          margin-top: 10px;
        }

        .chat-button {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          margin: 15px 0;
          transition: transform 0.3s ease;
        }

        .chat-button:hover {
          transform: scale(1.05);
        }

        .contact-main {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 60px;
          margin-bottom: 60px;
        }

        @media (max-width: 1024px) {
          .contact-main {
            grid-template-columns: 1fr;
          }
        }

        .contact-form-container {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.1);
        }

        .contact-form-container h2 {
          font-size: 32px;
          margin-bottom: 15px;
          color: #333;
        }

        .form-description {
          color: #666;
          margin-bottom: 30px;
          font-size: 16px;
          line-height: 1.6;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }

        .form-group input[type="text"],
        .form-group input[type="email"],
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 16px;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .budget-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 10px;
        }

        .budget-option {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .budget-option:hover {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.05);
        }

        .budget-option input[type="radio"] {
          margin: 0;
        }

        .file-upload {
          display: block;
          padding: 20px;
          border: 2px dashed #e0e0e0;
          border-radius: 10px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.3s ease;
        }

        .file-upload:hover {
          border-color: #667eea;
        }

        .file-upload input[type="file"] {
          display: none;
        }

        .file-upload span {
          font-weight: 600;
          color: #667eea;
        }

        .file-upload small {
          display: block;
          color: #888;
          margin-top: 5px;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .checkbox-group input[type="checkbox"] {
          width: 18px;
          height: 18px;
        }

        .submit-button {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 18px 40px;
          border-radius: 50px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          transition: all 0.3s ease;
          margin-top: 20px;
        }

        .submit-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(102, 126, 234, 0.3);
        }

        .arrow {
          font-size: 20px;
          transition: transform 0.3s ease;
        }

        .submit-button:hover .arrow {
          transform: translateX(5px);
        }

        .contact-sidebar {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .team-section,
        .faq-section,
        .social-section {
          background: white;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .team-section h3,
        .faq-section h3,
        .social-section h3 {
          font-size: 22px;
          margin-bottom: 25px;
          color: #333;
        }

        .team-members {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .team-member {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .member-avatar {
          font-size: 32px;
          width: 60px;
          height: 60px;
          background: linear-gradient(45deg, #667eea20, #764ba220);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .member-info h4 {
          margin: 0;
          font-size: 16px;
          color: #333;
        }

        .member-info p {
          margin: 5px 0 0;
          color: #666;
          font-size: 14px;
        }

        .faq-item {
          margin-bottom: 25px;
          padding-bottom: 25px;
          border-bottom: 1px solid #eee;
        }

        .faq-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .faq-item h4 {
          font-size: 16px;
          margin-bottom: 10px;
          color: #333;
        }

        .faq-item p {
          color: #666;
          font-size: 14px;
          line-height: 1.5;
        }

        .social-links {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .social-link {
          display: block;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 10px;
          text-decoration: none;
          color: #333;
          font-weight: 500;
          text-align: center;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          transform: translateY(-2px);
        }

        .map-section {
          margin-top: 60px;
        }

        .map-section h2 {
          text-align: center;
          font-size: 36px;
          margin-bottom: 40px;
          color: #333;
        }

        .map-placeholder {
          height: 400px;
          background: linear-gradient(135deg, #667eea20, #764ba220);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .map-content {
          text-align: center;
          background: white;
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
        }

        .map-marker {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .map-content h3 {
          margin: 0 0 10px;
          color: #333;
        }

        .map-content p {
          color: #666;
          margin: 5px 0;
        }

        .directions-button {
          margin-top: 20px;
          padding: 12px 30px;
          background: #333;
          color: white;
          border: none;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .directions-button:hover {
          background: #667eea;
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 32px;
          }

          .hero-subtitle {
            font-size: 16px;
          }

          .contact-hero {
            padding: 40px 20px;
          }

          .contact-form-container {
            padding: 25px;
          }

          .contact-form-container h2 {
            font-size: 28px;
          }
        }

        @media (max-width: 480px) {
          .contact-info-grid {
            grid-template-columns: 1fr;
          }

          .budget-options {
            grid-template-columns: 1fr;
          }

          .social-links {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
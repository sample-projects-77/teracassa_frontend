import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <Navbar />
      
      {/* Hero Banner Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">About TerraCasa</h1>
          <p className="about-hero-subtitle">
            More than a platform – The secure foundation for international life dreams.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="about-content">
        <div className="about-container">
          {/* Mission Section */}
          <div className="about-section">
            <h2 className="about-section-title">Our Mission</h2>
            <p className="about-section-text">
              Buying an international property should be a journey of trust. 
              At TerraCasa, we understand that you're not just buying a house, but 
              realizing a dream. That's why we offer you not just a platform, 
              but a comprehensive knowledge base that helps you learn about countries and cultures 
              – with knowledge and maximum security.
            </p>
          </div>

          {/* Vision Section */}
          <div className="about-section">
            <h2 className="about-section-title">Our Vision</h2>
            <p className="about-section-intro">
              We are revolutionizing international real estate purchases by removing the biggest 
              hurdles:
            </p>

            <div className="vision-subsections">
              {/* Security through Verification */}
              <div className="vision-subsection">
                <h3 className="vision-subsection-title">Security through Verification:</h3>
                <p className="vision-subsection-text">
                  We verify proof of ownership and the identity of every seller, 
                  so you have transparency and security. This way, you can invest with 
                  confidence.
                </p>
              </div>

              {/* Full Support */}
              <div className="vision-subsection">
                <h3 className="vision-subsection-title">Full Support:</h3>
                <p className="vision-subsection-text">
                  We ensure that you are not alone. We connect you with a vetted network of 
                  local lawyers, notaries, and experts who guide you through every step in your language 
                  and according to local law.
                </p>
              </div>

              {/* Knowledge before Investment */}
              <div className="vision-subsection">
                <h3 className="vision-subsection-title">Knowledge before Investment:</h3>
                <p className="vision-subsection-text">
                  We provide you with the best and most intelligent search criteria to precisely find 
                  what you are looking for, and we deliver all relevant market and lifestyle information.
                </p>
              </div>
            </div>

            {/* Concluding Statement */}
            <p className="vision-conclusion">
              TerraCasa is the secure bridge between your dream and your international home.
            </p>
          </div>

          {/* Values Section */}
          <div className="about-section">
            <h2 className="about-section-title">Our Values</h2>
            <p className="values-subtitle">What drives us and how we work</p>
            
            <div className="values-cards">
              {/* Global Thinking */}
              <div className="value-card">
                <div className="value-icon-wrapper">
                  <svg className="value-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 2C15.31 2 18.31 3.5 20.5 6C20.5 8.5 18.5 10.5 16 10.5C13.5 10.5 11.5 8.5 11.5 6C11.5 3.5 13.5 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 22C8.69 22 5.69 20.5 3.5 18C3.5 15.5 5.5 13.5 8 13.5C10.5 13.5 12.5 15.5 12.5 18C12.5 20.5 10.5 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="value-card-title">Think globally</h3>
                <p className="value-card-text">
                  We connect people with countries, cultures, and opportunities worldwide.
                </p>
              </div>

              {/* With Passion */}
              <div className="value-card">
                <div className="value-icon-wrapper">
                  <svg className="value-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.0621 22.0329 6.39464C21.7564 5.72718 21.351 5.12075 20.84 4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="value-card-title">With passion</h3>
                <p className="value-card-text">
                  Real estate is more than just objects - they are life dreams that we take seriously.
                </p>
              </div>

              {/* Build Trust */}
              <div className="value-card">
                <div className="value-icon-wrapper">
                  <svg className="value-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L4 5V11C4 16.55 7.16 21.74 12 23C16.84 21.74 20 16.55 20 11V5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="value-card-title">Build trust</h3>
                <p className="value-card-text">
                  Transparency and verified partners are the foundation of our platform.
                </p>
              </div>

              {/* Strong Together */}
              <div className="value-card">
                <div className="value-icon-wrapper">
                  <svg className="value-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="value-card-title">Strong together</h3>
                <p className="value-card-text">
                  Our network grows with everyone who participates - buyers, sellers, partners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Banner Section */}
      <section className="stats-banner">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">12+</div>
            <div className="stat-label">Countries</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5.000+</div>
            <div className="stat-label">Properties</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1.200+</div>
            <div className="stat-label">Partners</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Satisfaction</div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="contact-section">
        <div className="contact-container">
          <h2 className="contact-title">Contact us</h2>
          <p className="contact-subtitle">
            Do you have questions or suggestions? We look forward to hearing from you!
          </p>

          <div className="contact-content">
            {/* Contact Information */}
            <div className="contact-info">
              <div className="contact-info-item">
                <div className="contact-icon-wrapper">
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="contact-info-content">
                  <div className="contact-info-label">E-Mail</div>
                  <div className="contact-info-value">info@terracasa.com</div>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon-wrapper">
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7292C21.7209 20.9842 21.5573 21.2126 21.3528 21.3992C21.1482 21.5858 20.9074 21.7267 20.6446 21.8127C20.3819 21.8987 20.1035 21.9279 19.8288 21.8988C16.4273 21.4585 13.1477 20.2431 10.19 18.3188C7.57982 16.6149 5.46056 14.2957 4.05 11.5688C2.79336 9.13005 2.16613 6.36073 2.23 3.56875C2.20094 3.29397 2.23012 3.01564 2.31612 2.75291C2.40212 2.49018 2.54302 2.24943 2.72962 2.04484C2.91622 1.84025 3.14458 1.67672 3.39959 1.56509C3.65459 1.45346 3.93034 1.39648 4.20875 1.39763H7.20875C7.74735 1.39338 8.26712 1.58778 8.66758 1.94219C9.06804 2.2966 9.31814 2.78493 9.36875 3.31875C9.46673 4.37754 9.71409 5.41955 10.1038 6.40875C10.2596 6.81678 10.3337 7.25339 10.3213 7.69188C10.3088 8.13037 10.21 8.56266 10.03 8.95875L8.61875 11.7688C10.2061 14.4069 12.5931 16.7939 15.2313 18.3813L18.0413 16.9688C18.4374 16.7888 18.8697 16.69 19.3082 16.6775C19.7467 16.6651 20.1833 16.7392 20.5913 16.895C21.5805 17.2847 22.6225 17.5321 23.6813 17.63C24.2202 17.6776 24.7135 17.9301 25.0652 18.3344C25.4169 18.7387 25.5999 19.2631 25.5788 19.7988L25.5788 19.9188H25.5688" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="contact-info-content">
                  <div className="contact-info-label">Phone</div>
                  <div className="contact-info-value">+49 (0) 123 456 789</div>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon-wrapper">
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="contact-info-content">
                  <div className="contact-info-label">Address</div>
                  <div className="contact-info-value">
                    Musterstraße 123<br />
                    10115 Berlin, Germany
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <form className="contact-form">
                <div className="form-group">
                  <label htmlFor="contact-name">Name *</label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    required
                    placeholder="Your Name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email">E-Mail *</label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    required
                    placeholder="your@email.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-subject">Subject</label>
                  <input
                    type="text"
                    id="contact-subject"
                    name="subject"
                    placeholder="What is it about?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message">Message *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows="6"
                    required
                    placeholder="Your Message..."
                  ></textarea>
                </div>

                <button type="submit" className="contact-submit-btn">
                  Send message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;


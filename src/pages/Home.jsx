import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Home.css';

const Home = () => {
  useEffect(() => {
    // Add class to body to identify home page
    document.body.classList.add('home-page');
    return () => {
      document.body.classList.remove('home-page');
    };
  }, []);

  return (
    <div className="home-container">
      <Navbar />
      
      {/* Main Hero Section with Background Image */}
      <div className="home-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Discover. Invest. Live.</h1>
            <p className="hero-subtitle">
              A platform that is more than a property search: We offer you security and complete support on your way to your international home.
            </p>

            <div className="hero-features">
              <h2 className="features-title">Why TerraCasa is unique:</h2>
              
              <div className="features-list">
                <p className="feature-intro">
                  <strong>When buying abroad, we stand by your side.</strong> We take away your biggest worries and risks by creating trust through transparency:
                </p>

                <p className="feature-text">
                  <strong>Verified Security:</strong> Every property and every seller is thoroughly checked. From property deeds to identity – we verify the data so you don't have to.
                </p>

                <p className="feature-text">
                  <strong>Intelligent Search:</strong> Our filters go beyond the usual. Find your dream property based on specific criteria like sea view or proximity to the beach that really matter.
                </p>

                <p className="feature-text">
                  <strong>Expert Network:</strong> We connect you with a local network of lawyers, architects, and consultants who will guide you legally and professionally through the entire purchase process – from initial inspiration to notarized certification.
                </p>

                <p className="feature-text">
                  <strong>Learn the Lifestyle:</strong> Get to know countries, cities, and lifestyles before you decide. We accompany you on this journey – from inspiration to investment.
                </p>
              </div>

              <h2 className="hero-cta">Your journey begins here</h2>
            </div>

            {/* Cards Section - Positioned over hero background */}
            <div className="home-cards">
              <div className="card">
                <div className="card-icon">🏠</div>
                <h3 className="card-title">Search Holiday Property</h3>
                <p className="card-description">Find your dream property in your desired country</p>
              </div>

              <div className="card">
                <div className="card-icon">🌍</div>
                <h3 className="card-title">Get to know Country & Life</h3>
                <p className="card-description">Discover countries, cities and lifestyles before you invest</p>
              </div>

              <div className="card">
                <div className="card-icon">📄</div>
                <h3 className="card-title">Post Ad</h3>
                <p className="card-description">Offer your property worldwide with verification</p>
              </div>

              <div className="card">
                <div className="card-icon">🤝</div>
                <h3 className="card-title">Build Network</h3>
                <p className="card-description">Connect with verified local experts who can help you with buying, moving and emigrating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips & Guides Section */}
      <section className="tips-section">
        <div className="tips-container">
          <h2 className="tips-heading">Tips & Guides</h2>
          <p className="tips-subtitle">
            Your path to your dream property - with verified information, checklists, and experts at your side if needed
          </p>

          <div className="tips-cards">
            <div className="tip-card">
              <div className="tip-icon-wrapper">
                <div className="tip-icon">📖</div>
              </div>
              <h3 className="tip-card-title">Guide Articles</h3>
              <p className="tip-card-description">
                10 things to consider when buying a property in the target country
              </p>
            </div>

            <div className="tip-card">
              <div className="tip-icon-wrapper">
                <div className="tip-icon">✓</div>
              </div>
              <h3 className="tip-card-title">Checklists</h3>
              <p className="tip-card-description">
                Free downloads for your property purchase
              </p>
            </div>

            <div className="tip-card">
              <div className="tip-icon-wrapper">
                <div className="tip-icon">🎥</div>
              </div>
              <h3 className="tip-card-title">Virtual Tours</h3>
              <p className="tip-card-description">
                Experience reports & 360-degree videos
              </p>
            </div>

            <div className="tip-card">
              <div className="tip-icon-wrapper">
                <div className="tip-icon">📅</div>
              </div>
              <h3 className="tip-card-title">Webinars & Q&A</h3>
              <p className="tip-card-description">
                Live sessions with experts
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const destinations = [
    {
      name: "Beirut",
      description: "The vibrant capital city",
      image: "https://transferdesk.com/wp-content/uploads/2018/11/beirut-roundabout-min.jpg"
    },
    {
      name: "Byblos",
      description: "Ancient coastal treasure",
      image: "https://t4.ftcdn.net/jpg/02/43/85/83/360_F_243858350_lt7uwZeNzOfYhi8kEZYk15yQOuYe88vk.jpg"
    },
    {
      name: "Baalbek",
      description: "Legendary Roman ruins",
      image: "https://upload.wikimedia.org/wikipedia/commons/9/90/Baalbeck_Temple.jpg"
    },
    {
      name: "Cedars",
      description: "Majestic mountain forests",
      image: "https://kaleela.com/wp-content/uploads/2025/09/Whisk_e15d0f55a71912dbd904531dc43ab611dr.jpeg"
    }
  ];

  const features = [
    {
      icon: "🗺️",
      title: "Explore Places",
      description: "Discover restaurants, cafes, hotels and tourist attractions across Lebanon"
    },
    {
      icon: "⭐",
      title: "Top Rated",
      description: "Find the highest rated places with real reviews and ratings"
    },
    {
      icon: "📸",
      title: "Photo Gallery",
      description: "Browse stunning photos of Lebanon's most beautiful locations"
    },
    {
      icon: "🎯",
      title: "Smart Search",
      description: "Filter by category, location, rating and more to find exactly what you need"
    }
  ];

  const categories = [
    {
      name: "Restaurants",
      icon: "🍽️",
      count: "150+",
      className: "category-restaurants"
    },
    {
      name: "Cafes",
      icon: "☕",
      count: "80+",
      className: "category-cafes"
    },
    {
      name: "Hotels",
      icon: "🏨",
      count: "50+",
      className: "category-hotels"
    },
    {
      name: "Landmarks",
      icon: "🏛️",
      count: "40+",
      className: "category-landmarks"
    },
    {
      name: "Beaches",
      icon: "🏖️",
      count: "25+",
      className: "category-beaches"
    },
    {
      name: "Museums",
      icon: "🎨",
      count: "15+",
      className: "category-museums"
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div 
          className="hero-bg" 
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        ></div>
        
        <div className="hero-content">
          <h1 className="hero-title">
            Discover the Beauty of
            <span className="gradient-text"> Lebanon</span>
          </h1>
          <p className="hero-subtitle">
            Explore breathtaking destinations, authentic cuisine, and rich culture
          </p>
          
          <div className="hero-buttons">
            <Link to="/dashboard" className="btn btn-primary">
              <span>Start Exploring</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/data-table" className="btn btn-secondary">
              <span>View All Places</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Places</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">9+</div>
              <div className="stat-label">Cities</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">8+</div>
              <div className="stat-label">Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose TravelMate?</h2>
            <p className="section-subtitle">Everything you need to plan the perfect trip to Lebanon</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="destinations-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Destinations</h2>
            <p className="section-subtitle">Explore the most visited places in Lebanon</p>
          </div>

          <div className="destinations-grid">
            {destinations.map((dest, index) => (
              <Link 
                to={`/dashboard?city=${dest.name}`} 
                key={index} 
                className="destination-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="destination-image">
                  <img src={dest.image} alt={dest.name} />
                  <div className="destination-overlay"></div>
                </div>
                <div className="destination-content">
                  <h3 className="destination-name">{dest.name}</h3>
                  <p className="destination-description">{dest.description}</p>
                  <div className="destination-arrow">→</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Explore by Category</h2>
            <p className="section-subtitle">Find exactly what you're looking for</p>
          </div>

          <div className="categories-grid">
            {categories.map((cat, index) => (
              <Link
                key={index}
                to={`/dashboard?category=${cat.name}`}
                className={`category-card ${cat.className}`}
              >
                <div className="category-icon">{cat.icon}</div>
                <h3>{cat.name}</h3>
                <p>{cat.count} places</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Your Journey?</h2>
          <p className="cta-subtitle">Discover amazing places and create unforgettable memories</p>
          <Link to="/dashboard" className="btn btn-cta">
            <span>Explore Dashboard</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* QR Code Section */}
      <section className="qr-section">
        <div className="container">
          <div className="qr-content">
            <div className="qr-text">
              <h2 className="qr-title">📱 Scan & Visit</h2>
              <p className="qr-description">
                Scan this QR code with your phone to quickly access TravelMate
              </p>
            </div>
            <div className="qr-code-wrapper">
              <img 
                src="/travel-mate-qrcode.png" 
                alt="TravelMate QR Code" 
                className="qr-code-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <button 
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ↑
      </button>

      <style jsx>{`
        .qr-section {
          padding: 80px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }

        .qr-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .qr-content {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 60px;
          position: relative;
          z-index: 1;
        }

        .qr-text {
          flex: 1;
          color: white;
        }

        .qr-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: white;
        }

        .qr-description {
          font-size: 1.125rem;
          line-height: 1.6;
          opacity: 0.95;
          color: white;
        }

        .qr-code-wrapper {
          background: white;
          padding: 24px;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          transform: rotate(-2deg);
          transition: transform 0.3s ease;
        }

        .qr-code-wrapper:hover {
          transform: rotate(0deg) scale(1.05);
        }

        .qr-code-image {
          display: block;
          width: 200px;
          height: 200px;
          border-radius: 12px;
        }

        @media (max-width: 768px) {
          .qr-section {
            padding: 60px 20px;
          }

          .qr-content {
            flex-direction: column;
            text-align: center;
            gap: 40px;
          }

          .qr-title {
            font-size: 2rem;
          }

          .qr-description {
            font-size: 1rem;
          }

          .qr-code-wrapper {
            transform: rotate(0deg);
          }

          .qr-code-image {
            width: 180px;
            height: 180px;
          }
        }

        @media (max-width: 480px) {
          .qr-section {
            padding: 50px 16px;
          }

          .qr-title {
            font-size: 1.75rem;
          }

          .qr-code-wrapper {
            padding: 20px;
          }

          .qr-code-image {
            width: 160px;
            height: 160px;
          }
        }
      `}</style>
    </div>
  );
}

import { useState } from 'react';
import {
    Printer,
    Search,
    FileText,
    Palette,
    Zap,
    Sparkles,
    Target,
    Banknote,
    ArrowRight,
    LayoutGrid
} from 'lucide-react';
import './Home.css';

const Home = ({ onNavigate, onOpenAuth }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        // Handle search - could navigate to specific service based on query
        console.log('Searching for:', searchQuery);
    };

    const features = [
        {
            icon: <Zap size={24} />,
            title: 'Fast Delivery',
            description: 'Quick turnaround times for all your printing needs.',
            color: 'magenta',
        },
        {
            icon: <Sparkles size={24} />,
            title: 'Premium Quality',
            description: 'High-quality prints using the best materials and technology.',
            color: 'yellow',
        },
        {
            icon: <Target size={24} />,
            title: 'Easy to Use',
            description: 'Simple interface to upload, customize, and order prints.',
            color: 'green',
        },
        {
            icon: <Banknote size={24} />,
            title: 'Affordable Prices',
            description: 'Competitive pricing without compromising on quality.',
            color: 'blue',
        },
    ];

    const mainServices = [
        {
            id: 'normalPrint',
            icon: <FileText size={40} />,
            title: 'Normal Print',
            description: 'Standard document printing with customizable options like paper size, color, and binding.',
            image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800',
            features: ['Standard Documents', 'A4 Size Paper', 'Bulk Printing', 'Color & B/W']
        },
        {
            id: 'advancedPrint',
            icon: <Palette size={40} />,
            title: 'Advanced Print',
            description: 'Specialized printing for letterheads, posters, jumbo prints, and more.',
            image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800',
            features: ['Business Cards', 'Posters & Banners', 'Custom Design']
        }
    ];

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-background">
                    <div className="hero-gradient"></div>
                    <div className="hero-pattern"></div>
                </div>

                <div className="hero-content container">
                    <div className="hero-badge animate-slideDown">
                        <span className="badge-icon"><Printer size={16} /></span>
                        <span>A Better Way To Print</span>
                    </div>

                    <h1 className="hero-title animate-slideUp">
                        Professional Printing Made Simple
                    </h1>

                    <p className="hero-subtitle animate-slideUp">
                        Upload, customize, and print with just a few clicks. Quality printing services at your fingertips.
                    </p>

                    {/* Search Bar */}
                    <form
                        className={`hero-search animate-scaleIn ${isSearchFocused ? 'focused' : ''}`}
                        onSubmit={handleSearch}
                    >
                        <div className="search-icon"><Search size={20} /></div>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="What do you want to print today?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                        <button type="submit" className="search-btn">
                            Search
                        </button>
                    </form>
                </div>

                {/* Floating Elements */}
                <div className="hero-floating">
                    <div className="floating-shape shape-1"></div>
                    <div className="floating-shape shape-2"></div>
                    <div className="floating-shape shape-3"></div>
                </div>
            </section>

            {/* Services Section */}
            <section className="services-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Our Printing Services</h2>
                        <p className="section-subtitle">Professional printing solutions for every need</p>
                    </div>

                    <div className="main-services-grid">
                        {mainServices.map((service, index) => (
                            <div
                                key={service.id}
                                className="main-service-card"
                                style={{ animationDelay: `${index * 200}ms` }}
                                onClick={() => onNavigate(service.id)}
                            >
                                <div className="main-service-image">
                                    <img src={service.image} alt={service.title} />

                                </div>
                                <div className="main-service-content">
                                    <h3 className="main-service-title">{service.title}</h3>
                                    <p className="main-service-description">{service.description}</p>
                                    <div className="main-service-features">
                                        {service.features.map((feature, idx) => (
                                            <span key={idx} className="feature-pill">{feature}</span>
                                        ))}
                                    </div>
                                    <button className="main-service-btn">
                                        Start Printing
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Why Choose PrintHub?</h2>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`feature-card feature-${feature.color}`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="feature-icon-wrapper">
                                    <span className="feature-icon">{feature.icon}</span>
                                </div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-background">
                            <div className="cta-gradient"></div>
                        </div>
                        <div className="cta-content">
                            <h2 className="cta-title">Ready to Start Printing?</h2>
                            <p className="cta-subtitle">
                                Join thousands of satisfied customers who trust PrintHub for their printing needs.
                            </p>
                            <div className="cta-actions">
                                <button
                                    className="btn btn-primary btn-lg cta-btn"
                                    onClick={() => onOpenAuth('signup')}
                                >
                                    Create Free Account
                                </button>
                                <button
                                    className="btn btn-ghost btn-lg cta-btn-secondary"
                                    onClick={() => onNavigate('normalPrint')}
                                >
                                    Try Without Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-number">50K+</span>
                            <span className="stat-label">Happy Customers</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">100K+</span>
                            <span className="stat-label">Documents Printed</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">99.9%</span>
                            <span className="stat-label">Satisfaction Rate</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">24/7</span>
                            <span className="stat-label">Customer Support</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

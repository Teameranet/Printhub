import { useState } from 'react';
import {
    FileText,
    Maximize,
    Layers,
    Image as ImageIcon,
    Contact,
    BookOpen,
    Flag,
    Palette,
    Plus,
    Sparkles,
    ArrowRight,
    X,
    Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AdvancedPrint.css';

const AdvancedPrint = ({ onNavigate, onOpenAuth }) => {
    const { user, isAuthenticated } = useAuth();
    const [selectedService, setSelectedService] = useState(null);
    const [showAddServiceModal, setShowAddServiceModal] = useState(false);
    const [newService, setNewService] = useState({
        name: '',
        description: '',
        price: '',
        icon: 'FileText'
    });

    // Check if user is admin
    const isAdmin = isAuthenticated && user?.role === 'admin';

    // Initial services
    const [services, setServices] = useState([
        { id: 'letterhead', name: 'Letterhead', description: 'Professional letterheads for your business correspondence', iconName: 'FileText', price: 'Contact for price', popular: true, image: '', sizes: ['A4', 'Letter'], finishes: ['Matte', 'Glossy', 'Linen'] },
        { id: 'jumbo', name: 'Jumbo Print', description: 'Large format prints for maximum impact', iconName: 'Maximize', price: 'Contact for price', popular: false, image: '', sizes: ['24×36 inch', '36×48 inch', 'Custom'], finishes: ['Matte', 'Glossy', 'Canvas'] },
        { id: 'a3', name: 'A3 Print', description: 'Larger than standard prints for detailed documents', iconName: 'Layers', price: 'Contact for price', popular: false, image: '', sizes: ['A3'], finishes: ['Standard', 'Premium', 'Photo'] },
        { id: 'poster', name: 'Poster Print', description: 'High-quality posters for advertising and decoration', iconName: 'ImageIcon', price: 'Contact for price', popular: true, image: '', sizes: ['A2', 'A1', 'A0', 'Custom'], finishes: ['Matte', 'Glossy', 'Semi-Gloss'] },
        { id: 'businessCard', name: 'Business Cards', description: 'Professional business cards with various finishes', iconName: 'Contact', price: 'Contact for price', popular: true, image: '', sizes: ['Standard (3.5×2 inch)', 'Square'], finishes: ['Matte', 'Glossy', 'Spot UV', 'Embossed'] },
        { id: 'brochure', name: 'Brochures', description: 'Marketing brochures in various folds and sizes', iconName: 'BookOpen', price: 'Contact for price', popular: false, image: '', sizes: ['Bi-fold', 'Tri-fold', 'Z-fold'], finishes: ['Matte', 'Glossy'] },
        { id: 'banner', name: 'Banners', description: 'Indoor and outdoor banners for events and promotions', iconName: 'Flag', price: 'Contact for price', popular: false, image: '', sizes: ['2×4 ft', '3×6 ft', '4×8 ft', 'Custom'], finishes: ['Vinyl', 'Fabric', 'Mesh'] },
        { id: 'canvas', name: 'Canvas Print', description: 'Museum-quality canvas prints for art and photos', iconName: 'Palette', price: 'Contact for price', popular: false, image: '', sizes: ['12×18 inch', '18×24 inch', '24×36 inch', 'Custom'], finishes: ['Stretched', 'Rolled', 'Framed'] },
    ]);

    // Icon mapping for dynamic rendering
    const iconComponents = {
        FileText: FileText,
        Maximize: Maximize,
        Layers: Layers,
        ImageIcon: ImageIcon,
        Contact: Contact,
        BookOpen: BookOpen,
        Flag: Flag,
        Palette: Palette,
        Plus: Plus,
        Sparkles: Sparkles,
        ArrowRight: ArrowRight,
        X: X
    };

    const [searchQuery, setSearchQuery] = useState('');

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderIcon = (name, size = 20) => {
        const IconComponent = iconComponents[name] || FileText;
        return <IconComponent size={size} />;
    };

    // Handle service selection
    const handleServiceClick = (service) => {
        setSelectedService(service);
    };

    // Handle adding new service (admin only)
    const handleAddService = () => {
        if (!newService.name || !newService.description) return;

        const service = {
            id: `custom-${Date.now()}`,
            name: newService.name,
            description: newService.description,
            iconName: newService.icon,
            price: newService.price || 'Contact for price',
            popular: false,
            image: '',
            sizes: ['Custom'],
            finishes: ['Standard'],
        };

        setServices([...services, service]);
        setNewService({ name: '', description: '', price: '', icon: 'FileText' });
        setShowAddServiceModal(false);
    };

    // Available icons for custom services
    const availableIcons = [
        { name: 'document', iconName: 'FileText' },
        { name: 'jumbo', iconName: 'Maximize' },
        { name: 'a3', iconName: 'Layers' },
        { name: 'poster', iconName: 'ImageIcon' },
        { name: 'business', iconName: 'Contact' },
        { name: 'brochure', iconName: 'BookOpen' },
        { name: 'banner', iconName: 'Flag' },
        { name: 'canvas', iconName: 'Palette' },
        { name: 'sparkles', iconName: 'Sparkles' },
    ];

    return (
        <div className="advanced-print">
            <div className="container">
                {/* Page Header */}
                <div className="page-header-advanced">
                    <div className="header-left">
                        <h1 className="page-title">Advanced Print Services</h1>
                        <p className="page-subtitle">Specialized printing solutions for your unique needs</p>
                    </div>

                    <div className="header-right">
                        <div className="search-pill">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search services..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {isAdmin && (
                            <button
                                className="btn btn-primary add-service-btn"
                                onClick={() => setShowAddServiceModal(true)}
                            >
                                <Plus size={18} />
                                Add Service
                            </button>
                        )}
                    </div>
                </div>

                {/* Services Grid */}
                <div className="services-grid">
                    {filteredServices.map((service, index) => (
                        <div
                            key={service.id}
                            className={`service-card ${service.popular ? 'popular' : ''}`}
                            style={{ animationDelay: `${index * 50}ms` }}
                            onClick={() => handleServiceClick(service)}
                        >
                            {service.popular && (
                                <div className="popular-badge">Popular</div>
                            )}

                            <div className="service-image-wrapper">
                                {service.image ? (
                                    <img src={service.image} alt={service.name} className="service-image" />
                                ) : (
                                    <div className="service-image-placeholder">{renderIcon(service.iconName, 48)}</div>
                                )}
                                <div className="service-overlay" />
                            </div>

                            <div className="service-content">
                                <div className="service-header">
                                    <h3 className="service-name">{service.name}</h3>
                                </div>

                                <p className="service-description">{service.description}</p>

                                <div className="service-footer">
                                    <span className="service-price">{service.price}</span>
                                    <button className="service-select-btn">
                                        Select Service
                                        <ArrowRight size={18} className="btn-arrow" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Custom Request Card */}
                    <div
                        className="service-card custom-request-card"
                        onClick={() => isAuthenticated ? setShowAddServiceModal(true) : onOpenAuth('login')}
                    >
                        <div className="custom-request-content">
                            <div className="custom-icon"><Sparkles size={32} /></div>
                            <h3 className="custom-title">Custom Request</h3>
                            <p className="custom-description">
                                Don't see what you need? Contact us for custom printing solutions tailored to your requirements.
                            </p>
                            <button className="btn btn-outline">
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>

                {/* Service Detail Modal */}
                {selectedService && (
                    <div className="service-modal-overlay" onClick={() => setSelectedService(null)}>
                        <div className="service-modal" onClick={(e) => e.stopPropagation()}>
                            <button
                                className="modal-close"
                                onClick={() => setSelectedService(null)}
                            >
                                <X size={24} />
                            </button>

                            <div className="modal-image">
                                {selectedService.image ? (
                                    <img src={selectedService.image} alt={selectedService.name} />
                                ) : (
                                    <div className="modal-image-placeholder">{renderIcon(selectedService.iconName, 64)}</div>
                                )}
                            </div>

                            <div className="modal-content">
                                <div className="modal-header">
                                    <span className="modal-icon">{renderIcon(selectedService.iconName, 24)}</span>
                                    <h2>{selectedService.name}</h2>
                                </div>

                                <p className="modal-description">{selectedService.description}</p>

                                <div className="modal-details">
                                    <div className="detail-group">
                                        <h4>Available Sizes</h4>
                                        <div className="detail-tags">
                                            {selectedService.sizes.map((size, idx) => (
                                                <span key={idx} className="detail-tag">{size}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="detail-group">
                                        <h4>Finish Options</h4>
                                        <div className="detail-tags">
                                            {selectedService.finishes.map((finish, idx) => (
                                                <span key={idx} className="detail-tag">{finish}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <div className="modal-price">
                                        <span className="price-label">Starting at</span>
                                        <span className="price-value">{selectedService.price}</span>
                                    </div>

                                    <button
                                        className="btn btn-primary btn-lg"
                                        onClick={() => {
                                            setSelectedService(null);
                                            onNavigate('normalPrint');
                                        }}
                                    >
                                        Start Designing
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Service Modal (Admin Only) */}
                {showAddServiceModal && isAdmin && (
                    <div className="add-service-modal-overlay" onClick={() => setShowAddServiceModal(false)}>
                        <div className="add-service-modal" onClick={(e) => e.stopPropagation()}>
                            <button
                                className="modal-close"
                                onClick={() => setShowAddServiceModal(false)}
                            >
                                <X size={24} />
                            </button>

                            <h2>Add New Service</h2>
                            <p className="modal-subtitle">Create a new printing service for your customers</p>

                            <form onSubmit={(e) => { e.preventDefault(); handleAddService(); }}>
                                <div className="input-group">
                                    <label className="input-label">Service Name</label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="e.g., Photo Books"
                                        value={newService.name}
                                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Description</label>
                                    <textarea
                                        className="input textarea"
                                        placeholder="Describe the service..."
                                        value={newService.description}
                                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Starting Price</label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="e.g., ₹500+"
                                        value={newService.price}
                                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Icon</label>
                                    <div className="icon-selector">
                                        {availableIcons.map((item) => (
                                            <button
                                                key={item.name}
                                                type="button"
                                                className={`icon-option ${newService.icon === item.iconName ? 'selected' : ''}`}
                                                onClick={() => setNewService({ ...newService, icon: item.iconName })}
                                            >
                                                {renderIcon(item.iconName, 20)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowAddServiceModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Add Service
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdvancedPrint;

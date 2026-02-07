import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../src/context/AuthContext';
import { useCart } from '../../src/context/CartContext';
import {
    User, Phone, MapPin, Truck, Store, Clock, Calendar,
    FileText, Lock, ShieldCheck, Zap, Info, ShoppingCart,
    CreditCard, ChevronRight, Loader2, Eye
} from 'lucide-react';
import './Checkout.css';

export const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated } = useAuth();
    const { cartItems: contextCartItems, clearCart } = useCart();

    // Combine cart items with items passed via state (from direct "Continue")
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const stateItems = location.state?.files || [];
        // If we have items from state, we prioritize them or combine them
        const combined = [...stateItems, ...contextCartItems];
        // Simple de-duplication by id if available
        const unique = combined.filter((item, index, self) =>
            index === self.findIndex((t) => (t.id === item.id))
        );
        setCartItems(unique);
    }, [location.state, contextCartItems]);

    const [deliveryType, setDeliveryType] = useState('pickup'); // 'pickup' or 'delivery'
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: user?.user_metadata?.full_name || '',
        mobile: user?.user_metadata?.phone || '',
        address: '',
        pincode: '',
        alternateMobile: '',
        pickupDate: '',
        pickupTime: ''
    });

    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
                mobile: user.user_metadata?.phone || ''
            }));
        }
    }, [isAuthenticated, user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price || 0), 0);
    };

    const calculateDeliveryCost = () => {
        return deliveryType === 'delivery' ? 40 : 0;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateDeliveryCost();
    };

    const handlePayment = async () => {
        // Validation
        if (!formData.fullName.trim()) {
            alert('Please enter your full name');
            return;
        }

        if (!formData.mobile.trim() || formData.mobile.length < 10) {
            alert('Please enter a valid 10-digit mobile number');
            return;
        }

        if (deliveryType === 'delivery') {
            if (!formData.address.trim()) {
                alert('Please enter your delivery address');
                return;
            }
            if (!formData.pincode.trim() || formData.pincode.length !== 6) {
                alert('Please enter a valid 6-digit pincode');
                return;
            }
        }

        setLoading(true);
        // Simulate payment process
        setTimeout(() => {
            setLoading(false);
            alert('Payment Successful! Your order has been placed.');
            clearCart();
            navigate('/');
        }, 2000);
    };

    const handlePreview = (item) => {
        if (item.file) {
            const fileUrl = URL.createObjectURL(item.file);
            window.open(fileUrl, '_blank');
            // Clean up the URL after a delay
            setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
        } else if (item.fileUrl) {
            window.open(item.fileUrl, '_blank');
        } else {
            alert('Preview not available. The file might have been lost due to page refresh.');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="checkout-empty">
                <div className="container">
                    <div className="empty-card">
                        <div className="empty-icon-wrapper">
                            <ShoppingCart size={48} className="empty-icon" />
                        </div>
                        <h2>Your cart is empty</h2>
                        <p>Add some files to print before checking out.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/normal-print')}>
                            Go to Printing
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <div className="checkout-header">
                    <h1>Checkout</h1>
                    <p>Complete your order securely</p>
                </div>

                <div className="checkout-grid">
                    {/* Left Column: Details and Summary */}
                    <div className="checkout-main">

                        {/* Personal Details Section */}
                        <section className="checkout-section">
                            <div className="section-title-wrapper">
                                <span className="section-number">1</span>
                                <h2>Personal Details</h2>
                                {isAuthenticated && <span className="badge badge-success">Logged In</span>}
                            </div>

                            <div className="section-content">
                                <div className="input-grid">
                                    <div className="input-group">
                                        <label className="input-label">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            className="input"
                                            placeholder="Enter your full name"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            disabled={isAuthenticated}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Mobile Number</label>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            className="input"
                                            placeholder="Enter 10-digit mobile number"
                                            value={formData.mobile}
                                            onChange={handleInputChange}
                                            disabled={isAuthenticated}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Delivery Options Section */}
                        <section className="checkout-section">
                            <div className="section-title-wrapper">
                                <span className="section-number">2</span>
                                <h2>Delivery Options</h2>
                            </div>

                            <div className="delivery-tabs">
                                <button
                                    className={`delivery-tab ${deliveryType === 'pickup' ? 'active' : ''}`}
                                    onClick={() => setDeliveryType('pickup')}
                                >
                                    <div className="tab-icon-wrapper">
                                        <Store size={24} />
                                    </div>
                                    <div className="tab-text">
                                        <span className="tab-title">Store Pickup</span>
                                        <span className="tab-desc">Ready in 2-4 hours</span>
                                    </div>
                                </button>
                                <button
                                    className={`delivery-tab ${deliveryType === 'delivery' ? 'active' : ''}`}
                                    onClick={() => setDeliveryType('delivery')}
                                >
                                    <div className="tab-icon-wrapper">
                                        <Truck size={24} />
                                    </div>
                                    <div className="tab-text">
                                        <span className="tab-title">Home Delivery</span>
                                        <span className="tab-desc">Delivery in 24-48 hours</span>
                                    </div>
                                </button>
                            </div>

                            <div className="section-content">
                                {deliveryType === 'pickup' ? (
                                    <div className="pickup-details animate-fadeIn">
                                        <div className="store-info-card">
                                            <div className="store-header">
                                                <span className="store-name">PrintHub Central Store</span>
                                                <span className="store-status">Open Now</span>
                                            </div>
                                            <p className="store-address">123 Printing Street, Tech Hub, Mumbai - 400001</p>
                                            <div className="store-meta">
                                                <span className="meta-item"><Clock size={16} /> 9:00 AM - 9:00 PM</span>
                                                <span className="meta-item"><Zap size={16} /> Est. Ready: 2-4 Hours</span>
                                            </div>
                                        </div>

                                        <div className="input-grid mt-6">
                                            <div className="input-group">
                                                <label className="input-label">Select Pickup Date</label>
                                                <input
                                                    type="date"
                                                    name="pickupDate"
                                                    className="input"
                                                    value={formData.pickupDate}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label className="input-label">Select Pickup Time</label>
                                                <input
                                                    type="time"
                                                    name="pickupTime"
                                                    className="input"
                                                    value={formData.pickupTime}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="delivery-details animate-fadeIn">
                                        <div className="delivery-notice">
                                            <Info size={20} className="notice-icon" />
                                            <p>Our standard delivery takes 24-48 hours. Orders placed after 6 PM will be processed next day.</p>
                                        </div>

                                        <div className="input-group mt-4">
                                            <label className="input-label">Full Delivery Address</label>
                                            <textarea
                                                name="address"
                                                className="input textarea"
                                                placeholder="House No, Street, Landmark, Area"
                                                rows="3"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                            ></textarea>
                                        </div>

                                        <div className="input-grid mt-4">
                                            <div className="input-group">
                                                <label className="input-label">Pincode</label>
                                                <input
                                                    type="text"
                                                    name="pincode"
                                                    className="input"
                                                    placeholder="6-digit Pincode"
                                                    value={formData.pincode}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label className="input-label">Alternate Mobile (Optional)</label>
                                                <input
                                                    type="tel"
                                                    name="alternateMobile"
                                                    className="input"
                                                    placeholder="Secondary contact number"
                                                    value={formData.alternateMobile}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Order Summary Section */}
                        <section className="checkout-section">
                            <div className="section-title-wrapper">
                                <span className="section-number">3</span>
                                <h2>Order Summary</h2>
                                <span className="items-count">{cartItems.length} {cartItems.length === 1 ? 'File' : 'Files'}</span>
                            </div>

                            <div className="order-items-list">
                                {cartItems.map((item, index) => (
                                    <div key={item.id || index} className="order-item-card">
                                        <div className="item-header">
                                            <div className="item-file-info">
                                                <div className="item-icon-circle">
                                                    <FileText size={20} />
                                                </div>
                                                <div className="item-title-wrapper">
                                                    <h3>{item.name || item.fileName || 'Untitled Document'}</h3>
                                                    <span className="item-page-count">{item.pages || 1} pages</span>
                                                </div>
                                            </div>
                                            <div className="item-right">
                                                <button
                                                    className="btn-preview-icon"
                                                    title="View Document"
                                                    onClick={() => handlePreview(item)}
                                                >
                                                    <Eye size={20} />
                                                </button>
                                                <span className="item-price">₹{(item.price || 0).toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="item-specs-grid">
                                            <div className="spec-group">
                                                <span className="spec-label">Page Range:</span>
                                                <span className="spec-value">{item.settings?.pageRange || item.pages || '1-1'}</span>
                                            </div>
                                            <div className="spec-group">
                                                <span className="spec-label">Color:</span>
                                                <span className="spec-value">
                                                    {(item.settings?.printColorId === 'color' || item.color === 'color') ? 'Color' : 'Black & White'}
                                                </span>
                                            </div>
                                            <div className="spec-group">
                                                <span className="spec-label">Sides:</span>
                                                <span className="spec-value">
                                                    {item.settings?.printSideId === 'double' ? 'Double-Sided' :
                                                        (item.settings?.printSideId === 'single' ? 'Single-Sided' : (item.sides || 'Single-Sided'))}
                                                </span>
                                            </div>
                                            <div className="spec-group">
                                                <span className="spec-label">Binding:</span>
                                                <span className="spec-value">
                                                    {item.settings?.bindingTypeId === 'none' ? 'None' :
                                                        (item.settings?.bindingTypeId ?
                                                            (item.settings.bindingTypeId.charAt(0).toUpperCase() + item.settings.bindingTypeId.slice(1)) :
                                                            (item.binding === 'none' ? 'None' : (item.binding || 'None')))}
                                                </span>
                                            </div>
                                            <div className="spec-group">
                                                <span className="spec-label">Copies:</span>
                                                <span className="spec-value">{item.settings?.copies || item.copies || 1}</span>
                                            </div>
                                            <div className="spec-group">
                                                <span className="spec-label">Page Per Set:</span>
                                                <span className="spec-value">{item.settings?.pagesPerSet || item.pagesPerSet || 1}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Sticky Payment Sidebar */}
                    <div className="checkout-sidebar">
                        <div className="payment-sticky-card">
                            <h2>Detailed Summary</h2>

                            <div className="price-breakdown">
                                <div className="price-row">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span>₹{calculateSubtotal()}</span>
                                </div>
                                <div className="price-row">
                                    <span>Delivery Charges</span>
                                    <span className={deliveryType === 'pickup' ? 'text-success' : ''}>
                                        {deliveryType === 'pickup' ? 'FREE' : `₹${calculateDeliveryCost()}`}
                                    </span>
                                </div>
                                <div className="divider"></div>
                                <div className="price-row total">
                                    <span>Total Amount</span>
                                    <span>₹{calculateTotal()}</span>
                                </div>
                            </div>

                            <div className="payment-security">
                                <span className="security-badge">
                                    <Lock size={14} className="lock-icon" /> Secure Payment via Stripe
                                </span>
                            </div>

                            <button
                                className={`btn btn-primary btn-full pay-btn ${loading ? 'loading' : ''}`}
                                onClick={handlePayment}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-sm"></span>
                                        Processing...
                                    </>
                                ) : (
                                    `Pay ₹${calculateTotal()}`
                                )}
                            </button>

                            <div className="guarantees">
                                <div className="guarantee-item">
                                    <ShieldCheck size={18} className="guarantee-icon" />
                                    <span>Satisfaction Guaranteed</span>
                                </div>
                                <div className="guarantee-item">
                                    <Zap size={18} className="guarantee-icon" />
                                    <span>Quality Prints Guaranteed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

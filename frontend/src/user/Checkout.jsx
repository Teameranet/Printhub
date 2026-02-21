import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { paymentAPI } from '../lib/api';
import {
    User, Phone, MapPin, Truck, Store, Clock, Calendar,
    FileText, Lock, ShieldCheck, Zap, Info, ShoppingCart,
    CreditCard, ChevronRight, Loader2, Eye
} from 'lucide-react';
import './Checkout.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

// Map frontend settings to backend Order format
const COLOR_TO_ORDER = { bw: 'B&W', color: 'Color' };
const SIDE_TO_ORDER = { single: 'Single', double: 'Double' };

function parsePageRange(range, maxPages) {
    if (!range || String(range).trim() === '' || String(range).toLowerCase() === 'all') return maxPages;
    const parts = String(range).split(',').map(p => p.trim());
    const uniquePages = new Set();
    parts.forEach(part => {
        if (part.includes('-')) {
            const [startStr, endStr] = part.split('-');
            const start = parseInt(startStr, 10);
            const end = parseInt(endStr, 10);
            if (!isNaN(start) && !isNaN(end)) {
                const s = Math.max(1, Math.min(start, end));
                const e = Math.min(maxPages, Math.max(start, end));
                for (let i = s; i <= e; i++) uniquePages.add(i);
            }
        } else {
            const page = parseInt(part, 10);
            if (!isNaN(page) && page >= 1 && page <= maxPages) uniquePages.add(page);
        }
    });
    return uniquePages.size > 0 ? uniquePages.size : maxPages;
}

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
        fullName: '',
        mobile: '',
        address: '',
        pincode: '',
        alternateMobile: '',
        pickupDate: '',
        pickupTime: ''
    });

    // Backend returns user with name, phone, email (not user_metadata)
    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.name || user.email?.split('@')[0] || '',
                mobile: user.phone || ''
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
        return deliveryType === 'delivery' ? (Number(import.meta.env.VITE_DELIVERY_COST) || 0) : 0;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateDeliveryCost();
    };
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (document.getElementById('razorpay-sdk')) {
                return resolve(true);
            }
            const script = document.createElement('script');
            script.id = 'razorpay-sdk';
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const placeOrders = async (razorpayOrderId = null, paymentStatus = 'unpaid') => {
        const token = localStorage.getItem('token');
        const isGuest = !token || !isAuthenticated;
        const orderUrl = isGuest ? `${API_URL}/api/orders/guest` : `${API_URL}/api/orders`;

        setLoading(true);
        try {
            let bindingTypesCache = null;
            const resolveBindingId = async (bindingTypeId) => {
                if (bindingTypeId && bindingTypeId.length === 24 && /^[a-f0-9]+$/i.test(bindingTypeId)) return bindingTypeId;
                if (!bindingTypesCache) {
                    const res = await fetch(`${API_URL}/api/binding/types`);
                    if (res.ok) {
                        const json = await res.json();
                        bindingTypesCache = json.data || [];
                    }
                }
                const noneType = (bindingTypesCache || []).find(t => t.name === 'None' || t._id === bindingTypeId);
                return noneType ? noneType._id : bindingTypeId;
            };

            const createdOrders = [];
            for (const item of cartItems) {
                const settings = item.settings || {};
                const pageCount = parsePageRange(settings.pageRange, item.pages || 1);
                const quantity = parseInt(settings.copies, 10) || 1;
                let bindingTypeId = await resolveBindingId(settings.bindingTypeId);
                if (!bindingTypeId || bindingTypeId.length !== 24) {
                    alert(`Invalid binding type for "${item.name || 'file'}". Please go back to Normal Print and try again.`);
                    setLoading(false);
                    return;
                }

                const colorType = COLOR_TO_ORDER[settings.printColorId] || 'B&W';
                const sideType = SIDE_TO_ORDER[settings.printSideId] || 'Single';
                const totalPrice = Number(item.price) || 0;

                const form = new FormData();
                form.append('colorType', colorType);
                form.append('sideType', sideType);
                form.append('pageCount', String(pageCount));
                form.append('bindingType', String(bindingTypeId));
                form.append('quantity', String(quantity));
                form.append('totalPrice', String(totalPrice));
                form.append('paymentStatus', paymentStatus);
                if (razorpayOrderId) {
                    form.append('razorpayOrderId', razorpayOrderId);
                }
                if (formData.pickupDate) form.append('notes', `Pickup: ${formData.pickupDate} ${formData.pickupTime || ''}`);
                
                if (item.file instanceof File) {
                    form.append('files', item.file);
                } else {
                    alert(`File for "${item.name || 'document'}" is missing. This usually happens after a page refresh. Please go back and re-upload your files.`);
                    setLoading(false);
                    return;
                }

                if (isGuest) {
                    form.append('guestName', formData.fullName.trim());
                    form.append('guestPhone', formData.mobile.trim());
                }

                const headers = {};
                if (!isGuest && token) headers.Authorization = `Bearer ${token}`;

                const res = await fetch(orderUrl, {
                    method: 'POST',
                    headers,
                    body: form,
                });
                const data = await res.json();
                if (!res.ok) {
                    if (data.received?.bodyKeys) console.warn('Server received body keys:', data.received.bodyKeys);
                    throw new Error(data.message || 'Failed to create order');
                }
                if (data.data && data.data._id) createdOrders.push(data.data._id);
            }

            return createdOrders;
        } catch (err) {
            console.error('Place order error:', err);
            throw err;
        }
    };

    const handlePayment = async () => {
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

        const amount = calculateTotal();
        if (!amount || amount <= 0) {
            alert('Amount must be greater than zero');
            return;
        }

        // If Razorpay key is not configured, fallback to direct order placement (no online payment)
        if (!RAZORPAY_KEY_ID) {
            setLoading(true);
            try {
                const createdOrders = await placeOrders(null, 'unpaid');
                clearCart();
                if (createdOrders.length > 0) {
                    const state = { fromCheckout: true, orderCount: createdOrders.length };
                    const token = localStorage.getItem('token');
                    const isGuest = !token || !isAuthenticated;
                    if (isGuest) state.guestPhone = formData.mobile.trim();
                    navigate(`/invoice/${createdOrders[0]}`, { state });
                } else {
                    const token = localStorage.getItem('token');
                    const isGuest = !token || !isAuthenticated;
                    navigate(isGuest ? '/' : '/orders');
                }
            } catch (err) {
                alert('Failed to place order: ' + (err.message || 'Please try again.'));
            } finally {
                setLoading(false);
            }
            return;
        }

        setLoading(true);
        try {
            // Step 1: Create Razorpay order on backend
            const razorpayOrderRes = await paymentAPI.createRazorpayOrder({
                amount: amount,
                currency: 'INR',
                receipt: `receipt_${Date.now()}`,
                notes: {
                    deliveryType,
                    pickupDate: formData.pickupDate || '',
                    pickupTime: formData.pickupTime || '',
                    address: formData.address || '',
                    pincode: formData.pincode || '',
                },
            });

            if (!razorpayOrderRes.success || !razorpayOrderRes.data) {
                throw new Error('Failed to create payment order');
            }

            const razorpayOrderId = razorpayOrderRes.data.orderId;

            // Step 2: Create database orders (unpaid, linked to Razorpay order)
            const createdOrders = await placeOrders(razorpayOrderId, 'unpaid');
            setLoading(false);

            if (createdOrders.length === 0) {
                alert('Failed to create orders');
                return;
            }

            // Step 3: Load Razorpay SDK and open payment popup
            const loaded = await loadRazorpayScript();
            if (!loaded || !window.Razorpay) {
                alert('Failed to load payment gateway. Please check your internet connection and try again.');
                return;
            }

            const options = {
                key: RAZORPAY_KEY_ID,
                amount: razorpayOrderRes.data.amount,
                currency: razorpayOrderRes.data.currency,
                order_id: razorpayOrderId,
                name: 'PrintHub',
                description: 'Print order payment',
                // Enable all payment methods including UPI
                method: {
                    upi: true,
                    card: true,
                    netbanking: true,
                    wallet: true,
                    emi: false, // Disable EMI if not needed
                    paylater: true,
                },
                prefill: {
                    name: formData.fullName || user?.name || '',
                    email: user?.email || '',
                    contact: formData.mobile || user?.phone || '',
                },
                theme: {
                    color: '#e91e63',
                },
                handler: async function (response) {
                    // Step 4: Verify payment on backend
                    setLoading(true);
                    try {
                        const verifyRes = await paymentAPI.verifyPayment({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            orderIds: createdOrders,
                        });

                        if (!verifyRes.success) {
                            alert('Payment verification failed: ' + (verifyRes.message || 'Please contact support'));
                            return;
                        }

                        // Step 5: Clear cart and navigate to invoice
                        clearCart();
                        const state = { fromCheckout: true, orderCount: createdOrders.length };
                        const token = localStorage.getItem('token');
                        const isGuest = !token || !isAuthenticated;
                        if (isGuest) state.guestPhone = formData.mobile.trim();
                        navigate(`/invoice/${createdOrders[0]}`, { state });
                    } catch (err) {
                        console.error('Payment verification error:', err);
                        alert('Payment verification failed: ' + (err.message || 'Please contact support'));
                    } finally {
                        setLoading(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        // User closed the payment popup
                        setLoading(false);
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                setLoading(false);
                alert('Payment failed: ' + (response.error?.description || 'Please try again'));
            });
            rzp.open();
        } catch (err) {
            console.error('Payment initiation error:', err);
            alert('Failed to initiate payment: ' + (err.message || 'Please try again.'));
            setLoading(false);
        }
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
        const hasItemsInContext = contextCartItems?.length > 0;
        const hasItemsInState = location.state?.files?.length > 0;

        if (!hasItemsInContext && !hasItemsInState) {
            return <Navigate to="/cart" replace />;
        }

        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Loader2 className="animate-spin" size={48} color="#3b82f6" />
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
                                {isAuthenticated ? (
                                    <span className="badge badge-success">Logged In</span>
                                ) : (
                                    <span className="badge badge-guest">Guest — name & number only</span>
                                )}
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
                                {!isAuthenticated && (
                                    <p className="checkout-guest-note">No sign-in required. Enter your name and mobile to place the order.</p>
                                )}
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
                                                <span className="store-name">Store Pickup</span>
                                                <span className="store-status">Available</span>
                                            </div>
                                            <p className="store-address">Collect your order at the store. Address and timings will be shared after order confirmation.</p>
                                            <div className="store-meta">
                                                <span className="meta-item"><Zap size={16} /> Est. ready: 2–4 hours</span>
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
                                    <Lock size={14} className="lock-icon" /> Secure Payment via Razorpay
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

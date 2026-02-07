import { useState, useMemo } from 'react';
import { Search, Filter, Calendar, ChevronDown, Download, ExternalLink, Package, User, CreditCard, Settings, Bell, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../src/context/AuthContext';
import './Profile.css';

const Profile = ({ onNavigate }) => {
    const { user, isAuthenticated } = useAuth();
    const [activeTab, setActiveTab] = useState('personal'); // Default to personal as per move to dedicated orders page
    const [isEditing, setIsEditing] = useState(false);

    // Profile form state
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '+91 9876543210',
        address: '123 Main Street, Mumbai, Maharashtra 400001',
    });

    // Preferences state
    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        smsNotifications: false,
        promotionalEmails: true,
        orderUpdates: true,
    });

    // Mock saved payment methods
    const [paymentMethods] = useState([
        { id: 1, type: 'card', last4: '4242', brand: 'Visa', expiry: '12/25' },
        { id: 2, type: 'upi', vpa: 'user@upi' },
    ]);


    if (!isAuthenticated) {
        return (
            <div className="profile-page">
                <div className="container">
                    <div className="auth-required">
                        <div className="auth-required-icon">🔒</div>
                        <h2>Please Login</h2>
                        <p>You need to be logged in to view your profile</p>
                        <button className="btn btn-primary" onClick={() => onNavigate('home')}>
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePreferenceChange = (key) => {
        setPreferences({
            ...preferences,
            [key]: !preferences[key]
        });
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        setIsEditing(false);
        // Here you would typically save to backend
        console.log('Saving profile:', formData);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            delivered: { class: 'badge-success', label: 'Delivered' },
            processing: { class: 'badge-warning', label: 'Processing' },
            pending: { class: 'badge-warning', label: 'Pending' },
            cancelled: { class: 'badge-error', label: 'Cancelled' },
        };
        const config = statusConfig[status] || statusConfig.pending;
        return <span className={`badge ${config.class}`}>{config.label}</span>;
    };

    const tabs = [
        { id: 'personal', label: 'Personal Information', icon: '👤' },
        { id: 'payment', label: 'Payment Methods', icon: '💳' },
        { id: 'preferences', label: 'Communication Preferences', icon: '⚙️' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'personal':
                return (
                    <div className="tab-content personal-info">
                        <div className="content-header">
                            <h3>Personal Information</h3>
                            {!isEditing ? (
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSaveProfile}>
                            <div className="form-grid">
                                <div className="input-group">
                                    <label className="input-label">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="input"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="input"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="input"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="input-group full-width">
                                    <label className="input-label">Address</label>
                                    <textarea
                                        name="address"
                                        className="input textarea"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary">
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                );


            case 'payment':
                return (
                    <div className="tab-content payment-methods">
                        <div className="content-header">
                            <h3>Payment Methods</h3>
                            <button className="btn btn-primary">
                                Add Payment Method
                            </button>
                        </div>

                        <div className="payment-list">
                            {paymentMethods.map((method) => (
                                <div key={method.id} className="payment-card">
                                    <div className="payment-icon">
                                        {method.type === 'card' ? '💳' : '📱'}
                                    </div>
                                    <div className="payment-details">
                                        {method.type === 'card' ? (
                                            <>
                                                <span className="payment-name">
                                                    {method.brand} ending in {method.last4}
                                                </span>
                                                <span className="payment-meta">Expires {method.expiry}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="payment-name">UPI</span>
                                                <span className="payment-meta">{method.vpa}</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="payment-actions">
                                        <button className="btn btn-ghost btn-sm">Edit</button>
                                        <button className="btn btn-ghost btn-sm text-error">Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'preferences':
                return (
                    <div className="tab-content preferences">
                        <div className="content-header">
                            <h3>Communication Preferences</h3>
                        </div>

                        <div className="preferences-list">
                            <div className="preference-item">
                                <div className="preference-info">
                                    <span className="preference-icon">📧</span>
                                    <div>
                                        <span className="preference-name">Email Notifications</span>
                                        <span className="preference-desc">Receive emails about your orders</span>
                                    </div>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={preferences.emailNotifications}
                                        onChange={() => handlePreferenceChange('emailNotifications')}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>

                            <div className="preference-item">
                                <div className="preference-info">
                                    <span className="preference-icon">📱</span>
                                    <div>
                                        <span className="preference-name">SMS Notifications</span>
                                        <span className="preference-desc">Receive SMS updates</span>
                                    </div>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={preferences.smsNotifications}
                                        onChange={() => handlePreferenceChange('smsNotifications')}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>

                            <div className="preference-item">
                                <div className="preference-info">
                                    <span className="preference-icon">🎁</span>
                                    <div>
                                        <span className="preference-name">Promotional Emails</span>
                                        <span className="preference-desc">Receive offers and promotions</span>
                                    </div>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={preferences.promotionalEmails}
                                        onChange={() => handlePreferenceChange('promotionalEmails')}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>

                            <div className="preference-item">
                                <div className="preference-info">
                                    <span className="preference-icon">📦</span>
                                    <div>
                                        <span className="preference-name">Order Updates</span>
                                        <span className="preference-desc">Receive order status updates</span>
                                    </div>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={preferences.orderUpdates}
                                        onChange={() => handlePreferenceChange('orderUpdates')}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="profile-page">
            <div className="container">
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="profile-avatar-large">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="profile-info">
                        <h1 className="profile-name">{user?.name}</h1>
                        <p className="profile-email">{user?.email}</p>
                        <span className="profile-role badge badge-primary">
                            {user?.role === 'admin' ? 'Admin' : 'Customer'}
                        </span>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="profile-content">
                    {/* Sidebar Tabs */}
                    <div className="profile-sidebar">
                        <button
                            className="tab-btn"
                            onClick={() => onNavigate('orders')}
                        >
                            <span className="tab-icon">📦</span>
                            <span className="tab-label">Order History</span>
                        </button>
                        <div className="profile-dropdown-divider" style={{ margin: '0.5rem 0' }}></div>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className="tab-icon">{tab.icon}</span>
                                <span className="tab-label">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="profile-main">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

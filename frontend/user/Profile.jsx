import { useState, useEffect } from 'react';
import {
    User,
    Mail,
    MapPin,
    ShieldCheck,
    LogOut,
    Save,
    Edit2,
    ChevronRight,
    Smartphone,
    Briefcase,
    History
} from 'lucide-react';
import { useAuth } from '../../src/context/AuthContext';
import './Profile.css';

const Profile = ({ onNavigate }) => {
    const { user, isAuthenticated, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    // Profile form state populated from user context
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        profileType: user?.profileType || 'Regular',
        address: '123 Main Street, Mumbai, Maharashtra 400001', // Example default
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                phone: user.phone || '',
                profileType: user.profileType || 'Regular'
            }));
        }
    }, [user]);

    if (!isAuthenticated) {
        return (
            <div className="profile-page-empty">
                <div className="empty-state-card animate-scaleIn">
                    <div className="lock-icon-wrapper">
                        <ShieldCheck size={48} />
                    </div>
                    <h2>Please Sign In</h2>
                    <p>Access your profile and orders by signing into your account.</p>
                    <button className="btn-primary-saas" onClick={() => onNavigate('home')}>
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        setIsEditing(false);
        // In a real app, call a backend update function
        console.log('Updating profile:', formData);
    };

    return (
        <div className="profile-wrapper-saas">
            <div className="profile-container-saas">
                {/* Header Section */}
                <div className="profile-hero-saas">
                    <div className="hero-content-saas">
                        <div className="avatar-wrapper-saas">
                            <div className="avatar-large-saas">
                                {user?.name?.charAt(0).toUpperCase() || <User size={32} />}
                            </div>
                            <div className="avatar-badge-saas">
                                <ShieldCheck size={14} />
                            </div>
                        </div>
                        <div className="hero-text-saas">
                            <h1>{user?.name || 'User Profile'}</h1>
                            <p className="hero-profile-type-text">{user?.profileType || 'Regular'} Member</p>
                            <div className="hero-badges-saas">
                                <span className="status-badge-saas">Verified Account</span>
                            </div>
                        </div>
                    </div>
                    <div className="hero-actions-saas">
                        <button
                            className="btn-order-history-saas"
                            onClick={() => onNavigate('orders')}
                        >
                            <History size={18} />
                            <span>Order History</span>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                <div className="profile-layout-single-saas">
                    <main className="profile-main-content-saas">
                        <div className="content-card-saas">
                            <div className="pane-header">
                                <div>
                                    <h3>Account Details</h3>
                                    <p>Maintain your personal profile information</p>
                                </div>
                                {!isEditing ? (
                                    <button className="btn-secondary-saas" onClick={() => setIsEditing(true)}>
                                        <Edit2 size={16} /> Edit Details
                                    </button>
                                ) : (
                                    <button className="btn-ghost-saas" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleSaveProfile} className="profile-form-saas">
                                <div className="form-grid-saas">
                                    <div className="input-field-saas">
                                        <label>Full Name</label>
                                        <div className={`input-wrapper-saas ${!isEditing ? 'disabled' : ''}`}>
                                            <User size={18} className="input-icon-saas" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                    </div>

                                    <div className="input-field-saas">
                                        <label>Profile Type</label>
                                        <div className="input-wrapper-saas disabled">
                                            <Briefcase size={18} className="input-icon-saas" />
                                            <input
                                                type="text"
                                                value={formData.profileType}
                                                disabled
                                            />
                                        </div>
                                        <p className="field-hint">Profile type cannot be changed manually</p>
                                    </div>

                                    <div className="input-field-saas">
                                        <label>Contact Number</label>
                                        <div className="input-wrapper-saas disabled">
                                            <Smartphone size={18} className="input-icon-saas" />
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                disabled
                                            />
                                        </div>
                                        <p className="field-hint">Verified mobile number</p>
                                    </div>

                                    <div className="input-field-saas full-width">
                                        <label>Shipping Address</label>
                                        <div className={`input-wrapper-saas ${!isEditing ? 'disabled' : ''}`}>
                                            <MapPin size={18} className="input-icon-saas top-icon" />
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Enter your full shipping address for deliveries"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="form-footer-saas">
                                        <button type="submit" className="btn-primary-saas">
                                            <Save size={18} /> Update Profile
                                        </button>
                                    </div>
                                )}
                            </form>

                            <div className="profile-footer-actions-saas">
                                <div className="divider-saas"></div>
                                <button className="logout-btn-saas" onClick={logout}>
                                    <LogOut size={18} />
                                    <span>Sign Out of Account</span>
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Profile;


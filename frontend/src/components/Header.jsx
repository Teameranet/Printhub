import { useState, useEffect } from 'react';
import {
    ChevronDown,
    User,
    Sparkles,
    Package,
    LogOut,
    Check,
    LogIn,
    ShoppingCart,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = ({ onOpenAuth, onNavigate, currentPage }) => {
    const { isAuthenticated, user, logout } = useAuth();
    const { cartItems } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (pageId) => {
        onNavigate(pageId);
    };

    const handleLogout = async () => {
        await logout();
        setShowProfileDropdown(false);
        onNavigate('home');
    };

    return (
        <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
            <div className="header-container">
                {/* Logo */}
                <div className="header-logo" onClick={() => handleNavClick('home')}>
                    <img src="/Printhub_logo.png" alt="PrintHub Logo" className="logo-img" />
                </div>

                {/* Right Section */}
                <div className="header-actions">
                    {/* Auth Buttons / Profile */}
                    {!isAuthenticated ? (
                        <button
                            className="btn-auth-saas"
                            onClick={() => onOpenAuth('login')}
                        >
                            <User size={20} className="auth-icon" />
                            <span className="auth-text">Sign In/Up</span>
                        </button>
                    ) : (
                        <div className="header-logged-in">
                            <button
                                className="cart-trigger"
                                onClick={() => handleNavClick('cart')}
                            >
                                <ShoppingCart size={22} />
                                {cartItems?.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
                            </button>
                            <div className="profile-menu">
                                <button
                                    className="btn-auth-saas"
                                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                >
                                    <User size={20} className="auth-icon" />
                                    <span className="auth-text">Profile</span>
                                    <ChevronDown className={`dropdown-arrow ${showProfileDropdown ? 'open' : ''}`} size={14} />
                                </button>

                                {showProfileDropdown && (
                                    <div className="profile-dropdown">
                                        <div className="profile-dropdown-header">
                                            <div className="profile-avatar large">
                                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div className="profile-info">
                                                <span className="profile-name-full">{user?.name}</span>
                                                <span className="profile-email">{user?.profileType || 'Regular'} Member</span>
                                            </div>
                                        </div>

                                        <div className="profile-dropdown-list">
                                            <button
                                                className="profile-dropdown-item"
                                                onClick={() => {
                                                    handleNavClick('profile');
                                                    setShowProfileDropdown(false);
                                                }}
                                            >
                                                <User size={18} className="dropdown-item-icon" />
                                                My Profile
                                            </button>
                                            <button
                                                className="profile-dropdown-item"
                                                onClick={() => {
                                                    handleNavClick('orders');
                                                    setShowProfileDropdown(false);
                                                }}
                                            >
                                                <Package size={18} className="dropdown-item-icon" />
                                                My Orders
                                            </button>

                                            <div className="profile-dropdown-divider"></div>

                                            <button
                                                className="profile-dropdown-item logout-item"
                                                onClick={handleLogout}
                                            >
                                                <LogOut size={18} className="dropdown-item-icon" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;

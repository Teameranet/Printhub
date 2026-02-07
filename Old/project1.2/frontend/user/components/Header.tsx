import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, Menu, X, MapPin, LogOut, Settings } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import TrackOrderModal from './tracking/TrackOrderModal';
import SearchBar from './search/SearchBar';

interface UserData {
  name: string;
  email: string;
}

interface HeaderProps {
  triggerToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

const Header = ({ triggerToast }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [user, setUser] = useState<UserData | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [cartItemCount, setCartItemCount] = useState(2);

  useEffect(() => {
    // Check if user is logged in (you can store this in localStorage or use a proper auth system)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    console.log('Logout initiated: Clearing user data and triggering toast');
    localStorage.removeItem('user');
    setUser(null);
    triggerToast('Logged out successfully', 'success');
    setTimeout(() => {
      console.log('Navigating to home page after toast delay');
      navigate('/');
    }, 500);
  };

  const handleAuthSuccess = (userData: { name: string; email: string }) => {
    setUser(userData);
    triggerToast(`Welcome, ${userData.name}!`, 'success');
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show topbar when scrolling up or at the top
      // Hide when scrolling down and past threshold
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowTopBar(false);
      } else {
        setShowTopBar(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Add click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
        {/* Top Bar */}
        <div 
          className={`bg-white transition-all duration-300 ${
            showTopBar ? 'h-10 opacity-100' : 'h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="container mx-auto px-4 h-full">
            <div className="flex items-center justify-between h-full">
              <button 
                onClick={() => setIsTrackOrderOpen(true)}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Track Order
              </button>
              <Link 
                to="/store-locator" 
                className="flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                <MapPin size={16} className="mr-1" />
                Store Locator
              </Link>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-4">
              <Link to="/" className="flex-shrink-0">
                <img src="/logo.png" alt="PrintHub" className="h-12 md:h-16" />
              </Link>

              <div className="hidden md:block flex-grow max-w-xl mx-auto">
                <SearchBar />
              </div>

              <div className="hidden md:flex items-center space-x-6">
                {user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center text-gray-600 hover:text-purple-600 cursor-pointer"
                    >
                      <User size={20} className="mr-2" />
                      <span>{user.name}</span>
                    </button>
                    
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 transform transition-all duration-200 ease-in-out">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 ease-in-out group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Settings size={18} className="mr-2 group-hover:scale-110 transition-transform duration-200" />
                          <span className="group-hover:translate-x-1 transition-transform duration-200">Profile</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 ease-in-out group"
                        >
                          <LogOut size={18} className="mr-2 group-hover:scale-110 transition-transform duration-200" />
                          <span className="group-hover:translate-x-1 transition-transform duration-200">Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center text-gray-600 hover:text-purple-600"
                  >
                    <User size={20} className="mr-1" />
                    <span>Login / Signup</span>
                  </button>
                )}
                {user ? (
                  // Cart with item count for logged-in users
                  <Link to="/cart" className="relative flex items-center text-gray-600 hover:text-purple-600">
                    <ShoppingCart size={20} className="mr-1" />
                    <span>Cart</span>
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center text-gray-600 hover:text-purple-600 relative"
                  >
                    <ShoppingCart size={20} className="mr-1" />
                  </button>
                )}
              </div>

              <div className="flex md:hidden items-center space-x-4">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-gray-600 hover:text-purple-600"
                >
                  <User size={24} />
                </button>
                {user ? (
                  <Link to="/cart" className="text-gray-600 hover:text-purple-600 relative">
                    <ShoppingCart size={24} />
                    <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  </Link>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-gray-600 hover:text-purple-600 relative"
                  >
                    <ShoppingCart size={24} />
                  </button>
                )}
                <button
                  className="text-gray-600"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            <div className="mt-4 md:hidden">
              <SearchBar />
            </div>
          </div>
        </div>

        <nav className="bg-white border-t">
          <div className="container mx-auto px-4">
            <ul className={`${isMenuOpen ? 'block' : 'hidden'} md:flex md:items-center md:justify-start space-y-2 md:space-y-0 md:space-x-6 py-2`}>
              <li>
                <Link to="/" className="text-gray-600 hover:text-purple-600 block md:inline-block py-2 md:py-1">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-purple-600 block md:inline-block py-2 md:py-1">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-purple-600 block md:inline-block py-2 md:py-1">
                  Services
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
      
      <TrackOrderModal 
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
      />
    </>
  );
};

export default Header;

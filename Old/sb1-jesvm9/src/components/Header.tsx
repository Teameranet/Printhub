import React, { useState } from 'react';
import { Search, ShoppingCart, MapPin, User, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthModal from './AuthModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const menuItems = [
    'Same Day Delivery',
    'Stationery',
    'Labels & Packaging',
    'Marketing & Promo',
    'Photo Gifts'
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
        {/* Top Bar */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-10">
              <div>
                <Link to="/" className="text-gray-600 hover:text-purple-600">Track Order</Link>
              </div>
              <div className="flex items-center space-x-6">
                <Link to="/" className="flex items-center text-gray-600 hover:text-purple-600">
                  <MapPin size={18} className="mr-1" />
                  Store Locator
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to="/" className="flex-shrink-0">
                <img 
                  src="/src/assets/logo.png" 
                  alt="PrintHub" 
                  className="h-12 md:h-16"
                />
                <div className="text-xs text-gray-600 mt-1 text-center">A BETTER WAY TO PRINT</div>
              </Link>

              {/* Search Bar - Hidden on mobile */}
              <div className="hidden md:flex flex-1 mx-8">
                <div className="relative w-full max-w-xl">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                  <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>

              {/* Actions */}
              <div className="hidden md:flex items-center space-x-6">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center text-gray-600 hover:text-purple-600"
                >
                  <User size={20} className="mr-1" />
                  <span className="hidden md:inline">Login / Signup</span>
                </button>
                <Link to="/" className="flex items-center text-gray-600 hover:text-purple-600 relative">
                  <ShoppingCart size={20} className="mr-1" />
                  <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="flex items-center space-x-4 md:hidden">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-gray-600 hover:text-purple-600"
                >
                  <User size={24} />
                </button>
                <Link to="/" className="text-gray-600 hover:text-purple-600 relative">
                  <ShoppingCart size={24} />
                  <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </Link>
                <button
                  className="text-gray-600"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {/* Mobile Search - Visible only on mobile */}
            <div className="md:hidden mt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                />
                <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-white border-t">
          <div className="container mx-auto px-4">
            <ul className={`${isMenuOpen ? 'block' : 'hidden'} md:flex md:items-center md:justify-start space-y-2 md:space-y-0 md:space-x-6 py-2`}>
              {menuItems.map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-purple-600 block md:inline-block py-2 md:py-1"
                  >
                    {item}
                  </Link>
                </li>
              ))}
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
      />
    </>
  );
};

export default Header;
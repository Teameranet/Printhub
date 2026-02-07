import React from 'react';
import { ArrowLeft, Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderHeader = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft size={24} className="text-gray-600 hover:text-purple-600" />
            </Link>
            <Link to="/" className="flex-shrink-0">
              <img src="/logo.png" alt="PrintHub" className="h-8" />
            </Link>
          </div>

          <div className="hidden md:block flex-grow max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="flex items-center text-gray-600 hover:text-purple-600">
              <User size={20} className="mr-1" />
              <span className="hidden md:inline">Account</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default OrderHeader;
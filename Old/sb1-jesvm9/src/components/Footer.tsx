import React from 'react';
import { Phone, Mail, Instagram, Facebook, Twitter, Linkedin, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const cities = ['Bangalore', 'Gurgoan', 'New Delhi', 'Chennai', 'Hyderabad', 'Pune'];
  
  return (
    <footer className="bg-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4">Find Stores</h3>
            <ul className="space-y-2">
              {cities.map((city) => (
                <li key={city}>
                  <Link to="/" className="text-gray-600 hover:text-purple-600">{city}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Our Company</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-purple-600">About us</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-purple-600">Careers</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-purple-600">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-purple-600">Help</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-purple-600">Business Solutions</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-purple-600">Find Stores</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-purple-600">My Account</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-purple-600">Track Order</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Important Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-purple-600">Privacy Policy</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-purple-600">Delivery & Return Policy</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-purple-600">Terms & conditions</Link></li>
            </ul>
            
            <div className="mt-6">
              <div className="flex items-center mb-2">
                <Phone size={20} className="text-gray-600 mr-2" />
                <a href="tel:+919513734374" className="text-gray-600 hover:text-purple-600">+91 951 373 4374</a>
              </div>
              <div className="flex items-center">
                <Mail size={20} className="text-gray-600 mr-2" />
                <a href="mailto:care@printo.in" className="text-gray-600 hover:text-purple-600">care@printo.in</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="font-bold mb-2">Follow us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-purple-600"><Instagram size={24} /></a>
                <a href="#" className="text-gray-600 hover:text-purple-600"><Facebook size={24} /></a>
                <a href="#" className="text-gray-600 hover:text-purple-600"><Twitter size={24} /></a>
                <a href="#" className="text-gray-600 hover:text-purple-600"><Linkedin size={24} /></a>
                <a href="#" className="text-gray-600 hover:text-purple-600"><Share2 size={24} /></a>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <a href="#" className="block">
                <img src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png" alt="Get it on Google Play" className="h-10" />
              </a>
              <a href="#" className="block">
                <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="Download on the App Store" className="h-10" />
              </a>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center space-x-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-8" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
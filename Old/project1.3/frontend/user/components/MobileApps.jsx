import React from 'react';
import { Apple, PlayCircle } from 'lucide-react';

const MobileApps = () => {
  return (
    <section className="bg-gradient-to-r from-purple-600 to-orange-500 py-16 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">Print On The Go</h2>
            <p className="text-lg mb-8">
              Download our mobile app to manage your printing needs anywhere, anytime.
              Track orders, browse products, and place orders with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#"
                className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
              >
                <Apple size={24} />
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
              >
                <PlayCircle size={24} />
                <div>
                  <div className="text-xs">Get it on</div>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800"
              alt="Mobile App Preview"
              className="w-64 rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileApps;
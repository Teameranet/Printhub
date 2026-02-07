import React, { useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
}

const StoreLocator = () => {
  const [selectedCity, setSelectedCity] = useState('all');

  const stores: Store[] = [
    {
      id: '1',
      name: 'PrintHub Bangalore Central',
      address: '123 MG Road, Bangalore - 560001',
      phone: '+91 80 1234 5678',
      email: 'bangalore@printhub.com',
      hours: 'Mon-Sat: 9:00 AM - 8:00 PM'
    },
    {
      id: '2',
      name: 'PrintHub Delhi NCR',
      address: '456 Connaught Place, New Delhi - 110001',
      phone: '+91 11 2345 6789',
      email: 'delhi@printhub.com',
      hours: 'Mon-Sat: 9:00 AM - 8:00 PM'
    }
  ];

  const cities = ['all', 'bangalore', 'delhi', 'mumbai', 'chennai'];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Our Stores</h1>
        
        <div className="flex justify-center mb-8">
          <select 
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            {cities.map(city => (
              <option key={city} value={city}>
                {city.charAt(0).toUpperCase() + city.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map(store => (
            <div key={store.id} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4">{store.name}</h3>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-purple-600 mt-1 mr-2" />
                  <span>{store.address}</span>
                </div>
                
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-purple-600 mr-2" />
                  <a href={`tel:${store.phone}`} className="hover:text-purple-600">
                    {store.phone}
                  </a>
                </div>
                
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-purple-600 mr-2" />
                  <a href={`mailto:${store.email}`} className="hover:text-purple-600">
                    {store.email}
                  </a>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <p className="font-medium">Store Hours:</p>
                  <p>{store.hours}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;
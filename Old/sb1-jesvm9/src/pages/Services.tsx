import React from 'react';
import { Printer, Package, Palette, Clock, Truck, Headphones } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Printer,
      title: 'Digital Printing',
      description: 'High-quality digital printing for all your business needs, from brochures to banners.'
    },
    {
      icon: Package,
      title: 'Custom Packaging',
      description: 'Bespoke packaging solutions that protect your products and enhance your brand.'
    },
    {
      icon: Palette,
      title: 'Design Services',
      description: 'Professional design team to help bring your ideas to life with stunning visuals.'
    },
    {
      icon: Clock,
      title: 'Rush Orders',
      description: 'Quick turnaround options available for urgent printing requirements.'
    },
    {
      icon: Truck,
      title: 'Nationwide Delivery',
      description: 'Fast and reliable delivery service across the country.'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to assist you with any queries.'
    }
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive printing and packaging solutions tailored to your business needs
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                <service.icon size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Process</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-full text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-lg font-bold mb-2">Consultation</h3>
              <p className="text-gray-600">Discuss your requirements with our experts</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-full text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-bold mb-2">Design</h3>
              <p className="text-gray-600">Create or refine your design</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-full text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-lg font-bold mb-2">Production</h3>
              <p className="text-gray-600">Print and quality check</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-full text-xl font-bold mb-4">
                4
              </div>
              <h3 className="text-lg font-bold mb-2">Delivery</h3>
              <p className="text-gray-600">Fast and secure delivery</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Contact us today to discuss your printing needs
          </p>
          <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
            Get a Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services;
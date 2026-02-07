import React from 'react';
import { Award, Users, Globe, Printer } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Users, value: '10,000+', label: 'Happy Customers' },
    { icon: Printer, value: '50,000+', label: 'Orders Completed' },
    { icon: Globe, value: '25+', label: 'Cities Served' },
    { icon: Award, value: '15+', label: 'Years Experience' },
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About NewPrintHub</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing the printing industry with innovative solutions
            and exceptional service for businesses of all sizes.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <stat.icon size={32} className="text-purple-600" />
              </div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2008, NewPrintHub began with a simple mission: to make
              professional printing services accessible to everyone. What started as
              a small local print shop has grown into a nationwide network of
              printing centers.
            </p>
            <p className="text-gray-600">
              Today, we're proud to serve thousands of businesses across the
              country, providing everything from business cards to large-format
              printing, all while maintaining our commitment to quality and
              customer satisfaction.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=1600"
              alt="Printing facility"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Quality First</h3>
              <p className="text-gray-600">
                We never compromise on quality, using the latest technology and
                premium materials for every project.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Customer Focus</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We work closely with you to
                ensure your vision becomes reality.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Innovation</h3>
              <p className="text-gray-600">
                We continuously invest in new technologies to provide cutting-edge
                printing solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
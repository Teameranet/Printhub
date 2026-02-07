import React from 'react';
import { Printer, Book, Award, Megaphone, Image, FileText, Mail, CreditCard, Gift, Sticker, BookOpen, Car as IdCard } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: IdCard,
      title: 'Identification Card',
      description: 'Professional ID cards for your organization. High-quality plastic cards with custom designs, perfect for employee identification and access control.',
      image: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?auto=format&fit=crop&w=2000'
    },
    {
      icon: Book,
      title: 'Books',
      description: 'Get your books printed and bound with precision. Whether it\'s for publishing, education, or personal projects — our book printing service delivers professional results.',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=2000'
    },
    {
      icon: Sticker,
      title: 'Stickers',
      description: 'Custom stickers for any purpose. Choose from various materials and finishes to create the perfect sticker for your brand or personal use.',
      image: 'https://images.unsplash.com/photo-1535891169584-75bcaf12e964?auto=format&fit=crop&w=2000'
    },
    {
      icon: FileText,
      title: 'Labels',
      description: 'Professional labels for products, packaging, and organization. Durable materials and high-quality printing for long-lasting results.',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=2000'
    },
    {
      icon: Gift,
      title: 'Personalised Gifts',
      description: 'Make it personal! From mugs to photo gifts, customize a wide range of products for birthdays, events, or special occasions.',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=2000'
    },
    {
      icon: CreditCard,
      title: 'Visiting Cards',
      description: 'Design and print professional visiting cards that reflect your brand identity. High-quality finishes and a variety of styles to leave a lasting impression.',
      image: 'https://images.unsplash.com/photo-1607545236599-5caa5455b9f0?auto=format&fit=crop&w=2000'
    },
    {
      icon: Mail,
      title: 'Letter Head',
      description: 'Create a strong first impression with custom letterheads. Upload your design or choose from our templates. Premium paper and professional finish included.',
      image: 'https://images.unsplash.com/photo-1586074299757-dc655f18518c?auto=format&fit=crop&w=2000'
    },
    {
      icon: FileText,
      title: 'Pamphlet / Leaflets',
      description: 'Share your message effectively with eye-catching pamphlets and leaflets. A cost-effective solution to reach your audience with information that sticks.',
      image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=2000'
    },
    {
      icon: Image,
      title: 'Posters',
      description: 'Make a statement with custom posters. Ideal for events, advertisements, or promotions. Upload your design and we\'ll handle the print with precision and flair.',
      image: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=2000'
    },
    {
      icon: Megaphone,
      title: 'Marketing Materials',
      description: 'Promote your brand with powerful marketing materials — from brochures to flyers, we\'ve got you covered. High-impact design and professional printing all in one place.',
      image: 'https://images.unsplash.com/photo-1475269146786-5c01f5e7d2f2?auto=format&fit=crop&w=2000'
    },
    {
      icon: Award,
      title: 'Certificate',
      description: 'Order your custom certificates today! Perfect for awards, achievements, courses, or employee recognition. Choose your design or let us help you create one.',
      image: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=2000'
    },
    {
      icon: Book,
      title: 'Black Book',
      description: 'Get your thesis, dissertation, or important documents professionally bound with our Black Book printing service. Durable and polished for academic or business presentation.',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=2000'
    },
    {
      icon: Printer,
      title: 'Print',
      description: 'High-quality printing services tailored to meet all your needs. Whether it\'s documents, images, or marketing materials — we ensure sharp, vibrant results every time.',
      image: 'https://images.unsplash.com/photo-1562564055-71e051d33c19?auto=format&fit=crop&w=2000'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-purple-700 text-white py-24">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1562564055-71e051d33c19?auto=format&fit=crop&w=2000"
            alt="Printing Services"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Professional Printing & Customization Services
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 max-w-3xl">
            Discover our wide range of services designed to meet your personal and business needs. 
            Quality, speed, and creativity — all in one place.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="flex items-center text-white">
                    <service.icon className="w-6 h-6 mr-3" />
                    <h3 className="text-xl font-bold">{service.title}</h3>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600">{service.description}</p>
                <button className="mt-4 text-purple-600 font-medium hover:text-purple-700">
                  Learn More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're a business looking for marketing materials or an individual with a creative project, 
            we're here to help bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
              Start Your Order
            </button>
            <button className="border border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
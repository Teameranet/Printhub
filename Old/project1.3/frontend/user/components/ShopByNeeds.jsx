import React from 'react';

const ShopByNeeds = () => {
  const needs = [
    {
      title: 'For Startups',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800',
      description: 'Essential printing solutions for new businesses'
    },
    {
      title: 'Event and Promotions',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800',
      description: 'Stand out at your next event'
    },
    {
      title: 'Employee Engagement',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800',
      description: 'Recognize and reward your team'
    },
    {
      title: 'Cafe and Restaurant',
      image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800',
      description: 'Complete printing solutions for hospitality'
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Shop By Needs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {needs.map((need) => (
            <div
              key={need.title}
              className="group relative overflow-hidden rounded-xl cursor-pointer"
            >
              <img
                src={need.image}
                alt={need.title}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white mb-2">{need.title}</h3>
                <p className="text-white/80 text-sm">{need.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByNeeds;
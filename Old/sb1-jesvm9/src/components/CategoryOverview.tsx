import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryOverview = () => {
  const navigate = useNavigate();
  
  const categories = [
    {
      name: 'Business Cards',
      image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'Corporate Gifts',
      image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'Custom Apparel',
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'Office Stationery',
      image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'Labels & Packaging',
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'Marketing Materials',
      image: 'https://images.unsplash.com/photo-1475269146237-3cefb2be191c?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {categories.map((category) => (
            <div
              key={category.name}
              onClick={() => navigate('/services')}
              className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                <h3 className="text-white font-medium group-hover:text-purple-200 transition-colors">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryOverview;
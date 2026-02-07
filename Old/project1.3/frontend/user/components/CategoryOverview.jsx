import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryOverview = () => {
  const navigate = useNavigate();
  
  const categories = [
    {
      name: 'Business Cards',
      image: 'https://images.unsplash.com/photo-1607545236599-5caa5455b9f0?auto=format&fit=crop&w=800'
    },
    {
      name: 'Apparel',
      image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800'
    },
    {
      name: 'Corporate Gifts',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800'
    },
    {
      name: 'Drinkware',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800'
    },
    {
      name: 'Mailer Boxes',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800'
    },
    {
      name: 'Awards',
      image: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&w=800'
    },
    {
      name: 'Stickers',
      image: 'https://images.unsplash.com/photo-1535891169584-75bcaf12e964?auto=format&fit=crop&w=800'
    },
    {
      name: 'Name Plates',
      image: 'https://images.unsplash.com/photo-1581776752456-51ce6c3e1f68?auto=format&fit=crop&w=800'
    },
    {
      name: 'Backpacks',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800'
    },
    {
      name: 'Labels',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800'
    },
    {
      name: 'Courier Poly Bag',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800'
    },
    {
      name: 'Posters',
      image: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=800'
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
              className="group cursor-pointer"
            >
              <div className="aspect-square rounded-lg overflow-hidden mb-3">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <h3 className="text-center font-medium text-gray-800 group-hover:text-purple-600 transition-colors">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryOverview;
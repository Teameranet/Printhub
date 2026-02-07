import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BrowseCategories = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  const categories = [
    {
      name: 'Business cards',
      image: 'https://images.unsplash.com/photo-1607545236599-5caa5455b9f0?auto=format&fit=crop&w=800',
    },
    {
      name: 'Stationery',
      image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800',
    },
    {
      name: 'Corporate Gifts',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800',
    },
    {
      name: 'Apparel',
      image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800',
    },
    {
      name: 'Photo gifts',
      image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?auto=format&fit=crop&w=800',
    },
    {
      name: 'Stickers & Labels',
      image: 'https://images.unsplash.com/photo-1535891169584-75bcaf12e964?auto=format&fit=crop&w=800',
    },
    {
      name: 'Packaging',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800',
    },
    {
      name: 'Signages',
      image: 'https://images.unsplash.com/photo-1581776752456-51ce6c3e1f68?auto=format&fit=crop&w=800',
    },
    {
      name: 'Marketing Material',
      image: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=800',
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Browse All Categories</h2>
        <div className="relative group">
          {/* Left scroll button */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors hidden md:block opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={24} className="text-gray-600" />
          </button>

          {/* Right scroll button */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors hidden md:block opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={24} className="text-gray-600" />
          </button>

          <div ref={scrollContainerRef} className="flex overflow-x-auto gap-4 no-scrollbar scroll-smooth">
            {categories.map((category) => (
              <div
                key={category.name}
                onClick={() => navigate('/services')}
                className="flex-none w-48 cursor-pointer group"
              >
                <div className="rounded-lg overflow-hidden mb-3">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-center font-medium text-purple-600">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrowseCategories;
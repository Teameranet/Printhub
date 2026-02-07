import React from 'react';
import { Calendar, Gift, Shirt, FileText, Package, Megaphone } from 'lucide-react';

const Categories = () => {
  const categories = [
    { icon: Calendar, name: 'Calendars & Diaries' },
    { icon: Gift, name: 'Corporate Gifts' },
    { icon: Shirt, name: 'Apparel' },
    { icon: FileText, name: 'Stationery' },
    { icon: Package, name: 'Labels & Packaging' },
    { icon: Megaphone, name: 'Promotions' }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {categories.map((category) => (
            <div
              key={category.name}
              className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            >
              <category.icon
                size={48}
                className="text-purple-600 group-hover:scale-110 transition-transform"
              />
              <h3 className="mt-4 text-center font-medium">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
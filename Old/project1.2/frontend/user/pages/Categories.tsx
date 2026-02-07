import React from 'react';
import { Printer, CreditCard, Book } from 'lucide-react';

const Categories = () => {
  const categories = [
    {
      icon: CreditCard,
      name: 'ID Card',
      description: 'Professional ID cards for your organization',
      price: 'Starting from $5.99'
    },
    {
      icon: CreditCard,
      name: 'Visiting Card',
      description: 'Make a lasting first impression',
      price: 'Starting from $9.99'
    },
    {
      icon: Book,
      name: 'Book Print',
      description: 'High-quality book printing services',
      price: 'Starting from $19.99'
    },
    {
      icon: Printer,
      name: 'Custom Print',
      description: 'Personalized printing solutions',
      price: 'Get a quote'
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Shop By Categories</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center text-center cursor-pointer group"
            >
              <category.icon
                size={48}
                className="text-purple-600 mb-4 group-hover:scale-110 transition-transform"
              />
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <span className="text-purple-600 font-medium">{category.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
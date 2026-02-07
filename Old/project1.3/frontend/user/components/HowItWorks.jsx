import React from 'react';
import { Upload, Printer, Truck, Check } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Design',
      description: 'Upload your design or use our online design tool to create your perfect print'
    },
    {
      icon: Printer,
      title: 'We Print',
      description: 'Our expert team prints your order using state-of-the-art equipment'
    },
    {
      icon: Check,
      title: 'Quality Check',
      description: 'Every order undergoes thorough quality checks before shipping'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Your order is carefully packed and delivered to your doorstep'
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">How PrintHub Works</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Get your printing done in four simple steps. Quality and efficiency guaranteed.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <step.icon className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
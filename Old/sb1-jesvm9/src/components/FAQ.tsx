import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How long does printing and delivery take?',
      answer: 'Standard printing takes 2-3 business days, while delivery times vary by location. Express printing and shipping options are available for urgent orders.'
    },
    {
      question: 'What file formats do you accept for printing?',
      answer: 'We accept PDF, AI, PSD, EPS, and JPEG files. For best results, we recommend high-resolution PDF files with embedded fonts.'
    },
    {
      question: 'Do you offer bulk order discounts?',
      answer: 'Yes, we offer tiered pricing for bulk orders. The larger your order, the better the price per unit. Contact our sales team for custom quotes.'
    },
    {
      question: 'Can I get samples before placing a large order?',
      answer: 'Yes, we offer sample kits and individual product samples. This helps you verify the paper quality, print quality, and colors before placing a bulk order.'
    },
    {
      question: 'What if I\'m not satisfied with my order?',
      answer: 'We have a satisfaction guarantee. If you\'re not happy with your order, contact us within 7 days of receipt, and we\'ll work to make it right.'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="text-purple-600" />
                ) : (
                  <ChevronDown className="text-gray-400" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Director',
      company: 'Tech Innovations Inc.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200',
      content: 'NewPrintHub has transformed how we handle our marketing materials. The quality and turnaround time are exceptional.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Small Business Owner',
      company: 'Artisan Cafe',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200',
      content: 'Their business card and menu printing services are top-notch. Customer service is always helpful and responsive.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Event Coordinator',
      company: 'Global Events',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200',
      content: 'We rely on NewPrintHub for all our event materials. They never disappoint with their quality and timely delivery.',
      rating: 5
    },
    {
      name: 'David Thompson',
      role: 'Creative Director',
      company: 'Design Studio',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200',
      content: 'The print quality exceeds our expectations every time. Their attention to detail is remarkable.',
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about our services.
          </p>
        </div>
        
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          breakpoints={{
            // Mobile
            0: {
              slidesPerView: 1,
              spaceBetween: 16,
            },
            // Tablet
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            // Desktop
            1024: {
              slidesPerView: 3,
              spaceBetween: 32,
            },
          }}
          loop={true}
          className="px-4 pb-12"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-2xl shadow-lg p-8 h-full transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl relative">
                <Quote className="absolute top-4 right-4 text-purple-100 w-12 h-12" />
                
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-purple-50"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-purple-600 rounded-full p-1">
                      <Quote className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-purple-600 font-medium">{testimonial.role}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      className="fill-yellow-400 text-yellow-400 mr-1" 
                    />
                  ))}
                </div>

                <p className="text-gray-600 leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
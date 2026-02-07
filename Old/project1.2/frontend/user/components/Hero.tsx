import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';

const Hero = () => {
  const navigate = useNavigate();

  const slides = [
    {
      title: "Own the Year 2025 with Customized Products!",
      description: "Get ready for success with our premium printing solutions",
      image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=2000",
    },
    {
      title: "Transform Your Brand Identity",
      description: "Professional printing services for lasting impressions",
      image: "https://images.unsplash.com/photo-1611244806964-91d204d4a2a7?auto=format&fit=crop&w=2000",
    },
    {
      title: "Sustainable Packaging Solutions",
      description: "Eco-friendly options for conscious businesses",
      image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=2000",
    },
    {
      type: "video",
      title: "Professional Printing Services",
      description: "Watch our state-of-the-art printing process",
      video: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=164&oauth2_token_id=57447761",
    }
  ];

  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        className="h-[600px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full">
              {slide.type === "video" ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src={slide.video} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-orange-500/70">
                <div className="container mx-auto px-4 h-full flex items-center">
                  <div className="max-w-2xl text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-xl mb-8">{slide.description}</p>
                    <button
                      onClick={() => navigate('/categories')}
                      className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-100 transition-colors"
                    >
                      Explore Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;
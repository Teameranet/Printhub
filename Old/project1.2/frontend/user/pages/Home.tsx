import React from 'react';
import Hero from '../components/Hero';
import BrowseCategories from '../components/BrowseCategories';
import CategoryOverview from '../components/CategoryOverview';
import HowItWorks from '../components/HowItWorks';
import ShopByNeeds from '../components/ShopByNeeds';
import Testimonials from '../components/Testimonials';
import MobileApps from '../components/MobileApps';
import FAQ from '../components/FAQ';

const Home = () => {
  return (
    <>
      <Hero />
      <BrowseCategories />
      <CategoryOverview />
      <HowItWorks />
      <ShopByNeeds />
      <MobileApps />
      <Testimonials />
      <FAQ />
    </>
  );
};

export default Home;
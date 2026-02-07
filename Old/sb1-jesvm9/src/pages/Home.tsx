import React from 'react';
import Hero from '../components/Hero';
import CategoryOverview from '../components/CategoryOverview';
import HowItWorks from '../components/HowItWorks';
import ShopByNeeds from '../components/ShopByNeeds';
import MobileApps from '../components/MobileApps';
import FAQ from '../components/FAQ';

const Home = () => {
  return (
    <>
      <Hero />
      <CategoryOverview />
      <HowItWorks />
      <ShopByNeeds />
      <MobileApps />
      <FAQ />
    </>
  );
};

export default Home;

import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import CastingTool from '@/components/CastingTool';
import Footer from '@/components/Footer';
import PrivacyBanner from '@/components/PrivacyBanner';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <HowItWorks />
      <CastingTool />
      <Footer />
      <PrivacyBanner />
    </div>
  );
};

export default Index;

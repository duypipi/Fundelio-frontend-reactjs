import { Footer } from '@/components/common/Footer';
import { Header } from '@/components/common/Header';
import Hero from '@/components/common/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import NearGoalMasonry from '@/components/home/NearGoalMasonry';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import CrowdfundingTips from '@/components/home/CrowdfundingTips';
import PrimaryCTA from '@/components/home/PrimaryCTA';
import React from 'react';
import RecentSavedCampaigns from '@/components/home/RecentSavedCampaigns';
import PopularCampaigns from '@/components/home/PopularCampaigns';

export const HomePage = () => {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Featured Projects Slider */}
      <PopularCampaigns />

      {/* How It Works */}
      <HowItWorks />

      <RecentSavedCampaigns />

      {/* Near Goal - Masonry Layout */}
      <NearGoalMasonry />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Crowdfunding Tips */}
      <CrowdfundingTips />

      {/* Primary CTA */}
      <PrimaryCTA />

      <Footer />
    </div>
  );
};

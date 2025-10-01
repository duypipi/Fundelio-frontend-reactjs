import { Footer } from '@/components/common/Footer';
import { Header } from '@/components/common/Header';
import Hero from '@/components/common/Hero';
import PopularCampaigns from '@/components/PopularCampaigns';
import RecentSavedCampaigns from '@/components/RecentSavedCampaigns';
import React from 'react';

export const HomePage = () => {
  return (
    <div>
      <Header />
      {/* Hero Section */}
      <Hero />

      {/* Popular Campaigns Section */}
      <PopularCampaigns />

      {/* Recent & Saved Campaigns Section */}
      <RecentSavedCampaigns />

      <Footer />
    </div>
  );
};

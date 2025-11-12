import React, { useState, useEffect } from 'react';
import TocMenu from './story/TocMenu';
import { RewardDetailSection } from './rewards/reward-detail/RewardDetalSection';
import { PledgeSummaryCard } from './rewards/reward-detail/PledgeSummaryCard';

/**
 * Custom hook for scroll spy functionality
 */
const useScrollSpy = (sectionIds) => {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!sectionIds || sectionIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first intersecting entry
        const intersecting = entries.find((entry) => entry.isIntersecting);

        if (intersecting) {
          setActiveId(intersecting.target.id);
        }
      },
      {
        rootMargin: '0px 0px -60% 0px',
        threshold: 0.2,
      }
    );

    // Observe all sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds]);

  return activeId;
};

/**
 * RewardsPage Component
 * Displays reward cards with TOC navigation and pledge summary
 */
const RewardsPage = ({ rewards = [], items = [], addOns = [], onPledge }) => {
  const [selectedReward, setSelectedReward] = useState(null);

  // Transform rewards to TOC menu items format
  const rewardMenuItems = rewards.map((reward) => ({
    id: reward.reward_id || reward.id,
    title_text: reward.title,
    order: rewards.indexOf(reward),
  }));

  // Use scroll spy to track active reward
  const activeId = useScrollSpy(rewards.map((r) => r.reward_id || r.id));

  // Find reward with most backers for default display
  const mostPopularReward = rewards.length > 0
    ? rewards.reduce((max, reward) =>
      (reward.backers || 0) > (max.backers || 0) ? reward : max,
      rewards[0]
    )
    : null;

  // Set default selected reward if none selected
  useEffect(() => {
    if (!selectedReward && mostPopularReward) {
      setSelectedReward({
        reward: mostPopularReward,
        quantity: 1,
        addOns: [],
        total: mostPopularReward.min_pledge_amount,
      });
    }
  }, [mostPopularReward, selectedReward]);

  const handleSelectReward = (rewardData) => {
    setSelectedReward(rewardData);
    if (onPledge) {
      onPledge(rewardData);
    }
  };

  const handleRemoveItem = (type, itemId) => {
    if (type === 'reward') {
      setSelectedReward(null);
    } else if (type === 'addon' && selectedReward) {
      setSelectedReward({
        ...selectedReward,
        addOns: selectedReward.addOns.filter((addon) => addon.id !== itemId),
      });
    }
  };

  const handlePickAddOns = () => {
    // This would open an add-ons picker modal or expand add-ons section
    console.log('Pick add-ons clicked');
  };

  const handleSubmit = () => {
    if (selectedReward && onPledge) {
      onPledge(selectedReward);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)_250px] gap-6 lg:gap-8">
      {/* Left Column - TOC Menu */}
      <div className="order-2 lg:order-1 hidden lg:block">
        <TocMenu blanks={rewardMenuItems} activeId={activeId} />
      </div>

      {/* Center Column - Reward Cards */}
      <div className="order-1 lg:order-2" id="rewards-section">
        <RewardDetailSection
          rewards={rewards}
          items={items}
          addOns={addOns}
          onSelectReward={handleSelectReward}
        />
      </div>

      {/* Right Column - Pledge Summary */}
      <div className="order-3 hidden lg:block">
        <PledgeSummaryCard
          selectedReward={selectedReward}
          onRemoveItem={handleRemoveItem}
          onPickAddOns={handlePickAddOns}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default RewardsPage;

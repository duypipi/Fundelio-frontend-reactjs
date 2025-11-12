import { motion } from 'framer-motion';
import { RewardDetailCard } from './RewardDetailCard';

export function RewardDetailSection({ rewards = [], items = [], addOns = [], onSelectReward }) {
  return (
    <div className="space-y-6">
      {rewards.map((reward, index) => (
        <motion.div
          key={reward.reward_id || reward.id}
          id={reward.reward_id || reward.id}
          className="scroll-mt-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <RewardDetailCard
            reward={reward}
            items={items}
            addOns={addOns}
            onSelectReward={onSelectReward}
          />
        </motion.div>
      ))}
    </div>
  );
}

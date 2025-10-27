import { motion } from 'framer-motion';
import { UsersIcon, MapPinIcon, CalendarIcon, PackageIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
// import type { Reward } from '@/stores/rewardStore';

// interface RewardDetailCardProps {
//   reward: Reward;
// }

export function RewardDetailCard({ reward }) {
  const percentageRemaining = reward.limitedQuantity
    ? (reward.limitedQuantity.remaining / reward.limitedQuantity.total) * 100
    : 100;

  return (
    <Card className="overflow-hidden border border-border/50 h-fit sticky top-8 max-w-[380px] mx-auto">
      {/* Image Section - 16:9 aspect ratio */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={reward.coverUrl || reward.image}
          alt={reward.imageAlt || reward.title}
          className="w-full h-full object-cover"
        />
        
        {/* Price Badge */}
        {/* <div
          className="absolute top-6 right-6 px-6 py-3 rounded-sm font-bold text-white bg-[#635bff] shadow-xl"
          style={{
            // background: 'linear-gradient(135deg, #FFB700 0%, #FF9603 100%)',
          }}
        >
          <span className="text-2xl">{reward.priceLabel || `$${reward.price}`}</span>
        </div> */}
      </div>

      {/* Content Section - Reduced padding */}
      <div className="p-4">
        <h3 className="text-base font-bold text-foreground mb-3 leading-tight">
          {reward.title}
        </h3>

        {/* Stats Grid - Vertical layout for narrow card */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm gradient-2 flex items-center justify-center flex-shrink-0">
              <UsersIcon className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Backers</p>
              <p className="text-base font-bold text-primary">{reward.backers}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm gradient-3 flex items-center justify-center flex-shrink-0">
              <MapPinIcon className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Ships to</p>
              <p className="text-xs font-semibold text-foreground">{reward.shipsTo}</p>
            </div>
          </div>
        </div>

        {/* Delivery Info - Smaller */}
        <div
          className="p-3 rounded-sm mb-4"
          style={{
            background: 'linear-gradient(135deg, rgba(8, 148, 226, 0.08) 0%, rgba(30, 199, 148, 0.08) 100%)',
            border: '1px solid rgba(8, 148, 226, 0.15)',
          }}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-primary" strokeWidth={2} />
            <div>
              <p className="text-xs text-muted-foreground">Estimated Delivery</p>
              <p className="text-sm font-semibold text-foreground">{reward.eta || reward.deliveryDate}</p>
            </div>
          </div>
        </div>

        {/* Limited Quantity - Smaller */}
        {reward.limitedQuantity && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PackageIcon className="w-4 h-4 text-warning" strokeWidth={2} />
                <span className="text-xs font-semibold text-foreground">Limited Quantity</span>
              </div>
              <span className="text-xs font-bold text-warning">
                {reward.limitedQuantity.remaining} left of {reward.limitedQuantity.total}
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: percentageRemaining > 50
                    ? 'linear-gradient(90deg, #1EC794 0%, #0894E2 100%)'
                    : percentageRemaining > 25
                    ? 'linear-gradient(90deg, #FFB700 0%, #FF9603 100%)'
                    : 'linear-gradient(90deg, #FF6D03 0%, #C44C93 100%)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${percentageRemaining}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* CTA Button - Smaller */}
        <Button
          className="w-full font-bold text-white shadow-lg h-10 text-sm"
          style={{
            background: 'linear-gradient(135deg, #1EC794 0%, #0894E2 100%)',
          }}
        >
          {reward.pledgeActionLabel || `Pledge $${reward.price}`}
        </Button>
      </div>
    </Card>
  );
}

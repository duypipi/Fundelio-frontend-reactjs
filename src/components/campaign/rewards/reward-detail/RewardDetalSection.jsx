import { motion } from 'framer-motion';
import { RewardDetailCard } from './RewardDetailCard';
import { RewardItem } from './RewardItem';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { PlusIcon, MinusIcon, CheckIcon } from 'lucide-react';
import { useState } from 'react';

// interface IncludedItem {
//   id: string;
//   name: string;
//   quantity: number;
//   image?: string;
//   badge?: string;
//   description?: string;
// }

// interface AddOnItem {
//   id: string;
//   name: string;
//   price: number;
//   description: string;
//   image: string;
//   quantity: number;
// }

// interface RewardDetailSectionProps {
//   reward: Reward;
// }

export function RewardDetailSection({ reward }) {
  const [addOns, setAddOns] = useState([
    {
      id: '1',
      name: 'Premium Accessory Pack',
      price: 15,
      description: 'Enhance your experience with our curated accessory collection.',
      image: 'https://c.animaapp.com/mh96kubogMaabT/img/ai_1.png',
      quantity: 0,
    },
    {
      id: '2',
      name: 'Deluxe Bundle Set',
      price: 28,
      description: 'Get two premium items at a special bundled price.',
      image: 'https://c.animaapp.com/mh96kubogMaabT/img/ai_1.png',
      quantity: 0,
    },
    {
      id: '3',
      name: 'Exclusive Limited Edition',
      price: 45,
      description: 'Limited availability - collectors edition with unique features.',
      image: 'https://c.animaapp.com/mh96kubogMaabT/img/ai_1.png',
      quantity: 0,
    },
  ]);

  const includedItems = [
    {
      id: '1',
      name: 'Core Product Access',
      quantity: 1,
      badge: 'INCLUDED',
      description: 'Full access to the core product with all standard features',
    },
    {
      id: '2',
      name: 'Digital Content Pack',
      quantity: 1,
      image: 'https://c.animaapp.com/mh96kubogMaabT/img/ai_1.png',
      badge: 'BONUS',
      description: 'Exclusive digital content and bonus materials',
    },
  ];

  const updateQuantity = (id, delta) => {
    setAddOns((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
    );
  };

  const totalAddOnsPrice = addOns.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[35%_1fr] gap-8">
      {/* Left Column - Reward Card (35%) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <RewardDetailCard reward={reward} />
      </motion.div>

      {/* Right Column - Details (65%) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-8"
      >
        {/* Description */}
        <Card className="p-6 border border-border/50">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Customize Your Pledge with Add-ons
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base">
            {reward.description}
          </p>
        </Card>

        {/* Included Items */}
        <Card className="p-6 border border-border/50">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-foreground">
              {includedItems.length} Items Included
            </h3>
            <div className="w-8 h-8 rounded-sm gradient-2 flex items-center justify-center">
              <CheckIcon className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <div className="space-y-4">
            {includedItems.map((item) => (
              <RewardItem
                key={item.id}
                item={item}
                variant="default"
                rightContent={
                  item.badge && (
                    <span
                      className="px-3 py-1 rounded-sm text-xs font-bold text-white"
                      style={{
                        background: 'linear-gradient(135deg, #1EC794 0%, #0894E2 100%)',
                      }}
                    >
                      {item.badge}
                    </span>
                  )
                }
              />
            ))}
          </div>
        </Card>

        {/* Add-ons */}
        <Card className="p-6 border border-border/50">
          <h3 className="text-lg font-bold text-foreground mb-5">
            Optional Add-ons
          </h3>

          <div className="space-y-5">
            {addOns.map((addon, index) => (
              <motion.div
                key={addon.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="overflow-hidden"
              >
                <RewardItem
                  item={addon}
                  variant="addon"
                  showQuantity={false}
                  rightContent={
                    <div className="flex flex-col gap-3">
                      <div
                        className="px-4 py-2 rounded-sm font-bold text-white shadow-md whitespace-nowrap text-center"
                        style={{
                          background: 'linear-gradient(135deg, #FFB700 0%, #FF9603 100%)',
                        }}
                      >
                        +${addon.price}
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-sm"
                          onClick={() => updateQuantity(addon.id, -1)}
                          disabled={addon.quantity === 0}
                        >
                          <MinusIcon className="w-4 h-4" />
                        </Button>
                        <span className="font-semibold text-foreground min-w-[2.5rem] text-center">
                          {addon.quantity > 0 ? `×${addon.quantity}` : '0'}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-sm"
                          onClick={() => updateQuantity(addon.id, 1)}
                        >
                          <PlusIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  }
                />

                {/* Selected Indicator */}
                {addon.quantity > 0 && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    className="px-4 py-2 gradient-2 text-white text-sm font-semibold mt-0 rounded-b-sm"
                  >
                    Added: {addon.quantity} × ${addon.price} = ${addon.quantity * addon.price}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Total */}
          {totalAddOnsPrice > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 183, 0, 0.1) 0%, rgba(255, 150, 3, 0.1) 100%)',
                border: '2px solid rgba(255, 183, 0, 0.3)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground">Add-ons Total:</span>
                <span className="text-xl font-bold text-accent">+${totalAddOnsPrice}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-accent/20">
                <span className="text-lg font-bold text-foreground">Grand Total:</span>
                <span className="text-2xl font-bold text-primary">
                  ${reward.price + totalAddOnsPrice}
                </span>
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}

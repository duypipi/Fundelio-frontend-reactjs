import { motion } from 'framer-motion';

/**
 * RewardItem Component
 * Reusable component for displaying included items and add-ons
 * 
 * @param {Object} item - Item data
 * @param {string} item.id - Unique identifier
 * @param {string} item.name - Item name
 * @param {number} item.quantity - Item quantity
 * @param {string} [item.image] - Optional item image URL
 * @param {string} [item.badge] - Optional badge text (e.g., "INCLUDED", "BONUS")
 * @param {string} [item.description] - Optional item description
 * @param {React.ReactNode} [rightContent] - Optional content to display on the right (e.g., badge, price)
 * @param {boolean} [showQuantity=true] - Whether to show quantity text
 * @param {string} [variant='default'] - Variant styling ('default' or 'addon')
 */
export function RewardItem({ 
  item, 
  rightContent, 
  showQuantity = true,
  variant = 'default'
}) {
  const isAddon = variant === 'addon';

  return (
    <motion.div
      className={`flex items-start justify-between p-5 rounded-sm border border-border/50 ${
        isAddon ? 'hover:border-primary/30' : 'bg-gradient-to-r from-success/5 to-transparent'
      } transition-colors`}
      whileHover={{ scale: isAddon ? 1 : 1.01 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="flex items-start gap-4 flex-1 min-w-0">
        {/* Image */}
        {item.image && (
          <div className={`${isAddon ? 'w-20 h-20' : 'w-16 h-16'} rounded-sm overflow-hidden bg-gray-100 flex-shrink-0`}>
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-foreground text-base">{item.name}</p>
          
          {/* Description (optional) */}
          {item.description && (
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {item.description}
            </p>
          )}
          
          {/* Quantity */}
          {showQuantity && (
            <p className="text-sm text-muted-foreground mt-2">
              Quantity: {item.quantity}
            </p>
          )}
        </div>
      </div>

      {/* Right Content (badge, price, controls, etc.) */}
      {rightContent && (
        <div className="flex-shrink-0 ml-4">
          {rightContent}
        </div>
      )}
    </motion.div>
  );
}

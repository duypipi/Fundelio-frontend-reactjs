import React from 'react';
import { Check } from 'lucide-react';
/**
 * Payment Package Card Component
 * @param {Object} props
 * @param {number} props.amount - Base amount (e.g., 575, 1275, etc.)
 * @param {number} props.bonus - Bonus amount
 * @param {number} props.price - Price in VND
 * @param {string} props.image - Image URL for the package
 * @param {boolean} props.selected - Whether this package is selected
 * @param {Function} props.onSelect - Callback when package is clicked
 */
const PaymentPackageCard = ({ 
  amount, 
  bonus, 
  price, 
  image, 
  selected = false, 
  onSelect 
}) => {
  const totalRP = amount + bonus;
  
  // Format price to VND
  const formatPrice = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  return (
    <div
      onClick={onSelect}
      className={`
        group relative cursor-pointer rounded-lg overflow-hidden
        transition-all duration-300 ease-in-out
        hover:scale-105 hover:shadow-xl
        ${selected 
          ? 'ring-2 ring-primary' 
          : 'ring-1 ring-border-light dark:ring-white/10 hover:ring-primary/50'
        }
      `}
    >
      {/* Card Content */}
      <div className="relative bg-background-light dark:bg-[#1c2237]">
        {/* Image Section */}
        <div className="relative h-24 bg-gradient-to-br from-indigo-950 via-slate-900 to-black flex items-center justify-center">
          <img 
            src={image} 
            alt={`${totalRP} RP Package`}
            className="h-full w-auto object-contain drop-shadow-2xl"
          />
          
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Package Info */}
        <div className="p-3 pt-2 space-y-2">
          {/* Coin Amount */}
          <div className="text-start flex items-center">
            <p className="text-text-primary dark:text-white text-md">
              Gói {totalRP} <img src="/packages/coin.svg" alt="Coin" className="inline-block w-5 h-5 mb-0.5" />
            </p>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-secondary">
              {formatPrice(price)} VND
            </span>
            
            {/* Select Button or Check Mark */}
            {selected ? (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                <Check className="w-5 h-5" />
              </div>
            ) : (
              <button className="flex items-center justify-center w-8 h-8 rounded-full bg-primary hover:bg-secondary/90 text-white transition-all duration-200 hover:scale-110">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPackageCard;

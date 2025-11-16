# Pledge Flow Implementation

## Overview

Implemented a complete pledge flow where users can select a single reward with multiple add-ons, then proceed to a pledge summary page to confirm their pledge.

## Changes Made

### 1. RewardDetailModal Component

**File:** `/src/components/campaign/rewards/reward-detail/RewardDetailModal.jsx`

**Changes:**

- ✅ Removed reward quantity selector (users can only select 1 reward)
- ✅ Added max quantity constraint for add-ons (max 10 per item)
- ✅ Added `campaignId` prop
- ✅ Added navigation to PledgeSummaryPage on confirm
- ✅ Updated calculation to use single reward (no quantity multiplier)

**Key Features:**

```javascript
// Single reward - no quantity selector
const [selectedAddOns, setSelectedAddOns] = useState([]);

// Add-on quantity constraint (max 10)
const updateAddOnQuantity = (addonId, delta) => {
  setSelectedAddOns((prev) =>
    prev.map((addon) =>
      addon.id === addonId
        ? {
            ...addon,
            quantity: Math.max(1, Math.min(10, addon.quantity + delta)),
          }
        : addon
    )
  );
};

// Navigate to pledge summary
const handleSubmit = () => {
  const pledgeData = {
    reward,
    quantity: 1,
    addOns: selectedAddOns,
    total: calculateTotal(),
    campaignId,
  };

  navigate(`/campaigns/${campaignId}/pledge`, {
    state: { pledgeData },
  });
};
```

### 2. PledgeSummaryPage Component

**File:** `/src/pages/PledgeSummaryPage.jsx`

**New Page Structure:**

#### Section 1: Reward and Add-ons Display

- Displays selected reward with image, title, description, and price
- Shows all selected add-ons with their quantities
- Separated by `<hr>` tags for clarity

#### Section 2: Included Products (Collapsible)

- Show/hide toggle with chevron icon
- Uses `RewardItem` component to display included products
- Shows all items that come with the reward

#### Section 3: Order Summary (Highlighted)

- **Amount:** Base pledge amount (reward + add-ons)
- **Bonus Amount:** Optional input for users to add extra support
- **Total Amount:** Final calculated total
- Styled with border and background to stand out

#### Section 4: Terms and Conditions

- Statement about supporting creative projects
- Checkbox: "Tôi hiểu rằng Fundelio hoặc người sáng tạo không đảm bảo sẽ trao phần thưởng hoặc hoàn tiền"
- Links to Terms of Use and Privacy Policy
- Pledge button showing total amount (disabled until terms accepted)

**Key Features:**

```javascript
// Calculate total with bonus
const amount = rewardAmount + addOnsAmount;
const totalAmount = amount + (bonusAmount || 0);

// Collapsible included products
const [showProducts, setShowProducts] = useState(false);

// Terms acceptance
const [agreeToTerms, setAgreeToTerms] = useState(false);

// Pledge button disabled until terms accepted
<Button
  onClick={handlePledge}
  disabled={!agreeToTerms}
  className="w-full h-14 text-lg font-bold"
>
  Ủng hộ {formatPrice(totalAmount)} VND
</Button>;
```

### 3. Routing

**File:** `/src/routes/index.jsx`

**Added Route:**

```javascript
{ path: ':campaignId/pledge', element: <PledgeSummaryPage /> }
```

### 4. Props Chain Updates

Updated all components in the chain to pass `campaignId`:

**Files Updated:**

1. `/src/pages/CampaignDetailPage.jsx` - Added `campaignId` to `campaignProps`
2. `/src/components/campaign/CampaignTabs.jsx` - Pass `campaignId` to RewardsPage
3. `/src/components/campaign/CampaignPage.jsx` - Pass `campaignId` to RewardsColumn
4. `/src/components/campaign/RewardsPage.jsx` - Pass `campaignId` to RewardDetailSection
5. `/src/components/campaign/rewards/RewardsColumn.jsx` - Pass `campaignId` to RewardCard
6. `/src/components/campaign/rewards/reward-detail/RewardDetalSection.jsx` - Pass `campaignId` to RewardDetailCard
7. `/src/components/campaign/rewards/reward-detail/RewardDetailCard.jsx` - Pass `campaignId` to RewardDetailModal
8. `/src/components/campaign/rewards/RewardCard.jsx` - Added modal and `campaignId` support

### 5. RewardCard Enhancement

**File:** `/src/components/campaign/rewards/RewardCard.jsx`

**Changes:**

- Added `useState` for modal control
- Added `RewardDetailModal` import
- Both action buttons now open the modal
- Modal handles navigation to pledge summary

## User Flow

1. **Browse Rewards**

   - User sees rewards in Story tab (RewardsColumn) or Rewards tab
   - Clicks on reward card or price button

2. **Select Reward & Add-ons**

   - Modal opens showing reward details
   - User can select multiple add-ons (each with quantity 1-10)
   - Only 1 reward can be selected (no quantity selector)
   - Clicks "Xác nhận ủng hộ"

3. **Review Pledge**

   - Navigated to `/campaigns/:campaignId/pledge`
   - See selected reward and add-ons with all details
   - Can expand/collapse included products
   - See order summary with amounts

4. **Confirm Terms & Pledge**
   - Optional: Add bonus amount
   - Must check terms agreement checkbox
   - Click "Ủng hộ [total] VND" button
   - Proceed to payment (TODO: integrate payment)

## Data Structure

### Pledge Data Passed via Navigation State

```javascript
{
  reward: {
    rewardId,
    title,
    description,
    imageUrl,
    minPledgedAmount,
    items: {
      included: [...],
      addOn: [...]
    }
  },
  quantity: 1, // Always 1
  addOns: [
    {
      id,
      title,
      price,
      quantity, // 1-10
      image,
      description
    }
  ],
  total: number,
  campaignId: string
}
```

## Styling Highlights

- **Section 3 (Order Summary):**

  - Border: `border-2 border-primary/20`
  - Background: `bg-primary/5`
  - Makes it stand out for user attention

- **Pledge Button:**

  - Large: `h-14 text-lg font-bold`
  - Full width
  - Disabled state when terms not accepted

- **Sections:**
  - Separated with Card components
  - Consistent padding and spacing
  - Responsive design

## TODOs

- [ ] Integrate payment gateway
- [ ] Add success/confirmation page after pledge
- [ ] Store pledge data to backend
- [ ] Add loading states during submission
- [ ] Add validation for bonus amount (minimum/maximum)
- [ ] Add estimated total delivery date
- [ ] Add shipping address form (if applicable)

## Testing Checklist

- [ ] Modal opens from both Story and Rewards tabs
- [ ] Can select multiple add-ons
- [ ] Add-on quantity increments work (max 10)
- [ ] Total calculation is correct
- [ ] Navigation to pledge summary works
- [ ] All reward and add-on details display correctly
- [ ] Included products toggle works
- [ ] Bonus amount input works
- [ ] Terms checkbox prevents pledge when unchecked
- [ ] Pledge button shows correct total
- [ ] Back button returns to campaign page
- [ ] Redirect works when no pledge data in state

## Notes

- Reward quantity was intentionally removed per requirements
- Add-ons have strict max quantity of 10
- CampaignId is now passed through entire component tree
- RewardCard now opens modal instead of direct pledge
- All calculations use VND currency format

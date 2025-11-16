# Refactor Campaign Detail Page - Sử dụng trực tiếp API data

## Tổng quan

Đã sửa lại trang chi tiết chiến dịch (`CampaignDetailPage.jsx`) để sử dụng trực tiếp data từ API thay vì transform qua nhiều lớp. Giảm complexity và dễ maintain hơn.

## Files đã sửa

### 1. `/src/pages/CampaignDetailPage.jsx`

**Thay đổi chính:**

- ✅ Xóa bỏ hàm `transformApiData()` và `transformPreviewData()`
- ✅ Xóa bỏ `getMockCampaignData()`
- ✅ Dùng trực tiếp response từ `campaignApi.getCampaignById()`
- ✅ Thêm state `rewards` riêng biệt
- ✅ Thêm state `activeTab` để track tab hiện tại
- ✅ Lazy load rewards khi chuyển sang tab Rewards
- ✅ Transform `blanks` từ `campaignSections` bằng `getBlanksFromSections()`
- ✅ Tạo `creatorData` từ `campaign.owner`

**API được sử dụng:**

```javascript
// Load campaign basic info + story
campaignApi.getCampaignById(campaignId);

// Load rewards khi chuyển sang tab Rewards
rewardApi.getRewardsWithItems(campaignId);
```

**Data flow:**

```
API Response → CampaignData State
              ↓
        CampaignHeader (nhận campaign)
        CampaignTabs → CampaignPage (nhận blanks)
                    → RewardsPage (nhận rewards)
```

### 2. `/src/components/campaign/CampaignHeader.jsx`

**Thay đổi:**

- ✅ Đổi `highlights` → `description` (khớp với API field)
- ✅ Đổi `pledged` → `pledgedAmount`
- ✅ Đổi `goal` → `goalAmount`
- ✅ Đổi `backers` → `backersCount`
- ✅ Tạo `creator` object từ `owner` (firstName, lastName)
- ✅ Comment các field không có trong API

**API fields được dùng:**

- `title`, `description`, `introImageUrl`, `introVideoUrl`
- `pledgedAmount`, `goalAmount`, `backersCount`, `daysLeft`
- `owner.firstName`, `owner.lastName`

### 3. `/src/components/campaign/CampaignTabs.jsx`

**Thay đổi:**

- ✅ Thêm prop `onTabChange` callback
- ✅ Gọi `onTabChange` khi user click tab

**Lý do:** Để `CampaignDetailPage` biết khi nào load rewards API

### 4. `/src/api/rewardApi.jsx`

Đã có sẵn, không cần sửa:

- `getRewardsWithItems(campaignId)` - Get all rewards with items

## Data Structure từ API

### Campaign Data (từ `getCampaignById`)

```json
{
  "campaignId": "uuid",
  "title": "string",
  "description": "string",
  "goalAmount": number,
  "pledgedAmount": number,
  "backersCount": number,
  "campaignCategory": "string",
  "introImageUrl": "string",
  "introVideoUrl": "string",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "campaignStatus": "DRAFT|ACTIVE|...",
  "owner": {
    "userId": "uuid",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "createdAt": "timestamp"
  },
  "campaignSections": [
    {
      "campaignSectionId": "uuid",
      "tabTitle": "string",
      "formatTitle": "html",
      "itemData": "html",
      "orderIndex": number
    }
  ]
}
```

### Rewards Data (từ `getRewardsWithItems`)

```json
{
  "content": [
    {
      "rewardId": "uuid",
      "title": "string",
      "description": "string",
      "imageUrl": "string",
      "minPledgedAmount": number,
      "shipsTo": ["string"],
      "estimatedDelivery": "YYYY-MM-DD",
      "rewardStatus": "AVAILABLE",
      "items": {
        "included": [
          {
            "catalogItemId": "uuid",
            "name": "string",
            "price": number,
            "quantity": number,
            "imageUrl": "string",
            "componentType": "INCLUDED"
          }
        ],
        "addOn": [...]
      }
    }
  ]
}
```

## Computed Fields

### daysLeft

```javascript
const endDate = apiData.endDate ? new Date(apiData.endDate) : new Date();
const today = new Date();
const daysLeft = Math.max(
  0,
  Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))
);
```

### blanks (cho Story tab)

```javascript
const blanks = apiData.campaignSections
  ? getBlanksFromSections(apiData.campaignSections)
  : [];
```

### creatorData (cho Creator tab)

```javascript
const creatorData = {
  name: `${owner.firstName} ${owner.lastName}`.trim(),
  username: owner.email,
  avatar: owner.profileImage || default,
  bio: owner.bio || 'Campaign creator',
  // ... các field khác
}
```

## Preview Mode

### Preview với Campaign ID thật (UUID)

```javascript
if (!isPreviewId(previewId)) {
  // Load từ API như bình thường
  const response = await campaignApi.getCampaignById(previewId);
}
```

### Preview với data từ localStorage

```javascript
else {
  // Load từ localStorage
  const stateData = location.state?.campaignData;
  const { basics, story, rewards } = stateData;

  setCampaignData({
    ...basics,
    daysLeft,
    blanks: story?.blanks || [],
  });

  setRewards(rewards?.rewards || []);
}
```

## TODO - Các phần chưa hoàn thành

### Items & Add-ons

- ❌ Chưa có API endpoint cho items riêng lẻ
- ❌ Add-ons grid chưa implement (đợi sửa UI)
- ⚠️ Hiện tại truyền empty array: `items: []`, `addOns: []`

### Related Projects

- ❌ Chưa có API lấy other projects của creator
- ⚠️ Hiện tại truyền: `otherProjects: []`

### Creator Stats

- ❌ API chưa có: `createdProjects`, `backedProjects`
- ⚠️ Hiện tại set: `createdProjects: 0`, `backedProjects: 0`

## Testing Checklist

### Normal Mode (Published Campaign)

- [ ] Load campaign từ `/campaigns/:campaignId`
- [ ] Hiển thị đúng title, description, images
- [ ] Progress bar tính đúng
- [ ] Backers count, days left đúng
- [ ] Tab Story hiển thị blanks từ campaignSections
- [ ] Tab Rewards lazy load khi click
- [ ] Tab Creator hiển thị owner info

### Preview Mode (Real Campaign ID)

- [ ] Load campaign từ `/preview/:campaignId`
- [ ] Banner "Chế độ xem trước" xuất hiện
- [ ] Button "Thoát xem trước" navigate đúng
- [ ] Data hiển thị giống Normal Mode

### Preview Mode (localStorage)

- [ ] Load từ `/preview/:previewId` (random ID)
- [ ] Đọc data từ `location.state` hoặc localStorage
- [ ] Hiển thị preview data đúng
- [ ] Rewards từ preview state nếu có

## Migration Notes

### Trước đây

```javascript
// Transform nhiều lớp
API → transformApiData → { campaign, rewards, items, blanks, creator }
      ↓
  Components nhận nested structure
```

### Bây giờ

```javascript
// Dùng trực tiếp
API → campaignData (flat structure)
    ↓
  Components nhận đúng API fields
```

### Breaking Changes

- ❌ `campaign.highlights` → `campaign.description`
- ❌ `campaign.pledged` → `campaign.pledgedAmount`
- ❌ `campaign.goal` → `campaign.goalAmount`
- ❌ `campaign.backers` → `campaign.backersCount`
- ❌ Không còn nested `campaign.campaign.xxx`

## Performance

### Before

- Load tất cả data một lần (rewards, items, addons)
- Transform toàn bộ data ngay từ đầu

### After

- Load campaign info trước
- Lazy load rewards khi cần (tab Rewards)
- Giảm initial load time

## Lợi ích

1. **Code đơn giản hơn**: Bỏ 2 hàm transform phức tạp
2. **Dễ maintain**: Thêm field mới chỉ cần map trong component
3. **Performance tốt hơn**: Lazy load rewards
4. **Type safe hơn**: Data structure khớp với API doc
5. **Debug dễ hơn**: Không cần trace qua nhiều layer transform

## Notes

- Currency mặc định: `VND`
- Location mặc định: `Vietnam` (API chưa có)
- Các field computed: `daysLeft`, `blanks`, `creatorData`
- Rewards chỉ load khi user click tab Rewards

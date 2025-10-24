import { useState, useRef } from "react"
import Button from "@/components/common/Button"
import Input from "@/components/common/Input"
import Checkbox from "@/components/common/Checkbox"

export default function ItemForm({ item, rewards, onSave, onCancel }) {
  const [formData, setFormData] = useState(
    item || {
      id: `item${Date.now()}`,
      title: "",
      image: null,
      rewardRefs: [],
    },
  )
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          image: event.target?.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRewardToggle = (rewardId) => {
    setFormData((prev) => ({
      ...prev,
      rewardRefs: prev.rewardRefs.includes(rewardId)
        ? prev.rewardRefs.filter((id) => id !== rewardId)
        : [...prev.rewardRefs, rewardId],
    }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSave(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-sm border border-border bg-white dark:bg-darker p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {item ? "Chỉnh sửa thành phần" : "Tạo thành phần mới"}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tiêu đề *</label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ví dụ: Sách in, Sticker set"
              error={errors.title}
            />
            {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title}</p>}
            <p className="mt-2 text-xs text-muted-foreground">
              💡 Tên cần ngắn gọn, mô tả đúng 'một món hàng' (SKU). Ảnh nên theo tỉ lệ 3:2 để hiển thị đẹp.
            </p>
          </div>

               <div className="rounded-sm border border-border bg-white dark:bg-darker p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Hình ảnh</h3>
        
        {/* Upload Area - Only show when no image */}
        {!formData.image && (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl">
              <div className="border-2 border-dashed border-border rounded-sm p-8 bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center text-center space-y-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 border border-border rounded-sm text-foreground bg-background hover:bg-muted transition-colors font-medium"
                  >
                    Upload a file
                  </button>
                  
                  <p className="text-sm text-muted-foreground">Select a file.</p>
                  
                  <p className="text-xs text-muted-foreground">
                    Image specifications: JPG, PNG, GIF, or WEBP, 3:2 ratio, 348 × 232 pixels, 50 MB maximum
                  </p>
                </div>
              </div>
              
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="hidden" 
              />
            </div>
          </div>
        )}

        {/* Image Preview - Only show when image exists */}
        {formData.image && (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl">
              <div className="relative aspect-video rounded-sm overflow-hidden bg-muted border border-border">
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="mt-3 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 border border-border rounded-sm text-foreground bg-background hover:bg-muted transition-colors text-sm font-medium"
                >
                  Thay đổi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newData = { ...formData, image: null }
                    setFormData(newData)
                    onChange(newData)
                  }}
                  className="px-4 py-2 border border-destructive text-destructive rounded-sm hover:bg-destructive/10 transition-colors text-sm font-medium"
                >
                  Xóa ảnh
                </button>
              </div>
            </div>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="hidden" 
            />
          </div>
        )}

        <p className="mt-4 text-xs text-muted-foreground text-center">
          💡 Show your backers what they'll receive for their support. Images should be{" "}
          <span className="text-primary">honest</span>, and should avoid banners, badges, and overlaid text.
        </p>
      </div>

          {rewards.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Gán vào phần thưởng (tùy chọn)</label>
              <div className="space-y-2">
                {rewards.map((reward) => (
                  <Checkbox
                    key={reward.id}
                    checked={formData.rewardRefs.includes(reward.id)}
                    onChange={() => handleRewardToggle(reward.id)}
                    label={reward.title}
                  />
                ))}
              </div>
            </div>
          )}

          {rewards.length === 0 && (
            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">💡 Chưa có Reward, bạn có thể tạo ở tab Reward tiers</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" variant="primary">
            Lưu
          </Button>
        </div>
      </div>
    </form>
  )
}

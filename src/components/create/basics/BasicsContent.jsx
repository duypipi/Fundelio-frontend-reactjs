import { useState, useEffect, useRef } from 'react';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import { useLocalStorage } from '@/hooks/useLocalStorge';

const CATEGORIES = [
  'Nghệ thuật',
  'Truyện tranh & Minh họa',
  'Thiết kế & Công nghệ',
  'Phim & Video',
  'Thực phẩm & Thủ công',
  'Trò chơi',
  'Nhạc',
  'Xuất bản',
];

export default function BasicsContent() {
  const { value: savedData, setValue: setSavedData } = useLocalStorage('ff:campaign-basics', null);
  
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    category: '',
    image_url: null,
    intro_video_url: null,
    start_date: '',
    end_date: '',
  });

  const [mounted, setMounted] = useState(false);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Hydrate from localStorage
  useEffect(() => {
    setMounted(true);
    if (savedData) {
      setFormData(savedData);
    } else {
      // Set default dates
      const today = new Date();
      const endDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
      
      setFormData(prev => ({
        ...prev,
        start_date: today.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
      }));
    }
  }, [savedData]);

  // Auto-save to localStorage with debounce
  useEffect(() => {
    if (!mounted) return;
    
    const timer = setTimeout(() => {
      setSavedData(formData);
    }, 500);

    return () => clearTimeout(timer);
  }, [formData, mounted, setSavedData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          image_url: event.target?.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          intro_video_url: event.target?.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      {/* Section 1: Title & Description */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Tiêu đề dự án</h3>
          <p className="text-sm text-muted-foreground">
            Viết một tiêu đề ngắn gọn, súc tích để giúp mọi người nhanh chóng hiểu về dự án của bạn. 
            Cả hai sẽ xuất hiện trên trang dự án và trang khởi chạy trước.
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            Các nhà tài trợ tiềm năng cũng sẽ thấy chúng nếu dự án của bạn xuất hiện trên các trang danh mục, 
            kết quả tìm kiếm hoặc trong email chúng tôi gửi đến cộng đồng của mình.
          </p>
        </div>

        <div className="bg-white dark:bg-darker border border-border rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tiêu đề
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Papercuts: A Party Game for the Rude and Well-Read"
                maxLength={60}
              />
              <div className="flex justify-end mt-1">
                <span className="text-xs text-muted-foreground">{formData.title.length}/60</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Mô tả ngắn
              </label>
              <Textarea
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                placeholder="Papercuts is a rowdy card game about books and writing brought to you by Electric Literature."
                rows={3}
                maxLength={135}
              />
              <div className="flex justify-end mt-1">
                <span className="text-xs text-muted-foreground">{formData.desc.length}/135</span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <span className="text-primary mt-0.5">💡</span>
              <p className="text-sm text-foreground">
                Tạo ấn tượng đầu tiên tốt nhất cho nhà tài trợ với tiêu đề tuyệt vời.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Category */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Danh mục</h3>
          <p className="text-sm text-muted-foreground">
            Chọn danh mục phù hợp nhất cho dự án của bạn. 
            Điều này giúp mọi người dễ dàng tìm thấy dự án của bạn.
          </p>
        </div>

        <div className="bg-white dark:bg-darker border border-border rounded-lg p-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Danh mục dự án
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          >
            <option value="">Chọn danh mục</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Section 3: Project Image */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Ảnh dự án</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Thêm một hình ảnh đại diện rõ ràng cho dự án của bạn. 
            Chọn một hình ảnh trông đẹp ở các kích thước khác nhau—nó sẽ xuất hiện trên trang dự án của bạn, 
            trên trang web Kickstarter và ứng dụng di động, và (khi được chia sẻ) trên các kênh mạng xã hội.
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            Hình ảnh của bạn phải có kích thước ít nhất 1024×576 pixel. 
            Nó sẽ được cắt theo tỷ lệ 16:9.
          </p>
          <p className="text-sm text-primary font-medium">
            Tránh hình ảnh có banner, huy hiệu hoặc văn bản—chúng khó đọc ở kích thước nhỏ hơn, 
            có thể bị phạt bởi thuật toán Facebook và giảm cơ hội có được các tính năng trang chủ 
            và bản tin của Kickstarter.
          </p>
        </div>

        <div className="rounded-sm border border-border bg-white dark:bg-darker p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Hình ảnh</h3>
          
          {/* Upload Area - Only show when no image */}
          {!formData.image_url && (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-2xl">
                <div className="border-2 border-dashed border-border rounded-sm p-8 bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="px-6 py-3 border border-border rounded-sm text-foreground bg-background hover:bg-muted transition-colors font-medium"
                    >
                      Upload a file
                    </button>
                    
                    <p className="text-sm text-muted-foreground">Select a file.</p>
                    
                    <p className="text-xs text-muted-foreground">
                      Image specifications: JPG, PNG, GIF, or WEBP, 16:9 ratio, 1024 × 576 pixels minimum, 50 MB maximum
                    </p>
                  </div>
                </div>
                
                <input 
                  ref={imageInputRef} 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden" 
                />
              </div>
            </div>
          )}

          {/* Image Preview - Only show when image exists */}
          {formData.image_url && (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-2xl">
                <div className="relative aspect-video rounded-sm overflow-hidden bg-muted border border-border">
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="mt-3 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="px-4 py-2 border border-border rounded-sm text-foreground bg-background hover:bg-muted transition-colors text-sm font-medium"
                  >
                    Thay đổi
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image_url: null }))}
                    className="px-4 py-2 border border-destructive text-destructive rounded-sm hover:bg-destructive/10 transition-colors text-sm font-medium"
                  >
                    Xóa ảnh
                  </button>
                </div>
              </div>
              <input 
                ref={imageInputRef} 
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
      </div>

      {/* Section 4: Project Video */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Video dự án (tùy chọn)</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Thêm một video mô tả dự án của bạn.
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            Hãy cho mọi người biết bạn đang gây quỹ để làm gì, 
            bạn có kế hoạch thực hiện nó như thế nào, bạn là ai, 
            và tại sao bạn quan tâm đến dự án này.
          </p>
          <p className="text-sm text-muted-foreground">
            Sau khi bạn tải video lên, hãy sử dụng trình chỉnh sửa của chúng tôi 
            để thêm chú thích và phụ đề để dự án của bạn dễ tiếp cận hơn với mọi người.
          </p>
        </div>

        <div className="rounded-sm border border-border bg-white dark:bg-darker p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Video giới thiệu</h3>
          
          {/* Upload Area - Only show when no video */}
          {!formData.intro_video_url && (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-2xl">
                <div className="border-2 border-dashed border-border rounded-sm p-8 bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="px-6 py-3 border border-border rounded-sm text-foreground bg-background hover:bg-muted transition-colors font-medium"
                    >
                      Upload a video
                    </button>
                    
                    <p className="text-sm text-muted-foreground">Select a video file.</p>
                    
                    <p className="text-xs text-muted-foreground">
                      Video specifications: MP4, MOV, AVI, or WEBM, 16:9 ratio recommended, 500 MB maximum
                    </p>
                  </div>
                </div>
                
                <input 
                  ref={videoInputRef} 
                  type="file" 
                  accept="video/*" 
                  onChange={handleVideoChange} 
                  className="hidden" 
                />
              </div>
            </div>
          )}

          {/* Video Preview - Only show when video exists */}
          {formData.intro_video_url && (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-2xl">
                <div className="relative aspect-video rounded-sm overflow-hidden bg-muted border border-border">
                  <video 
                    src={formData.intro_video_url} 
                    className="w-full h-full object-cover" 
                    controls 
                  />
                </div>
                <div className="mt-3 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="px-4 py-2 border border-border rounded-sm text-foreground bg-background hover:bg-muted transition-colors text-sm font-medium"
                  >
                    Thay đổi
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, intro_video_url: null }))}
                    className="px-4 py-2 border border-destructive text-destructive rounded-sm hover:bg-destructive/10 transition-colors text-sm font-medium"
                  >
                    Xóa video
                  </button>
                </div>
              </div>
              <input 
                ref={videoInputRef} 
                type="file" 
                accept="video/*" 
                onChange={handleVideoChange} 
                className="hidden" 
              />
            </div>
          )}

          <p className="mt-4 text-xs text-muted-foreground text-center">
            💡 Tell people what you're raising funds to do, how you plan to make it happen, who you are, and why you care about this project.
          </p>
        </div>
      </div>

      {/* Section 5: Campaign Duration */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Thời gian chiến dịch</h3>
          <p className="text-sm text-muted-foreground">
            Chọn ngày bắt đầu và kết thúc cho chiến dịch gây quỹ của bạn. 
            Hầu hết các chiến dịch thành công kéo dài từ 30-60 ngày.
          </p>
        </div>

        <div className="bg-white dark:bg-darker border border-border rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Ngày bắt đầu
              </label>
              <Input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Ngày kết thúc
              </label>
              <Input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                min={formData.start_date}
              />
            </div>
          </div>

          {formData.start_date && formData.end_date && (
            <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-foreground">
                <span className="font-medium">Thời gian chiến dịch:</span>{' '}
                {Math.ceil((new Date(formData.end_date) - new Date(formData.start_date)) / (1000 * 60 * 60 * 24))} ngày
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

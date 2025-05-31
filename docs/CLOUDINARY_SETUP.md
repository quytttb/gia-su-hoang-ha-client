# 🌤️ Cloudinary Setup Guide

## Tại sao chọn Cloudinary?

- ✅ **10GB storage miễn phí** (vs 5GB Firebase)
- ✅ **25GB bandwidth/tháng** 
- ✅ **Tự động tối ưu ảnh** (resize, compress, format conversion)
- ✅ **CDN global** cho tốc độ tải nhanh
- ✅ **API đơn giản** và mạnh mẽ
- ✅ **Transformation on-the-fly** (resize ảnh theo URL)

## 📋 Hướng dẫn Setup

### 1. Tạo tài khoản Cloudinary

1. Truy cập [https://cloudinary.com](https://cloudinary.com)
2. Đăng ký tài khoản miễn phí
3. Sau khi đăng nhập, vào **Dashboard**

### 2. Lấy thông tin cấu hình

Từ Dashboard, copy các thông tin sau:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_API_KEY=your_api_key_here
```

### 3. Tạo Upload Preset

1. Vào **Settings** → **Upload**
2. Scroll xuống **Upload presets**
3. Click **Add upload preset**
4. Cấu hình:
   - **Preset name**: `banners` (hoặc tên khác)
   - **Signing Mode**: `Unsigned`
   - **Folder**: `banners` (tùy chọn)
   - **Allowed formats**: `jpg,png,webp`
   - **Max file size**: `5000000` (5MB)
   - **Auto optimize**: `Yes`
   - **Auto format**: `Yes`
5. Save preset

### 4. Cập nhật Environment Variables

Thêm vào file `.env` của bạn:

```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=banners
VITE_CLOUDINARY_API_KEY=your_api_key
```

## 🔧 Sử dụng trong Code

### Upload Banner

```typescript
import { UploadService } from '../services/uploadService';

const handleUpload = async (file: File) => {
  try {
    const result = await UploadService.uploadBannerImage(
      file,
      (progress) => {
        console.log('Upload progress:', progress.progress + '%');
      }
    );
    
    console.log('Upload success:', result.url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Tối ưu ảnh với URL

```typescript
import { CloudinaryService } from '../services/cloudinaryService';

// Resize ảnh banner cho mobile
const mobileUrl = CloudinaryService.getOptimizedImageUrl(
  'banners/my-banner',
  {
    width: 800,
    height: 400,
    quality: 'auto',
    format: 'webp'
  }
);

// Thumbnail nhỏ
const thumbnailUrl = CloudinaryService.getOptimizedImageUrl(
  'banners/my-banner',
  {
    width: 150,
    height: 100,
    crop: 'fill'
  }
);
```

## 🎯 Tính năng nâng cao

### 1. Auto-optimization
Cloudinary tự động:
- Chọn format tối ưu (WebP cho Chrome, JPEG cho Safari)
- Compress ảnh không mất chất lượng
- Responsive images

### 2. Transformations
```typescript
// Blur ảnh
const blurredUrl = CloudinaryService.getOptimizedImageUrl(
  'banners/my-banner',
  { blur: 300 }
);

// Thêm text overlay
const textOverlayUrl = `https://res.cloudinary.com/${cloudName}/image/upload/l_text:Arial_60:Hello%20World/banners/my-banner.jpg`;
```

### 3. Video support
Cloudinary cũng hỗ trợ video với tính năng tương tự

## 🔄 Migration từ Firebase

Nếu bạn đã có ảnh trên Firebase Storage:

1. Download ảnh từ Firebase
2. Upload lên Cloudinary
3. Update database với URL mới
4. Xóa ảnh cũ từ Firebase (tùy chọn)

## 🚨 Lưu ý bảo mật

- **Upload Preset**: Sử dụng `unsigned` cho client uploads
- **API Key**: Không cần thiết cho uploads, chỉ dùng cho quản lý
- **API Secret**: KHÔNG bao giờ expose trên frontend
- **Deletion**: Implement trên backend API với API Secret

## 📊 So sánh với Firebase Storage

| Tính năng | Cloudinary | Firebase Storage |
|-----------|------------|------------------|
| Free Storage | 10GB | 5GB |
| Free Bandwidth | 25GB/month | 1GB/day |
| Auto-optimization | ✅ | ❌ |
| Image transformations | ✅ | ❌ |
| CDN | ✅ Global | ✅ Google |
| Setup complexity | Easy | Medium |
| Real-time optimizations | ✅ | ❌ | 

# Hướng dẫn cấu hình Cloudinary

## 1. Tạo tài khoản Cloudinary

1. Truy cập https://cloudinary.com và đăng ký tài khoản miễn phí
2. Sau khi đăng ký, bạn sẽ nhận được:
   - Cloud Name: `dobcvvl12`
   - API Key
   - API Secret

## 2. Cấu hình Upload Preset

### Cách 1: Sử dụng preset mặc định
- Cloudinary cung cấp preset mặc định `ml_default` cho unsigned uploads
- Preset này cho phép upload trực tiếp từ browser mà không cần authentication

### Cách 2: Tạo preset tùy chỉnh
1. Đăng nhập vào Cloudinary Console
2. Vào Settings → Upload → Upload Presets
3. Click "Add upload preset"
4. Cấu hình:
   - **Preset name**: `gia-su-hoang-ha` (hoặc tên tùy chọn)
   - **Signing Mode**: Unsigned (cho phép upload từ client)
   - **Folder**: Để trống (chúng ta sẽ set folder khi upload)
   
5. Trong tab "Upload Control":
   - **Allowed formats**: jpg, jpeg, png, webp, gif
   - **Max file size**: 5MB
   
6. Trong tab "Upload Manipulations":
   - **Quality**: Auto
   - **Format**: Auto
   
7. Save preset

## 3. Cấu hình trong dự án

### Tạo file .env
```bash
# Google Analytics
VITE_GA_TRACKING_ID=G-0C25SX7IGJ

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyC0ZGhS9oJTZp2jl9fVnQlYq8FQXZvZMJU
VITE_FIREBASE_AUTH_DOMAIN=gia-su-hoang-ha.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gia-su-hoang-ha
VITE_FIREBASE_STORAGE_BUCKET=gia-su-hoang-ha.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=821551022903
VITE_FIREBASE_APP_ID=1:821551022903:web:00a86f5c5a35e0c1e3e9f8
VITE_FIREBASE_MEASUREMENT_ID=G-0C25SX7IGJ

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=dobcvvl12
VITE_CLOUDINARY_UPLOAD_PRESET=ml_default
```

## 4. Cấu trúc thư mục trên Cloudinary

Dự án sử dụng các thư mục sau trên Cloudinary:
- `banners/` - Lưu trữ banner cho trang chủ
- `tutors/` - Lưu trữ ảnh giáo viên
- `courses/` - Lưu trữ ảnh khóa học

## 5. Upload hình ảnh

### Upload qua Admin Panel
1. Vào `/panel/banners`
2. Click "Thêm Banner" hoặc "Khởi Tạo Banner Mẫu"
3. Chọn file và upload

### Upload programmatically
```javascript
// Upload với folder cụ thể
const result = await CloudinaryService.uploadImage(
  file,
  'banners', // folder
  onProgress
);
```

## 6. Tối ưu hình ảnh

Cloudinary tự động tối ưu hình ảnh với:
- Format tự động (WebP cho browsers hỗ trợ)
- Quality tự động
- CDN delivery

Ví dụ URL tối ưu:
```
https://res.cloudinary.com/dobcvvl12/image/upload/f_auto,q_auto/banners/banner1.jpg
```

## 7. Troubleshooting

### Lỗi "Cloudinary is not configured"
- Kiểm tra file .env đã có đủ cấu hình
- Restart development server sau khi thay đổi .env

### Lỗi upload
- Kiểm tra upload preset tồn tại
- Kiểm tra file size < 5MB
- Kiểm tra định dạng file (jpg, png, webp, gif)

### Lỗi CORS
- Đảm bảo sử dụng unsigned upload preset
- File `cloudinary_cors.html` phải có trong public folder

## 8. Best Practices

1. **Đặt tên file**: Sử dụng tên có ý nghĩa và SEO-friendly
2. **Kích thước**: Upload ảnh với kích thước phù hợp (không quá lớn)
3. **Backup**: Cloudinary tự động backup, nhưng nên giữ bản gốc
4. **Transformations**: Sử dụng transformations để tạo các phiên bản khác nhau

## 9. Giới hạn miễn phí

Gói miễn phí của Cloudinary bao gồm:
- 25 credits hàng tháng
- 25GB storage
- 25GB bandwidth
- Đủ cho website quy mô nhỏ và vừa 
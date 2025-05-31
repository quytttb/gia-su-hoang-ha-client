# 🔥 Hướng Dẫn Tích Hợp Firebase

## 📋 Tổng Quan

Hướng dẫn này bao gồm việc tích hợp Firebase hoàn chỉnh cho website Gia Sư Hoàng Hà, bao gồm xác thực, cơ sở dữ liệu Firestore và triển khai bảo mật.

## 🚀 Giai Đoạn 1: Thiết Lập Dự Án Firebase

### 1. Tạo Dự Án Firebase

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Nhấp "Create a project" (Tạo dự án)
3. Nhập tên dự án: `gia-su-hoang-ha`
4. Bật Google Analytics (tùy chọn)
5. Chọn tài khoản Google Analytics của bạn

### 2. Kích Hoạt Xác Thực

1. Trong Firebase Console, vào **Authentication** > **Sign-in method**
2. Kích hoạt nhà cung cấp **Email/Password**
3. Tùy chọn kích hoạt nhà cung cấp **Google** để đăng nhập dễ dàng hơn

### 3. Tạo Cơ Sở Dữ Liệu Firestore

1. Vào **Firestore Database** > **Create database**
2. Chọn **Start in test mode** (chúng ta sẽ thêm quy tắc bảo mật sau)
3. Chọn vị trí gần nhất với người dùng của bạn

### 4. Lấy Cấu Hình Firebase

1. Vào **Project Settings** > tab **General**
2. Cuộn xuống phần "Your apps"
3. Nhấp biểu tượng **Web app** (`</>`)
4. Đăng ký ứng dụng với tên: `gia-su-hoang-ha-client`
5. Sao chép đối tượng cấu hình Firebase

## 🔧 Giai Đoạn 2: Thiết Lập Môi Trường

### 1. Biến Môi Trường

Tạo file `.env` trong thư mục gốc dự án:

```env
# Cấu hình Firebase
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Analytics (đã có)
VITE_GA_TRACKING_ID=G-0C25SX7IGJ
```

### 2. Biến Môi Trường Vercel

Để triển khai production, thêm các biến này trong Vercel Dashboard:

1. Vào dashboard dự án Vercel của bạn
2. Điều hướng đến **Settings** > **Environment Variables**
3. Thêm tất cả biến `VITE_FIREBASE_*` từ file `.env` của bạn

## 🛡️ Giai Đoạn 3: Quy Tắc Bảo Mật

### Quy Tắc Bảo Mật Firestore

Sao chép và dán các quy tắc này vào **Firestore** > **Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Collection users - người dùng có thể đọc/ghi dữ liệu của họ, admin có thể đọc tất cả
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'staff'];
    }
    
    // Collection courses - đọc công khai, admin/staff ghi
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'staff'];
    }
    
    // Collection registrations - người dùng có thể tạo, admin/staff có thể đọc/ghi
    match /registrations/{registrationId} {
      allow create: if request.auth != null;
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'staff'];
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Collection inquiries - người dùng có thể tạo, admin/staff có thể đọc/ghi
    match /inquiries/{inquiryId} {
      allow create: if request.auth != null;
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'staff'];
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Collection schedules - chỉ admin/staff
    match /schedules/{scheduleId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'staff'];
    }
    
    // Collection analytics - chỉ admin
    match /analytics/{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 👥 Giai Đoạn 4: Thiết Lập Người Dùng Ban Đầu

### Tạo Người Dùng Admin

Bạn có thể tạo người dùng admin ban đầu theo hai cách:

#### Tùy Chọn A: Firebase Console (Khuyến Nghị)

1. Vào **Authentication** > **Users**
2. Nhấp **Add user**
3. Nhập email và mật khẩu
4. Sau khi tạo, vào **Firestore Database**
5. Tạo document trong collection `users` với UID của người dùng:

```json
{
  "uid": "user_uid_from_auth",
  "email": "admin@giasuhoangha.com",
  "name": "Quản trị viên",
  "role": "admin",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastLogin": "2024-01-01T00:00:00.000Z",
  "isActive": true
}
```

#### Tùy Chọn B: Script Thiết Lập (Nâng Cao)

Chạy script thiết lập Firebase (yêu cầu môi trường Node.js với Firebase Admin SDK):

```bash
node scripts/firebase-setup.js
```

## 🔐 Tính Năng Xác Thực

### Vai Trò Người Dùng

- **admin**: Quyền truy cập đầy đủ tất cả tính năng
- **staff**: Quyền truy cập admin hạn chế (không quản lý người dùng)
- **user**: Chỉ quyền truy cập người dùng công khai

### Hệ Thống Quyền Hạn

Hệ thống sử dụng hệ thống quyền hạn chi tiết:

- `view_courses`, `create_course`, `edit_course`, `delete_course`
- `view_registrations`, `approve_registration`, `cancel_registration`
- `view_inquiries`, `respond_inquiry`, `resolve_inquiry`
- `view_schedules`, `create_schedule`, `edit_schedule`, `delete_schedule`
- `view_users`, `create_user`, `edit_user`, `delete_user`
- `view_analytics`, `export_data`
- `manage_settings`, `view_logs`

### Route Được Bảo Vệ

- `/admin` - Yêu cầu vai trò `admin` hoặc `staff`
- `/admin/users` - Chỉ yêu cầu vai trò `admin`
- `/admin/analytics` - Yêu cầu quyền `view_analytics`

## 🧪 Kiểm Thử

### Kiểm Thử Phát Triển

1. Khởi động server phát triển:
```bash
npm run dev
```

2. Điều hướng đến `/login`
3. Sử dụng thông tin đăng nhập demo (nếu đã tạo):
   - Admin: `admin@giasuhoangha.com` / `admin123`
   - Staff: `staff@giasuhoangha.com` / `staff123`

### Kiểm Thử Production

1. Triển khai lên Vercel với biến môi trường
2. Kiểm thử luồng xác thực
3. Xác minh kiểm soát truy cập dựa trên vai trò
4. Kiểm tra quy tắc bảo mật Firestore

## 🚨 Cân Nhắc Bảo Mật

### Ghi Chú Bảo Mật Quan Trọng

1. **Thay Đổi Mật Khẩu Mặc Định**: Ngay lập tức thay đổi mật khẩu admin mặc định sau lần đăng nhập đầu tiên
2. **Biến Môi Trường**: Không bao giờ commit file `.env` vào version control
3. **Quy Tắc Bảo Mật**: Kiểm thử kỹ lưỡng quy tắc Firestore trước khi production
4. **Xác Thực Người Dùng**: Xác thực tất cả đầu vào người dùng ở cả client và server
5. **Kiểm Tra Định Kỳ**: Thường xuyên xem xét quyền người dùng và log truy cập

### Danh Sách Kiểm Tra Bảo Mật

- [ ] Quy tắc bảo mật Firebase đã triển khai
- [ ] Mật khẩu mặc định đã thay đổi
- [ ] Biến môi trường đã bảo mật
- [ ] Panel admin đã được bảo vệ
- [ ] Xác thực đầu vào người dùng đã triển khai
- [ ] Xử lý lỗi đã triển khai
- [ ] Logging đã cấu hình

## 📊 Cấu Trúc Cơ Sở Dữ Liệu

### Collections

#### `users`
```typescript
{
  uid: string;
  email: string;
  name: string;
  role: 'user' | 'staff' | 'admin';
  phone?: string;
  avatar?: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  isActive: boolean;
}
```

#### `courses` (Di Chuyển Tương Lai)
```typescript
{
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  subjects: string[];
  features: string[];
  image: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### `registrations` (Di Chuyển Tương Lai)
```typescript
{
  id: string;
  userId: string;
  courseId: string;
  studentName: string;
  studentPhone: string;
  parentName: string;
  parentPhone: string;
  address: string;
  preferredSchedule: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 🔄 Kế Hoạch Di Chuyển

### Giai Đoạn 1: Xác Thực (✅ Hoàn Thành)
- Tích hợp Firebase Auth
- Vai trò và quyền hạn người dùng
- Route được bảo vệ
- Chức năng đăng nhập/đăng xuất

### Giai Đoạn 2: Di Chuyển Dữ Liệu (Tiếp Theo)
- Di chuyển dữ liệu mock sang Firestore
- Cập nhật dịch vụ dữ liệu
- Đồng bộ hóa dữ liệu thời gian thực

### Giai Đoạn 3: Tính Năng Nâng Cao (Tương Lai)
- Upload file cho hình ảnh khóa học
- Thông báo email
- Phân tích nâng cao
- Sao lưu và khôi phục

## 🐛 Khắc Phục Sự Cố

### Vấn Đề Thường Gặp

#### 1. Lỗi Cấu Hình Firebase
```
Error: Firebase configuration not found
```
**Giải pháp**: Kiểm tra biến môi trường đã được thiết lập đúng

#### 2. Lỗi Xác Thực
```
Error: auth/user-not-found
```
**Giải pháp**: Đảm bảo người dùng tồn tại trong Firebase Auth và Firestore

#### 3. Quyền Bị Từ Chối
```
Error: Missing or insufficient permissions
```
**Giải pháp**: Kiểm tra quy tắc bảo mật Firestore và vai trò người dùng

#### 4. Lỗi Build
```
Error: Cannot resolve firebase modules
```
**Giải pháp**: Đảm bảo Firebase SDK đã được cài đặt đúng

### Chế Độ Debug

Kích hoạt chế độ debug trong phát triển:

```typescript
// Trong firebase.ts
if (import.meta.env.DEV) {
  console.log('Firebase Debug Mode Enabled');
  // Thêm debug logging
}
```

## 📞 Hỗ Trợ

Để được hỗ trợ kỹ thuật hoặc có câu hỏi:

1. Kiểm tra tài liệu này trước
2. Xem xét log Firebase Console
3. Kiểm tra console trình duyệt để tìm lỗi
4. Liên hệ nhóm phát triển

## 🔗 Liên Kết Hữu Ích

- [Tài Liệu Firebase](https://firebase.google.com/docs)
- [Quy Tắc Bảo Mật Firestore](https://firebase.google.com/docs/firestore/security/get-started)
- [Tài Liệu Firebase Auth](https://firebase.google.com/docs/auth)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)

---

**Cập Nhật Lần Cuối**: Tháng 1 năm 2024  
**Phiên Bản**: 1.0.0  
**Trạng Thái**: Giai Đoạn 1 Hoàn Thành ✅ 
# Phase 2: Data Migration Setup Guide

## 🎯 Mục tiêu Phase 2
Chuyển từ mock data sang Firestore database thực tế với real-time synchronization.

## 📋 Các bước thực hiện

### Step 1: Deploy Firestore Security Rules (MANUAL)

**Tại sao cần rules:** Firestore yêu cầu security rules để bảo vệ dữ liệu. Hiện tại Node.js version không tương thích với Firebase CLI mới.

#### Cách 1: Qua Firebase Console (RECOMMENDED)
1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Chọn project: `gia-su-hoang-ha`
3. Vào **Firestore Database** → **Rules**
4. Copy nội dung từ file `firestore.rules` trong project
5. Paste vào Firebase Console và click **Publish**

#### Cách 2: Upgrade Node.js rồi dùng CLI
```bash
# Upgrade Node.js to version 20+
nvm install 20
nvm use 20

# Then run Firebase CLI
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

### Step 2: Verify Rules Deployment
1. Trong Firebase Console → Firestore → Rules
2. Kiểm tra rules đã được deploy
3. Thấy các rules cho collections: users, courses, registrations, inquiries

### Step 3: Run Data Migration
Sau khi deploy rules thành công:

```bash
node scripts/migrate-data.cjs
```

**Expected Output:**
```
🚀 Bắt đầu migration data sang Firestore...
==================================================
🔄 Đang migrate courses...
✅ Đã tạo course: Toán học lớp 10 (courseId123)
✅ Đã tạo course: Vật lý lớp 11 (courseId456)
✅ Đã tạo course: Hóa học lớp 12 (courseId789)
==================================================
🎉 Migration hoàn thành thành công!
✅ Đã migrate 3 courses
```

### Step 4: Verify Data in Firebase Console
1. Firebase Console → Firestore Database → Data
2. Kiểm tra collection `courses` đã có data
3. Mỗi document có các fields: title, description, price, etc.

## 🔧 Phase 2.1: Firestore Services Integration

### Files đã tạo:
- ✅ `src/types/firestore.ts` - TypeScript interfaces
- ✅ `src/services/firestore/base.ts` - Base service class
- ✅ `src/services/firestore/coursesService.ts` - Courses service  
- ✅ `src/services/firestore/registrationsService.ts` - Registrations service
- ✅ `scripts/migrate-data.cjs` - Data migration script
- ✅ `firestore.rules` - Security rules

### Tính năng Firestore Services:
- **CRUD operations**: Create, Read, Update, Delete
- **Real-time listeners**: Live data synchronization
- **Pagination**: Handle large datasets efficiently
- **Filtering & Search**: Advanced query capabilities  
- **Error handling**: Comprehensive error management
- **Vietnamese messages**: User-friendly Vietnamese error messages

## 🚀 Phase 2.2: Component Integration (NEXT)

Sau khi migration thành công, chúng ta sẽ:

### 1. Update Components to use Firestore
```typescript
// Thay vì mock data
import { mockCourses } from '../data/courses';

// Sử dụng Firestore service
import coursesService from '../services/firestore/coursesService';
```

### 2. Add Real-time Synchronization
```typescript
// Component sẽ tự động update khi data thay đổi
useEffect(() => {
  const unsubscribe = coursesService.subscribeToActiveCourses((courses) => {
    setCourses(courses);
  });
  
  return unsubscribe;
}, []);
```

### 3. Enhanced Admin Dashboard
- Real-time course statistics
- Live registration management
- Advanced filtering và search

## ❌ Troubleshooting

### Lỗi: "Missing or insufficient permissions"
**Nguyên nhân:** Security rules chưa được deploy hoặc deploy sai

**Giải pháp:**
1. Kiểm tra Firebase Console → Firestore → Rules
2. Đảm bảo rules từ file `firestore.rules` đã được copy đúng
3. Click **Publish** để deploy rules
4. Retry migration script

### Lỗi: "Document not found" 
**Nguyên nhân:** Admin user chưa tồn tại trong users collection

**Giải pháp:**
```bash
node scripts/create-staff.cjs admin@giasuhoangha.com "Admin User" admin123
```

### Lỗi: Firebase configuration
**Nguyên nhân:** Environment variables chưa đúng

**Giải pháp:**
1. Kiểm tra file `.env`
2. So sánh với Firebase Console → Project Settings → Web app config
3. Restart dev server sau khi update .env

## 📊 Expected Database Structure

Sau migration thành công, Firestore sẽ có:

```
📁 courses/
  📄 [auto-id-1]
    title: "Toán học lớp 10"
    description: "Khóa học toán học dành cho..."
    price: 2000000
    duration: "3 tháng"
    level: "Cơ bản"
    subjects: ["Toán học", "Đại số", "Hình học"]
    isActive: true
    instructor: "Thầy Nguyễn Văn A"
    maxStudents: 20
    currentStudents: 12
    createdAt: Timestamp
    updatedAt: Timestamp
    
  📄 [auto-id-2]
    title: "Vật lý lớp 11"
    ...
```

## 🎉 Success Criteria

Phase 2.1 thành công khi:
- ✅ Firestore rules deployed
- ✅ Migration script chạy không lỗi  
- ✅ Firebase Console hiển thị courses data
- ✅ Firestore services hoạt động tốt

**Tiếp theo:** Phase 2.2 - Component Integration với real-time data synchronization.

---

**📞 Cần hỗ trợ?**
- Kiểm tra Firebase Console logs
- Đọc error messages trong terminal
- Verify project permissions trong Firebase Console 
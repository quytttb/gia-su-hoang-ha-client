# Firestore Integration Documentation

## Overview

Website này đã được chuyển đổi hoàn toàn từ mock data sang sử dụng Firebase Firestore làm database thực tế. Tất cả dữ liệu hiện tại được lưu trữ và quản lý trên Firestore.

## Data Structure

### Courses Collection (`/courses`)

```typescript
{
  id: string (auto-generated)
  name: string           // Tên khóa học
  description: string    // Mô tả khóa học
  price: number         // Giá khóa học (VND)
  category: string      // Danh mục (THPT, THCS, Tiểu học, Ngoại ngữ, etc.)
  targetAudience: string // Đối tượng học viên
  schedule: string      // Lịch học
  imageUrl: string      // URL hình ảnh
  featured: boolean     // Khóa học nổi bật
  discount?: number     // Phần trăm giảm giá (optional)
  discountEndDate?: string // Ngày kết thúc giảm giá (optional)
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Other Collections

- `settings` - Thông tin trung tâm và cấu hình
- `schedules` - Lịch học chi tiết
- `tutors` - Thông tin giáo viên
- `banners` - Banner quảng cáo

## Services Architecture

### Base Service (`src/services/firestore/base.ts`)
- Abstract class cung cấp CRUD operations cơ bản
- Real-time subscriptions với onSnapshot
- Pagination và filtering support
- Error handling

### Courses Service (`src/services/firestore/coursesService.ts`)
- Extends BaseFirestoreService
- Specialized methods cho courses
- Real-time subscriptions cho active courses
- Course statistics và analytics

### Utility Functions (`src/utils/courseHelpers.ts`)
- `convertFirestoreCourse()` - Convert Firestore data to UI model
- `extractCourseCategories()` - Extract unique categories
- `filterCoursesByCategory()` - Filter courses by category
- `getFeaturedCourses()` - Get featured courses only

## Real-time Updates

Website sử dụng Firestore real-time listeners để tự động cập nhật UI khi data thay đổi:

```typescript
// Example usage in components
const unsubscribe = coursesService.subscribeToActiveCourses((courses) => {
  const convertedCourses = courses.map(convertFirestoreCourse);
  setCourses(convertedCourses);
});

// Don't forget to cleanup
return () => unsubscribe();
```

## Data Migration

### Current Status
- ✅ **Tutors**: 5 tutors migrated from mock data
- ✅ **Courses**: 4 courses created with proper structure  
- ✅ **Schedules**: 6 schedules linked to courses
- ✅ **Settings**: Center info initialized
- ✅ **Banners**: Active banners configured

### Data Sources
- **Courses**: Created via `scripts/create-courses.cjs`
- **Other data**: Previously migrated from mock data

## Usage Examples

### Getting Courses
```typescript
// Get all courses with real-time updates
const unsubscribe = coursesService.subscribeToActiveCourses((courses) => {
  console.log('Received courses:', courses);
});

// Get single course
const courseResult = await coursesService.getById(courseId);
if (courseResult.data) {
  const course = convertFirestoreCourse(courseResult.data);
}
```

### Creating Courses
```typescript
const newCourse = {
  name: "Toán học lớp 12",
  description: "Khóa học toán nâng cao",
  price: 2000000,
  category: "THPT",
  targetAudience: "Học sinh lớp 12",
  schedule: "Thứ 2, 4, 6 (19:00-21:00)",
  imageUrl: "https://example.com/image.jpg",
  featured: true
};

const result = await coursesService.create(newCourse);
```

## Environment Configuration

### Environment Variables
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Firebase Console
- Project: `gia-su-hoang-ha`
- Database: Cloud Firestore
- Region: `asia-southeast1`

## Security Rules

Firestore security rules được cấu hình để:
- Allow public read access cho display data
- Restrict write access cho admin/staff only
- Validate data structure và permissions

## Performance Optimizations

1. **Pagination**: Services support limit và cursor-based pagination
2. **Indexing**: Composite indexes tự động được tạo cho complex queries
3. **Real-time Subscriptions**: Chỉ subscribe to data thực sự cần thiết
4. **Caching**: Browser caching cho static data

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   - Check Firestore security rules
   - Verify user authentication status

2. **Missing Composite Index**
   - Firebase sẽ tự động suggest missing indexes
   - Click link trong console để tạo index

3. **Real-time Updates Not Working**
   - Verify subscription cleanup trong useEffect
   - Check network connectivity

### Debug Tools

```typescript
// Enable Firestore debug logging
import { connectFirestoreEmulator } from 'firebase/firestore';

// In development only
if (process.env.NODE_ENV === 'development') {
  // Connect to emulator or enable debug logs
}
```

## Future Enhancements

- [ ] Implement search functionality với Algolia
- [ ] Add data validation schemas
- [ ] Implement audit logging
- [ ] Add data backup/restore procedures
- [ ] Performance monitoring và alerts 
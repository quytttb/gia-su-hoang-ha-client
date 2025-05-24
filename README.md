# Trung Tâm Gia Sư Hoàng Hà - Frontend

Frontend web application for "Trung tâm Gia Sư Hoàng Hà", a tutoring center in Thanh Hóa, Vietnam.

## Tính năng (Features)

- Hiển thị thông tin trung tâm: lịch sử, sứ mệnh, tầm nhìn, đội ngũ giáo viên
- Danh sách và chi tiết các khóa học
- Đăng ký khóa học trực tuyến
- Xem lịch học theo ngày hoặc số điện thoại
- Liên hệ và gửi yêu cầu
- Trang quản lý dành cho nhân viên (quản lý khóa học, lịch học, đăng ký, phản hồi)
- Chatbot tự động trả lời các câu hỏi thường gặp

## Công nghệ sử dụng (Technologies)

- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router
- Axios

## Cài đặt (Installation)

### Yêu cầu hệ thống (Requirements)

- Node.js v18.x hoặc cao hơn
- npm v8.x hoặc cao hơn

### Các bước cài đặt (Steps)

1. Clone repository:

```bash
git clone https://github.com/your-username/gia-su-hoang-ha-client.git
cd gia-su-hoang-ha-client
```

2. Cài đặt các dependencies:

```bash
npm install
```

3. Khởi động môi trường phát triển:

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173/`

## Cấu trúc dự án (Project Structure)

```
src/
├── components/           # Các component UI 
│   ├── layout/           # Layout components (Header, Footer, Layout)
│   └── shared/           # Các component dùng chung (Banner, CourseCard, SectionHeading)
├── pages/                # Các trang trong ứng dụng
│   ├── HomePage.tsx
│   ├── AboutPage.tsx
│   ├── CoursesPage.tsx
│   ├── CourseDetailPage.tsx
│   ├── CourseRegistrationPage.tsx
│   ├── SchedulePage.tsx
│   ├── ContactPage.tsx
│   └── AdminPage.tsx
├── services/             # Các service gọi API
│   ├── dataService.ts    # Service xử lý các request API (hiện tại dùng mock data)
│   └── mockData.ts       # Dữ liệu mẫu cho frontend
├── types/                # Type definitions
│   └── index.ts          # Định nghĩa các types dùng trong ứng dụng
├── utils/                # Các hàm utility
│   └── helpers.ts        # Các hàm hỗ trợ (format, validate,...)
├── App.tsx               # Component gốc với React Router
└── main.tsx              # Entry point
```

## Phát triển (Development)

### Cách thêm trang mới

1. Tạo file mới trong thư mục `src/pages/`
2. Thêm route trong `App.tsx`
3. Liên kết từ các trang khác nếu cần

### Chuẩn bị cho tích hợp Backend

Hiện tại, ứng dụng sử dụng mock data (trong `src/services/mockData.ts`) để mô phỏng API. Khi có backend thực:

1. Mở file `src/services/dataService.ts`
2. Cập nhật `API_BASE_URL` với URL của backend API
3. Đặt `USE_MOCK_DATA = false` để sử dụng API thực thay vì mock data

Các endpoint API đã được chuẩn bị sẵn trong `dataService.ts`:

- GET `/api/center-info`: Thông tin trung tâm
- GET `/api/banners`: Danh sách banner
- GET `/api/tutors`: Danh sách giáo viên
- GET `/api/courses`: Danh sách khóa học
- GET `/api/courses/featured`: Danh sách khóa học nổi bật
- GET `/api/courses/:id`: Chi tiết khóa học
- GET `/api/courses/category/:category`: Khóa học theo danh mục
- GET `/api/schedules`: Danh sách lịch học
- GET `/api/schedules/date/:date`: Lịch học theo ngày
- GET `/api/schedules/course/:courseId`: Lịch học theo khóa học
- GET `/api/schedules/phone/:phone`: Lịch học theo số điện thoại
- POST `/api/register`: Đăng ký khóa học
- POST `/api/inquiry`: Gửi yêu cầu/câu hỏi

### Tích hợp Google Maps

Hiện tại, ứng dụng chỉ có placeholder cho Google Maps. Để tích hợp Google Maps:

1. Đăng ký Google Maps API Key
2. Cài đặt thư viện: `npm install @react-google-maps/api`
3. Thêm API key vào file `.env`: `VITE_GOOGLE_MAPS_API_KEY=your_api_key`
4. Cập nhật component trong `ContactPage.tsx`

## Build và Deploy

Để build ứng dụng cho production:

```bash
npm run build
```

Các file build sẽ được tạo trong thư mục `dist/`

## Giấy phép (License)

© 2025 Trung tâm Gia Sư Hoàng Hà. Tất cả quyền được bảo lưu.

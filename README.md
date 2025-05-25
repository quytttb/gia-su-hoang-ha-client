# 🎓 **Gia Sư Hoàng Hà - Website Trung Tâm Gia Sư**

Website chính thức của Trung tâm Gia Sư Hoàng Hà tại Thanh Hóa - Nơi kết nối tri thức và ước mơ.

## 🌟 **Tính Năng Chính**

### ✅ **Đã Hoàn Thành**

- 🏠 **Trang chủ** với banner và giới thiệu
- 📚 **Danh sách khóa học** với tìm kiếm và lọc
- 📖 **Chi tiết khóa học** với thông tin đầy đủ
- 📝 **Đăng ký khóa học** với EmailJS integration
- 📞 **Liên hệ** với form gửi email tự động
- 📅 **Lịch học** với calendar view
- 👥 **Giới thiệu** về trung tâm và đội ngũ
- 🔐 **Trang quản trị** với dashboard
- 📱 **Facebook Integration** với fanpage chính thức
- 🔒 **Bảo mật** với validation và rate limiting
- ⚡ **Tối ưu hiệu suất** với code splitting
- 🔍 **SEO** optimization hoàn chỉnh
- 🧪 **Testing** với 91.83% coverage

### 🆕 **Tính Năng Mới (Latest Update)**

- 📧 **EmailJS Integration**: Gửi email trực tiếp từ frontend
- 🤖 **Enhanced Chatbot**: AI chatbot thông minh với quick replies
- 📱 **Facebook Integration**: Kết nối trực tiếp với fanpage
- 🎯 **Interactive UI**: Quick reply buttons và Facebook buttons
- 💬 **Smart Responses**: Phản hồi thông minh với emoji và formatting

## 🚀 **Cài Đặt & Chạy Dự Án**

### **Yêu Cầu Hệ Thống**

- Node.js 18+
- npm hoặc yarn

### **Cài Đặt**

```bash
# Clone repository
git clone <repository-url>
cd gia-su-hoang-ha-client

# Cài đặt dependencies
npm install

# Tạo file environment variables
cp .env.example .env
# Cập nhật các giá trị trong .env (xem CONFIGURATION.md)

# Chạy development server
npm run dev

# Mở http://localhost:5173
```

### **Build Production**

```bash
# Build cho production
npm run build

# Preview production build
npm run preview
```

## 📧 **Cấu Hình EmailJS**

### **Bước 1: Tạo tài khoản EmailJS**

1. Truy cập https://www.emailjs.com/
2. Đăng ký tài khoản miễn phí
3. Tạo Email Service (Gmail/Outlook)
4. Tạo Email Templates (xem `CONFIGURATION.md`)

### **Bước 2: Cập nhật .env**

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID_CONTACT=your_contact_template
VITE_EMAILJS_TEMPLATE_ID_REGISTRATION=your_registration_template
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### **Bước 3: Test Email**

- Vào `/contact` và test form liên hệ
- Vào `/courses/[id]/register` và test đăng ký khóa học

## 📱 **Facebook Integration**

### **Tính Năng**

- ✅ Facebook buttons trong contact form và registration form
- ✅ Chatbot với Facebook integration
- ✅ Direct link đến fanpage chính thức
- ✅ Quick replies trong chatbot để truy cập Facebook
- ✅ Responsive design cho mọi thiết bị

### **Facebook Fanpage**

- **URL**: https://www.facebook.com/profile.php?id=61575087818708
- **Tên**: Gia Sư Hoàng Hà Official
- **Tính năng**: Nhắn tin trực tiếp, cập nhật tin tức, hình ảnh hoạt động

## 🤖 **Enhanced Chatbot**

### **Tính Năng Mới**

- ✅ **Quick Reply Buttons**: Phản hồi nhanh với các lựa chọn sẵn có
- ✅ **Facebook Integration**: Nút truy cập trực tiếp đến fanpage
- ✅ **Smart Responses**: Phản hồi thông minh với emoji và formatting
- ✅ **Enhanced UI**: Giao diện đẹp hơn với gradient và animations
- ✅ **Multiple Message Types**: Text, quick-reply, contact, facebook
- ✅ **Contextual Responses**: Phản hồi phù hợp với ngữ cảnh

### **Cách Sử Dụng**

1. Click vào chatbot button ở góc phải màn hình
2. Chọn quick reply hoặc nhập câu hỏi
3. Sử dụng Facebook button để kết nối trực tiếp
4. Chatbot sẽ hướng dẫn và hỗ trợ 24/7

## 🛠️ **Scripts Có Sẵn**

```bash
# Development
npm run dev          # Chạy dev server
npm run build        # Build production
npm run preview      # Preview production build

# Testing
npm test             # Chạy unit tests
npm run test:watch   # Chạy tests ở watch mode
npm run test:coverage # Xem coverage report

# SEO Testing
npm run test:seo     # Test SEO configuration
npm run test:seo:prod # Test SEO trên production build

# Code Quality
npm run lint         # Chạy ESLint
npm run format       # Format code với Prettier
```

## 📁 **Cấu Trúc Dự Án**

```
src/
├── components/          # React components
│   ├── layout/         # Layout components (Header, Footer)
│   ├── shared/         # Shared components (WhatsAppButton, etc.)
│   └── ui/             # UI components
├── pages/              # Page components
├── services/           # API services
│   ├── emailService.ts # EmailJS integration
│   ├── whatsappService.ts # WhatsApp integration
│   └── dataService.ts  # Data management
├── utils/              # Utility functions
│   ├── seo.ts         # SEO utilities
│   └── security.ts    # Security utilities
├── types/              # TypeScript types
└── styles/             # CSS styles
```

## 🔧 **Công Nghệ Sử Dụng**

### **Core**

- ⚛️ **React 18** với TypeScript
- 🏗️ **Vite** build tool
- 🎨 **Tailwind CSS** cho styling
- 🧭 **React Router** cho navigation

### **Integrations**

- 📧 **EmailJS** cho email functionality
- 📱 **Facebook Integration** cho social messaging
- 🔍 **SEO optimization** với meta tags và structured data

### **Development**

- 🧪 **Vitest** cho testing
- 🔍 **ESLint** cho code quality
- 💅 **Prettier** cho code formatting
- 🐕 **Husky** cho git hooks

## 📊 **Thống Kê Dự Án**

### **Performance**

- ⚡ **Initial Bundle**: 167.42 kB (54.78 kB gzipped)
- 🚀 **Code Splitting**: Giảm 55% initial load
- 📱 **Mobile-first**: Responsive design
- 🔍 **SEO Score**: 100/100
- 🤖 **Enhanced Chatbot**: 12.87 kB (5.12 kB gzipped)

### **Testing Coverage**

- 🧪 **Total Tests**: 59 tests
- ✅ **Coverage**: 91.83% for utilities
- 📁 **Test Files**: 5 test suites

### **Bundle Analysis**

```
Main chunks:
- index.js: 167.42 kB (core app)
- dataService.js: 42.42 kB (data layer)
- AdminPage.js: 52.50 kB (admin features)
- SchedulePage.js: 68.03 kB (calendar features)
- Chatbot.js: 12.87 kB (enhanced chatbot)
```

## 🔐 **Bảo Mật**

- ✅ Input validation và sanitization
- ✅ Rate limiting cho forms
- ✅ XSS protection
- ✅ Environment variables cho sensitive data
- ✅ Security headers

## 📞 **Liên Hệ & Hỗ Trợ**

### **Thông Tin Trung Tâm**

- 📍 **Địa chỉ**: 265 - Đường 06, Phường Nam Ngạn, Thanh Hóa
- 📞 **Điện thoại**: 0385.510.892 - 0962.390.161
- 📧 **Email**: lienhe@giasuhoangha.com
- 📱 **Facebook**: https://www.facebook.com/profile.php?id=61575087818708

### **Hỗ Trợ Kỹ Thuật**

- 📖 **Documentation**: Xem `CONFIGURATION.md`
- 🔍 **SEO Guide**: Xem `SEO_TESTING_GUIDE.md`
- ✅ **Testing Guide**: Xem `TESTING.md`

## 📈 **Roadmap**

### **Phase 2 (Upcoming)**

- 🔥 **Firebase Integration** cho real-time data
- 📊 **Google Analytics** tracking
- 🗺️ **Google Maps** integration
- 📱 **Messenger Bot** nâng cao

### **Phase 3 (Future)**

- 🎥 **Video streaming** cho học online
- 💳 **Payment gateway** integration
- 📱 **Mobile app** development
- 🤖 **AI chatbot** với machine learning

---

**🎯 Mục tiêu**: Tạo ra website trung tâm gia sư hiện đại, thân thiện và hiệu quả nhất tại Thanh Hóa!

**💡 Slogan**: "Nơi kết nối tri thức và ước mơ" 🌟

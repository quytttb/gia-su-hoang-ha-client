# Tính năng Gửi Tin nhắn - Hướng dẫn hoàn chỉnh

## 🎯 Tổng quan

Tính năng gửi tin nhắn cho phép khách hàng liên hệ với trung tâm và admin quản lý các tin nhắn một cách hiệu quả.

## 🚀 Các tính năng đã hoàn thiện

### 1. Form Liên hệ (Contact Form)
- ✅ Validation đầy đủ cho tất cả trường
- ✅ Sanitization để bảo mật
- ✅ Rate limiting để tránh spam
- ✅ Toast notifications thân thiện
- ✅ Responsive design
- ✅ Dark mode support
- ✅ FAQ section

### 2. Email Service (EmailJS)
- ✅ Gửi email thông báo cho admin
- ✅ Gửi email auto-reply cho khách hàng
- ✅ Template tùy chỉnh
- ✅ Error handling
- ✅ Kiểm tra cấu hình
- ✅ Cảnh báo khi chưa cấu hình

### 3. Firestore Integration
- ✅ Lưu tin nhắn vào database
- ✅ Theo dõi trạng thái tin nhắn
- ✅ Metadata (user agent, timestamp)
- ✅ Security rules

### 4. Admin Panel
- ✅ Quản lý tin nhắn trực quan
- ✅ Filter theo trạng thái
- ✅ Chi tiết tin nhắn
- ✅ Cập nhật trạng thái
- ✅ Xóa tin nhắn
- ✅ Thông báo realtime
- ✅ Icon notification với số lượng

### 5. Toast Notifications
- ✅ Success/Error/Warning/Info messages
- ✅ Auto dismiss
- ✅ Portal rendering
- ✅ Context API
- ✅ Beautiful animations

## 📋 Cấu trúc Files

```
src/
├── components/
│   ├── shared/
│   │   ├── Toast.tsx
│   │   ├── ToastContainer.tsx
│   │   ├── EmailServiceStatus.tsx
│   │   └── TestContactForm.tsx (dev only)
│   └── panel/
│       └── layout/
│           └── PanelHeader.tsx (updated)
├── contexts/
│   └── ToastContext.tsx
├── hooks/
│   └── useToast.ts
├── services/
│   ├── emailService.ts (enhanced)
│   └── contactService.ts (new)
├── pages/
│   ├── ContactPage.tsx (enhanced)
│   └── panel/
│       └── InquiriesPage.tsx (completed)
└── utils/
    └── security.ts (validation functions)

docs/
└── EMAILJS_SETUP.md

scripts/
├── add-sample-messages.cjs
└── (other scripts...)
```

## 🔧 Cài đặt & Cấu hình

### 1. Environment Variables
Thêm vào file `.env`:
```bash
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID_CONTACT=template_contact_form
VITE_EMAILJS_TEMPLATE_ID_REGISTRATION=template_registration
VITE_EMAILJS_TEMPLATE_ID_AUTO_REPLY=template_auto_reply
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### 2. Firestore Rules
Rules đã được thêm vào `firestore.rules`:
```javascript
// Contacts collection
match /contacts/{contactId} {
  allow read, update, delete: if isStaff();
  allow create: if true; // Allow anyone to create contact messages
}
```

### 3. EmailJS Templates
Tạo 3 templates trong EmailJS dashboard:
- `template_contact_form`: Thông báo cho admin
- `template_auto_reply`: Phản hồi tự động cho khách hàng
- `template_registration`: Thông báo đăng ký (đã có)

Chi tiết xem: [docs/EMAILJS_SETUP.md](./EMAILJS_SETUP.md)

## 🎮 Cách sử dụng

### Cho khách hàng:
1. Truy cập trang `/contact`
2. Điền thông tin vào form
3. Nhấn "Gửi tin nhắn"
4. Nhận thông báo thành công và email xác nhận

### Cho admin:
1. Đăng nhập vào panel admin
2. Click icon thông báo (🔔) hoặc vào "Tin nhắn"
3. Xem danh sách tin nhắn theo trạng thái
4. Click vào tin nhắn để xem chi tiết
5. Cập nhật trạng thái hoặc xóa tin nhắn

## 🧪 Testing

### Thêm tin nhắn test:
```bash
npm run add:sample-messages
```

### Test trong development:
1. Vào trang `/contact`
2. Click nút "Thêm tin nhắn test" (góc dưới phải)
3. Kiểm tra admin panel

## 🔒 Bảo mật

- ✅ Input validation & sanitization
- ✅ Rate limiting (10 requests/minute)
- ✅ XSS protection
- ✅ Firestore security rules
- ✅ Client-side identifier tracking

## 📊 Database Schema

### Contacts Collection
```typescript
interface ContactMessage {
  name: string;           // Họ tên
  email: string;          // Email
  phone: string;          // Số điện thoại
  message: string;        // Tin nhắn
  status: 'new' | 'read' | 'replied' | 'closed';
  createdAt: Timestamp;   // Thời gian tạo
  updatedAt: Timestamp;   // Thời gian cập nhật
  userAgent?: string;     // Thông tin trình duyệt
}
```

## 📈 Metrics & Analytics

### Tracking events:
- Contact form submission
- Message status changes
- Admin interactions
- Email delivery status

## 🚀 Next Steps

### Planned enhancements:
- [ ] Email templates editor trong admin
- [ ] Bulk actions cho tin nhắn
- [ ] Export tin nhắn ra Excel/CSV
- [ ] Advanced search & filter
- [ ] Auto-reply customization
- [ ] SMS integration
- [ ] Attachment support
- [ ] Response templates
- [ ] Integration with CRM systems

## 🐛 Troubleshooting

### Common issues:
1. **Toast không hiển thị**: Kiểm tra ToastProvider wrap App
2. **EmailJS không gửi**: Kiểm tra config và templates
3. **Firestore permission**: Kiểm tra rules và authentication
4. **Notification không update**: Kiểm tra realtime listener

### Debug tools:
- Browser Developer Tools
- Firebase Console
- EmailJS Dashboard
- Network tab for API calls

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. Console logs
2. Firebase Console
3. EmailJS Dashboard
4. Network requests
5. Environment variables

---

*Tài liệu này được cập nhật ngày 16/06/2025*

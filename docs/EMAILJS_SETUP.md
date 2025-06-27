# Hướng dẫn thiết lập EmailJS

## Bước 1: Tạo tài khoản EmailJS

1. Truy cập [EmailJS](https://www.emailjs.com/)
2. Tạo tài khoản miễn phí
3. Xác nhận email

## Bước 2: Thiết lập Email Service

1. Trong dashboard EmailJS, click "Add New Service"
2. Chọn email provider (Gmail, Outlook, Yahoo, etc.)
3. Cấu hình kết nối với email của bạn
4. Lưu lại **Service ID**

## Bước 3: Tạo Email Templates

### Template 1: Contact Form (template_contact_form)
```html
Subject: Tin nhắn liên hệ từ {{from_name}}

Chào {{to_name}},

Bạn đã nhận được tin nhắn liên hệ mới từ website:

Họ tên: {{from_name}}
Email: {{from_email}}
Số điện thoại: {{from_phone}}

Nội dung tin nhắn:
{{message}}

---
Tin nhắn được gửi từ website Gia Sư Hoàng Hà
```

### Template 2: Auto Reply (template_auto_reply)
```html
Subject: Cảm ơn bạn đã liên hệ với {{center_name}}

Chào {{to_name}},

Cảm ơn bạn đã {{message_type}} với {{center_name}}. Chúng tôi đã nhận được thông tin của bạn và sẽ liên hệ lại trong thời gian sớm nhất.

Thông tin liên hệ:
- Điện thoại: {{center_phone}}
- Địa chỉ: {{center_address}}
- Email: {{reply_to}}

Trân trọng,
Đội ngũ {{center_name}}
```

### Template 3: Registration (template_registration)
```html
Subject: Đăng ký lớp học từ {{student_name}}

Chào {{to_name}},

Có học viên mới đăng ký lớp học:

Họ tên: {{student_name}}
Email: {{student_email}}
Số điện thoại: {{student_phone}}
Lớp học: {{course_name}}
Mã lớp: {{course_id}}
Ngày đăng ký: {{registration_date}}

---
Đăng ký từ website Gia Sư Hoàng Hà
```

## Bước 4: Cấu hình Environment Variables

Thêm các biến sau vào file `.env`:

```bash
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID_CONTACT=template_contact_form
VITE_EMAILJS_TEMPLATE_ID_REGISTRATION=template_registration
VITE_EMAILJS_TEMPLATE_ID_AUTO_REPLY=template_auto_reply
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

## Bước 5: Lấy Public Key

1. Trong EmailJS dashboard, vào "Account" → "General"
2. Copy **Public Key**
3. Paste vào `VITE_EMAILJS_PUBLIC_KEY`

## Bước 6: Test

1. Khởi động ứng dụng: `npm run dev`
2. Truy cập trang Contact
3. Điền form và gửi thử
4. Kiểm tra email đã nhận được chưa

## Troubleshooting

### Lỗi thường gặp:

1. **"EmailJS not configured"**: Kiểm tra lại các biến môi trường
2. **"Failed to send email"**: Kiểm tra Service ID và Template ID
3. **"403 Forbidden"**: Kiểm tra Public Key
4. **Email không nhận được**: Kiểm tra spam folder

### Debug:

1. Mở Developer Tools → Console để xem lỗi
2. Kiểm tra EmailJS dashboard xem có log gì không
3. Đảm bảo tất cả template variables đều có giá trị

## Giới hạn miễn phí

- 200 emails/tháng
- 2 email services
- Unlimited templates

Để tăng giới hạn, cần nâng cấp plan trả phí.

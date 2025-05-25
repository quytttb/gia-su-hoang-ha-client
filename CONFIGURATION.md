# 🔧 **HƯỚNG DẪN CẤU HÌNH DỊCH VỤ**

## 📧 **EmailJS Setup (Gửi Email từ Frontend)**

### **Bước 1: Tạo tài khoản EmailJS**

1. Truy cập https://www.emailjs.com/
2. Đăng ký tài khoản miễn phí
3. Xác thực email

### **Bước 2: Tạo Email Service**

1. Vào Dashboard → Email Services
2. Chọn "Add New Service"
3. Chọn Gmail/Outlook/Yahoo (khuyến nghị Gmail)
4. Kết nối với email của trung tâm: `lienhe@giasuhoangha.com`
5. Lưu Service ID (ví dụ: `service_abc123`)

### **Bước 3: Tạo Email Templates**

#### **Template 1: Contact Form**

```
Template ID: template_contact
Subject: [Gia Sư Hoàng Hà] Liên hệ từ {{from_name}}

Nội dung:
Xin chào {{to_name}},

Bạn có một liên hệ mới từ website:

Họ tên: {{from_name}}
Email: {{from_email}}
Điện thoại: {{from_phone}}

Tin nhắn:
{{message}}

---
Trung tâm Gia Sư Hoàng Hà
Website: https://giasuhoangha.com
```

#### **Template 2: Course Registration**

```
Template ID: template_registration
Subject: [Gia Sư Hoàng Hà] Đăng ký khóa học từ {{student_name}}

Nội dung:
Xin chào {{to_name}},

Có đăng ký khóa học mới:

Học viên: {{student_name}}
Email: {{student_email}}
Điện thoại: {{student_phone}}
Khóa học: {{course_name}}
Mã khóa học: {{course_id}}
Ngày đăng ký: {{registration_date}}

---
Trung tâm Gia Sư Hoàng Hà
Website: https://giasuhoangha.com
```

#### **Template 3: Auto Reply**

```
Template ID: template_auto_reply
Subject: [Gia Sư Hoàng Hà] Cảm ơn bạn đã liên hệ

Nội dung:
Xin chào {{to_name}},

Cảm ơn bạn đã {{message_type}} với {{center_name}}.

Chúng tôi đã nhận được thông tin và sẽ liên hệ lại với bạn trong vòng 24 giờ.

Thông tin liên hệ:
📞 {{center_phone}}
📍 {{center_address}}
📧 {{reply_to}}

Trân trọng,
Đội ngũ {{center_name}}
```

### **Bước 4: Cấu hình Environment Variables**

Tạo file `.env` trong thư mục gốc:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID_CONTACT=template_contact
VITE_EMAILJS_TEMPLATE_ID_REGISTRATION=template_registration
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# API Configuration
VITE_API_BASE_URL=https://api.giasuhoangha.com/api
VITE_USE_MOCK_DATA=true
```

### **Bước 5: Test EmailJS**

```bash
# Khởi động dev server
npm run dev

# Truy cập http://localhost:5173/contact
# Điền form và test gửi email
```

---

## 📱 **WhatsApp Business Setup**

### **Bước 1: Chuẩn bị số điện thoại**

- Số chính: `0385.510.892` → `84385510892`
- Số phụ: `0962.390.161` → `84962390161`

### **Bước 2: Cài đặt WhatsApp Business**

1. Tải WhatsApp Business trên điện thoại
2. Đăng ký với số điện thoại trung tâm
3. Thiết lập thông tin doanh nghiệp:
   - Tên: "Trung tâm Gia Sư Hoàng Hà"
   - Địa chỉ: "265 - Đường 06, Phường Nam Ngạn, Thanh Hóa"
   - Mô tả: "Trung tâm gia sư chất lượng cao tại Thanh Hóa"

### **Bước 3: Thiết lập Auto Reply**

```
Tin nhắn chào mừng:
"Xin chào! Cảm ơn bạn đã liên hệ với Trung tâm Gia Sư Hoàng Hà.
Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
📞 0385.510.892 - 0962.390.161"

Tin nhắn ngoài giờ:
"Hiện tại chúng tôi đang ngoài giờ làm việc.
Giờ làm việc: T2-T6: 7:30-20:00, T7-CN: 8:00-17:00
Chúng tôi sẽ phản hồi vào giờ làm việc tiếp theo."
```

---

## 📊 **Google Analytics Setup (Tùy chọn)**

### **Bước 1: Tạo Google Analytics Account**

1. Truy cập https://analytics.google.com/
2. Tạo account mới cho "Trung tâm Gia Sư Hoàng Hà"
3. Thiết lập property cho website

### **Bước 2: Lấy Measurement ID**

```
Measurement ID: G-XXXXXXXXXX
```

### **Bước 3: Thêm vào .env**

```env
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

---

## 🗺️ **Google Maps Integration (Tùy chọn)**

### **Bước 1: Tạo Google Maps API Key**

1. Truy cập https://console.cloud.google.com/
2. Tạo project mới
3. Enable Maps JavaScript API
4. Tạo API Key

### **Bước 2: Cấu hình API Key**

```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### **Bước 3: Giới hạn API Key**

- Giới hạn theo domain: `giasuhoangha.com`
- Giới hạn theo API: Maps JavaScript API

---

## 🚀 **Deployment Configuration**

### **Production Environment Variables**

```env
# Production API
VITE_API_BASE_URL=https://api.giasuhoangha.com/api
VITE_USE_MOCK_DATA=false

# EmailJS (Production)
VITE_EMAILJS_SERVICE_ID=service_production_id
VITE_EMAILJS_TEMPLATE_ID_CONTACT=template_contact_prod
VITE_EMAILJS_TEMPLATE_ID_REGISTRATION=template_registration_prod
VITE_EMAILJS_PUBLIC_KEY=production_public_key

# Analytics
VITE_GOOGLE_ANALYTICS_ID=G-PRODUCTION-ID
VITE_GOOGLE_MAPS_API_KEY=production_maps_key
```

---

## 🔍 **Testing & Validation**

### **Test EmailJS**

```bash
# Kiểm tra cấu hình
npm run dev
# Vào /contact và test form

# Kiểm tra console log
# Nếu thấy "EmailJS not configured", cần cập nhật .env
```

### **Test WhatsApp**

```bash
# Click vào nút WhatsApp
# Kiểm tra link được tạo đúng format:
# https://wa.me/84385510892?text=...
```

### **Test Production**

```bash
# Build và preview
npm run build
npm run preview

# Test tất cả tính năng
```

---

## 📞 **Support & Troubleshooting**

### **EmailJS Issues**

- **Lỗi 403**: Kiểm tra Public Key
- **Lỗi 400**: Kiểm tra Template ID
- **Email không gửi**: Kiểm tra Service ID

### **WhatsApp Issues**

- **Link không hoạt động**: Kiểm tra format số điện thoại
- **Tin nhắn bị cắt**: Kiểm tra URL encoding

### **Contact Support**

- EmailJS: https://www.emailjs.com/docs/
- WhatsApp Business: https://business.whatsapp.com/
- Google APIs: https://developers.google.com/

---

**🎯 Lưu ý**: Tất cả các dịch vụ trên đều có gói miễn phí phù hợp cho dự án quy mô nhỏ. Chỉ cần nâng cấp khi có lượng traffic lớn.

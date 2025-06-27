# EmailJS Template Setup for Reply Feature

## Cần tạo template mới trong EmailJS Dashboard

### 1. Đăng nhập EmailJS Dashboard
- Truy cập: https://dashboard.emailjs.com/
- Đăng nhập tài khoản

### 2. Tạo Template Reply
- Vào mục **Email Templates**
- Click **Create New Template**
- Template ID: `template_reply`

### 3. Nội dung Template

**Subject:**
```
{{subject}}
```

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Phản hồi từ Trung tâm Gia sư Hoàng Hà</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9fafb; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Trung tâm Gia sư Hoàng Hà</h1>
        </div>
        
        <div class="content">
            <p>Kính chào {{to_name}},</p>
            
            <div style="white-space: pre-line; margin: 20px 0;">{{message}}</div>
            
            <p>Trân trọng,<br>
            {{from_name}}</p>
        </div>
        
        <div class="footer">
            <p>📧 Email: giasuhoangha@gmail.com</p>
            <p>📱 Hotline: 0123456789</p>
            <p>🌐 Website: https://giasuhoangha.com</p>
        </div>
    </div>
</body>
</html>
```

### 4. Template Settings
- **From Name:** `{{from_name}}`
- **From Email:** `giasuhoangha@gmail.com`
- **To Email:** `{{to_email}}`
- **Reply To:** `{{reply_to}}`

### 5. Template Variables
- `{{to_name}}` - Tên người nhận
- `{{to_email}}` - Email người nhận  
- `{{subject}}` - Tiêu đề email
- `{{message}}` - Nội dung phản hồi
- `{{from_name}}` - Tên người gửi
- `{{reply_to}}` - Email reply

### 6. Test Template
- Dùng **Test** feature trong EmailJS để kiểm tra
- Đảm bảo tất cả variables hiển thị đúng

### 7. Publish
- Click **Save** để lưu template
- Template sẵn sàng sử dụng với ID: `template_reply`

## Lưu ý
- Đảm bảo service `service_contact_form` đã được tạo
- Public key `CYGfHqz7Kqr3Jb4Xm` phải đúng
- Test trước khi deploy production

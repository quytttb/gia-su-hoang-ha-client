# 🚀 How to Test Form Auto-Fill

Vấn đề: Bạn không thấy nút điền form tự động. Đây là các cách để test:

## 🎯 Cách 1: Sử dụng Console Script (Khuyến nghị)

### Bước 1: Mở trang đăng ký
```
http://localhost:5173/classes/test-class-id/register
```
*(Hoặc bất kỳ class ID nào có sẵn)*

### Bước 2: Mở Developer Console
- Nhấn **F12** hoặc **Ctrl+Shift+I**
- Chọn tab **Console**

### Bước 3: Copy và paste script
Copy toàn bộ nội dung file `scripts/console-form-fill.js` và paste vào console, sau đó nhấn Enter.

### Bước 4: Sử dụng
Sau khi paste script, bạn sẽ thấy:
- 🚀 **Fill** button (góc phải trên)
- 🧹 **Clear** button  
- 🎲 **Random** button

Hoặc gọi trực tiếp trong console:
```javascript
fillForm()    // Điền form
clearForm()   // Xóa form  
randomFill()  // Điền ngẫu nhiên
```

## 🎯 Cách 2: Kiểm tra DevFormHelper

### Nếu không thấy nút 🛠️ Dev Tools:

1. **Kiểm tra URL**: Phải có dạng `/classes/[id]/register`
2. **Kiểm tra Console**: Mở F12 → Console xem có lỗi không
3. **Refresh trang**: Ctrl+R hoặc F5
4. **Kiểm tra môi trường**: Đảm bảo đang chạy dev mode

### Debug steps:
```javascript
// Trong console, kiểm tra:
console.log(process.env.NODE_ENV) // Phải là 'development'
console.log(window.location.pathname) // Phải chứa 'register'
```

## 🎯 Cách 3: Tạo Class ID test

### Nếu không có class ID để test:

1. **Vào admin panel**: Đăng nhập với admin credentials
2. **Tạo class mới** hoặc **copy ID class có sẵn**
3. **Thử với URL**: `http://localhost:5173/classes/[copied-id]/register`

## 🎯 Cách 4: Quick URL Test

Thử trực tiếp với test URL:
```
http://localhost:5173/classes/test-class-id/register
```

Nếu báo lỗi "không tìm thấy class", có nghĩa là routing hoạt động nhưng cần class ID thực tế.

## 🔧 Test Data mẫu

Script sẽ điền các field sau:
```javascript
{
    parentName: 'Nguyễn Văn An',
    parentPhone: '0987654321',
    parentAddress: '123 Đường ABC, Phường XYZ, Quận 123, TP.HCM',
    name: 'Nguyễn Thị Bình', 
    school: 'Trường THPT Lê Quý Đôn',
    academicDescription: 'Học sinh khá, cần cải thiện môn Toán và Vật Lý.'
}
```

## ❓ Troubleshooting

### Script không hoạt động:
1. Đảm bảo đang ở đúng trang registration
2. Kiểm tra form fields có đúng ID không
3. Xem console có lỗi JavaScript không

### DevFormHelper không hiện:
1. Component có thể chưa render đúng
2. CSS có thể bị che khuất
3. Thử refresh hoặc clear cache

## 💡 Tips

- **Console script** là cách đáng tin cậy nhất
- **Floating buttons** xuất hiện sau khi chạy script
- **Multiple datasets** để test với dữ liệu khác nhau
- **Auto-trigger events** để React component nhận diện

---

**Hãy thử Console Script trước!** Đây là cách nhanh và chắc chắn nhất để test form auto-fill.

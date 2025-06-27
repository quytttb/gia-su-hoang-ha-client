# Auto Fill Form Tools

## Các cách sử dụng Auto Fill Form Script:

### 1. Bookmarklet (Khuyến nghị - Dễ nhất)

Tạo một bookmark mới trong trình duyệt với URL sau:

```javascript
javascript:(function(){var s=document.createElement('script');s.src='data:text/javascript;base64,' + btoa(`(function() {
    console.log('🚀 Auto Fill Form Script loaded');
    
    const testData = {
        parentName: 'Nguyễn Văn An',
        parentPhone: '0987654321',
        parentAddress: '123 Đường ABC, Phường XYZ, Quận 123, TP.HCM',
        name: 'Nguyễn Thị Bình',
        school: 'Trường THPT Lê Quý Đôn',
        academicDescription: 'Học sinh khá, cần cải thiện môn Toán và Vật Lý. Có hứng thú với môn Văn và Tiếng Anh.'
    };
    
    const alternativeData = [
        {
            parentName: 'Trần Thị Lan',
            parentPhone: '0912345678',
            parentAddress: '456 Đường DEF, Phường ABC, Quận 456, Hà Nội',
            name: 'Trần Văn Cường',
            school: 'Trường THPT Chu Văn An',
            academicDescription: 'Học sinh giỏi Toán, cần phát triển thêm kỹ năng Tiếng Anh và Văn.'
        },
        {
            parentName: 'Lê Hoàng Nam',
            parentPhone: '0923456789',
            parentAddress: '789 Đường GHI, Phường DEF, Quận 789, Đà Nẵng',
            name: 'Lê Thị Mai',
            school: 'Trường THPT Phan Châu Trinh',
            academicDescription: 'Học sinh trung bình, cần hỗ trợ toàn diện các môn học.'
        }
    ];
    
    function fillForm(data = testData) {
        try {
            console.log('📝 Filling form with data:', data);
            
            const fields = {
                parentName: document.getElementById('parentName'),
                parentPhone: document.getElementById('parentPhone'),
                parentAddress: document.getElementById('parentAddress'),
                name: document.getElementById('name'),
                school: document.getElementById('school'),
                academicDescription: document.getElementById('academicDescription')
            };
            
            Object.keys(fields).forEach(key => {
                const field = fields[key];
                if (field && data[key]) {
                    field.value = data[key];
                    field.dispatchEvent(new Event('input', { bubbles: true }));
                    field.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
            
            console.log('✅ Form filled successfully!');
            
        } catch (error) {
            console.error('❌ Error filling form:', error);
        }
    }
    
    function clearForm() {
        try {
            console.log('🧹 Clearing form...');
            
            const fields = ['parentName', 'parentPhone', 'parentAddress', 'name', 'school', 'academicDescription'];
            
            fields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.value = '';
                    field.dispatchEvent(new Event('input', { bubbles: true }));
                    field.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
            
            console.log('✅ Form cleared successfully!');
            
        } catch (error) {
            console.error('❌ Error clearing form:', error);
        }
    }
    
    function fillWithRandomData() {
        const randomIndex = Math.floor(Math.random() * alternativeData.length);
        const randomData = alternativeData[randomIndex];
        console.log('🎲 Using random dataset ' + (randomIndex + 1));
        fillForm(randomData);
    }
    
    window.autoFillForm = fillForm;
    window.clearForm = clearForm;
    window.fillWithRandomData = fillWithRandomData;
    
    function createFloatingButton() {
        if (document.getElementById('auto-fill-buttons')) return;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'auto-fill-buttons';
        buttonContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 10000; display: flex; flex-direction: column; gap: 8px;';
        
        const fillButton = document.createElement('button');
        fillButton.textContent = '🚀 Auto Fill';
        fillButton.style.cssText = 'background: #3b82f6; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500; box-shadow: 0 2px 4px rgba(0,0,0,0.1);';
        fillButton.onclick = () => fillForm();
        
        const randomButton = document.createElement('button');
        randomButton.textContent = '🎲 Random';
        randomButton.style.cssText = 'background: #10b981; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500; box-shadow: 0 2px 4px rgba(0,0,0,0.1);';
        randomButton.onclick = () => fillWithRandomData();
        
        const clearButton = document.createElement('button');
        clearButton.textContent = '🧹 Clear';
        clearButton.style.cssText = 'background: #ef4444; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500; box-shadow: 0 2px 4px rgba(0,0,0,0.1);';
        clearButton.onclick = () => clearForm();
        
        buttonContainer.appendChild(fillButton);
        buttonContainer.appendChild(randomButton);
        buttonContainer.appendChild(clearButton);
        
        document.body.appendChild(buttonContainer);
        
        console.log('🎯 Floating buttons added to page');
    }
    
    createFloatingButton();
    
    console.log('🎉 Auto Fill Form Script Ready! Functions: autoFillForm(), fillWithRandomData(), clearForm()');
    
})();`);document.head.appendChild(s);})()
```

### 2. Console Script (Nhanh)

Mở Developer Console (F12) trên trang đăng ký và paste đoạn code sau:

```javascript
// Paste contents of scripts/auto-fill-form.js here
```

### 3. Browser Extension (Nâng cao)

Có thể tạo một browser extension đơn giản để inject script này vào trang.

## Cách sử dụng:

1. **Bookmarklet**: Tạo bookmark với URL trên, sau đó click vào bookmark khi ở trang đăng ký
2. **Console**: Copy/paste script vào console
3. **Floating buttons**: Sẽ xuất hiện ở góc phải trên cùng của trang

## Các chức năng:

- **🚀 Auto Fill**: Điền form với dữ liệu test mặc định
- **🎲 Random**: Điền form với dữ liệu ngẫu nhiên từ 3 bộ dữ liệu khác nhau
- **🧹 Clear**: Xóa toàn bộ dữ liệu trong form

## Lưu ý:

- Script sẽ tự động dispatch events để trigger React state updates
- Dữ liệu test được thiết kế để pass validation
- Có thể dễ dàng thêm/sửa dữ liệu test trong script

## Kiểm tra manual:

Sau khi điền form, hãy kiểm tra:

1. **Validation**: Các field có highlight lỗi không?
2. **Submit**: Form có submit được không?
3. **Success**: Có hiển thị dialog thành công không?  
4. **Email**: Có nhận được email xác nhận không?
5. **Database**: Dữ liệu có được lưu vào Firestore không?
6. **Admin Panel**: Có thể xem đăng ký trong panel không?

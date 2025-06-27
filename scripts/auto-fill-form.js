/**
 * Auto Fill Form Script for Class Registration Page
 * Usage: Open browser console on registration page and run this script
 * Or paste it into browser developer tools console
 */

(function () {
     console.log('🚀 Auto Fill Form Script loaded');

     // Sample test data
     const testData = {
          parentName: 'Nguyễn Văn An',
          parentPhone: '0987654321',
          parentAddress: '123 Đường ABC, Phường XYZ, Quận 123, TP.HCM',
          name: 'Nguyễn Thị Bình',
          school: 'Trường THPT Lê Quý Đôn',
          academicDescription: 'Học sinh khá, cần cải thiện môn Toán và Vật Lý. Có hứng thú với môn Văn và Tiếng Anh.'
     };

     // Alternative test data sets for variety
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

               // Fill parent information
               const parentName = document.getElementById('parentName');
               const parentPhone = document.getElementById('parentPhone');
               const parentAddress = document.getElementById('parentAddress');

               // Fill student information
               const name = document.getElementById('name');
               const school = document.getElementById('school');
               const academicDescription = document.getElementById('academicDescription');

               if (parentName) {
                    parentName.value = data.parentName;
                    parentName.dispatchEvent(new Event('input', { bubbles: true }));
                    parentName.dispatchEvent(new Event('change', { bubbles: true }));
               }

               if (parentPhone) {
                    parentPhone.value = data.parentPhone;
                    parentPhone.dispatchEvent(new Event('input', { bubbles: true }));
                    parentPhone.dispatchEvent(new Event('change', { bubbles: true }));
               }

               if (parentAddress) {
                    parentAddress.value = data.parentAddress;
                    parentAddress.dispatchEvent(new Event('input', { bubbles: true }));
                    parentAddress.dispatchEvent(new Event('change', { bubbles: true }));
               }

               if (name) {
                    name.value = data.name;
                    name.dispatchEvent(new Event('input', { bubbles: true }));
                    name.dispatchEvent(new Event('change', { bubbles: true }));
               }

               if (school) {
                    school.value = data.school;
                    school.dispatchEvent(new Event('input', { bubbles: true }));
                    school.dispatchEvent(new Event('change', { bubbles: true }));
               }

               if (academicDescription) {
                    academicDescription.value = data.academicDescription;
                    academicDescription.dispatchEvent(new Event('input', { bubbles: true }));
                    academicDescription.dispatchEvent(new Event('change', { bubbles: true }));
               }

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
          console.log(`🎲 Using random dataset ${randomIndex + 1}`);
          fillForm(randomData);
     }

     // Add global functions to window for easy access
     window.autoFillForm = fillForm;
     window.clearForm = clearForm;
     window.fillWithRandomData = fillWithRandomData;

     // Create a floating button for easy access
     function createFloatingButton() {
          const buttonContainer = document.createElement('div');
          buttonContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;

          const fillButton = document.createElement('button');
          fillButton.textContent = '🚀 Auto Fill';
          fillButton.style.cssText = `
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
          fillButton.onclick = () => fillForm();

          const randomButton = document.createElement('button');
          randomButton.textContent = '🎲 Random';
          randomButton.style.cssText = `
            background: #10b981;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
          randomButton.onclick = () => fillWithRandomData();

          const clearButton = document.createElement('button');
          clearButton.textContent = '🧹 Clear';
          clearButton.style.cssText = `
            background: #ef4444;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
          clearButton.onclick = () => clearForm();

          buttonContainer.appendChild(fillButton);
          buttonContainer.appendChild(randomButton);
          buttonContainer.appendChild(clearButton);

          document.body.appendChild(buttonContainer);

          console.log('🎯 Floating buttons added to page');
     }

     // Create floating buttons if we're on the registration page
     if (window.location.pathname.includes('/classes/') && window.location.pathname.includes('/register')) {
          createFloatingButton();
     }

     console.log(`
🎉 Auto Fill Form Script Ready!

Available functions:
- autoFillForm() - Fill form with default test data
- fillWithRandomData() - Fill form with random test data  
- clearForm() - Clear all form fields

If you're on the registration page, you should see floating buttons in the top-right corner.

You can also run these functions directly in the console.
    `);

})();

// Quick Auto Fill Script for Class Registration
// Copy and paste this entire block into browser console on registration page

console.log('🚀 Loading Auto Fill Script...');

// Test data
const testData = {
     parentName: 'Nguyễn Văn An',
     parentPhone: '0987654321',
     parentAddress: '123 Đường ABC, Phường XYZ, Quận 123, TP.HCM',
     name: 'Nguyễn Thị Bình',
     school: 'Trường THPT Lê Quý Đôn',
     academicDescription: 'Học sinh khá, cần cải thiện môn Toán và Vật Lý.'
};

// Fill form function
function fillForm() {
     console.log('📝 Filling form...');

     const fields = ['parentName', 'parentPhone', 'parentAddress', 'name', 'school', 'academicDescription'];

     fields.forEach(fieldName => {
          const field = document.getElementById(fieldName);
          if (field && testData[fieldName]) {
               field.value = testData[fieldName];
               // Trigger React state update
               field.dispatchEvent(new Event('input', { bubbles: true }));
               field.dispatchEvent(new Event('change', { bubbles: true }));
          }
     });

     console.log('✅ Form filled!');
}

// Clear form function
function clearForm() {
     console.log('🧹 Clearing form...');

     const fields = ['parentName', 'parentPhone', 'parentAddress', 'name', 'school', 'academicDescription'];

     fields.forEach(fieldName => {
          const field = document.getElementById(fieldName);
          if (field) {
               field.value = '';
               field.dispatchEvent(new Event('input', { bubbles: true }));
               field.dispatchEvent(new Event('change', { bubbles: true }));
          }
     });

     console.log('✅ Form cleared!');
}

// Create quick buttons
const buttonStyle = 'position:fixed;top:20px;right:20px;z-index:10000;background:#3b82f6;color:white;border:none;padding:10px 15px;border-radius:6px;cursor:pointer;margin:5px;font-size:12px;box-shadow:0 2px 4px rgba(0,0,0,0.2);';

const fillBtn = document.createElement('button');
fillBtn.innerHTML = '🚀 Fill Form';
fillBtn.style.cssText = buttonStyle;
fillBtn.onclick = fillForm;

const clearBtn = document.createElement('button');
clearBtn.innerHTML = '🧹 Clear Form';
clearBtn.style.cssText = buttonStyle.replace('#3b82f6', '#ef4444').replace('top:20px', 'top:60px');
clearBtn.onclick = clearForm;

document.body.appendChild(fillBtn);
document.body.appendChild(clearBtn);

console.log('✅ Auto Fill Ready! Use fillForm() or clearForm() or click the buttons.');

// Auto fill on load
fillForm();

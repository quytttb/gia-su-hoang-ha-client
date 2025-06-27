#!/usr/bin/env node

/**
 * Script thêm tin nhắn liên hệ mẫu để test trang admin
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Firebase configuration
const firebaseConfig = {
     apiKey: process.env.VITE_FIREBASE_API_KEY,
     authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: process.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: process.env.VITE_FIREBASE_APP_ID,
     measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample contact messages
const sampleMessages = [
     {
          name: 'Nguyễn Thị Mai',
          email: 'mai.nguyen@email.com',
          phone: '0987654321',
          message: 'Chào anh/chị, con tôi đang học lớp 12 và cần gia sư môn Toán để ôn thi đại học. Gia đình mong muốn tìm một thầy/cô có kinh nghiệm và phương pháp giảng dạy hiệu quả. Xin thầy/cô tư vấn giúp gia đình.',
          status: 'new'
     },
     {
          name: 'Trần Văn Nam',
          email: 'nam.tran@gmail.com',
          phone: '0912345678',
          message: 'Em muốn đăng ký học tiếng Anh giao tiếp. Em đang là sinh viên năm 2 và muốn cải thiện khả năng nói tiếng Anh để có thể giao tiếp tốt hơn. Trung tâm có lớp nào phù hợp không ạ?',
          status: 'new'
     },
     {
          name: 'Lê Thị Hương',
          email: 'huong.le@yahoo.com',
          phone: '0945678912',
          message: 'Tôi muốn hỏi về lịch học và học phí của lớp Vật lý THPT. Con tôi đang học lớp 11 và khá yếu môn Vật lý. Mong trung tâm tư vấn chi tiết để gia đình có thể sắp xếp thời gian.',
          status: 'read'
     },
     {
          name: 'Phạm Minh Tuấn',
          email: 'tuan.pham@outlook.com',
          phone: '0978123456',
          message: 'Anh/chị ơi, em muốn đăng ký làm gia sư tại trung tâm. Em vừa tốt nghiệp đại học Sư phạm chuyên ngành Toán và có kinh nghiệm dạy học. Em muốn biết quy trình đăng ký như thế nào?',
          status: 'replied'
     },
     {
          name: 'Vũ Thị Lan',
          email: 'lan.vu@email.com',
          phone: '0934567890',
          message: 'Chào trung tâm, tôi muốn hỏi về khóa học Hóa học lớp 10. Con tôi mới lên lớp 10 và cảm thấy khá khó khăn với môn Hóa. Trung tâm có lớp học vào buổi tối không ạ?',
          status: 'new'
     }
];

async function addSampleMessages() {
     console.log('📧 Adding sample contact messages...\n');

     for (let i = 0; i < sampleMessages.length; i++) {
          const message = sampleMessages[i];

          const messageData = {
               ...message,
               createdAt: serverTimestamp(),
               updatedAt: serverTimestamp(),
               userAgent: 'Mozilla/5.0 (Test Script)',
          };

          const docRef = await addDoc(collection(db, 'contacts'), messageData);
          console.log(`✅ Added message ${i + 1}: ${message.name}`);
          console.log(`   📧 Email: ${message.email}`);
          console.log(`   📞 Phone: ${message.phone}`);
          console.log(`   📋 Status: ${message.status}`);
          console.log(`   🆔 ID: ${docRef.id}\n`);
     }

     console.log(`🎉 Successfully added ${sampleMessages.length} sample messages`);
}

async function runScript() {
     try {
          console.log('🚀 Starting message addition...\n');

          // Check Firebase connection
          if (!firebaseConfig.apiKey) {
               throw new Error('Firebase configuration not found. Please check your .env file.');
          }

          await addSampleMessages();

          console.log('\n✅ Message addition completed successfully!');
          console.log('\nYou can now:');
          console.log('1. View messages in Firebase Console');
          console.log('2. Test the admin panel inquiries page');
          console.log('3. Check notification icon in admin header');

     } catch (error) {
          console.error('❌ Script failed:', error.message);
          process.exit(1);
     }
}

// Run script
runScript();

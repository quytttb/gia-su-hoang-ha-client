#!/usr/bin/env node

/**
 * Script khởi tạo center info vào Firestore
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');
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

const SETTINGS_COLLECTION = 'settings';
const CENTER_INFO_DOC = 'center-info';

// Default center info
const defaultCenterInfo = {
     id: 'center-1',
     name: 'Trung tâm Gia Sư Hoàng Hà',
     description: 'Trung tâm Gia Sư Hoàng Hà tự hào là nơi cung cấp dịch vụ gia sư chất lượng cao tại Thanh Hóa với đội ngũ giáo viên giàu kinh nghiệm và phương pháp giảng dạy hiện đại.',
     address: '265 - ĐƯỜNG 06 - MẶT BẰNG 08, PHƯỜNG NAM NGẠN, THÀNH PHỐ THANH HOÁ, TỈNH THANH HOÁ',
     phone: '0385.510.892 - 0962.390.161',
     email: 'lienhe@giasuhoangha.com',
     history: 'Trung tâm Gia Sư Hoàng Hà được thành lập vào năm 2015 với mục tiêu ban đầu là cung cấp các dịch vụ gia sư cho học sinh tiểu học và THCS. Sau gần 10 năm hoạt động, chúng tôi đã mở rộng quy mô và phát triển thành một trung tâm giáo dục toàn diện, phục vụ học sinh từ mầm non đến THPT. Với sự tận tâm và chuyên nghiệp, chúng tôi đã đồng hành cùng hàng nghìn học sinh đạt được kết quả học tập xuất sắc và phát triển toàn diện.',
     mission: 'Sứ mệnh của chúng tôi là cung cấp môi trường học tập chất lượng cao, hiệu quả và thân thiện, giúp học sinh phát triển toàn diện về kiến thức, kỹ năng và nhân cách. Chúng tôi cam kết mang đến phương pháp giảng dạy hiện đại, cá nhân hóa và phù hợp với từng học sinh.',
     vision: 'Trở thành trung tâm gia sư hàng đầu tại Thanh Hóa và các tỉnh lân cận, được tin tưởng bởi phụ huynh và học sinh. Chúng tôi hướng tới việc xây dựng một hệ sinh thái giáo dục toàn diện, góp phần nâng cao chất lượng giáo dục và phát triển nguồn nhân lực chất lượng cao cho xã hội.',
     slogan: 'DẪN LỐI TRI THỨC - VỮNG BƯỚC TƯƠNG LAI',
     workingHours: {
          weekdays: '7:30 - 20:00',
          weekend: '8:00 - 17:00',
     },
};

async function initializeCenterInfo() {
     try {
          console.log('🏢 Initializing center info...\n');

          // Check Firebase connection
          if (!firebaseConfig.apiKey) {
               throw new Error('Firebase configuration not found. Please check your .env file.');
          }

          const docRef = doc(db, SETTINGS_COLLECTION, CENTER_INFO_DOC);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
               const dataToSave = {
                    ...defaultCenterInfo,
                    lastUpdated: new Date().toISOString(),
               };

               await setDoc(docRef, dataToSave);
               console.log('✅ Center info initialized in Firestore');
          } else {
               console.log('ℹ️ Center info already exists in Firestore');
               const existingData = docSnap.data();
               console.log(`📋 Current center name: ${existingData.name}`);
          }

          console.log('\n🎉 Center info setup completed successfully!');
          console.log('\nYou can now:');
          console.log('1. View center info in Firebase Console');
          console.log('2. Test the AboutPage to see Firestore center info');
          console.log('3. Admin can update center info through admin panel');

     } catch (error) {
          console.error('❌ Initialization failed:', error.message);
          process.exit(1);
     }
}

// Run initialization
initializeCenterInfo(); 
#!/usr/bin/env node

/**
 * Script migrate data từ mock data sang Firestore
 * 
 * Cách sử dụng:
 * node scripts/migrate-data.cjs
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp, getDocs } = require('firebase/firestore');

// Load environment variables
require('dotenv').config();

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

// Mock data
const mockCourses = [
     {
          title: "Toán học lớp 10",
          description: "Khóa học toán học dành cho học sinh lớp 10, bao gồm đại số và hình học cơ bản.",
          price: 2000000,
          duration: "3 tháng",
          level: "Cơ bản",
          subjects: ["Toán học", "Đại số", "Hình học"],
          features: ["Giảng viên kinh nghiệm", "Tài liệu đầy đủ", "Luyện tập thường xuyên"],
          image: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          isActive: true,
          instructor: "Thầy Nguyễn Văn A",
          maxStudents: 20,
     },
     {
          title: "Vật lý lớp 11",
          description: "Khóa học vật lý nâng cao cho học sinh lớp 11.",
          price: 2200000,
          duration: "4 tháng",
          level: "Nâng cao",
          subjects: ["Vật lý", "Cơ học", "Nhiệt học"],
          features: ["Thí nghiệm thực tế", "Bài tập phong phú", "Ôn tập định kỳ"],
          image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          isActive: true,
          instructor: "Cô Trần Thị B",
          maxStudents: 15,
     },
     {
          title: "Hóa học lớp 12",
          description: "Khóa học hóa học chuyên sâu cho học sinh lớp 12.",
          price: 2500000,
          duration: "6 tháng",
          level: "Chuyên sâu",
          subjects: ["Hóa học", "Hóa vô cơ", "Hóa hữu cơ"],
          features: ["Luyện đề thi THPT", "Phương pháp giải nhanh", "Thí nghiệm minh họa"],
          image: "https://images.unsplash.com/photo-1532634218-8b3dceb3b0fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          isActive: true,
          instructor: "Thầy Lê Văn C",
          maxStudents: 25,
     }
];

// Main migration function
async function runMigration() {
     console.log('🚀 Bắt đầu migration data sang Firestore...');
     console.log('='.repeat(50));

     try {
          // Check if courses already exist
          const coursesSnapshot = await getDocs(collection(db, 'courses'));
          if (!coursesSnapshot.empty) {
               console.log('⚠️  Courses đã tồn tại, bỏ qua migration');
               console.log('✅ Migration đã hoàn thành trước đó');
               return;
          }

          console.log('🔄 Đang migrate courses...');

          for (const course of mockCourses) {
               const courseData = {
                    ...course,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
               };

               const docRef = await addDoc(collection(db, 'courses'), courseData);
               console.log(`✅ Đã tạo course: ${course.title} (${docRef.id})`);
          }

          console.log('='.repeat(50));
          console.log('🎉 Migration hoàn thành thành công!');
          console.log(`✅ Đã migrate ${mockCourses.length} courses`);

     } catch (error) {
          console.error('❌ Migration thất bại:', error.message);
          process.exit(1);
     }
}

// Run migration if called directly
if (require.main === module) {
     runMigration()
          .then(() => {
               console.log('✅ Script hoàn thành');
               process.exit(0);
          })
          .catch((error) => {
               console.error('❌ Script lỗi:', error);
               process.exit(1);
          });
}

module.exports = { runMigration };

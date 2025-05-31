#!/usr/bin/env node

/**
 * Script migrate tutors mock data vào Firestore
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } = require('firebase/firestore');
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

// Mock tutors data
const mockTutors = [
     {
          name: "Thầy Nguyễn Văn Minh",
          specialty: "Toán học THPT",
          bio: "10 năm kinh nghiệm giảng dạy Toán THPT. Chuyên luyện thi đại học và học sinh giỏi.",
          experience: "10 năm",
          education: "Thạc sĩ Toán học - ĐH Sư phạm Hà Nội",
          imageUrl: "/tutor1.jpg",
          subjects: ["Toán học", "Đại số", "Hình học"],
          availability: ["Thứ 2", "Thứ 4", "Thứ 6", "Thứ 7"],
          isActive: true
     },
     {
          name: "Cô Trần Thị Lan",
          specialty: "Tiếng Anh giao tiếp",
          bio: "Cử nhân Ngôn ngữ Anh, 8 năm kinh nghiệm giảng dạy tiếng Anh giao tiếp và luyện thi IELTS.",
          experience: "8 năm",
          education: "Cử nhân Ngôn ngữ Anh - ĐH Ngoại ngữ Hà Nội",
          imageUrl: "/tutor2.jpg",
          subjects: ["Tiếng Anh", "IELTS", "TOEIC"],
          availability: ["Thứ 3", "Thứ 5", "Thứ 7", "Chủ nhật"],
          isActive: true
     },
     {
          name: "Thầy Lê Hoàng Nam",
          specialty: "Vật lý THPT",
          bio: "Giảng viên Vật lý với 12 năm kinh nghiệm. Chuyên luyện thi đại học khối A và A1.",
          experience: "12 năm",
          education: "Thạc sĩ Vật lý - ĐH Bách khoa Hà Nội",
          imageUrl: "/tutor3.jpg",
          subjects: ["Vật lý", "Cơ học", "Điện học"],
          availability: ["Thứ 2", "Thứ 4", "Thứ 6"],
          isActive: true
     },
     {
          name: "Cô Phạm Thị Hương",
          specialty: "Hóa học THPT",
          bio: "7 năm kinh nghiệm giảng dạy Hóa học. Chuyên gia trong việc giải bài tập hóa học phức tạp.",
          experience: "7 năm",
          education: "Cử nhân Hóa học - ĐH Khoa học Tự nhiên",
          imageUrl: "/tutor4.jpg",
          subjects: ["Hóa học", "Hóa hữu cơ", "Hóa vô cơ"],
          availability: ["Thứ 3", "Thứ 5", "Thứ 7"],
          isActive: true
     },
     {
          name: "Thầy Đỗ Minh Quân",
          specialty: "Văn học THPT",
          bio: "Thạc sĩ Văn học Việt Nam, 9 năm kinh nghiệm giảng dạy Ngữ văn và luyện thi đại học.",
          experience: "9 năm",
          education: "Thạc sĩ Văn học Việt Nam - ĐH Sư phạm Hà Nội",
          imageUrl: "/tutor5.jpg",
          subjects: ["Ngữ văn", "Văn học", "Tiếng Việt"],
          availability: ["Thứ 2", "Thứ 4", "Thứ 6", "Chủ nhật"],
          isActive: true
     }
];

async function clearTutorsCollection() {
     console.log('🗑️ Clearing existing tutors...');
     const snapshot = await getDocs(collection(db, 'tutors'));

     const deletePromises = snapshot.docs.map(docSnap =>
          deleteDoc(doc(db, 'tutors', docSnap.id))
     );

     await Promise.all(deletePromises);
     console.log(`✅ Deleted ${snapshot.docs.length} existing tutors`);
}

async function migrateTutors() {
     console.log('👨‍🏫 Migrating tutors...');

     const now = new Date().toISOString();

     for (const tutor of mockTutors) {
          await addDoc(collection(db, 'tutors'), {
               ...tutor,
               createdAt: now,
               updatedAt: now,
          });
          console.log(`✅ Added tutor: ${tutor.name}`);
     }

     console.log(`✅ Successfully migrated ${mockTutors.length} tutors`);
}

async function runMigration() {
     try {
          console.log('🚀 Starting tutors migration...\n');

          // Check Firebase connection
          if (!firebaseConfig.apiKey) {
               throw new Error('Firebase configuration not found. Please check your .env file.');
          }

          await clearTutorsCollection();
          await migrateTutors();

          console.log('\n🎉 Tutors migration completed successfully!');
          console.log('\nYou can now:');
          console.log('1. View tutors in Firebase Console');
          console.log('2. Test the AboutPage to see Firestore tutors');
          console.log('3. Update VITE_USE_MOCK_DATA=false for tutors');

     } catch (error) {
          console.error('❌ Migration failed:', error.message);
          process.exit(1);
     }
}

// Run migration
runMigration(); 
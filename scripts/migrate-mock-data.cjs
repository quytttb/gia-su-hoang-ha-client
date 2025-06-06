#!/usr/bin/env node

/**
 * Script migrate mock data vào Firestore
 * 
 * Cách sử dụng:
 * node scripts/migrate-mock-data.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, setDoc, doc, getDocs, deleteDoc, writeBatch } = require('firebase/firestore');
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

// Mock data từ file mockData.ts
const mockData = {
     centerInfo: {
          id: '1',
          name: 'Trung tâm Gia Sư Hoàng Hà',
          description: 'Trung tâm Gia Sư Hoàng Hà tự hào là nơi cung cấp dịch vụ gia sư chất lượng cao tại Thanh Hóa. Với đội ngũ giáo viên giỏi, nhiệt tình, chúng tôi cam kết mang đến những lớp học hiệu quả, giúp học sinh nâng cao kiến thức và kỹ năng.',
          address: '265 - ĐƯỜNG 06 - MẶT BẰNG 08, PHƯỜNG NAM NGẠN, THÀNH PHỐ THANH HOÁ, TỈNH THANH HOÁ',
          phone: '0385.510.892 - 0962.390.161',
          email: 'lienhe@giasuhoangha.com',
          history: 'Trung tâm Gia Sư Hoàng Hà được thành lập vào năm 2015 với mục tiêu ban đầu là cung cấp các dịch vụ gia sư cho học sinh tiểu học và THCS. Trải qua 10 năm hoạt động, chúng tôi đã không ngừng phát triển và mở rộng các lớp học, từ mầm non đến luyện thi đại học, đáp ứng nhu cầu học tập đa dạng của học sinh Thanh Hóa.',
          mission: 'Sứ mệnh của chúng tôi là cung cấp môi trường học tập chất lượng, hiệu quả, giúp học sinh phát triển toàn diện về kiến thức và kỹ năng sống.',
          vision: 'Trở thành trung tâm gia sư hàng đầu tại Thanh Hóa, mang đến giải pháp giáo dục toàn diện cho học sinh các cấp.',
          workingHours: {
               weekdays: '7:30 - 20:00',
               weekend: '8:00 - 17:00',
          },
          slogan: 'DẪN LỐI TRI THỨC - VỮNG BƯỚC TƯƠNG LAI',
     },

     courses: [
          {
               id: '1',
               name: 'Luyện thi Toán THPT Quốc Gia',
               description: 'Khóa học cung cấp kiến thức toàn diện và kỹ năng làm bài thi Toán THPT Quốc Gia, giúp học sinh đạt điểm cao.',
               targetAudience: 'Học sinh lớp 12',
               schedule: 'Thứ 2, 4, 6 (18:00 - 20:00)',
               price: 2500000,
               discount: 10,
               discountEndDate: '2025-05-30',
               imageUrl: '/course1.jpg',
               featured: true,
               category: 'THPT',
          },
          {
               id: '2',
               name: 'Tiếng Anh giao tiếp',
               description: 'Khóa học giúp học sinh phát triển kỹ năng giao tiếp tiếng Anh thông qua các hoạt động thực tế và tình huống hàng ngày.',
               targetAudience: 'Học sinh từ 10-15 tuổi',
               schedule: 'Thứ 3, 5, 7 (16:00 - 17:30)',
               price: 1800000,
               imageUrl: '/course2.jpg',
               featured: true,
               category: 'Ngoại ngữ',
          },
          {
               id: '3',
               name: 'Khóa học hè - Tiểu học',
               description: 'Khóa học giúp học sinh ôn tập kiến thức, phát triển kỹ năng đọc, viết và làm toán trong thời gian hè.',
               targetAudience: 'Học sinh lớp 1-5',
               schedule: 'Thứ 2 đến thứ 6 (8:00 - 10:30)',
               price: 3500000,
               discount: 15,
               discountEndDate: '2025-05-30',
               imageUrl: '/course3.jpg',
               featured: false,
               category: 'Tiểu học',
          },
          {
               id: '4',
               name: 'Luyện thi vào lớp 10',
               description: 'Khóa học tập trung vào ôn tập kiến thức và kỹ năng làm bài thi môn Toán, Văn, Tiếng Anh cho kỳ thi vào lớp 10.',
               targetAudience: 'Học sinh lớp 9',
               schedule: 'Thứ 2, 4, 6, 7 (18:00 - 20:30)',
               price: 4000000,
               imageUrl: '/course4.jpg',
               featured: true,
               category: 'THCS',
          },
     ],

     tutors: [
          {
               id: '1',
               name: 'Nguyễn Văn A',
               specialty: 'Toán học',
               bio: 'Thạc sĩ Toán học, 10 năm kinh nghiệm giảng dạy, chuyên luyện thi THPT Quốc Gia.',
               imageUrl: '/tutor1.jpg',
          },
          {
               id: '2',
               name: 'Trần Thị B',
               specialty: 'Ngữ văn',
               bio: 'Cử nhân Văn học Việt Nam, 8 năm kinh nghiệm giảng dạy văn học các cấp.',
               imageUrl: '/tutor2.jpg',
          },
          {
               id: '3',
               name: 'Lê Văn C',
               specialty: 'Tiếng Anh',
               bio: 'Thạc sĩ Ngôn ngữ Anh, chứng chỉ IELTS 8.0, 5 năm kinh nghiệm giảng dạy.',
               imageUrl: '/tutor3.jpg',
          },
          {
               id: '4',
               name: 'Phạm Thị D',
               specialty: 'Vật lý',
               bio: 'Thạc sĩ Vật lý, đạt giải nhất giáo viên dạy giỏi cấp tỉnh năm 2022.',
               imageUrl: '/tutor4.jpg',
          },
     ],

     schedules: [
          {
               id: '1',
               courseId: '1',
               courseName: 'Luyện thi Toán THPT Quốc Gia',
               date: '2025-05-20',
               startTime: '18:00',
               endTime: '20:00',
               tutor: 'Nguyễn Văn A',
               room: 'P201',
               studentIds: ['user1', 'user2', 'user3'],
          },
          {
               id: '2',
               courseId: '1',
               courseName: 'Luyện thi Toán THPT Quốc Gia',
               date: '2025-05-22',
               startTime: '18:00',
               endTime: '20:00',
               tutor: 'Nguyễn Văn A',
               room: 'P201',
               studentIds: ['user1', 'user2', 'user3'],
          },
          {
               id: '3',
               courseId: '2',
               courseName: 'Tiếng Anh giao tiếp',
               date: '2025-05-21',
               startTime: '16:00',
               endTime: '17:30',
               tutor: 'Lê Văn C',
               room: 'P103',
               studentIds: ['user4', 'user5'],
          },
     ]
};

async function clearCollection(collectionName) {
     console.log(`🗑️  Xóa collection ${collectionName}...`);
     const snapshot = await getDocs(collection(db, collectionName));
     const batch = writeBatch(db);

     snapshot.docs.forEach((docSnapshot) => {
          batch.delete(docSnapshot.ref);
     });

     if (!snapshot.empty) {
          await batch.commit();
          console.log(`✅ Đã xóa ${snapshot.size} documents từ ${collectionName}`);
     }
}

async function migrateCenterInfo() {
     console.log('📋 Migrate center info...');
     await setDoc(doc(db, 'settings', 'center-info'), {
          ...mockData.centerInfo,
          isPublic: true,
          updatedAt: new Date().toISOString(),
     });
     console.log('✅ Center info migrated');
}

async function migrateCourses() {
     console.log('📚 Migrate courses...');
     await clearCollection('courses');

     for (const course of mockData.courses) {
          const { id, ...courseData } = course;
          await setDoc(doc(db, 'courses', id), {
               ...courseData,
               createdAt: new Date().toISOString(),
               updatedAt: new Date().toISOString(),
          });
          console.log(`✅ Course: ${course.name}`);
     }
}

async function migrateTutors() {
     console.log('👨‍🏫 Migrate tutors...');
     await clearCollection('tutors');

     for (const tutor of mockData.tutors) {
          const { id, ...tutorData } = tutor;
          await setDoc(doc(db, 'tutors', id), {
               ...tutorData,
               isActive: true,
               createdAt: new Date().toISOString(),
               updatedAt: new Date().toISOString(),
          });
          console.log(`✅ Tutor: ${tutor.name}`);
     }
}

async function migrateSchedules() {
     console.log('📅 Migrate schedules...');
     await clearCollection('schedules');

     for (const schedule of mockData.schedules) {
          const { id, ...scheduleData } = schedule;
          await setDoc(doc(db, 'schedules', id), {
               ...scheduleData,
               createdAt: new Date().toISOString(),
               updatedAt: new Date().toISOString(),
          });
          console.log(`✅ Schedule: ${schedule.courseName} - ${schedule.date}`);
     }
}

async function runMigration() {
     console.log('🚀 Bắt đầu migration mock data...');
     console.log('='.repeat(50));

     try {
          await migrateCenterInfo();
          await migrateCourses();
          await migrateTutors();
          await migrateSchedules();

          console.log('='.repeat(50));
          console.log('🎉 Migration hoàn thành thành công!');
          console.log('✅ Tất cả mock data đã được thêm vào Firestore');

     } catch (error) {
          console.error('❌ Migration thất bại:', error.message);
          console.error(error);
          process.exit(1);
     }
}

// Run migration
runMigration(); 
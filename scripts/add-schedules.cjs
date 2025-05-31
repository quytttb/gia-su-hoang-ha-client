#!/usr/bin/env node

/**
 * Script thêm 3 lịch học mẫu vào Firestore
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, doc, getDoc } = require('firebase/firestore');
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

// Sample schedules data
const sampleSchedules = [
     {
          courseId: 'course-1', // Sẽ lấy từ courses collection
          courseName: 'Toán THPT - Luyện thi đại học',
          date: '2025-05-28',
          startTime: '18:00',
          endTime: '20:00',
          tutor: 'Thầy Nguyễn Văn Minh',
          room: 'Phòng 201',
          studentIds: ['student-1', 'student-2', 'student-3']
     },
     {
          courseId: 'course-2',
          courseName: 'Tiếng Anh giao tiếp cơ bản',
          date: '2025-05-29',
          startTime: '16:00',
          endTime: '17:30',
          tutor: 'Cô Trần Thị Lan',
          room: 'Phòng 103',
          studentIds: ['student-4', 'student-5']
     },
     {
          courseId: 'course-3',
          courseName: 'Vật lý THPT - Cơ bản',
          date: '2025-05-30',
          startTime: '19:00',
          endTime: '21:00',
          tutor: 'Thầy Lê Hoàng Nam',
          room: 'Phòng 205',
          studentIds: ['student-6', 'student-7', 'student-8', 'student-9']
     }
];

async function getCourseInfo(courseId) {
     try {
          const courseDoc = await getDoc(doc(db, 'courses', courseId));
          if (courseDoc.exists()) {
               const courseData = courseDoc.data();
               return {
                    id: courseDoc.id,
                    name: courseData.title || courseData.name || 'Unknown Course'
               };
          }
          return null;
     } catch (error) {
          console.log(`⚠️ Could not fetch course ${courseId}, using sample data`);
          return null;
     }
}

async function addSchedules() {
     console.log('📅 Adding sample schedules...\n');

     const now = new Date().toISOString();

     for (let i = 0; i < sampleSchedules.length; i++) {
          const schedule = sampleSchedules[i];

          // Try to get real course info from Firestore
          const courseInfo = await getCourseInfo(schedule.courseId);

          const scheduleData = {
               courseId: schedule.courseId,
               courseName: courseInfo ? courseInfo.name : schedule.courseName,
               date: schedule.date,
               startTime: schedule.startTime,
               endTime: schedule.endTime,
               tutor: schedule.tutor,
               room: schedule.room,
               studentIds: schedule.studentIds,
               maxStudents: schedule.studentIds.length + 2, // Allow 2 more students
               status: 'scheduled',
               createdAt: now,
               updatedAt: now,
          };

          const docRef = await addDoc(collection(db, 'schedules'), scheduleData);
          console.log(`✅ Added schedule ${i + 1}: ${schedule.courseName}`);
          console.log(`   📋 ID: ${docRef.id}`);
          console.log(`   📅 Date: ${schedule.date} ${schedule.startTime}-${schedule.endTime}`);
          console.log(`   👨‍🏫 Tutor: ${schedule.tutor}`);
          console.log(`   🏢 Room: ${schedule.room}`);
          console.log(`   👥 Students: ${schedule.studentIds.length}\n`);
     }

     console.log(`✅ Successfully added ${sampleSchedules.length} schedules`);
}

async function checkExistingSchedules() {
     console.log('🔍 Checking existing schedules...');
     const snapshot = await getDocs(collection(db, 'schedules'));
     console.log(`📊 Found ${snapshot.docs.length} existing schedules\n`);

     if (snapshot.docs.length > 0) {
          console.log('📋 Existing schedules:');
          snapshot.docs.forEach((doc, index) => {
               const data = doc.data();
               console.log(`   ${index + 1}. ${data.courseName} - ${data.date} (${data.startTime}-${data.endTime})`);
          });
          console.log('');
     }
}

async function runScript() {
     try {
          console.log('🚀 Starting schedule addition...\n');

          // Check Firebase connection
          if (!firebaseConfig.apiKey) {
               throw new Error('Firebase configuration not found. Please check your .env file.');
          }

          await checkExistingSchedules();
          await addSchedules();

          console.log('\n🎉 Schedule addition completed successfully!');
          console.log('\nYou can now:');
          console.log('1. View schedules in Firebase Console');
          console.log('2. Test the SchedulePage to see new schedules');
          console.log('3. Check admin panel for schedule management');

     } catch (error) {
          console.error('❌ Script failed:', error.message);
          process.exit(1);
     }
}

// Run script
runScript(); 
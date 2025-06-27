import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch, Timestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
     apiKey: "AIzaSyC0ZGhS9oJTZp2jl9fVnQlYq8FQXZvZMJU",
     authDomain: "gia-su-hoang-ha.firebaseapp.com",
     projectId: "gia-su-hoang-ha",
     storageBucket: "gia-su-hoang-ha.appspot.com",
     messagingSenderId: "821551022903",
     appId: "1:821551022903:web:00a86f5c5a35e0c1e3e9f8",
     measurementId: "G-0C25SX7IGJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function validateAndFixDataConsistency() {
     console.log('🔍 VALIDATE VÀ SỬA CHỮA TÍNH NHẤT QUÁN DỮ LIỆU');
     console.log('='.repeat(60));

     try {
          // Sign in as admin
          console.log('🔐 Đăng nhập với tài khoản admin...');
          await signInWithEmailAndPassword(auth, 'admin@giasuhoangha.com', 'admin123');
          console.log('✅ Đăng nhập thành công!');
          console.log('');

          // Load reference data
          console.log('📚 BƯỚC 1: TẢI DỮ LIỆU THAM CHIẾU');
          console.log('-'.repeat(40));

          const [classesSnapshot, tutorsSnapshot, schedulesSnapshot] = await Promise.all([
               getDocs(collection(db, 'classes')),
               getDocs(collection(db, 'tutors')),
               getDocs(collection(db, 'schedules'))
          ]);

          // Build reference maps
          const classesMap = new Map();
          const tutorsMap = new Map();

          classesSnapshot.forEach(doc => {
               const data = doc.data();
               classesMap.set(doc.id, data.name || data.title || '');
          });

          tutorsSnapshot.forEach(doc => {
               const data = doc.data();
               tutorsMap.set(doc.id, data.name || '');
          });

          console.log(`✅ Đã tải ${classesMap.size} classes và ${tutorsMap.size} tutors`);
          console.log('');

          // Validate schedules
          console.log('🔍 BƯỚC 2: KIỂM TRA TÍNH NHẤT QUÁN SCHEDULES');
          console.log('-'.repeat(40));

          const batch = writeBatch(db);
          let fixCount = 0;
          let inconsistentData = [];

          schedulesSnapshot.forEach(doc => {
               const data = doc.data();
               const issues = [];
               const updates = {};

               // Check classId và className
               const correctClassName = classesMap.get(data.classId);
               if (!correctClassName) {
                    issues.push(`❌ classId "${data.classId}" không tồn tại trong collection classes`);
               } else if (data.className !== correctClassName) {
                    issues.push(`⚠️ className không khớp: "${data.className}" → "${correctClassName}"`);
                    updates.className = correctClassName;
               }

               // Check tutorId và tutorName
               const correctTutorName = tutorsMap.get(data.tutorId);
               if (!correctTutorName) {
                    issues.push(`❌ tutorId "${data.tutorId}" không tồn tại trong collection tutors`);
               } else if (data.tutorName !== correctTutorName) {
                    issues.push(`⚠️ tutorName không khớp: "${data.tutorName}" → "${correctTutorName}"`);
                    updates.tutorName = correctTutorName;
               }

               // Check required fields
               if (!data.classId) issues.push('❌ Thiếu classId');
               if (!data.className) issues.push('❌ Thiếu className');
               if (!data.tutorId) issues.push('❌ Thiếu tutorId');
               if (!data.tutorName) issues.push('❌ Thiếu tutorName');
               if (!data.startDate) issues.push('❌ Thiếu startDate');
               if (!data.startTime) issues.push('❌ Thiếu startTime');
               if (!data.endTime) issues.push('❌ Thiếu endTime');
               if (data.maxStudents !== 12) {
                    issues.push(`⚠️ maxStudents không chuẩn: ${data.maxStudents} → 12`);
                    updates.maxStudents = 12;
               }

               // Check legacy fields
               if (data.tutor !== undefined) {
                    issues.push('⚠️ Tồn tại field "tutor" cũ');
               }
               if (data.courseId !== undefined) {
                    issues.push('⚠️ Tồn tại field "courseId" cũ');
               }
               if (data.date !== undefined) {
                    issues.push('⚠️ Tồn tại field "date" cũ');
               }
               if (data.room !== undefined) {
                    issues.push('⚠️ Tồn tại field "room" cũ');
               }

               if (issues.length > 0) {
                    inconsistentData.push({
                         id: doc.id,
                         issues: issues,
                         currentData: {
                              classId: data.classId,
                              className: data.className,
                              tutorId: data.tutorId,
                              tutorName: data.tutorName,
                              maxStudents: data.maxStudents
                         }
                    });

                    console.log(`📅 Schedule ${doc.id}:`);
                    issues.forEach(issue => console.log(`   ${issue}`));
                    console.log('');

                    // Apply fixes
                    if (Object.keys(updates).length > 0) {
                         updates.updatedAt = Timestamp.now();
                         batch.update(doc.ref, updates);
                         fixCount++;
                    }
               }
          });

          // Apply fixes
          if (fixCount > 0) {
               console.log('💾 BƯỚC 3: ÁP DỤNG SỬA CHỮA');
               console.log('-'.repeat(40));

               await batch.commit();
               console.log(`✅ Đã sửa chữa ${fixCount} schedules`);
               console.log('');
          }

          // Summary
          console.log('📊 KẾT QUẢ KIỂM TRA:');
          console.log(`   📅 Tổng số schedules: ${schedulesSnapshot.size}`);
          console.log(`   ❌ Schedules có vấn đề: ${inconsistentData.length}`);
          console.log(`   🔧 Đã sửa chữa: ${fixCount}`);
          console.log('');

          if (inconsistentData.length === 0) {
               console.log('🎉 TẤT CẢ DỮ LIỆU NHẤT QUÁN!');
               console.log('   • Tất cả className khớp với classes');
               console.log('   • Tất cả tutorName khớp với tutors');
               console.log('   • Không có field legacy nào');
               console.log('   • Cấu trúc dữ liệu chuẩn hóa hoàn toàn');
          } else {
               console.log('⚠️ VẪN CÒN VẤN ĐỀ CẦN XỬ LÝ THỦ CÔNG:');
               inconsistentData.forEach(item => {
                    if (item.issues.some(issue => issue.includes('❌'))) {
                         console.log(`   • Schedule ${item.id}: ${item.issues.filter(i => i.includes('❌')).join(', ')}`);
                    }
               });
          }

          console.log('');
          console.log('🎯 KHUYẾN NGHỊ:');
          console.log('   1. Chạy script này định kỳ để đảm bảo tính nhất quán');
          console.log('   2. Khi cập nhật tên class/tutor, chạy script này ngay sau');
          console.log('   3. Sử dụng DataSyncUtils trong code khi cập nhật dữ liệu');

     } catch (error) {
          console.error('❌ Lỗi:', error.message);
     }
}

// Run validation
validateAndFixDataConsistency().then(() => {
     console.log('✅ Hoàn thành validation và sửa chữa');
     process.exit(0);
}).catch(error => {
     console.error('❌ Lỗi:', error);
     process.exit(1);
});

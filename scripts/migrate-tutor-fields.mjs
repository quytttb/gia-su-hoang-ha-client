import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, writeBatch, Timestamp } from 'firebase/firestore';
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

async function migrateTutorFields() {
     console.log('🔄 SCRIPT MIGRATION: tutor → tutorId + tutorName');
     console.log('='.repeat(60));

     try {
          // Sign in as admin
          console.log('🔐 Đăng nhập với tài khoản admin...');
          await signInWithEmailAndPassword(auth, 'admin@giasuhoangha.com', 'admin123');
          console.log('✅ Đăng nhập thành công!');
          console.log('');

          // Step 1: Load tutors data
          console.log('👨‍🏫 BƯỚC 1: TẢI DỮ LIỆU TUTORS');
          console.log('-'.repeat(40));

          const tutorsRef = collection(db, 'tutors');
          const tutorsSnapshot = await getDocs(tutorsRef);

          const tutorsMap = new Map();
          tutorsSnapshot.forEach((doc) => {
               const data = doc.data();
               tutorsMap.set(doc.id, data.name || `Tutor ${doc.id}`);
          });

          console.log(`✅ Đã tải ${tutorsMap.size} tutors`);
          console.log('');

          // Step 2: Load and migrate schedules
          console.log('📅 BƯỚC 2: MIGRATION SCHEDULES');
          console.log('-'.repeat(40));

          const schedulesRef = collection(db, 'schedules');
          const schedulesSnapshot = await getDocs(schedulesRef);

          console.log(`📊 Tìm thấy ${schedulesSnapshot.size} schedules cần migration`);
          console.log('');

          const batch = writeBatch(db);
          let migrationCount = 0;
          let errorCount = 0;

          schedulesSnapshot.forEach((scheduleDoc) => {
               const scheduleId = scheduleDoc.id;
               const data = scheduleDoc.data();

               console.log(`🔄 Đang xử lý schedule ${scheduleId}...`);

               try {
                    let tutorId = '';
                    let tutorName = '';

                    // Xử lý field tutor hiện tại
                    if (data.tutor) {
                         // Nếu tutor là ID (có trong tutorsMap)
                         if (tutorsMap.has(data.tutor)) {
                              tutorId = data.tutor;
                              tutorName = tutorsMap.get(data.tutor);
                         } else {
                              // Nếu tutor là tên, tìm ID tương ứng
                              const foundTutorEntry = Array.from(tutorsMap.entries()).find(([id, name]) =>
                                   name.toLowerCase().includes(data.tutor.toLowerCase()) ||
                                   data.tutor.toLowerCase().includes(name.toLowerCase())
                              );

                              if (foundTutorEntry) {
                                   tutorId = foundTutorEntry[0];
                                   tutorName = foundTutorEntry[1];
                              } else {
                                   // Nếu không tìm thấy, dùng tutor đầu tiên hoặc tạo placeholder
                                   const firstTutor = Array.from(tutorsMap.entries())[0];
                                   if (firstTutor) {
                                        tutorId = firstTutor[0];
                                        tutorName = firstTutor[1];
                                        console.log(`   ⚠️  Không tìm thấy tutor "${data.tutor}", dùng "${tutorName}"`);
                                   }
                              }
                         }
                    } else {
                         // Nếu không có tutor, dùng tutor đầu tiên
                         const firstTutor = Array.from(tutorsMap.entries())[0];
                         if (firstTutor) {
                              tutorId = firstTutor[0];
                              tutorName = firstTutor[1];
                              console.log(`   ⚠️  Không có tutor, dùng "${tutorName}"`);
                         }
                    }

                    if (tutorId && tutorName) {
                         // Cập nhật document với cấu trúc mới
                         const updateData = {
                              tutorId: tutorId,
                              tutorName: tutorName,
                              updatedAt: Timestamp.now()
                         };

                         // Xóa field tutor cũ (Firebase sẽ không xóa field khi dùng update)
                         // Cần dùng FieldValue.delete() nhưng trong script này ta sẽ ghi đè toàn bộ

                         batch.update(scheduleDoc.ref, updateData);

                         console.log(`   ✅ Migration: tutorId="${tutorId}", tutorName="${tutorName}"`);
                         migrationCount++;
                    } else {
                         console.log(`   ❌ Không thể xác định tutor cho schedule ${scheduleId}`);
                         errorCount++;
                    }

               } catch (error) {
                    console.log(`   ❌ Lỗi xử lý schedule ${scheduleId}: ${error.message}`);
                    errorCount++;
               }

               console.log('');
          });

          // Commit batch update
          if (migrationCount > 0) {
               console.log('💾 BƯỚC 3: LƯU CẬP NHẬT');
               console.log('-'.repeat(40));

               await batch.commit();
               console.log('✅ Đã lưu tất cả cập nhật thành công!');
               console.log('');
          }

          // Summary
          console.log('📊 KẾT QUẢ MIGRATION:');
          console.log(`   ✅ Đã migration: ${migrationCount} schedules`);
          console.log(`   ❌ Lỗi: ${errorCount} schedules`);
          console.log(`   📋 Tổng cộng: ${schedulesSnapshot.size} schedules`);
          console.log('');

          console.log('🎯 BƯỚC TIẾP THEO:');
          console.log('   1. Kiểm tra dữ liệu sau migration');
          console.log('   2. Xóa field "tutor" cũ thủ công từ Firebase Console');
          console.log('   3. Test frontend với cấu trúc mới');
          console.log('   4. Chạy script validate-and-fix để kiểm tra tính nhất quán');

     } catch (error) {
          console.error('❌ Lỗi migration:', error.message);
     }
}

// Script để xóa field tutor cũ (cần chạy riêng)
function generateCleanupScript() {
     console.log('');
     console.log('🧹 SCRIPT XÓA FIELD "TUTOR" CŨ:');
     console.log('='.repeat(60));
     console.log(`
// Chạy script này để xóa field "tutor" cũ
import { FieldValue } from 'firebase/firestore';

const cleanupOldTutorField = async () => {
  const batch = writeBatch(db);
  const schedulesSnapshot = await getDocs(collection(db, 'schedules'));
  
  schedulesSnapshot.forEach(doc => {
    batch.update(doc.ref, {
      tutor: FieldValue.delete()
    });
  });
  
  await batch.commit();
  console.log('✅ Đã xóa field "tutor" cũ từ tất cả schedules');
}
  `);
}

// Run migration
migrateTutorFields().then(() => {
     generateCleanupScript();
     console.log('✅ Hoàn thành migration tutor fields');
     process.exit(0);
}).catch(error => {
     console.error('❌ Lỗi:', error);
     process.exit(1);
});

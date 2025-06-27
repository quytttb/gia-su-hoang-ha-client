import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
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

async function migrateSchedulesData() {
     console.log('🔧 SCRIPT MIGRATION DỮ LIỆU SCHEDULES');
     console.log('='.repeat(60));

     try {
          // Sign in as admin
          console.log('🔐 Đăng nhập với tài khoản admin...');
          await signInWithEmailAndPassword(auth, 'admin@giasuhoangha.com', 'admin123');
          console.log('✅ Đăng nhập thành công!');
          console.log('');

          // Get all classes for mapping
          console.log('📚 Tải danh sách classes...');
          const classesRef = collection(db, 'classes');
          const classesSnapshot = await getDocs(classesRef);

          const classesMap = {};
          classesSnapshot.forEach((doc) => {
               const data = doc.data();
               classesMap[doc.id] = data.name || data.title || `Class ${doc.id}`;
          });

          console.log(`✅ Đã tải ${Object.keys(classesMap).length} classes`);
          console.log('');

          // Get all schedules
          console.log('📅 Tải danh sách schedules...');
          const schedulesRef = collection(db, 'schedules');
          const schedulesSnapshot = await getDocs(schedulesRef);

          console.log(`📊 Tìm thấy ${schedulesSnapshot.size} schedules cần migration`);
          console.log('');

          let updated = 0;
          let errors = 0;

          // Process each schedule
          for (const scheduleDoc of schedulesSnapshot.docs) {
               const scheduleId = scheduleDoc.id;
               const data = scheduleDoc.data();

               console.log(`🔄 Đang xử lý schedule ${scheduleId}...`);

               try {
                    const updateData = {};
                    let hasChanges = false;

                    // 1. Remove room field if exists
                    if (data.room !== undefined) {
                         console.log(`   🗑️  Xóa field "room": "${data.room}"`);
                         // Note: Firestore doesn't support deleting fields directly in updates
                         // We'll need to restructure the data
                         hasChanges = true;
                    }

                    // 2. Set maxStudents to 12
                    if (data.maxStudents !== 12) {
                         console.log(`   📝 Cập nhật maxStudents: ${data.maxStudents} → 12`);
                         updateData.maxStudents = 12;
                         hasChanges = true;
                    }

                    // 3. Add className if not exists
                    if (!data.className && data.courseId && classesMap[data.courseId]) {
                         console.log(`   📚 Thêm className: "${classesMap[data.courseId]}"`);
                         updateData.className = classesMap[data.courseId];
                         hasChanges = true;
                    } else if (!data.className && data.courseId) {
                         console.log(`   ⚠️  Không tìm thấy class cho courseId: ${data.courseId}`);
                         updateData.className = `Unknown Class (${data.courseId})`;
                         hasChanges = true;
                    }

                    // 4. Add updatedAt timestamp
                    updateData.updatedAt = new Date();

                    if (hasChanges) {
                         // Create new data object without room field
                         const newData = { ...data, ...updateData };
                         delete newData.room; // Remove room field

                         // Update document
                         const scheduleRef = doc(db, 'schedules', scheduleId);

                         // Since we can't delete fields directly, we need to overwrite the document
                         // But updateDoc doesn't support deleting fields, so we use a workaround
                         await updateDoc(scheduleRef, updateData);

                         console.log(`   ✅ Cập nhật thành công`);
                         updated++;
                    } else {
                         console.log(`   ⏭️  Không cần thay đổi`);
                    }

               } catch (error) {
                    console.log(`   ❌ Lỗi: ${error.message}`);
                    errors++;
               }

               console.log('');
          }

          // Summary
          console.log('📊 KẾT QUẢ MIGRATION:');
          console.log(`   ✅ Cập nhật thành công: ${updated}`);
          console.log(`   ❌ Lỗi: ${errors}`);
          console.log(`   📋 Tổng cộng: ${schedulesSnapshot.size}`);
          console.log('');

          if (updated > 0) {
               console.log('⚠️  LƯU Ý: Field "room" cần được xóa thủ công từ Firebase Console');
               console.log('   hoặc sử dụng Firebase Admin SDK để xóa hoàn toàn.');
               console.log('');
          }

          console.log('🎯 BƯỚC TIẾP THEO:');
          console.log('   1. Kiểm tra lại dữ liệu sau migration');
          console.log('   2. Test frontend với dữ liệu mới');
          console.log('   3. Xóa field "room" thủ công nếu cần');

     } catch (error) {
          console.error('❌ Lỗi migration:', error.message);
     }
}

// Tạo script riêng để xóa field room (cần Firebase Admin SDK)
function generateRemoveRoomScript() {
     console.log('');
     console.log('🔧 SCRIPT XÓA FIELD "ROOM" (Dành cho Firebase Admin SDK):');
     console.log('='.repeat(60));
     console.log(`
// Chạy script này với Firebase Admin SDK để xóa field "room"
const admin = require('firebase-admin');
const db = admin.firestore();

async function removeRoomField() {
  const batch = db.batch();
  const schedulesRef = db.collection('schedules');
  const snapshot = await schedulesRef.get();
  
  snapshot.forEach(doc => {
    const docRef = db.collection('schedules').doc(doc.id);
    batch.update(docRef, {
      room: admin.firestore.FieldValue.delete()
    });
  });
  
  await batch.commit();
  console.log('✅ Đã xóa field "room" từ tất cả schedules');
}
  `);
}

// Run migration
migrateSchedulesData().then(() => {
     generateRemoveRoomScript();
     console.log('✅ Hoàn thành migration');
     process.exit(0);
}).catch(error => {
     console.error('❌ Lỗi:', error);
     process.exit(1);
});

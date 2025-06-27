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

async function migrateCourseToClass() {
     console.log('🔧 MIGRATION: CHUYỂN courseId → classId TRONG SCHEDULES');
     console.log('='.repeat(70));

     try {
          // Sign in as admin
          console.log('🔐 Đăng nhập với tài khoản admin...');
          await signInWithEmailAndPassword(auth, 'admin@giasuhoangha.com', 'admin123');
          console.log('✅ Đăng nhập thành công!');
          console.log('');

          // Get all schedules
          console.log('📅 Tải danh sách schedules...');
          const schedulesRef = collection(db, 'schedules');
          const schedulesSnapshot = await getDocs(schedulesRef);

          console.log(`📊 Tìm thấy ${schedulesSnapshot.size} schedules cần migration`);
          console.log('');

          let updated = 0;
          let skipped = 0;
          let errors = 0;

          // Process each schedule
          for (const scheduleDoc of schedulesSnapshot.docs) {
               const scheduleId = scheduleDoc.id;
               const data = scheduleDoc.data();

               console.log(`🔄 Đang xử lý schedule ${scheduleId}...`);

               try {
                    const updateData = {};
                    let hasChanges = false;

                    // 1. Migrate courseId to classId
                    if (data.courseId !== undefined) {
                         console.log(`   📝 Chuyển courseId → classId: "${data.courseId}"`);
                         updateData.classId = data.courseId;
                         hasChanges = true;
                    } else if (!data.classId) {
                         console.log(`   ⚠️  Cả courseId và classId đều không tồn tại`);
                    } else {
                         console.log(`   ⏭️  classId đã tồn tại: "${data.classId}"`);
                         skipped++;
                         continue;
                    }

                    // 2. Add migration timestamp
                    updateData.migratedAt = new Date();
                    updateData.updatedAt = new Date();

                    if (hasChanges) {
                         // Update document
                         const scheduleRef = doc(db, 'schedules', scheduleId);
                         await updateDoc(scheduleRef, updateData);

                         console.log(`   ✅ Cập nhật thành công`);
                         console.log(`      • Thêm classId: ${updateData.classId}`);
                         console.log(`      • Thêm migratedAt: ${updateData.migratedAt.toISOString()}`);
                         updated++;
                    }

               } catch (error) {
                    console.log(`   ❌ Lỗi: ${error.message}`);
                    errors++;
               }

               console.log('');
          }

          // Summary
          console.log('📊 KẾT QUẢ MIGRATION COURSEID → CLASSID:');
          console.log(`   ✅ Cập nhật thành công: ${updated}`);
          console.log(`   ⏭️  Bỏ qua (đã có classId): ${skipped}`);
          console.log(`   ❌ Lỗi: ${errors}`);
          console.log(`   📋 Tổng cộng: ${schedulesSnapshot.size}`);
          console.log('');

          if (updated > 0) {
               console.log('⚠️  LƯU Ý: Field "courseId" vẫn tồn tại song song với "classId"');
               console.log('   Sau khi test thành công, cần xóa field "courseId" bằng script riêng.');
               console.log('');
          }

          console.log('🎯 BƯỚC TIẾP THEO:');
          console.log('   1. Kiểm tra lại dữ liệu sau migration');
          console.log('   2. Test frontend với classId');
          console.log('   3. Cập nhật code để sử dụng classId thay vì courseId');
          console.log('   4. Xóa field "courseId" khi đã chắc chắn');

     } catch (error) {
          console.error('❌ Lỗi migration:', error.message);
     }
}

// Tạo script kiểm tra sau migration
async function checkMigrationResult() {
     console.log('');
     console.log('🔍 KIỂM TRA KẾT QUẢ MIGRATION');
     console.log('='.repeat(50));

     try {
          const schedulesRef = collection(db, 'schedules');
          const schedulesSnapshot = await getDocs(schedulesRef);

          let hasClassId = 0;
          let hasCourseId = 0;
          let hasBoth = 0;
          let hasNeither = 0;

          schedulesSnapshot.forEach((doc, index) => {
               const data = doc.data();
               const courseExists = data.courseId !== undefined;
               const classExists = data.classId !== undefined;

               console.log(`📅 Schedule ${index + 1} (${doc.id}):`);
               console.log(`   courseId: ${courseExists ? data.courseId : 'N/A'}`);
               console.log(`   classId: ${classExists ? data.classId : 'N/A'}`);

               if (courseExists && classExists) {
                    hasBoth++;
                    console.log(`   Status: ✅ Có cả hai (migration thành công)`);
               } else if (classExists && !courseExists) {
                    hasClassId++;
                    console.log(`   Status: ✅ Chỉ có classId (hoàn hảo)`);
               } else if (courseExists && !classExists) {
                    hasCourseId++;
                    console.log(`   Status: ⚠️ Chỉ có courseId (cần migration)`);
               } else {
                    hasNeither++;
                    console.log(`   Status: ❌ Không có gì (lỗi dữ liệu)`);
               }
               console.log('');
          });

          console.log('📊 THỐNG KÊ TỔNG QUAN:');
          console.log(`   ✅ Có cả courseId và classId: ${hasBoth}`);
          console.log(`   ✅ Chỉ có classId: ${hasClassId}`);
          console.log(`   ⚠️ Chỉ có courseId: ${hasCourseId}`);
          console.log(`   ❌ Không có gì: ${hasNeither}`);
          console.log('');

          if (hasCourseId > 0) {
               console.log('💡 Cần chạy lại migration cho các schedules chỉ có courseId');
          } else if (hasBoth > 0) {
               console.log('💡 Migration thành công! Có thể tiến hành xóa field courseId');
          } else if (hasClassId === schedulesSnapshot.size) {
               console.log('🎉 Hoàn hảo! Tất cả schedules đều có classId');
          }

     } catch (error) {
          console.error('❌ Lỗi kiểm tra:', error.message);
     }
}

// Run migration
migrateCourseToClass().then(async () => {
     await checkMigrationResult();
     console.log('✅ Hoàn thành migration courseId → classId');
     process.exit(0);
}).catch(error => {
     console.error('❌ Lỗi:', error);
     process.exit(1);
});

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, limit } from 'firebase/firestore';
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

async function checkFirebaseCollections() {
     console.log('🔍 BÁOO CÁO KIỂM TRA FIREBASE COLLECTIONS');
     console.log('='.repeat(60));

     try {
          // Sign in as admin
          console.log('🔐 Đăng nhập với tài khoản admin...');
          await signInWithEmailAndPassword(auth, 'admin@giasuhoangha.com', 'admin123');
          console.log('✅ Đăng nhập thành công!');
          console.log('');

          // Check schedules collection
          console.log('📅 KIỂM TRA COLLECTION "schedules"');
          console.log('-'.repeat(40));

          const schedulesRef = collection(db, 'schedules');
          const schedulesSnapshot = await getDocs(schedulesRef);

          console.log(`📊 Tổng số schedules: ${schedulesSnapshot.size}`);
          console.log('');

          if (!schedulesSnapshot.empty) {
               let index = 0;
               schedulesSnapshot.forEach((doc) => {
                    index++;
                    const data = doc.data();
                    console.log(`📅 Schedule ${index}:`);
                    console.log(`   ID: ${doc.id}`);
                    console.log(`   classId: ${data.classId || 'N/A'}`);
                    console.log(`   className: ${data.className || 'N/A'}`);
                    console.log(`   startDate: ${data.startDate ? new Date(data.startDate.seconds * 1000).toLocaleDateString('vi-VN') : 'N/A'}`);
                    console.log(`   startTime: ${data.startTime || 'N/A'}`);
                    console.log(`   endTime: ${data.endTime || 'N/A'}`);
                    console.log(`   tutorId: ${data.tutorId || 'N/A'}`);
                    console.log(`   tutorName: ${data.tutorName || 'N/A'}`);
                    console.log(`   maxStudents: ${data.maxStudents || 'N/A'}`);
                    console.log(`   status: ${data.status || 'N/A'}`);
                    console.log(`   studentPhones: ${JSON.stringify(data.studentPhones || [])}`);
                    console.log(`   createdAt: ${data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('vi-VN') : 'N/A'}`);
                    console.log(`   updatedAt: ${data.updatedAt ? new Date(data.updatedAt.seconds * 1000).toLocaleDateString('vi-VN') : 'N/A'}`);
                    console.log('');

                    // Legacy fields check
                    const legacyFields = [];
                    if (data.courseId) legacyFields.push('courseId');
                    if (data.tutor) legacyFields.push('tutor');
                    if (data.date) legacyFields.push('date');
                    if (data.room) legacyFields.push('room');
                    if (legacyFields.length > 0) {
                         console.log(`   ⚠️ LEGACY FIELDS: ${legacyFields.join(', ')}`);
                    }
                    console.log('');
               });
          } else {
               console.log('⚠️ Collection "schedules" trống');
          }

          // Check classes collection
          console.log('📚 KIỂM TRA COLLECTION "classes"');
          console.log('-'.repeat(40));

          const classesRef = collection(db, 'classes');
          const classesQuery = query(classesRef, limit(10));
          const classesSnapshot = await getDocs(classesQuery);

          console.log(`📊 Sample classes (tối đa 10): ${classesSnapshot.size}`);
          console.log('');

          if (!classesSnapshot.empty) {
               let index = 0;
               classesSnapshot.forEach((doc) => {
                    index++;
                    const data = doc.data();
                    console.log(`📚 Class ${index}:`);
                    console.log(`   ID: ${doc.id}`);
                    console.log(`   title: ${data.title || 'N/A'}`);
                    console.log(`   name: ${data.name || 'N/A'}`);
                    console.log(`   description: ${(data.description || '').substring(0, 100)}${data.description?.length > 100 ? '...' : ''}`);
                    console.log(`   price: ${data.price || 'N/A'}`);
                    console.log(`   level: ${data.level || 'N/A'}`);
                    console.log('');
               });
          } else {
               console.log('⚠️ Collection "classes" trống');
          }

          // Check tutors collection
          console.log('👨‍🏫 KIỂM TRA COLLECTION "tutors"');
          console.log('-'.repeat(40));

          const tutorsRef = collection(db, 'tutors');
          const tutorsQuery = query(tutorsRef, limit(10));
          const tutorsSnapshot = await getDocs(tutorsQuery);

          console.log(`📊 Sample tutors (tối đa 10): ${tutorsSnapshot.size}`);
          console.log('');

          if (!tutorsSnapshot.empty) {
               let index = 0;
               tutorsSnapshot.forEach((doc) => {
                    index++;
                    const data = doc.data();
                    console.log(`👨‍🏫 Tutor ${index}:`);
                    console.log(`   ID: ${doc.id}`);
                    console.log(`   name: ${data.name || 'N/A'}`);
                    console.log(`   phone: ${data.phone || 'N/A'}`);
                    console.log(`   email: ${data.email || 'N/A'}`);
                    console.log(`   subjects: ${JSON.stringify(data.subjects || [])}`);
                    console.log(`   level: ${data.level || 'N/A'}`);
                    console.log('');
               });
          } else {
               console.log('⚠️ Collection "tutors" trống');
          }

          // Analysis and recommendations
          console.log('🔍 PHÂN TÍCH VÀ ĐỀ XUẤT');
          console.log('='.repeat(60));

          // Problem 1: Check if schedules have className
          let schedulesWithoutClassName = 0;
          let schedulesWithRoom = 0;
          let totalSchedules = 0;

          schedulesSnapshot.forEach((doc) => {
               const data = doc.data();
               totalSchedules++;

               if (!data.className && !data.courseName) {
                    schedulesWithoutClassName++;
               }

               if (data.room) {
                    schedulesWithRoom++;
               }
          });

          console.log('📊 THỐNG KÊ VẤN ĐỀ:');
          console.log(`   • Tổng số schedules: ${totalSchedules}`);
          console.log(`   • Schedules thiếu className: ${schedulesWithoutClassName}/${totalSchedules}`);
          console.log(`   • Schedules còn field 'room': ${schedulesWithRoom}/${totalSchedules}`);
          console.log('');

          console.log('⚠️ CÁC VẤN ĐỀ CẦN KHẮC PHỤC:');

          if (schedulesWithoutClassName > 0) {
               console.log(`   1. ${schedulesWithoutClassName} schedules không có className/courseName`);
               console.log('      → Cần join với collection classes để lấy tên lớp');
          }

          if (schedulesWithRoom > 0) {
               console.log(`   2. ${schedulesWithRoom} schedules vẫn còn field 'room'`);
               console.log('      → Cần migration để xóa field này');
          }

          console.log('');
          console.log('💡 ĐỀ XUẤT KHẮC PHỤC:');
          console.log('   1. Tạo script migration để:');
          console.log('      - Xóa field "room" khỏi tất cả schedules');
          console.log('      - Thêm field "className" bằng cách join với classes');
          console.log('      - Đảm bảo maxStudents = 12 cho tất cả schedules');
          console.log('   2. Cập nhật logic frontend để:');
          console.log('      - Hiển thị className thay vì courseId');
          console.log('      - Sửa logic trạng thái dựa trên ngày hiện tại');

     } catch (error) {
          console.error('❌ Lỗi:', error.message);

          if (error.code === 'auth/user-not-found') {
               console.log('💡 Tài khoản admin chưa tồn tại, cần tạo tài khoản admin trước');
          } else if (error.code === 'auth/wrong-password') {
               console.log('💡 Mật khẩu admin không đúng');
          } else if (error.code === 'auth/invalid-email') {
               console.log('💡 Email admin không hợp lệ');
          }
     }
}

// Run the check
checkFirebaseCollections().then(() => {
     console.log('✅ Hoàn thành kiểm tra');
     process.exit(0);
}).catch(error => {
     console.error('❌ Lỗi:', error);
     process.exit(1);
});

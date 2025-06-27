import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, deleteDoc, addDoc, Timestamp } from 'firebase/firestore';
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

async function cleanAndStandardizeSchedules() {
     console.log('🗑️  SCRIPT XÓA VÀ CHUẨN HÓA COLLECTION SCHEDULES');
     console.log('='.repeat(70));

     try {
          // Sign in as admin
          console.log('🔐 Đăng nhập với tài khoản admin...');
          await signInWithEmailAndPassword(auth, 'admin@giasuhoangha.com', 'admin123');
          console.log('✅ Đăng nhập thành công!');
          console.log('');

          // Step 1: Delete all existing schedules
          console.log('🗑️  BƯỚC 1: XÓA TẤT CẢ SCHEDULES HIỆN TẠI');
          console.log('-'.repeat(50));

          const schedulesRef = collection(db, 'schedules');
          const schedulesSnapshot = await getDocs(schedulesRef);

          console.log(`📊 Tìm thấy ${schedulesSnapshot.size} schedules cần xóa`);

          let deletedCount = 0;
          let deleteErrors = 0;

          for (const scheduleDoc of schedulesSnapshot.docs) {
               try {
                    await deleteDoc(doc(db, 'schedules', scheduleDoc.id));
                    deletedCount++;
                    console.log(`   ✅ Đã xóa schedule: ${scheduleDoc.id}`);
               } catch (error) {
                    deleteErrors++;
                    console.log(`   ❌ Lỗi xóa schedule ${scheduleDoc.id}: ${error.message}`);
               }
          }

          console.log('');
          console.log(`📊 KẾT QUẢ XÓA:`);
          console.log(`   ✅ Đã xóa: ${deletedCount}`);
          console.log(`   ❌ Lỗi: ${deleteErrors}`);
          console.log('');

          // Step 2: Get classes and tutors for sample data
          console.log('📚 BƯỚC 2: TẢI DỮ LIỆU CLASSES VÀ TUTORS');
          console.log('-'.repeat(50));

          const classesRef = collection(db, 'classes');
          const classesSnapshot = await getDocs(classesRef);

          const tutorsRef = collection(db, 'tutors');
          const tutorsSnapshot = await getDocs(tutorsRef);

          const classes = [];
          classesSnapshot.forEach((doc) => {
               const data = doc.data();
               classes.push({
                    id: doc.id,
                    name: data.name || data.title || `Class ${doc.id}`
               });
          });

          const tutors = [];
          tutorsSnapshot.forEach((doc) => {
               const data = doc.data();
               tutors.push({
                    id: doc.id,
                    name: data.name || `Tutor ${doc.id}`
               });
          });

          console.log(`✅ Đã tải ${classes.length} classes`);
          console.log(`✅ Đã tải ${tutors.length} tutors`);
          console.log('');

          // Step 3: Create sample schedules with new structure
          console.log('📅 BƯỚC 3: TẠO SCHEDULES MẪU VỚI CẤU TRÚC MỚI');
          console.log('-'.repeat(50));

          if (classes.length === 0 || tutors.length === 0) {
               console.log('⚠️  Không có classes hoặc tutors để tạo schedules mẫu');
               return;
          }

          // Sample schedules data with new structure
          const sampleSchedules = [
               {
                    classId: classes[0]?.id || '',
                    className: classes[0]?.name || 'Toán 8',
                    startDate: new Date('2025-07-01'), // Ngày khai giảng
                    startTime: '08:00',
                    endTime: '10:00',
                    tutor: tutors[0]?.id || tutors[0]?.name || 'Thầy Nguyễn Văn A',
                    maxStudents: 12,
                    studentPhones: [],
                    status: 'scheduled',
                    createdAt: new Date(),
                    updatedAt: new Date()
               },
               {
                    classId: classes[1]?.id || classes[0]?.id || '',
                    className: classes[1]?.name || classes[0]?.name || 'Toán 7',
                    startDate: new Date('2025-07-03'),
                    startTime: '14:00',
                    endTime: '16:00',
                    tutor: tutors[1]?.id || tutors[1]?.name || 'Cô Trần Thị B',
                    maxStudents: 12,
                    studentPhones: ['0123456789', '0987654321'],
                    status: 'scheduled',
                    createdAt: new Date(),
                    updatedAt: new Date()
               },
               {
                    classId: classes[2]?.id || classes[0]?.id || '',
                    className: classes[2]?.name || classes[0]?.name || 'Toán 9',
                    startDate: new Date('2025-07-05'),
                    startTime: '18:00',
                    endTime: '20:00',
                    tutor: tutors[2]?.id || tutors[2]?.name || 'Thầy Lê Văn C',
                    maxStudents: 12,
                    studentPhones: ['0111222333'],
                    status: 'scheduled',
                    createdAt: new Date(),
                    updatedAt: new Date()
               },
               {
                    classId: classes[3]?.id || classes[0]?.id || '',
                    className: classes[3]?.name || classes[0]?.name || 'Tiền Tiểu học',
                    startDate: new Date('2025-06-28'), // Đã bắt đầu
                    startTime: '09:00',
                    endTime: '11:00',
                    tutor: tutors[3]?.id || tutors[3]?.name || 'Cô Phạm Thị D',
                    maxStudents: 12,
                    studentPhones: ['0444555666', '0777888999', '0111000222'],
                    status: 'ongoing',
                    createdAt: new Date(),
                    updatedAt: new Date()
               },
               {
                    classId: classes[4]?.id || classes[0]?.id || '',
                    className: classes[4]?.name || classes[0]?.name || 'Toán 6',
                    startDate: new Date('2025-05-15'), // Đã hoàn thành
                    startTime: '16:00',
                    endTime: '18:00',
                    tutor: tutors[4]?.id || tutors[4]?.name || 'Thầy Hoàng Văn E',
                    maxStudents: 12,
                    studentPhones: ['0123123123', '0456456456'],
                    status: 'completed',
                    createdAt: new Date(),
                    updatedAt: new Date()
               }
          ];

          let createdCount = 0;
          let createErrors = 0;

          for (const [index, scheduleData] of sampleSchedules.entries()) {
               try {
                    const docRef = await addDoc(collection(db, 'schedules'), scheduleData);
                    createdCount++;
                    console.log(`   ✅ Đã tạo schedule ${index + 1}: ${docRef.id}`);
                    console.log(`      📚 Class: ${scheduleData.className}`);
                    console.log(`      👨‍🏫 Tutor: ${scheduleData.tutor}`);
                    console.log(`      📅 Start Date: ${scheduleData.startDate.toLocaleDateString('vi-VN')}`);
                    console.log(`      ⏰ Time: ${scheduleData.startTime} - ${scheduleData.endTime}`);
                    console.log(`      👥 Students: ${scheduleData.studentPhones.length}/${scheduleData.maxStudents}`);
                    console.log(`      📊 Status: ${scheduleData.status}`);
                    console.log('');
               } catch (error) {
                    createErrors++;
                    console.log(`   ❌ Lỗi tạo schedule ${index + 1}: ${error.message}`);
               }
          }

          console.log('📊 KẾT QUẢ TẠO SCHEDULES MỚI:');
          console.log(`   ✅ Đã tạo: ${createdCount}`);
          console.log(`   ❌ Lỗi: ${createErrors}`);
          console.log('');

          // Step 4: Verify new structure
          console.log('🔍 BƯỚC 4: KIỂM TRA CẤU TRÚC MỚI');
          console.log('-'.repeat(50));

          const newSchedulesSnapshot = await getDocs(collection(db, 'schedules'));
          console.log(`📊 Tổng số schedules mới: ${newSchedulesSnapshot.size}`);
          console.log('');

          if (!newSchedulesSnapshot.empty) {
               console.log('📋 CẤU TRÚC SCHEDULE MỚI:');
               const firstDoc = newSchedulesSnapshot.docs[0];
               const sampleData = firstDoc.data();

               console.log('   📝 Các trường dữ liệu:');
               Object.keys(sampleData).forEach(key => {
                    const value = sampleData[key];
                    let type = typeof value;
                    if (value instanceof Date || (value && value.toDate)) {
                         type = 'Date';
                    } else if (Array.isArray(value)) {
                         type = 'Array';
                    }
                    console.log(`      • ${key}: ${type}`);
               });
          }

          console.log('');
          console.log('🎯 TỔNG KẾT:');
          console.log(`   🗑️  Đã xóa: ${deletedCount} schedules cũ`);
          console.log(`   ✅ Đã tạo: ${createdCount} schedules mới`);
          console.log(`   📋 Cấu trúc: Đã chuẩn hóa theo yêu cầu`);
          console.log('');

          console.log('📝 CẤU TRÚC MỚI SCHEDULE:');
          console.log('   • classId (String) - ID tham chiếu đến collection classes');
          console.log('   • className (String) - Tên lớp học');
          console.log('   • startDate (Date) - Ngày khai giảng lớp học');
          console.log('   • startTime (String) - Giờ bắt đầu (VD: "08:00")');
          console.log('   • endTime (String) - Giờ kết thúc (VD: "10:00")');
          console.log('   • tutor (String/Object ID) - ID hoặc tên giáo viên');
          console.log('   • maxStudents (Number) - Cố định 12');
          console.log('   • studentPhones (Array) - Danh sách SĐT học viên');
          console.log('   • status (String) - Trạng thái lớp học');
          console.log('   • createdAt (Date) - Ngày tạo');
          console.log('   • updatedAt (Date) - Ngày cập nhật');

     } catch (error) {
          console.error('❌ Lỗi:', error.message);
     }
}

// Run the cleanup and standardization
cleanAndStandardizeSchedules().then(() => {
     console.log('✅ Hoàn thành chuẩn hóa schedules collection');
     process.exit(0);
}).catch(error => {
     console.error('❌ Lỗi:', error);
     process.exit(1);
});

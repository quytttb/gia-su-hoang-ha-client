import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteField } from 'firebase/firestore';

// Firebase config - thay thế bằng config thực tế của bạn
const firebaseConfig = {
     // Thêm config Firebase của bạn ở đây
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateSchedulesToStudentPhones() {
     console.log('Bắt đầu migration schedules...');

     try {
          const schedulesRef = collection(db, 'schedules');
          const snapshot = await getDocs(schedulesRef);

          console.log(`Tìm thấy ${snapshot.docs.length} lịch học cần migration`);

          for (const docSnapshot of snapshot.docs) {
               const data = docSnapshot.data();
               const docRef = doc(db, 'schedules', docSnapshot.id);

               // Kiểm tra nếu có studentIds
               if (data.studentIds && Array.isArray(data.studentIds)) {
                    console.log(`Migrating schedule ${docSnapshot.id}...`);

                    // Chuyển đổi studentIds thành studentPhones
                    // Giả sử: student-1 -> phone1, student-2 -> phone2, etc.
                    // Bạn có thể thay đổi logic mapping này theo dữ liệu thực tế
                    const studentPhones = data.studentIds.map((studentId: string) => {
                         // Logic chuyển đổi từ studentId sang phone
                         // Ví dụ: nếu có bảng mapping hoặc pattern cố định
                         return studentId.replace('student-', '09876543') + Math.floor(Math.random() * 10);
                    });

                    // Cập nhật document
                    await updateDoc(docRef, {
                         studentPhones: studentPhones,
                         maxStudents: data.maxStudents || 10, // Đặt mặc định nếu chưa có
                         studentIds: deleteField() // Xóa trường cũ
                    });

                    console.log(`✅ Migrated schedule ${docSnapshot.id}: ${data.studentIds.length} students`);
               } else {
                    // Nếu chưa có studentIds, chỉ thêm studentPhones rỗng và maxStudents
                    await updateDoc(docRef, {
                         studentPhones: [],
                         maxStudents: data.maxStudents || 10
                    });

                    console.log(`✅ Updated schedule ${docSnapshot.id}: added empty studentPhones`);
               }
          }

          console.log('🎉 Migration hoàn thành!');

     } catch (error) {
          console.error('❌ Lỗi khi migration:', error);
     }
}

// Chạy migration
migrateSchedulesToStudentPhones(); 
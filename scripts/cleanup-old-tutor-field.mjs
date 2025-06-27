import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch, deleteField } from 'firebase/firestore';
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

async function cleanupOldTutorField() {
     console.log('🧹 SCRIPT XÓA FIELD "TUTOR" CŨ');
     console.log('='.repeat(50));

     try {
          // Sign in as admin
          console.log('🔐 Đăng nhập với tài khoản admin...');
          await signInWithEmailAndPassword(auth, 'admin@giasuhoangha.com', 'admin123');
          console.log('✅ Đăng nhập thành công!');
          console.log('');

          // Get all schedules
          console.log('📅 Tải danh sách schedules...');
          const schedulesSnapshot = await getDocs(collection(db, 'schedules'));
          console.log(`📊 Tìm thấy ${schedulesSnapshot.size} schedules`);
          console.log('');

          // Create batch to delete old tutor field
          const batch = writeBatch(db);
          let deleteCount = 0;

          schedulesSnapshot.forEach(doc => {
               const data = doc.data();

               if (data.tutor !== undefined) {
                    console.log(`🗑️  Xóa field "tutor" từ schedule ${doc.id}`);
                    batch.update(doc.ref, {
                         tutor: deleteField()
                    });
                    deleteCount++;
               }
          });

          if (deleteCount > 0) {
               console.log('');
               console.log('💾 Đang lưu cập nhật...');
               await batch.commit();
               console.log(`✅ Đã xóa field "tutor" từ ${deleteCount} schedules`);
          } else {
               console.log('✅ Không có field "tutor" nào cần xóa');
          }

          console.log('');
          console.log('🎯 HOÀN THÀNH:');
          console.log('   • Tất cả field "tutor" cũ đã được xóa');
          console.log('   • Schedules hiện chỉ sử dụng tutorId + tutorName');
          console.log('   • Dữ liệu đã được chuẩn hóa hoàn toàn');

     } catch (error) {
          console.error('❌ Lỗi:', error.message);
     }
}

// Run cleanup
cleanupOldTutorField().then(() => {
     console.log('✅ Hoàn thành cleanup field tutor cũ');
     process.exit(0);
}).catch(error => {
     console.error('❌ Lỗi:', error);
     process.exit(1);
});

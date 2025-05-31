const { initializeApp } = require('firebase/app');
const {
     getFirestore,
     collection,
     addDoc,
     getDocs,
     deleteDoc,
     serverTimestamp
} = require('firebase/firestore');

// Firebase config - copy from your env or config
const firebaseConfig = {
     apiKey: "AIzaSyDINyJJ1-lPfgFPTvZAhBCB6JL1bOLPPVY",
     authDomain: "gia-su-hoang-ha.firebaseapp.com",
     projectId: "gia-su-hoang-ha",
     storageBucket: "gia-su-hoang-ha.firebasestorage.app",
     messagingSenderId: "1068031506808",
     appId: "1:1068031506808:web:df1ef4f1d73e07b3a3d583",
     measurementId: "G-ZBQR1GYSJ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample courses data with correct structure
const courses = [
     {
          title: "Toán học lớp 10",
          description: "Khóa học toán học cơ bản dành cho học sinh lớp 10, bao gồm đại số và hình học.",
          price: 1500000,
          duration: "3 tháng",
          level: "Cơ bản",
          subjects: ["Toán học", "Đại số", "Hình học"],
          features: ["Bài tập về nhà", "Kiểm tra định kỳ", "Tư vấn cá nhân"],
          image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          isActive: true,
          instructor: "Thầy Nguyễn Văn A",
          maxStudents: 20,
          currentStudents: 12,
          schedule: [
               { dayOfWeek: 2, time: "19:00-21:00" },
               { dayOfWeek: 4, time: "19:00-21:00" }
          ]
     },
     {
          title: "Vật lý lớp 11",
          description: "Khóa học vật lý nâng cao cho học sinh lớp 11, tập trung vào cơ học và điện học.",
          price: 1800000,
          duration: "4 tháng",
          level: "Nâng cao",
          subjects: ["Vật lý", "Cơ học", "Điện học"],
          features: ["Thí nghiệm thực hành", "Giải bài tập khó", "Ôn thi học kỳ"],
          image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          isActive: true,
          instructor: "Cô Trần Thị B",
          maxStudents: 15,
          currentStudents: 8,
          schedule: [
               { dayOfWeek: 1, time: "18:30-20:30" },
               { dayOfWeek: 3, time: "18:30-20:30" }
          ]
     },
     {
          title: "Hóa học lớp 12",
          description: "Khóa học hóa học chuyên sâu cho học sinh lớp 12, chuẩn bị cho kỳ thi THPT.",
          price: 2500000,
          duration: "6 tháng",
          level: "Chuyên sâu",
          subjects: ["Hóa học", "Hóa vô cơ", "Hóa hữu cơ"],
          features: ["Luyện đề thi THPT", "Phương pháp giải nhanh", "Thí nghiệm minh họa"],
          image: "https://images.unsplash.com/photo-1532634218-8b3dceb3b0fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          isActive: true,
          instructor: "Thầy Lê Văn C",
          maxStudents: 25,
          currentStudents: 18,
          schedule: [
               { dayOfWeek: 0, time: "08:00-10:00" },
               { dayOfWeek: 6, time: "14:00-16:00" }
          ]
     },
     {
          title: "Tiếng Anh giao tiếp",
          description: "Khóa học tiếng Anh giao tiếp cơ bản cho mọi lứa tuổi.",
          price: 1200000,
          duration: "2 tháng",
          level: "Cơ bản",
          subjects: ["Tiếng Anh", "Giao tiếp", "Phát âm"],
          features: ["Luyện phát âm", "Thực hành hội thoại", "Từ vựng thực tế"],
          image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          isActive: true,
          instructor: "Cô Phạm Thị D",
          maxStudents: 12,
          currentStudents: 7,
          schedule: [
               { dayOfWeek: 2, time: "17:00-19:00" },
               { dayOfWeek: 5, time: "17:00-19:00" }
          ]
     }
];

async function createCourses() {
     try {
          console.log('🚀 Bắt đầu tạo courses...');

          // Clear existing courses first
          console.log('🗑️ Xóa courses cũ...');
          const existingCoursesSnapshot = await getDocs(collection(db, 'courses'));
          const deletePromises = existingCoursesSnapshot.docs.map(doc => deleteDoc(doc.ref));
          await Promise.all(deletePromises);
          console.log(`✅ Đã xóa ${existingCoursesSnapshot.size} courses cũ`);

          // Create new courses
          for (const course of courses) {
               try {
                    const docRef = await addDoc(collection(db, 'courses'), {
                         ...course,
                         createdAt: serverTimestamp(),
                         updatedAt: serverTimestamp()
                    });
                    console.log(`✅ Đã tạo course: ${course.title} (ID: ${docRef.id})`);
               } catch (error) {
                    console.error(`❌ Lỗi tạo course ${course.title}:`, error.message);
               }
          }

          console.log('🎉 Hoàn thành tạo courses!');
          process.exit(0);

     } catch (error) {
          console.error('❌ Lỗi:', error.message);
          process.exit(1);
     }
}

createCourses(); 
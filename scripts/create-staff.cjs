#!/usr/bin/env node

/**
 * Script tạo tài khoản Staff
 * 
 * Cách sử dụng:
 * node scripts/create-staff.js email@example.com "Tên Nhân Viên" password123
 */

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');

// Load environment variables
require('dotenv').config();

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
const auth = getAuth(app);
const db = getFirestore(app);

async function createStaffUser(email, name, password) {
     try {
          console.log(`🔄 Đang tạo tài khoản staff: ${email}`);

          // Tạo Firebase Authentication user
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;

          // Cập nhật profile
          await updateProfile(firebaseUser, {
               displayName: name,
          });

          // Tạo document trong Firestore
          await setDoc(doc(db, 'users', firebaseUser.uid), {
               uid: firebaseUser.uid,
               email: firebaseUser.email,
               name: name,
               role: 'staff',
               createdAt: serverTimestamp(),
               lastLogin: serverTimestamp(),
               isActive: true,
          });

          console.log('✅ Tài khoản staff đã được tạo thành công!');
          console.log(`📧 Email: ${email}`);
          console.log(`👤 Tên: ${name}`);
          console.log(`🔑 Mật khẩu: ${password}`);
          console.log(`🆔 UID: ${firebaseUser.uid}`);
          console.log(`👥 Vai trò: staff`);

          return firebaseUser;
     } catch (error) {
          if (error.code === 'auth/email-already-in-use') {
               console.error('❌ Email này đã được sử dụng!');
          } else {
               console.error('❌ Lỗi tạo tài khoản:', error.message);
          }
          throw error;
     }
}

// Main function
async function main() {
     const args = process.argv.slice(2);

     if (args.length < 3) {
          console.log('📋 Cách sử dụng:');
          console.log('node scripts/create-staff.js <email> <name> <password>');
          console.log('');
          console.log('📋 Ví dụ:');
          console.log('node scripts/create-staff.js staff@giasuhoangha.com "Nguyễn Văn A" staff123');
          process.exit(1);
     }

     const [email, name, password] = args;

     // Validate input
     if (!email.includes('@')) {
          console.error('❌ Email không hợp lệ!');
          process.exit(1);
     }

     if (password.length < 6) {
          console.error('❌ Mật khẩu phải có ít nhất 6 ký tự!');
          process.exit(1);
     }

     try {
          await createStaffUser(email, name, password);
          process.exit(0);
     } catch (error) {
          process.exit(1);
     }
}

// Chạy script
if (require.main === module) {
     main();
}

module.exports = { createStaffUser }; 
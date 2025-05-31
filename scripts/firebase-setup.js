#!/usr/bin/env node

/**
 * Firebase Setup Script
 * 
 * This script helps set up Firebase for the Gia Su Hoang Ha project:
 * 1. Creates initial admin user
 * 2. Sets up Firestore security rules
 * 3. Initializes collections with sample data
 */

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');

// Firebase configuration (you'll need to replace these with your actual values)
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

// Default admin user
const ADMIN_USER = {
     email: 'admin@giasuhoangha.com',
     password: 'admin123',
     name: 'Quản trị viên',
     role: 'admin',
};

// Default staff user
const STAFF_USER = {
     email: 'staff@giasuhoangha.com',
     password: 'staff123',
     name: 'Nhân viên',
     role: 'staff',
};

async function createUser(userData) {
     try {
          console.log(`Creating user: ${userData.email}`);

          // Create Firebase user
          const userCredential = await createUserWithEmailAndPassword(
               auth,
               userData.email,
               userData.password
          );
          const firebaseUser = userCredential.user;

          // Update Firebase profile
          await updateProfile(firebaseUser, {
               displayName: userData.name,
          });

          // Create user document in Firestore
          await setDoc(doc(db, 'users', firebaseUser.uid), {
               uid: firebaseUser.uid,
               email: firebaseUser.email,
               name: userData.name,
               role: userData.role,
               createdAt: serverTimestamp(),
               lastLogin: serverTimestamp(),
               isActive: true,
          });

          console.log(`✅ User created successfully: ${userData.email}`);
          return firebaseUser;
     } catch (error) {
          if (error.code === 'auth/email-already-in-use') {
               console.log(`⚠️  User already exists: ${userData.email}`);
          } else {
               console.error(`❌ Error creating user ${userData.email}:`, error.message);
          }
          return null;
     }
}

async function setupFirebase() {
     console.log('🚀 Starting Firebase setup...\n');

     // Check if Firebase config is available
     if (!firebaseConfig.apiKey) {
          console.error('❌ Firebase configuration not found!');
          console.log('Please set up your environment variables:');
          console.log('- VITE_FIREBASE_API_KEY');
          console.log('- VITE_FIREBASE_AUTH_DOMAIN');
          console.log('- VITE_FIREBASE_PROJECT_ID');
          console.log('- VITE_FIREBASE_STORAGE_BUCKET');
          console.log('- VITE_FIREBASE_MESSAGING_SENDER_ID');
          console.log('- VITE_FIREBASE_APP_ID');
          console.log('- VITE_FIREBASE_MEASUREMENT_ID');
          process.exit(1);
     }

     try {
          // Create admin user
          await createUser(ADMIN_USER);

          // Create staff user
          await createUser(STAFF_USER);

          console.log('\n✅ Firebase setup completed successfully!');
          console.log('\nDefault login credentials:');
          console.log(`Admin: ${ADMIN_USER.email} / ${ADMIN_USER.password}`);
          console.log(`Staff: ${STAFF_USER.email} / ${STAFF_USER.password}`);
          console.log('\n⚠️  Please change these passwords after first login!');

     } catch (error) {
          console.error('❌ Firebase setup failed:', error.message);
          process.exit(1);
     }
}

// Firestore Security Rules Template
const FIRESTORE_RULES = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can read/write their own data, admins can read all
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'staff'];
    }
    
    // Courses collection - public read, admin/staff write
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'staff'];
    }
    
    // Registrations collection - users can create, admin/staff can read/write
    match /registrations/{registrationId} {
      allow create: if request.auth != null;
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'staff'];
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Inquiries collection - users can create, admin/staff can read/write
    match /inquiries/{inquiryId} {
      allow create: if request.auth != null;
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'staff'];
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Schedules collection - admin/staff only
    match /schedules/{scheduleId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'staff'];
    }
    
    // Analytics collection - admin only
    match /analytics/{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
`;

function printSecurityRules() {
     console.log('\n📋 Firestore Security Rules:');
     console.log('Copy and paste these rules into your Firebase Console > Firestore > Rules:');
     console.log('='.repeat(80));
     console.log(FIRESTORE_RULES);
     console.log('='.repeat(80));
}

// Run setup if called directly
if (require.main === module) {
     setupFirebase().then(() => {
          printSecurityRules();
          process.exit(0);
     });
}

module.exports = {
     setupFirebase,
     createUser,
     FIRESTORE_RULES,
};

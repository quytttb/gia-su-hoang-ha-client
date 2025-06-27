// Test Firestore connection and create contacts collection
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Firebase config từ .env
const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: import.meta.env.VITE_FIREBASE_APP_ID,
     measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

console.log('🔧 Firebase Config:');
console.log('- Project ID:', firebaseConfig.projectId);
console.log('- Auth Domain:', firebaseConfig.authDomain);
console.log('- API Key:', firebaseConfig.apiKey?.substring(0, 10) + '...');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const testData = {
     name: 'Test Contact',
     email: 'test@example.com',
     phone: '0123456789',
     message: 'This is a test message to create contacts collection',
     status: 'new',
     createdAt: serverTimestamp(),
     updatedAt: serverTimestamp(),
     userAgent: 'Test Script',
};

export const testFirestoreConnection = async () => {
     try {
          console.log('🚀 Testing Firestore connection...');

          const docRef = await addDoc(collection(db, 'contacts'), testData);
          console.log('✅ Success! Document ID:', docRef.id);

          return { success: true, id: docRef.id };
     } catch (error) {
          console.error('❌ Failed:', error);
          return { success: false, error };
     }
};

// Expose globally for browser console testing
(window as any).testFirestore = testFirestoreConnection;

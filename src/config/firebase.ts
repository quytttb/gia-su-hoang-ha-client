import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { Installations } from 'firebase/installations';

// Kiểm tra xem có đang trong môi trường phát triển không
const isDevelopment = import.meta.env.DEV === true;

// Firebase configuration
const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'dummy-key',
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'dummy-domain.firebaseapp.com',
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'dummy-project',
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'dummy-bucket.appspot.com',
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
     appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef123456',
     measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-ABCDEFGHIJ',
};

// Initialize Firebase (conditionally)
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;
let installations: Installations | null = null;

try {
     // Khởi tạo app
     app = initializeApp(firebaseConfig);

     // Khởi tạo Auth
     auth = getAuth(app);

     // Khởi tạo Firestore
     db = getFirestore(app);

     // Khởi tạo Analytics chỉ khi không ở môi trường phát triển
     if (!isDevelopment && typeof window !== 'undefined') {
          try {
               analytics = getAnalytics(app);
               console.log('Firebase Analytics initialized');
          } catch {
               // Analytics may not be available in some environments (e.g., localhost)
               console.warn('Firebase Analytics not available');
          }
     } else {
          console.log('Firebase Analytics initialized (data collection disabled)');
          analytics = null;
     }

     // Không sử dụng Installations vì gây lỗi 403
     installations = null;
     console.log('Firebase Installations skipped (to avoid 403 errors)');

     console.log('Firebase initialized successfully');
} catch (error) {
     console.error('Firebase initialization error:', error);
     // Create dummy objects to prevent app crashes
     app = null;
     auth = null;
     db = null;
     analytics = null;
     installations = null;
}

// Export the services
export { auth, db, analytics, installations };

export default app; 
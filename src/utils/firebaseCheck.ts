import { auth, db, analytics, installations } from '../config/firebase';

export interface FirebaseStatus {
     auth: boolean;
     firestore: boolean;
     analytics: boolean;
     installations: boolean;
     configured: boolean;
     errors: string[];
}

export const checkFirebaseConfig = (): FirebaseStatus => {
     const errors: string[] = [];

     // Check environment variables
     const requiredEnvVars = [
          'VITE_FIREBASE_API_KEY',
          'VITE_FIREBASE_AUTH_DOMAIN',
          'VITE_FIREBASE_PROJECT_ID',
          'VITE_FIREBASE_MESSAGING_SENDER_ID',
          'VITE_FIREBASE_APP_ID'
     ];

     const missingEnvVars = requiredEnvVars.filter(
          envVar => !import.meta.env[envVar]
     );

     if (missingEnvVars.length > 0) {
          errors.push(`Missing environment variables: ${missingEnvVars.join(', ')}`);
     }

     // Check Firebase services - sử dụng null check để tránh lỗi linter
     const authAvailable = auth !== null;
     const firestoreAvailable = db !== null;
     const analyticsAvailable = analytics !== null;
     const installationsAvailable = installations !== null;

     if (!authAvailable) {
          errors.push('Firebase Auth is not initialized');
     }

     if (!firestoreAvailable) {
          errors.push('Firebase Firestore is not initialized');
     }

     // Analytics và Installations không được coi là bắt buộc
     // nhưng vẫn ghi lại trạng thái của chúng

     const configured = authAvailable && firestoreAvailable;

     return {
          auth: authAvailable,
          firestore: firestoreAvailable,
          analytics: analyticsAvailable,
          installations: installationsAvailable,
          configured,
          errors
     };
};

export const logFirebaseStatus = () => {
     const status = checkFirebaseConfig();

     if (status.configured) {
          console.log('✅ Firebase is properly configured (Auth + Firestore)');
          console.log('📁 Storage: Using Cloudinary instead of Firebase Storage');

          // Log analytics status
          if (!status.analytics) {
               console.log('ℹ️ Firebase Analytics is disabled (not critical)');
          }

          // Log installations status
          if (!status.installations) {
               console.log('ℹ️ Firebase Installations is disabled (not critical)');
          }
     } else {
          console.warn('⚠️ Firebase configuration issues:');
          status.errors.forEach(error => console.warn(`  - ${error}`));
     }

     return status;
};

// Auto-check on import in development
if (import.meta.env.DEV) {
     logFirebaseStatus();
}

// Hàm kiểm tra trạng thái kết nối Firebase
export function checkFirebaseConnection() {
     // ... existing code ...
}

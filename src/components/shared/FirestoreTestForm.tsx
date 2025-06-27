import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useToastContext } from '../../contexts/ToastContext';

const FirestoreTestForm: React.FC = () => {
     const [loading, setLoading] = useState(false);
     const toast = useToastContext();

     const testDirectFirestore = async () => {
          setLoading(true);

          try {
               console.log('🔥 Testing direct Firestore connection...');
               console.log('📊 Database instance:', db);

               if (!db) {
                    throw new Error('Database not initialized');
               }

               const testData = {
                    name: 'Test User',
                    email: 'test@example.com',
                    phone: '0123456789',
                    message: 'This is a test message',
                    status: 'new',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    userAgent: navigator.userAgent,
               };

               console.log('📝 Attempting to add document to contacts collection...');
               console.log('📋 Data to add:', testData);

               const docRef = await addDoc(collection(db, 'contacts'), testData);

               console.log('✅ Document added successfully with ID:', docRef.id);
               toast.success('Thành công!', `Đã tạo document với ID: ${docRef.id}`);

          } catch (error) {
               console.error('💥 Firestore error:', error);
               console.error('Error code:', (error as any).code);
               console.error('Error message:', (error as any).message);

               toast.error('Lỗi Firestore!', `${(error as any).code}: ${(error as any).message}`);
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="fixed bottom-20 right-4 bg-red-100 dark:bg-red-900 p-4 rounded-lg shadow-lg border z-50">
               <h3 className="text-sm font-medium mb-2 text-red-800 dark:text-red-200">Debug Firestore</h3>
               <button
                    onClick={testDirectFirestore}
                    disabled={loading}
                    className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50"
               >
                    {loading ? 'Testing...' : 'Test Firestore Direct'}
               </button>
          </div>
     );
};

export default FirestoreTestForm;

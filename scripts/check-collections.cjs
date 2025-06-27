const admin = require('firebase-admin');
const fs = require('fs');
require('dotenv').config();

// Initialize Firebase Admin
const serviceAccount = {
     type: "service_account",
     project_id: process.env.VITE_FIREBASE_PROJECT_ID,
     private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
     private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
     client_email: process.env.FIREBASE_CLIENT_EMAIL,
     client_id: process.env.FIREBASE_CLIENT_ID,
     auth_uri: "https://accounts.google.com/o/oauth2/auth",
     token_uri: "https://oauth2.googleapis.com/token",
     auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
     client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
};

admin.initializeApp({
     credential: admin.credential.cert(serviceAccount),
     projectId: process.env.VITE_FIREBASE_PROJECT_ID
});

const db = admin.firestore();

async function checkCollections() {
     console.log('🔍 BÁOÁO KIỂM TRA FIREBASE COLLECTIONS');
     console.log('='.repeat(60));

     try {
          // Get all collections
          const collections = await db.listCollections();
          console.log(`📊 Tổng số collections: ${collections.length}`);
          console.log('');

          for (const collection of collections) {
               const collectionName = collection.id;
               console.log(`📁 Collection: ${collectionName}`);
               console.log('-'.repeat(40));

               try {
                    const snapshot = await collection.limit(5).get();
                    console.log(`   📈 Tổng số documents: ${snapshot.size}`);

                    if (!snapshot.empty) {
                         console.log('   📄 Sample documents:');
                         snapshot.forEach((doc, index) => {
                              const data = doc.data();
                              console.log(`      ${index + 1}. ID: ${doc.id}`);

                              // Show key fields
                              const keys = Object.keys(data).slice(0, 5);
                              keys.forEach(key => {
                                   let value = data[key];
                                   if (typeof value === 'object' && value !== null) {
                                        if (value.toDate && typeof value.toDate === 'function') {
                                             value = value.toDate().toISOString();
                                        } else {
                                             value = JSON.stringify(value).substring(0, 50) + '...';
                                        }
                                   }
                                   console.log(`         ${key}: ${value}`);
                              });
                              console.log('');
                         });
                    } else {
                         console.log('   ⚠️  Collection trống');
                    }
               } catch (error) {
                    console.log(`   ❌ Lỗi khi đọc collection: ${error.message}`);
               }

               console.log('');
          }

          // Specific check for schedules collection
          console.log('🎯 KIỂM TRA CHI TIẾT COLLECTION "schedules"');
          console.log('='.repeat(60));

          const schedulesRef = db.collection('schedules');
          const schedulesSnapshot = await schedulesRef.get();

          if (!schedulesSnapshot.empty) {
               console.log(`📊 Tổng số schedules: ${schedulesSnapshot.size}`);
               console.log('');

               schedulesSnapshot.forEach((doc, index) => {
                    const data = doc.data();
                    console.log(`📅 Schedule ${index + 1}:`);
                    console.log(`   ID: ${doc.id}`);
                    console.log(`   courseId: ${data.courseId || 'N/A'}`);
                    console.log(`   tutorId: ${data.tutorId || 'N/A'}`);
                    console.log(`   date: ${data.date || 'N/A'}`);
                    console.log(`   startTime: ${data.startTime || 'N/A'}`);
                    console.log(`   endTime: ${data.endTime || 'N/A'}`);
                    console.log(`   maxStudents: ${data.maxStudents || 'N/A'}`);
                    console.log(`   status: ${data.status || 'N/A'}`);
                    console.log(`   tutor: ${data.tutor || 'N/A'}`);
                    console.log(`   room: ${data.room || 'N/A'} ${data.room ? '⚠️ (CẦN XÓA)' : '✅'}`);
                    console.log(`   studentPhones: ${JSON.stringify(data.studentPhones || [])}`);
                    console.log('');
               });
          } else {
               console.log('⚠️ Collection "schedules" trống hoặc không tồn tại');
          }

          // Check classes collection for mapping
          console.log('🎯 KIỂM TRA CHI TIẾT COLLECTION "classes"');
          console.log('='.repeat(60));

          const classesRef = db.collection('classes');
          const classesSnapshot = await classesRef.limit(10).get();

          if (!classesSnapshot.empty) {
               console.log(`📊 Sample classes (10 đầu tiên):`);
               console.log('');

               classesSnapshot.forEach((doc, index) => {
                    const data = doc.data();
                    console.log(`📚 Class ${index + 1}:`);
                    console.log(`   ID: ${doc.id}`);
                    console.log(`   title/name: ${data.title || data.name || 'N/A'}`);
                    console.log(`   description: ${(data.description || '').substring(0, 100)}${data.description?.length > 100 ? '...' : ''}`);
                    console.log('');
               });
          } else {
               console.log('⚠️ Collection "classes" trống hoặc không tồn tại');
          }

          // Check tutors collection
          console.log('🎯 KIỂM TRA CHI TIẾT COLLECTION "tutors"');
          console.log('='.repeat(60));

          const tutorsRef = db.collection('tutors');
          const tutorsSnapshot = await tutorsRef.limit(10).get();

          if (!tutorsSnapshot.empty) {
               console.log(`📊 Sample tutors (10 đầu tiên):`);
               console.log('');

               tutorsSnapshot.forEach((doc, index) => {
                    const data = doc.data();
                    console.log(`👨‍🏫 Tutor ${index + 1}:`);
                    console.log(`   ID: ${doc.id}`);
                    console.log(`   name: ${data.name || 'N/A'}`);
                    console.log(`   phone: ${data.phone || 'N/A'}`);
                    console.log(`   email: ${data.email || 'N/A'}`);
                    console.log('');
               });
          } else {
               console.log('⚠️ Collection "tutors" trống hoặc không tồn tại');
          }

     } catch (error) {
          console.error('❌ Lỗi khi kiểm tra collections:', error);
     }
}

checkCollections().then(() => {
     console.log('✅ Hoàn thành kiểm tra');
     process.exit(0);
}).catch(error => {
     console.error('❌ Lỗi:', error);
     process.exit(1);
});

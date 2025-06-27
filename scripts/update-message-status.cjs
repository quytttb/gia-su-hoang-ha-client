const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
     admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          projectId: 'gia-su-hoang-ha'
     });
}

const db = admin.firestore();

async function updateMessageStatus() {
     try {
          console.log('🔄 Updating message status...');

          // Get all contacts
          const contactsRef = db.collection('contacts');
          const snapshot = await contactsRef.get();

          console.log(`📊 Found ${snapshot.docs.length} messages`);

          const batch = db.batch();
          let updatedCount = 0;

          snapshot.docs.forEach(doc => {
               const data = doc.data();
               console.log(`Message ${doc.id}: status = ${data.status || 'undefined'}`);

               // If status is undefined or empty, set to 'new'
               if (!data.status) {
                    batch.update(doc.ref, {
                         status: 'new',
                         updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    });
                    updatedCount++;
                    console.log(`  → Setting status to 'new' for message ${doc.id}`);
               }
          });

          if (updatedCount > 0) {
               await batch.commit();
               console.log(`✅ Updated ${updatedCount} messages`);
          } else {
               console.log('✅ All messages already have status');
          }

     } catch (error) {
          console.error('❌ Error updating message status:', error);
     }
}

updateMessageStatus();

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch, doc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
     apiKey: "AIzaSyDeVw_cKKG9I7xr0oRLh8jGDRe4cWa7bIk",
     authDomain: "gia-su-hoang-ha.firebaseapp.com",
     projectId: "gia-su-hoang-ha",
     storageBucket: "gia-su-hoang-ha.appspot.com",
     messagingSenderId: "634060395765",
     appId: "1:634060395765:web:55e4a8a8b8b8f8b8f8b8b8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function updateMessageStatus() {
     try {
          console.log('🔄 Updating message status...');

          // Get all contacts
          const contactsRef = collection(db, 'contacts');
          const snapshot = await getDocs(contactsRef);

          console.log(`📊 Found ${snapshot.docs.length} messages`);

          const batch = writeBatch(db);
          let updatedCount = 0;

          snapshot.docs.forEach(docSnapshot => {
               const data = docSnapshot.data();
               console.log(`Message ${docSnapshot.id}: status = ${data.status || 'undefined'}`);

               // If status is undefined or empty, set to 'new'
               if (!data.status) {
                    batch.update(doc(db, 'contacts', docSnapshot.id), {
                         status: 'new',
                         updatedAt: serverTimestamp()
                    });
                    updatedCount++;
                    console.log(`  → Setting status to 'new' for message ${docSnapshot.id}`);
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

#!/usr/bin/env node
/**
 * Backfill missing or empty `slug` fields for documents in the `blogPosts` collection.
 * - Generates slugs from `title` using `slugify`
 * - Ensures uniqueness by appending -2, -3, ... when necessary
 * - Optionally can set `publishedAt` if status is 'published' and missing (disabled by default)
 */
import dotenv from 'dotenv';
import slugifyLib from 'slugify';
import { initializeApp } from 'firebase/app';
import {
     getFirestore,
     collection,
     getDocs,
     query,
     where,
     limit,
     updateDoc,
     doc,
} from 'firebase/firestore';

dotenv.config();

const firebaseConfig = {
     apiKey: process.env.VITE_FIREBASE_API_KEY,
     authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: process.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: process.env.VITE_FIREBASE_APP_ID,
     measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

function assertEnv() {
     const missing = Object.entries(firebaseConfig)
          .filter(([, v]) => !v)
          .map(([k]) => k);
     if (missing.length) {
          console.error('❌ Missing Firebase env vars:', missing.join(', '));
          process.exit(1);
     }
}

function slugify(title) {
     return slugifyLib(title, { lower: true, strict: true, locale: 'vi' });
}

async function ensureUniqueSlug(db, base) {
     let candidate = base;
     let idx = 1;
     while (true) {
          const qSnap = await getDocs(
               query(collection(db, 'blogPosts'), where('slug', '==', candidate), limit(1))
          );
          if (qSnap.empty) return candidate;
          idx += 1;
          candidate = `${base}-${idx}`;
     }
}

async function run() {
     assertEnv();
     const app = initializeApp(firebaseConfig);
     const db = getFirestore(app);

     console.log('🔎 Scanning blogPosts for missing slugs...');
     const snap = await getDocs(collection(db, 'blogPosts'));
     if (snap.empty) {
          console.log('No documents found. Exiting.');
          return;
     }

     let updated = 0;
     let skipped = 0;
     for (const d of snap.docs) {
          const data = d.data();
          const hasSlug = typeof data.slug === 'string' && data.slug.trim().length > 0;
          const hasTitle = typeof data.title === 'string' && data.title.trim().length > 0;
          if (hasSlug) {
               skipped++;
               continue;
          }
          if (!hasTitle) {
               console.warn(`⚠️ Skip ${d.id}: missing title, cannot derive slug.`);
               skipped++;
               continue;
          }
          const base = slugify(data.title.trim());
          const unique = await ensureUniqueSlug(db, base);
          await updateDoc(doc(db, 'blogPosts', d.id), { slug: unique });
          console.log(`✅ Updated ${d.id} -> slug: ${unique}`);
          updated++;
     }

     console.log(`\nDone. Updated ${updated}, skipped ${skipped}.`);
}

run().catch(e => {
     console.error('❌ Backfill error:', e);
     process.exit(1);
});



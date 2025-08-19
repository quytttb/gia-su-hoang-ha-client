#!/usr/bin/env node
/**
 * Migration: push static blogPosts from constants/blogData.ts into Firestore blogPosts collection.
 * Content in constants is HTML; we store it both as markdown (same HTML) & html for now.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import admin from 'firebase-admin';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env
dotenv.config();

// Dynamic import of TS constants via transpiled build path is not trivial at runtime; replicate minimal data reading by relative require using ts-node? For simplicity we re-import compiled JS if available.
// Instead, we do a dynamic import of the source with vite-style alias risk; fallback to manual copy if fails.

const firebaseConfig = {
     apiKey: process.env.VITE_FIREBASE_API_KEY,
     authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: process.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: process.env.VITE_FIREBASE_APP_ID,
     measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

if (!firebaseConfig.apiKey) {
     console.error('❌ Missing Firebase env vars');
     process.exit(1);
}

// Try firebase-admin first for elevated privileges
let useAdmin = false;
let db;
try {
     let serviceAccount = null;
     // 1. Prefer explicit env vars
     if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
          serviceAccount = {
               type: 'service_account',
               project_id: process.env.VITE_FIREBASE_PROJECT_ID,
               private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
               private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
               client_email: process.env.FIREBASE_CLIENT_EMAIL,
               client_id: process.env.FIREBASE_CLIENT_ID,
               auth_uri: 'https://accounts.google.com/o/oauth2/auth',
               token_uri: 'https://oauth2.googleapis.com/token',
               auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
               client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
          };
     } else if (process.env.FIREBASE_SERVICE_ACCOUNT_FILE || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
          // 2. Fallback to JSON file path
          const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_FILE || process.env.GOOGLE_APPLICATION_CREDENTIALS;
          if (filePath && fs.existsSync(filePath)) {
               const raw = fs.readFileSync(filePath, 'utf8');
               serviceAccount = JSON.parse(raw);
          } else {
               console.warn('⚠️ Service account file path provided but file not found:', filePath);
          }
     }
     if (serviceAccount?.private_key && serviceAccount?.client_email) {
          admin.initializeApp({ credential: admin.credential.cert(serviceAccount), projectId: serviceAccount.project_id });
          db = admin.firestore();
          useAdmin = true;
          console.log('✅ Using firebase-admin for migration');
     }
} catch (e) {
     console.warn('⚠️ firebase-admin init failed, fallback decision pending:', e.message);
}

if (!db) {
     // Final fallback to client SDK (may fail with security rules)
     const app = initializeApp(firebaseConfig);
     db = getFirestore(app);
     console.log('ℹ️ Using client Firestore (ensure rules allow writes for this operation).');
}

// We will use a dynamic import of the TypeScript source via ES module loader
async function loadStaticPosts() {
     const __filename = fileURLToPath(import.meta.url);
     const __dirname = path.dirname(__filename);
     const tsPath = path.resolve(__dirname, '../src/constants/blogData.ts');
     try {
          // Attempt native import (will fail due to .ts extension normally under plain node)
          const mod = await import(tsPath);
          if (mod.blogPosts?.length) return mod.blogPosts;
     } catch (e) {
          console.warn('⚠️ Native import failed, will attempt manual parse:', e.message);
     }

     // Manual parse fallback
     try {
          const fs = await import('fs');
          const source = fs.readFileSync(tsPath, 'utf8');
          const catMatch = source.match(/export const blogCategories[^=]*= (\[[\s\S]*?\n\]);/);
          const postMatch = source.match(/export const blogPosts[^=]*= (\[[\s\S]*?\n\]);/);
          if (!postMatch) {
               console.error('❌ Could not locate blogPosts array in source.');
               return [];
          }
          const vm = await import('vm');
          const sandbox = {};
          vm.createContext(sandbox);
          if (catMatch) {
               const catCode = 'var blogCategories = ' + catMatch[1] + '; blogCategories;';
               sandbox.blogCategories = vm.runInContext(catCode, sandbox);
          } else {
               sandbox.blogCategories = [];
          }
          const postsCode = 'var blogCategories = globalThis.blogCategories || blogCategories; var blogPosts = ' + postMatch[1] + '; blogPosts;';
          // Provide blogCategories in globalThis within sandbox
          sandbox.globalThis = sandbox;
          const blogPosts = vm.runInContext(postsCode, sandbox);
          return blogPosts || [];
     } catch (e) {
          console.error('❌ Manual parse failed:', e.message);
          return [];
     }
}

function toMarkdown(html) {
     // For now keep original HTML as markdown placeholder.
     return html;
}

function extractExcerpt(html) {
     const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
     return text.slice(0, 160);
}

function toPlain(value) {
     return JSON.parse(JSON.stringify(value));
}

async function migrate() {
     const posts = await loadStaticPosts();
     if (!posts.length) {
          console.log('No static posts loaded. Aborting.');
          return;
     }
     console.log(`Found ${posts.length} static posts.`);

     let added = 0; let skipped = 0;
     for (const p of posts) {
          // Check existing by slug or title
          const slug = p.title.toLowerCase().replace(/[^a-z0-9\s-]/gi, '').replace(/\s+/g, '-').replace(/-+/g, '-');
          let exists = false;
          try {
               const qSnap = await getDocs(query(collection(db, 'blogPosts'), where('slug', '==', slug)));
               exists = !qSnap.empty;
          } catch { }
          if (exists) {
               console.log(`⏭️ Skip existing: ${p.title}`);
               skipped++; continue;
          }
          const docData = toPlain({
               title: p.title,
               subtitle: p.subtitle || '',
               slug,
               contentMarkdown: toMarkdown(p.content),
               contentHtml: p.content,
               excerpt: p.excerpt || extractExcerpt(p.content),
               authorName: p.author || 'Tác giả',
               categoryId: p.category?.id || 'uncategorized',
               tags: p.tags || [],
               status: p.status || 'published',
               featured: !!p.featured,
               coverImage: { url: p.imageUrl },
               readTime: p.readTime || 5,
               viewCount: p.viewCount || 0,
               seo: p.seo || {},
               publishedAt: p.publishedAt ? new Date(p.publishedAt) : new Date(),
               createdAt: new Date(),
               updatedAt: new Date(),
          });
          if (useAdmin) {
               await db.collection('blogPosts').add(docData);
          } else {
               await addDoc(collection(db, 'blogPosts'), docData);
          }
          console.log(`✅ Migrated: ${p.title}`);
          added++;
     }
     console.log(`\nDone. Added ${added}, skipped ${skipped}.`);
}

migrate().catch(e => { console.error(e); process.exit(1); });

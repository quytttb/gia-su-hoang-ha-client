# 🔥 Firebase Integration Setup Guide

## 📋 Overview

This guide covers the complete Firebase integration for the Gia Sư Hoàng Hà website, including authentication, Firestore database, and security implementation.

## 🚀 Phase 1: Firebase Project Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `gia-su-hoang-ha`
4. Enable Google Analytics (optional)
5. Choose your Google Analytics account

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Optionally enable **Google** provider for easier login

### 3. Create Firestore Database

1. Go to **Firestore Database** > **Create database**
2. Choose **Start in test mode** (we'll add security rules later)
3. Select your preferred location (closest to your users)

### 4. Get Firebase Configuration

1. Go to **Project Settings** > **General** tab
2. Scroll down to "Your apps" section
3. Click **Web app** icon (`</>`)
4. Register your app with name: `gia-su-hoang-ha-client`
5. Copy the Firebase configuration object

## 🔧 Phase 2: Environment Setup

### 1. Environment Variables

Create a `.env` file in your project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Analytics (existing)
VITE_GA_TRACKING_ID=G-0C25SX7IGJ
```

### 2. Vercel Environment Variables

For production deployment, add these variables in Vercel Dashboard:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add all the `VITE_FIREBASE_*` variables from your `.env` file

## 🛡️ Phase 3: Security Rules

### Firestore Security Rules

Copy and paste these rules in **Firestore** > **Rules**:

```javascript
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
```

## 👥 Phase 4: Initial User Setup

### Create Admin Users

You can create initial admin users in two ways:

#### Option A: Firebase Console (Recommended)

1. Go to **Authentication** > **Users**
2. Click **Add user**
3. Enter email and password
4. After creating, go to **Firestore Database**
5. Create a document in `users` collection with the user's UID:

```json
{
  "uid": "user_uid_from_auth",
  "email": "admin@giasuhoangha.com",
  "name": "Quản trị viên",
  "role": "admin",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastLogin": "2024-01-01T00:00:00.000Z",
  "isActive": true
}
```

#### Option B: Setup Script (Advanced)

Run the Firebase setup script (requires Node.js environment with Firebase Admin SDK):

```bash
node scripts/firebase-setup.js
```

## 🔐 Authentication Features

### User Roles

- **admin**: Full access to all features
- **staff**: Limited admin access (no user management)
- **user**: Public user access only

### Permissions System

The system uses a granular permission system:

- `view_courses`, `create_course`, `edit_course`, `delete_course`
- `view_registrations`, `approve_registration`, `cancel_registration`
- `view_inquiries`, `respond_inquiry`, `resolve_inquiry`
- `view_schedules`, `create_schedule`, `edit_schedule`, `delete_schedule`
- `view_users`, `create_user`, `edit_user`, `delete_user`
- `view_analytics`, `export_data`
- `manage_settings`, `view_logs`

### Protected Routes

- `/admin` - Requires `admin` or `staff` role
- `/admin/users` - Requires `admin` role only
- `/admin/analytics` - Requires `view_analytics` permission

## 🧪 Testing

### Development Testing

1. Start the development server:
```bash
npm run dev
```

2. Navigate to `/login`
3. Use demo credentials (if created):
   - Admin: `admin@giasuhoangha.com` / `admin123`
   - Staff: `staff@giasuhoangha.com` / `staff123`

### Production Testing

1. Deploy to Vercel with environment variables
2. Test authentication flow
3. Verify role-based access control
4. Check Firestore security rules

## 🚨 Security Considerations

### Important Security Notes

1. **Change Default Passwords**: Immediately change default admin passwords after first login
2. **Environment Variables**: Never commit `.env` files to version control
3. **Security Rules**: Test Firestore rules thoroughly before production
4. **User Validation**: Validate all user inputs on both client and server side
5. **Regular Audits**: Regularly review user permissions and access logs

### Security Checklist

- [ ] Firebase security rules implemented
- [ ] Default passwords changed
- [ ] Environment variables secured
- [ ] Admin panel protected
- [ ] User input validation implemented
- [ ] Error handling implemented
- [ ] Logging configured

## 📊 Database Structure

### Collections

#### `users`
```typescript
{
  uid: string;
  email: string;
  name: string;
  role: 'user' | 'staff' | 'admin';
  phone?: string;
  avatar?: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  isActive: boolean;
}
```

#### `courses` (Future Migration)
```typescript
{
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  subjects: string[];
  features: string[];
  image: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### `registrations` (Future Migration)
```typescript
{
  id: string;
  userId: string;
  courseId: string;
  studentName: string;
  studentPhone: string;
  parentName: string;
  parentPhone: string;
  address: string;
  preferredSchedule: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 🔄 Migration Plan

### Phase 1: Authentication (✅ Completed)
- Firebase Auth integration
- User roles and permissions
- Protected routes
- Login/logout functionality

### Phase 2: Data Migration (Next)
- Migrate mock data to Firestore
- Update data services
- Real-time data synchronization

### Phase 3: Advanced Features (Future)
- File upload for course images
- Email notifications
- Advanced analytics
- Backup and recovery

## 🐛 Troubleshooting

### Common Issues

#### 1. Firebase Configuration Error
```
Error: Firebase configuration not found
```
**Solution**: Check environment variables are properly set

#### 2. Authentication Error
```
Error: auth/user-not-found
```
**Solution**: Ensure user exists in Firebase Auth and Firestore

#### 3. Permission Denied
```
Error: Missing or insufficient permissions
```
**Solution**: Check Firestore security rules and user roles

#### 4. Build Errors
```
Error: Cannot resolve firebase modules
```
**Solution**: Ensure Firebase SDK is properly installed

### Debug Mode

Enable debug mode in development:

```typescript
// In firebase.ts
if (import.meta.env.DEV) {
  console.log('Firebase Debug Mode Enabled');
  // Additional debug logging
}
```

## 📞 Support

For technical support or questions:

1. Check this documentation first
2. Review Firebase Console logs
3. Check browser console for errors
4. Contact development team

## 🔗 Useful Links

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Status**: Phase 1 Complete ✅ 

## Phase 1: Authentication (COMPLETED ✅)

### Step 1: Firebase Console Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project or select existing: `gia-su-hoang-ha`
3. Enable Authentication, Firestore, and Analytics

### Step 2: Authentication Configuration
- Enable Email/Password authentication in Firebase Console
- Configure authorized domains if needed

### Step 3: Environment Setup
- Copy `.env.example` to `.env`
- Add your Firebase configuration values

### Step 4: Create Admin User
```bash
node scripts/create-staff.cjs admin@giasuhoangha.com "Admin User" admin123
```

## Phase 2: Data Migration (IN PROGRESS 🔄)

### Step 1: Deploy Firestore Security Rules
Before running data migration, you need to deploy security rules:

1. **Install Firebase CLI** (if not already installed):
```bash
npm install -g firebase-tools
```

2. **Login to Firebase**:
```bash
firebase login
```

3. **Initialize Firebase in your project**:
```bash
firebase init firestore
```
- Select your existing project: `gia-su-hoang-ha`
- Use `firestore.rules` as your rules file
- Use `firestore.indexes.json` as your indexes file

4. **Deploy the security rules**:
```bash
firebase deploy --only firestore:rules
```

### Step 2: Run Data Migration
After deploying the security rules, run the migration script:

```bash
node scripts/migrate-data.cjs
```

This will populate your Firestore database with sample course data.

### Step 3: Verify Data Migration
1. Check Firebase Console → Firestore Database
2. Verify that courses collection has been created with sample data

## Firestore Collections Structure

### courses
- `title` (string): Course title
- `description` (string): Course description  
- `price` (number): Course price in VND
- `duration` (string): Course duration
- `level` (string): Difficulty level
- `subjects` (array): List of subjects
- `features` (array): Course features
- `isActive` (boolean): Whether course is active
- `instructor` (string): Instructor name
- `maxStudents` (number): Maximum students
- `currentStudents` (number): Current enrolled students

### registrations
- `courseId` (string): Reference to course
- `studentName` (string): Student name
- `studentPhone` (string): Student phone
- `parentName` (string): Parent name
- `parentPhone` (string): Parent phone
- `address` (string): Student address
- `status` (string): pending|approved|rejected|cancelled|completed
- `paymentStatus` (string): pending|partial|completed|refunded

### inquiries
- `name` (string): Inquirer name
- `email` (string): Email address
- `phone` (string): Phone number
- `subject` (string): Inquiry subject
- `message` (string): Inquiry message
- `status` (string): new|in_progress|resolved|closed
- `priority` (string): low|medium|high|urgent

## Security Rules Summary

- **Public access**: Course browsing, creating registrations/inquiries
- **Authenticated users**: View own registrations/inquiries  
- **Staff**: Manage registrations, inquiries, schedules
- **Admin**: Full access including user management

## Troubleshooting

### Permission Errors
If you get "Missing or insufficient permissions" error:
1. Ensure security rules are deployed: `firebase deploy --only firestore:rules`
2. Check that your admin user exists in the `users` collection
3. Verify Firebase project configuration in `.env`

### Migration Issues
If migration fails:
1. Check internet connection
2. Verify Firebase configuration
3. Ensure you have proper permissions on the Firebase project

## Next Steps

After successful data migration:
1. Update React components to use Firestore services instead of mock data
2. Implement real-time data synchronization
3. Add advanced features like search and filtering
4. Set up proper error handling and loading states 
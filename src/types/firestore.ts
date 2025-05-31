import { Timestamp } from 'firebase/firestore';

// Base interface for all Firestore documents
export interface FirestoreDocument {
     id: string;
     createdAt: Timestamp;
     updatedAt: Timestamp;
}

// Course interface for Firestore
export interface FirestoreCourse extends FirestoreDocument {
     title: string;
     description: string;
     price: number;
     duration: string;
     level: 'Cơ bản' | 'Nâng cao' | 'Chuyên sâu';
     subjects: string[];
     features: string[];
     image: string;
     isActive: boolean;
     instructor?: string;
     maxStudents?: number;
     currentStudents?: number;
     startDate?: Timestamp;
     endDate?: Timestamp;
     schedule?: {
          dayOfWeek: number; // 0-6 (Sunday-Saturday)
          time: string; // "19:00-21:00"
     }[];
}

// Registration interface for Firestore
export interface FirestoreRegistration extends FirestoreDocument {
     userId?: string; // Optional for guest registrations
     courseId: string;
     studentName: string;
     studentPhone: string;
     parentName: string;
     parentPhone: string;
     address: string;
     preferredSchedule: string;
     notes?: string;
     status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';
     approvedBy?: string; // Admin/Staff UID who approved
     approvedAt?: Timestamp;
     rejectionReason?: string;
     // Payment information
     paymentStatus?: 'pending' | 'partial' | 'completed' | 'refunded';
     paidAmount?: number;
     totalAmount?: number;
     paymentMethod?: 'cash' | 'transfer' | 'card';
     paymentDate?: Timestamp;
}

// Inquiry interface for Firestore
export interface FirestoreInquiry extends FirestoreDocument {
     userId?: string; // Optional for guest inquiries
     name: string;
     email: string;
     phone: string;
     subject: string;
     message: string;
     status: 'new' | 'in_progress' | 'resolved' | 'closed';
     priority: 'low' | 'medium' | 'high' | 'urgent';
     assignedTo?: string; // Staff UID
     assignedAt?: Timestamp;
     responseRequired: boolean;
     // Response tracking
     responses?: {
          id: string;
          userId: string;
          userName: string;
          message: string;
          timestamp: Timestamp;
          isStaff: boolean;
     }[];
     resolvedAt?: Timestamp;
     resolvedBy?: string;
     tags?: string[];
}

// Schedule interface for Firestore
export interface FirestoreSchedule extends FirestoreDocument {
     courseId: string;
     instructorId: string;
     instructorName: string;
     date: Timestamp;
     startTime: string; // "19:00"
     endTime: string;   // "21:00"
     location: string;
     maxStudents: number;
     enrolledStudents: string[]; // Array of registration IDs
     status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
     notes?: string;
     // Attendance tracking
     attendance?: {
          registrationId: string;
          studentName: string;
          status: 'present' | 'absent' | 'late';
          notes?: string;
     }[];
}

// Analytics interface for Firestore
export interface FirestoreAnalytics extends FirestoreDocument {
     type: 'page_view' | 'course_view' | 'registration' | 'inquiry' | 'user_action';
     data: Record<string, any>;
     userId?: string;
     sessionId?: string;
     timestamp: Timestamp;
     metadata?: {
          userAgent?: string;
          referrer?: string;
          ip?: string;
          location?: {
               country?: string;
               city?: string;
          };
     };
}

// User statistics interface
export interface FirestoreUserStats extends FirestoreDocument {
     userId: string;
     totalCourses: number;
     completedCourses: number;
     activeCourses: number;
     totalPayments: number;
     lastActivity: Timestamp;
     achievements?: string[];
     preferences?: {
          subjects?: string[];
          preferredTime?: string[];
          notifications?: boolean;
     };
}

// System settings interface
export interface FirestoreSettings extends FirestoreDocument {
     key: string;
     value: any;
     description?: string;
     isPublic: boolean;
     lastModifiedBy: string;
}

// Collection names constants
export const COLLECTIONS = {
     USERS: 'users',
     COURSES: 'courses',
     REGISTRATIONS: 'registrations',
     INQUIRIES: 'inquiries',
     SCHEDULES: 'schedules',
     ANALYTICS: 'analytics',
     USER_STATS: 'userStats',
     SETTINGS: 'settings',
} as const;

// Firestore converter helper type
export type FirestoreConverter<T> = {
     toFirestore: (data: Partial<T>) => Record<string, any>;
     fromFirestore: (snapshot: any) => T;
}; 
import {
     collection,
     doc,
     getDocs,
     getDoc,
     addDoc,
     updateDoc,
     deleteDoc,
     query,
     where,
     onSnapshot,
     Timestamp,
     Firestore,
     writeBatch,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Schedule } from '../../types';

const COLLECTION_NAME = 'schedules';

export interface FirestoreSchedule {
     id: string;
     classId: string;
     className: string;
     startDate: Timestamp; // Ngày khai giảng lớp học
     startTime: string; // Giờ bắt đầu (VD: "08:00")
     endTime: string; // Giờ kết thúc (VD: "10:00")
     tutorId: string; // ID tham chiếu đến collection tutors
     tutorName: string; // Tên giáo viên (denormalized)
     maxStudents: number; // Cố định 12
     studentPhones: string[]; // Danh sách SĐT học viên
     status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'; // Trạng thái lớp học
     notes?: string;
     createdAt: Timestamp;
     updatedAt: Timestamp;
}

// Convert Firestore schedule to Schedule type
const convertFromFirestore = (firestoreSchedule: FirestoreSchedule): Schedule => {
     return {
          id: firestoreSchedule.id,
          classId: firestoreSchedule.classId,
          className: firestoreSchedule.className || '',
          startDate: firestoreSchedule.startDate ? firestoreSchedule.startDate.toDate().toISOString().split('T')[0] : '',
          startTime: firestoreSchedule.startTime,
          endTime: firestoreSchedule.endTime,
          tutorId: firestoreSchedule.tutorId || '',
          tutorName: firestoreSchedule.tutorName || '',
          maxStudents: firestoreSchedule.maxStudents || 12,
          studentPhones: firestoreSchedule.studentPhones || [],
          status: firestoreSchedule.status || 'scheduled',
     };
};

class SchedulesService {
     async getAll(): Promise<Schedule[]> {
          try {
               if (!db) {
                    console.error('Firestore not initialized');
                    return [];
               }

               // Simple query without orderBy to avoid index requirement
               const querySnapshot = await getDocs(collection(db as Firestore, COLLECTION_NAME));

               const schedules = querySnapshot.docs.map(doc => {
                    const data = doc.data() as Omit<FirestoreSchedule, 'id'>;
                    return convertFromFirestore({ id: doc.id, ...data });
               });

               // Sort in memory
               return schedules.sort((a, b) => {
                    if (a.startDate !== b.startDate) {
                         return a.startDate.localeCompare(b.startDate);
                    }
                    return a.startTime.localeCompare(b.startTime);
               });
          } catch (error) {
               console.error('Error fetching schedules:', error);
               throw new Error('Không thể tải danh sách lịch học');
          }
     }

     async getById(id: string): Promise<{ data: Schedule | null; error: string | null }> {
          try {
               if (!db) {
                    return { data: null, error: 'Firestore not initialized' };
               }

               const docRef = doc(db as Firestore, COLLECTION_NAME, id);
               const docSnap = await getDoc(docRef);

               if (docSnap.exists()) {
                    const data = docSnap.data() as Omit<FirestoreSchedule, 'id'>;
                    return {
                         data: convertFromFirestore({ id: docSnap.id, ...data }),
                         error: null
                    };
               } else {
                    return { data: null, error: 'Không tìm thấy lịch học' };
               }
          } catch (error) {
               console.error('Error fetching schedule:', error);
               return { data: null, error: 'Không thể tải thông tin lịch học' };
          }
     }

     async getByDate(date: string): Promise<Schedule[]> {
          try {
               if (!db) {
                    console.error('Firestore not initialized');
                    return [];
               }

               const q = query(
                    collection(db as Firestore, COLLECTION_NAME),
                    where('startDate', '==', Timestamp.fromDate(new Date(date)))
               );
               const querySnapshot = await getDocs(q);

               const schedules = querySnapshot.docs.map(doc => {
                    const data = doc.data() as Omit<FirestoreSchedule, 'id'>;
                    return convertFromFirestore({ id: doc.id, ...data });
               });

               // Sort by start time in memory
               return schedules.sort((a, b) => a.startTime.localeCompare(b.startTime));
          } catch (error) {
               console.error('Error fetching schedules by date:', error);
               throw new Error('Không thể tải lịch học theo ngày');
          }
     }

     async getByClassId(classId: string): Promise<Schedule[]> {
          try {
               if (!db) {
                    console.error('Firestore not initialized');
                    return [];
               }

               // Try classId first, fallback to courseId for backward compatibility
               let q = query(
                    collection(db as Firestore, COLLECTION_NAME),
                    where('classId', '==', classId)
               );
               let querySnapshot = await getDocs(q);

               // If no results with classId, try courseId for backward compatibility
               if (querySnapshot.empty) {
                    q = query(
                         collection(db as Firestore, COLLECTION_NAME),
                         where('courseId', '==', classId)
                    );
                    querySnapshot = await getDocs(q);
               }

               const schedules = querySnapshot.docs.map(doc => {
                    const data = doc.data() as Omit<FirestoreSchedule, 'id'>;
                    return convertFromFirestore({ id: doc.id, ...data });
               });

               // Sort by date then start time in memory
               return schedules.sort((a, b) => {
                    if (a.startDate !== b.startDate) {
                         return a.startDate.localeCompare(b.startDate);
                    }
                    return a.startTime.localeCompare(b.startTime);
               });
          } catch (error) {
               console.error('Error fetching schedules by course:', error);
               throw new Error('Không thể tải lịch học theo lớp học');
          }
     }

     async getByUserPhone(phone: string): Promise<Schedule[]> {
          try {
               if (!db) {
                    console.error('Firestore not initialized');
                    return [];
               }

               const q = query(
                    collection(db as Firestore, COLLECTION_NAME),
                    where('studentPhones', 'array-contains', phone)
               );
               const querySnapshot = await getDocs(q);

               const schedules = querySnapshot.docs.map(doc => {
                    const data = doc.data() as Omit<FirestoreSchedule, 'id'>;
                    return convertFromFirestore({ id: doc.id, ...data });
               });

               // Sort by date then start time in memory
               return schedules.sort((a, b) => {
                    if (a.startDate !== b.startDate) {
                         return a.startDate.localeCompare(b.startDate);
                    }
                    return a.startTime.localeCompare(b.startTime);
               });
          } catch (error) {
               console.error('Error fetching schedules by phone:', error);
               throw new Error('Không thể tải lịch học cá nhân');
          }
     }

     async getAvailableDates(): Promise<string[]> {
          try {
               if (!db) {
                    console.error('Firestore not initialized');
                    return [];
               }

               const querySnapshot = await getDocs(collection(db as Firestore, COLLECTION_NAME));

               const dates = querySnapshot.docs.map(doc => {
                    const data = doc.data() as Omit<FirestoreSchedule, 'id'>;
                    return data.startDate ? data.startDate.toDate().toISOString().split('T')[0] : '';
               }).filter(date => date !== '');

               // Return unique dates sorted
               return Array.from(new Set(dates)).sort();
          } catch (error) {
               console.error('Error fetching available dates:', error);
               throw new Error('Không thể tải danh sách ngày có lịch');
          }
     }

     // Real-time subscription for all schedules
     subscribeToSchedules(callback: (schedules: Schedule[]) => void): () => void {
          if (!db) {
               console.error('Firestore not initialized');
               callback([]);
               return () => { };
          }

          return onSnapshot(collection(db as Firestore, COLLECTION_NAME), (snapshot) => {
               const schedules = snapshot.docs.map(doc => {
                    const data = doc.data() as Omit<FirestoreSchedule, 'id'>;
                    return convertFromFirestore({ id: doc.id, ...data });
               });

               // Sort in memory
               const sortedSchedules = schedules.sort((a, b) => {
                    if (a.startDate !== b.startDate) {
                         return a.startDate.localeCompare(b.startDate);
                    }
                    return a.startTime.localeCompare(b.startTime);
               });

               callback(sortedSchedules);
          }, (error) => {
               console.error('Error in schedules subscription:', error);
               callback([]); // Return empty array on error
          });
     }

     // Real-time subscription for schedules by date
     subscribeToSchedulesByDate(date: string, callback: (schedules: Schedule[]) => void): () => void {
          if (!db) {
               console.error('Firestore not initialized');
               callback([]);
               return () => { };
          }

          const q = query(
               collection(db as Firestore, COLLECTION_NAME),
               where('date', '==', date)
          );

          return onSnapshot(q, (snapshot) => {
               const schedules = snapshot.docs.map(doc => {
                    const data = doc.data() as Omit<FirestoreSchedule, 'id'>;
                    return convertFromFirestore({ id: doc.id, ...data });
               });

               // Sort by start time in memory
               const sortedSchedules = schedules.sort((a, b) =>
                    a.startTime.localeCompare(b.startTime)
               );

               callback(sortedSchedules);
          }, (error) => {
               console.error('Error in schedules by date subscription:', error);
               callback([]); // Return empty array on error
          });
     }

     async create(scheduleData: Omit<FirestoreSchedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ data: FirestoreSchedule | null; error: string | null }> {
          try {
               if (!db) {
                    return { data: null, error: 'Firestore not initialized' };
               }

               const now = Timestamp.now();
               const docRef = await addDoc(collection(db as Firestore, COLLECTION_NAME), {
                    ...scheduleData,
                    createdAt: now,
                    updatedAt: now,
               });

               // Get the created document
               const docSnap = await getDoc(docRef);
               if (docSnap.exists()) {
                    const data = docSnap.data() as Omit<FirestoreSchedule, 'id'>;
                    return {
                         data: { id: docSnap.id, ...data },
                         error: null
                    };
               }

               return { data: null, error: 'Không thể tạo lịch học mới' };
          } catch (error) {
               console.error('Error creating schedule:', error);
               return { data: null, error: 'Không thể tạo lịch học mới' };
          }
     }

     async update(id: string, updates: Partial<Omit<FirestoreSchedule, 'id' | 'createdAt' | 'updatedAt'>>): Promise<{ data: FirestoreSchedule | null; error: string | null }> {
          try {
               if (!db) {
                    return { data: null, error: 'Firestore not initialized' };
               }

               const docRef = doc(db as Firestore, COLLECTION_NAME, id);
               await updateDoc(docRef, {
                    ...updates,
                    updatedAt: Timestamp.now()
               });

               // Get the updated document
               const docSnap = await getDoc(docRef);
               if (docSnap.exists()) {
                    const data = docSnap.data() as Omit<FirestoreSchedule, 'id'>;
                    return {
                         data: { id: docSnap.id, ...data },
                         error: null
                    };
               }

               return { data: null, error: 'Không thể cập nhật lịch học' };
          } catch (error) {
               console.error('Error updating schedule:', error);
               return { data: null, error: 'Không thể cập nhật lịch học' };
          }
     }

     async delete(id: string): Promise<{ error: string | null }> {
          try {
               if (!db) {
                    return { error: 'Firestore not initialized' };
               }

               const docRef = doc(db as Firestore, COLLECTION_NAME, id);
               await deleteDoc(docRef);
               return { error: null };
          } catch (error) {
               console.error('Error deleting schedule:', error);
               return { error: 'Không thể xóa lịch học' };
          }
     }

     // Backward compatibility alias
     async getByCourseId(courseId: string): Promise<Schedule[]> {
          return this.getByClassId(courseId);
     }
}

// Utility functions để đồng bộ dữ liệu denormalized
class DataSyncUtils {
     // Cập nhật className trong tất cả schedules khi class name thay đổi
     static async updateClassNameInSchedules(classId: string, newClassName: string): Promise<void> {
          try {
               if (!db) {
                    throw new Error('Firestore not initialized');
               }

               // Tìm tất cả schedules có classId này
               const q = query(
                    collection(db as Firestore, COLLECTION_NAME),
                    where('classId', '==', classId)
               );

               const querySnapshot = await getDocs(q);

               // Batch update để cập nhật hiệu quả
               const batch = writeBatch(db as Firestore);

               querySnapshot.forEach((docSnap) => {
                    batch.update(docSnap.ref, {
                         className: newClassName,
                         updatedAt: new Date()
                    });
               });

               await batch.commit();
               console.log(`✅ Updated className to "${newClassName}" for ${querySnapshot.size} schedules`);
          } catch (error) {
               console.error('Error updating className in schedules:', error);
               throw error;
          }
     }

     // Cập nhật tutorName trong tất cả schedules khi tutor name thay đổi
     static async updateTutorNameInSchedules(tutorId: string, newTutorName: string): Promise<void> {
          try {
               if (!db) {
                    throw new Error('Firestore not initialized');
               }

               // Tìm tất cả schedules có tutorId này
               const q = query(
                    collection(db as Firestore, COLLECTION_NAME),
                    where('tutorId', '==', tutorId)
               );

               const querySnapshot = await getDocs(q);

               // Batch update để cập nhật hiệu quả
               const batch = writeBatch(db as Firestore);

               querySnapshot.forEach((docSnap) => {
                    batch.update(docSnap.ref, {
                         tutorName: newTutorName,
                         updatedAt: new Date()
                    });
               });

               await batch.commit();
               console.log(`✅ Updated tutorName to "${newTutorName}" for ${querySnapshot.size} schedules`);
          } catch (error) {
               console.error('Error updating tutorName in schedules:', error);
               throw error;
          }
     }

     // Kiểm tra và sửa chữa dữ liệu không nhất quán
     static async validateAndFixInconsistentData(): Promise<void> {
          try {
               console.log('🔍 Checking for inconsistent data in schedules...');

               // Tải tất cả schedules
               const schedulesSnapshot = await getDocs(collection(db as Firestore, COLLECTION_NAME));

               // Tải tất cả classes và tutors để so sánh
               const classesSnapshot = await getDocs(collection(db as Firestore, 'classes'));
               const tutorsSnapshot = await getDocs(collection(db as Firestore, 'tutors'));

               const classesMap = new Map();
               const tutorsMap = new Map();

               classesSnapshot.forEach(doc => {
                    const data = doc.data();
                    classesMap.set(doc.id, data.name || data.title || '');
               });

               tutorsSnapshot.forEach(doc => {
                    const data = doc.data();
                    tutorsMap.set(doc.id, data.name || '');
               });

               const batch = writeBatch(db as Firestore);
               let fixCount = 0;

               schedulesSnapshot.forEach(doc => {
                    const data = doc.data();
                    const updates: any = {};

                    // Kiểm tra className
                    const correctClassName = classesMap.get(data.classId);
                    if (correctClassName && data.className !== correctClassName) {
                         updates.className = correctClassName;
                         fixCount++;
                    }

                    // Kiểm tra tutorName
                    const correctTutorName = tutorsMap.get(data.tutorId);
                    if (correctTutorName && data.tutorName !== correctTutorName) {
                         updates.tutorName = correctTutorName;
                         fixCount++;
                    }

                    if (Object.keys(updates).length > 0) {
                         updates.updatedAt = new Date();
                         batch.update(doc.ref, updates);
                    }
               });

               if (fixCount > 0) {
                    await batch.commit();
                    console.log(`✅ Fixed ${fixCount} inconsistent data entries`);
               } else {
                    console.log('✅ No inconsistent data found');
               }
          } catch (error) {
               console.error('Error validating data:', error);
               throw error;
          }
     }
}

// Export singleton instance and utilities
const schedulesService = new SchedulesService();
export default schedulesService;
export { DataSyncUtils };
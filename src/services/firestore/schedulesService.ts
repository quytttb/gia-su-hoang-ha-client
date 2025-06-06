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
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Schedule } from '../../types';

const COLLECTION_NAME = 'schedules';

export interface FirestoreSchedule {
     id: string;
     courseId: string;
     tutorId: string;
     date: string;
     startTime: string;
     endTime: string;
     room: string;
     status: 'scheduled' | 'completed' | 'cancelled';
     maxStudents?: number;
     studentPhones?: string[];
     tutor?: string;
     notes?: string;
     createdAt: Timestamp;
     updatedAt: Timestamp;
}

// Convert Firestore schedule to Schedule type
const convertFromFirestore = (firestoreSchedule: FirestoreSchedule): Schedule => {
     return {
          id: firestoreSchedule.id,
          classId: firestoreSchedule.courseId,
          className: '', // Will be populated by joining with course data
          date: firestoreSchedule.date,
          startTime: firestoreSchedule.startTime,
          endTime: firestoreSchedule.endTime,
          tutor: firestoreSchedule.tutor || '', // Use stored tutor name or empty
          room: firestoreSchedule.room,
          maxStudents: firestoreSchedule.maxStudents,
          studentPhones: firestoreSchedule.studentPhones || [],
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
                    if (a.date !== b.date) {
                         return a.date.localeCompare(b.date);
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
                    where('date', '==', date)
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

     async getByCourseId(courseId: string): Promise<Schedule[]> {
          try {
               if (!db) {
                    console.error('Firestore not initialized');
                    return [];
               }

               const q = query(
                    collection(db as Firestore, COLLECTION_NAME),
                    where('courseId', '==', courseId)
               );
               const querySnapshot = await getDocs(q);

               const schedules = querySnapshot.docs.map(doc => {
                    const data = doc.data() as Omit<FirestoreSchedule, 'id'>;
                    return convertFromFirestore({ id: doc.id, ...data });
               });

               // Sort by date then start time in memory
               return schedules.sort((a, b) => {
                    if (a.date !== b.date) {
                         return a.date.localeCompare(b.date);
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
                    if (a.date !== b.date) {
                         return a.date.localeCompare(b.date);
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
                    return data.date;
               });

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
                    if (a.date !== b.date) {
                         return a.date.localeCompare(b.date);
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

     async create(scheduleData: Omit<FirestoreSchedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
          try {
               if (!db) {
                    throw new Error('Firestore not initialized');
               }

               const now = Timestamp.now();
               const docRef = await addDoc(collection(db as Firestore, COLLECTION_NAME), {
                    ...scheduleData,
                    createdAt: now,
                    updatedAt: now,
               });
               return docRef.id;
          } catch (error) {
               console.error('Error creating schedule:', error);
               throw new Error('Không thể tạo lịch học mới');
          }
     }

     async update(id: string, updates: Partial<Omit<FirestoreSchedule, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
          try {
               if (!db) {
                    throw new Error('Firestore not initialized');
               }

               const docRef = doc(db as Firestore, COLLECTION_NAME, id);
               await updateDoc(docRef, {
                    ...updates,
                    updatedAt: Timestamp.now()
               });
          } catch (error) {
               console.error('Error updating schedule:', error);
               throw new Error('Không thể cập nhật lịch học');
          }
     }

     async delete(id: string): Promise<void> {
          try {
               if (!db) {
                    throw new Error('Firestore not initialized');
               }

               const docRef = doc(db as Firestore, COLLECTION_NAME, id);
               await deleteDoc(docRef);
          } catch (error) {
               console.error('Error deleting schedule:', error);
               throw new Error('Không thể xóa lịch học');
          }
     }
}

// Export singleton instance
const schedulesService = new SchedulesService();
export default schedulesService;                                                                                                                                
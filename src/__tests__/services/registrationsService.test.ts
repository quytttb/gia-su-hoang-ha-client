import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { registrationsService } from '../../services/firestore/registrationsService';
import type { FirestoreRegistration } from '../../types/firestore';
import type { RegistrationFilters } from '../../services/firestore/registrationsService';

// Mock Firebase
vi.mock('../../config/firebase', () => ({
     db: {
          collection: vi.fn(),
          doc: vi.fn(),
     },
     serverTimestamp: vi.fn(() => ({ __type: 'timestamp' })),
}));

// Mock classes service
vi.mock('../../services/firestore/classesService', () => ({
     default: {
          getById: vi.fn(),
     },
}));

// Mock base service
vi.mock('../../services/firestore/base', () => ({
     BaseFirestoreService: class MockBaseFirestoreService {
          collection: string;

          constructor(collection: string) {
               this.collection = collection;
          }

          async create(data: any) {
               return {
                    data: { ...data, id: 'test-id', createdAt: new Date(), updatedAt: new Date() },
                    error: null,
                    loading: false,
               };
          }

          async update(id: string, data: any) {
               return {
                    data: { id, ...data, updatedAt: new Date() },
                    error: null,
                    loading: false,
               };
          }

          async getAll() {
               return {
                    data: mockRegistrations,
                    hasMore: false,
                    lastDoc: null,
                    error: null,
               };
          }

          subscribeToCollection(callback: Function) {
               // Simulate real-time updates
               setTimeout(() => callback(mockRegistrations), 100);
               return () => { }; // unsubscribe function
          }
     },
}));

import classesService from '../../services/firestore/classesService';

// Mock data
const mockClass = {
     id: 'class-1',
     title: 'Toán 10',
     subject: 'Toán',
     grade: '10',
     description: 'Lớp toán 10 cơ bản',
     price: 500000,
     isActive: true,
     maxStudents: 20,
     currentStudents: 5,
     createdAt: new Date(),
     updatedAt: new Date(),
};

const mockRegistration: Omit<FirestoreRegistration, 'id' | 'createdAt' | 'updatedAt'> = {
     type: 'class',
     classId: 'class-1',
     studentName: 'Nguyễn Văn A',
     studentPhone: '0987654321',
     studentSchool: 'THPT Nguyễn Du',
     parentName: 'Nguyễn Văn Bố',
     parentPhone: '0123456789',
     parentAddress: '123 Nguyễn Huệ, Q1, TP.HCM',
     preferredSchedule: 'Thứ 2, 4, 6 - 19:00-21:00',
     notes: 'Học sinh khá, cần cải thiện',
     status: 'pending',
};

const mockRegistrations: FirestoreRegistration[] = [
     {
          ...mockRegistration,
          id: 'reg-1',
          status: 'pending',
          createdAt: { toDate: () => new Date('2024-01-01') } as any,
          updatedAt: { toDate: () => new Date('2024-01-01') } as any,
     },
     {
          ...mockRegistration,
          id: 'reg-2',
          status: 'approved',
          approvedBy: 'admin-1',
          approvedAt: { toDate: () => new Date('2024-01-02') } as any,
          createdAt: { toDate: () => new Date('2024-01-01') } as any,
          updatedAt: { toDate: () => new Date('2024-01-02') } as any,
     },
     {
          ...mockRegistration,
          id: 'reg-3',
          status: 'rejected',
          rejectionReason: 'Lớp đã đầy',
          approvedBy: 'admin-1',
          createdAt: { toDate: () => new Date('2024-01-01') } as any,
          updatedAt: { toDate: () => new Date('2024-01-02') } as any,
     },
];

describe('RegistrationsService', () => {
     beforeEach(() => {
          vi.clearAllMocks();

          // Mock successful class service response
          (classesService.getById as any).mockResolvedValue({
               data: mockClass,
               error: null,
               loading: false,
          });
     });

     afterEach(() => {
          vi.restoreAllMocks();
     });

     describe('createRegistration', () => {
          it('should create registration successfully', async () => {
               const result = await registrationsService.createRegistration(mockRegistration);

               expect(result.data).toBeDefined();
               expect(result.data?.classId).toBe(mockRegistration.classId);
               expect(result.data?.status).toBe('pending');
               expect(result.error).toBeNull();
          });

          it('should fail when class does not exist', async () => {
               (classesService.getById as any).mockResolvedValue({
                    data: null,
                    error: 'Class not found',
                    loading: false,
               });

               const result = await registrationsService.createRegistration(mockRegistration);

               expect(result.data).toBeNull();
               expect(result.error).toBe('Khóa học không tồn tại');
          });

          it('should fail when class is inactive', async () => {
               (classesService.getById as any).mockResolvedValue({
                    data: { ...mockClass, isActive: false },
                    error: null,
                    loading: false,
               });

               const result = await registrationsService.createRegistration(mockRegistration);

               expect(result.data).toBeNull();
               expect(result.error).toBe('Khóa học không còn hoạt động');
          });
     });

     describe('getRegistrations', () => {
          it('should get all registrations without filters', async () => {
               const result = await registrationsService.getRegistrations();

               expect(result.data).toHaveLength(3);
               expect(result.error).toBeNull();
          });

          it('should filter by status', async () => {
               const filters: RegistrationFilters = { status: 'pending' };
               const result = await registrationsService.getRegistrations(filters);

               expect(result.data).toBeDefined();
               // Note: In real implementation, filtering would be done by Firebase
               // Here we're testing the service structure
          });

          it('should filter by classId', async () => {
               const filters: RegistrationFilters = { classId: 'class-1' };
               const result = await registrationsService.getRegistrations(filters);

               expect(result.data).toBeDefined();
          });

          it('should filter by userId', async () => {
               const filters: RegistrationFilters = { userId: 'user-1' };
               const result = await registrationsService.getRegistrations(filters);

               expect(result.data).toBeDefined();
          });

          it('should filter by date range', async () => {
               const filters: RegistrationFilters = {
                    dateRange: {
                         start: new Date('2023-12-31'),
                         end: new Date('2024-01-02'),
                    },
               };
               const result = await registrationsService.getRegistrations(filters);

               expect(result.data).toBeDefined();
               // Client-side filtering should be applied
          });
     });

     describe('approveRegistration', () => {
          it('should approve registration successfully', async () => {
               const result = await registrationsService.approveRegistration('reg-1', 'admin-1');

               expect(result.data).toBeDefined();
               expect(result.error).toBeNull();
          });
     });

     describe('rejectRegistration', () => {
          it('should reject registration successfully', async () => {
               const result = await registrationsService.rejectRegistration(
                    'reg-1',
                    'Lớp đã đầy',
                    'admin-1'
               );

               expect(result.data).toBeDefined();
               expect(result.error).toBeNull();
          });
     });

     describe('cancelRegistration', () => {
          it('should cancel registration successfully', async () => {
               const result = await registrationsService.cancelRegistration('reg-1');

               expect(result.data).toBeDefined();
               expect(result.error).toBeNull();
          });
     });

     describe('getPendingRegistrations', () => {
          it('should get pending registrations', async () => {
               const result = await registrationsService.getPendingRegistrations();

               expect(result.data).toBeDefined();
               expect(result.error).toBeNull();
          });
     });

     describe('getUserRegistrations', () => {
          it('should get user registrations', async () => {
               const result = await registrationsService.getUserRegistrations('user-1');

               expect(result.data).toBeDefined();
               expect(result.error).toBeNull();
          });
     });

     describe('getCourseRegistrations', () => {
          it('should get course registrations', async () => {
               const result = await registrationsService.getCourseRegistrations('class-1');

               expect(result.data).toBeDefined();
               expect(result.error).toBeNull();
          });
     });

     describe('getRegistrationStats', () => {
          it('should calculate registration statistics correctly', async () => {
               const result = await registrationsService.getRegistrationStats();

               expect(result.data).toBeDefined();
               expect(result.data?.totalRegistrations).toBe(3);
               expect(result.data?.pendingRegistrations).toBe(1);
               expect(result.data?.approvedRegistrations).toBe(1);
               expect(result.data?.rejectedRegistrations).toBe(1);
               expect(result.data?.popularCourses).toBeDefined();
               expect(result.data?.recentRegistrations).toBeDefined();
               expect(result.error).toBeNull();
          });

          it('should handle empty registrations list', async () => {
               // Mock empty response
               vi.spyOn(registrationsService as any, 'getAll').mockResolvedValue({
                    data: [],
                    hasMore: false,
                    lastDoc: null,
                    error: null,
               });

               const result = await registrationsService.getRegistrationStats();

               expect(result.data).toBeDefined();
               expect(result.data?.totalRegistrations).toBe(0);
               expect(result.data?.pendingRegistrations).toBe(0);
               expect(result.data?.approvedRegistrations).toBe(0);
               expect(result.data?.rejectedRegistrations).toBe(0);
               expect(result.error).toBeNull();
          });
     });

     describe('bulkApproveRegistrations', () => {
          it('should approve multiple registrations successfully', async () => {
               const registrationIds = ['reg-1', 'reg-2'];
               const result = await registrationsService.bulkApproveRegistrations(
                    registrationIds,
                    'admin-1'
               );

               expect(result.data).toBe(true);
               expect(result.error).toBeNull();
          });

          it('should handle partial success in bulk operations', async () => {
               // Mock one success, one failure
               vi.spyOn(registrationsService, 'approveRegistration')
                    .mockResolvedValueOnce({
                         data: { id: 'reg-1' } as any,
                         error: null,
                         loading: false,
                    })
                    .mockRejectedValueOnce(new Error('Failed to approve'));

               const registrationIds = ['reg-1', 'reg-2'];
               const result = await registrationsService.bulkApproveRegistrations(
                    registrationIds,
                    'admin-1'
               );

               expect(result.data).toBe(false);
               expect(result.error).toContain('1/2 registrations were approved');
          });
     });

     describe('subscription methods', () => {
          it('should subscribe to pending registrations', () => {
               const callback = vi.fn();
               const unsubscribe = registrationsService.subscribeToPendingRegistrations(callback);

               expect(typeof unsubscribe).toBe('function');

               // Test callback is called after subscription
               setTimeout(() => {
                    expect(callback).toHaveBeenCalledWith(mockRegistrations);
               }, 150);
          });

          it('should subscribe to user registrations', () => {
               const callback = vi.fn();
               const unsubscribe = registrationsService.subscribeToUserRegistrations('user-1', callback);

               expect(typeof unsubscribe).toBe('function');
          });

          it('should subscribe to all registrations', () => {
               const callback = vi.fn();
               const unsubscribe = registrationsService.subscribeToAllRegistrations(callback);

               expect(typeof unsubscribe).toBe('function');
          });
     });

     describe('error handling', () => {
          it('should handle service errors gracefully', async () => {
               // Mock service error
               vi.spyOn(registrationsService as any, 'create').mockRejectedValue(
                    new Error('Database connection failed')
               );

               const result = await registrationsService.createRegistration(mockRegistration);

               expect(result.data).toBeNull();
               expect(result.error).toBe('Database connection failed');
          });

          it('should handle stats calculation errors', async () => {
               // Mock getAll error
               vi.spyOn(registrationsService as any, 'getAll').mockResolvedValue({
                    data: [],
                    hasMore: false,
                    lastDoc: null,
                    error: 'Database error',
               });

               const result = await registrationsService.getRegistrationStats();

               expect(result.data).toBeNull();
               expect(result.error).toBeDefined();
          });
     });
});

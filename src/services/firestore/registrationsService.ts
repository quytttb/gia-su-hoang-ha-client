import { serverTimestamp } from 'firebase/firestore';
import { BaseFirestoreService, QueryOptions, ServiceResponse, PaginatedResponse } from './base';
import { FirestoreRegistration, COLLECTIONS } from '../../types/firestore';
import coursesService from './classesService';

export interface RegistrationFilters {
     status?: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';
     classId?: string;
     userId?: string;
     paymentStatus?: 'pending' | 'partial' | 'completed' | 'refunded';
     dateRange?: { start: Date; end: Date };
}

export interface RegistrationStats {
     totalRegistrations: number;
     pendingRegistrations: number;
     approvedRegistrations: number;
     rejectedRegistrations: number;
     totalRevenue: number;
     pendingPayments: number;
     popularCourses: { classId: string; className?: string; count: number }[];
     recentRegistrations: number;
}

class RegistrationsService extends BaseFirestoreService<FirestoreRegistration> {
     constructor() {
          super(COLLECTIONS.REGISTRATIONS);
     }

     // Create registration and update course enrollment
     async createRegistration(
          registrationData: Omit<FirestoreRegistration, 'id' | 'createdAt' | 'updatedAt'>
     ): Promise<ServiceResponse<FirestoreRegistration>> {
          try {
               // Check if course exists and has available spots
               const courseResult = await coursesService.getById(registrationData.classId);
               if (!courseResult.data) {
                    return {
                         data: null,
                         error: 'Khóa học không tồn tại',
                         loading: false,
                    };
               }

               const course = courseResult.data;
               if (!course.isActive) {
                    return {
                         data: null,
                         error: 'Khóa học không còn hoạt động',
                         loading: false,
                    };
               }

               // Available spots check removed as currentStudents is no longer tracked

               // Create registration with default values
               const registration = {
                    ...registrationData,
                    status: 'pending' as const,
                    paymentStatus: 'pending' as const,
                    totalAmount: course.price,
                    paidAmount: 0,
               };

               const result = await this.create(registration);

               // Enrollment count tracking removed

               return result;
          } catch (error: any) {
               console.error('Error creating registration:', error);
               return {
                    data: null,
                    error: error.message || 'Không thể tạo đăng ký',
                    loading: false,
               };
          }
     }

     // Get registrations with filters
     async getRegistrations(
          filters?: RegistrationFilters,
          options?: QueryOptions
     ): Promise<PaginatedResponse<FirestoreRegistration>> {
          try {
               const whereClause: { field: string; operator: any; value: any }[] = [];

               // Apply filters
               if (filters?.status) {
                    whereClause.push({ field: 'status', operator: '==', value: filters.status });
               }

               if (filters?.classId) {
                    whereClause.push({ field: 'classId', operator: '==', value: filters.classId });
               }

               if (filters?.userId) {
                    whereClause.push({ field: 'userId', operator: '==', value: filters.userId });
               }

               if (filters?.paymentStatus) {
                    whereClause.push({ field: 'paymentStatus', operator: '==', value: filters.paymentStatus });
               }

               const queryOptions: QueryOptions = {
                    ...options,
                    where: [...(options?.where || []), ...whereClause],
                    orderBy: options?.orderBy || [
                         { field: 'createdAt', direction: 'desc' }
                    ]
               };

               const result = await this.getAll(queryOptions);

               // Client-side filtering for date range
               if (filters?.dateRange) {
                    result.data = result.data.filter(registration => {
                         if (!registration.createdAt) return false;
                         const createdDate = registration.createdAt.toDate();
                         return createdDate >= filters.dateRange!.start && createdDate <= filters.dateRange!.end;
                    });
               }

               return result;
          } catch (error: any) {
               console.error('Error getting registrations with filters:', error);
               return {
                    data: [],
                    hasMore: false,
                    lastDoc: null,
                    error: error.message || 'Failed to get registrations',
               };
          }
     }

     // Approve registration
     async approveRegistration(
          registrationId: string,
          approvedBy: string
     ): Promise<ServiceResponse<FirestoreRegistration>> {
          try {
               const updateData = {
                    status: 'approved' as const,
                    approvedBy,
                    approvedAt: serverTimestamp(),
               };

               return await this.update(registrationId, updateData);
          } catch (error: any) {
               console.error('Error approving registration:', error);
               return {
                    data: null,
                    error: error.message || 'Failed to approve registration',
                    loading: false,
               };
          }
     }

     // Reject registration
     async rejectRegistration(
          registrationId: string,
          rejectionReason: string,
          rejectedBy: string
     ): Promise<ServiceResponse<FirestoreRegistration>> {
          try {
               const updateData = {
                    status: 'rejected' as const,
                    rejectionReason,
                    approvedBy: rejectedBy, // Using approvedBy field for tracking who processed it
               };

               return await this.update(registrationId, updateData);
          } catch (error: any) {
               console.error('Error rejecting registration:', error);
               return {
                    data: null,
                    error: error.message || 'Failed to reject registration',
                    loading: false,
               };
          }
     }

     // Cancel registration
     async cancelRegistration(registrationId: string): Promise<ServiceResponse<FirestoreRegistration>> {
          try {
               const updateData = {
                    status: 'cancelled' as const,
               };

               return await this.update(registrationId, updateData);
          } catch (error: any) {
               console.error('Error cancelling registration:', error);
               return {
                    data: null,
                    error: error.message || 'Failed to cancel registration',
                    loading: false,
               };
          }
     }

     // Update payment information
     async updatePayment(
          registrationId: string,
          paymentData: {
               paidAmount: number;
               paymentMethod?: 'cash' | 'transfer' | 'card';
               paymentStatus?: 'pending' | 'partial' | 'completed' | 'refunded';
          }
     ): Promise<ServiceResponse<FirestoreRegistration>> {
          try {
               const registrationResult = await this.getById(registrationId);
               if (!registrationResult.data) {
                    return {
                         data: null,
                         error: 'Registration not found',
                         loading: false,
                    };
               }

               const registration = registrationResult.data;
               const totalAmount = registration.totalAmount || 0;
               const newPaidAmount = paymentData.paidAmount;

               // Determine payment status if not provided
               let paymentStatus = paymentData.paymentStatus;
               if (!paymentStatus) {
                    if (newPaidAmount <= 0) {
                         paymentStatus = 'pending';
                    } else if (newPaidAmount >= totalAmount) {
                         paymentStatus = 'completed';
                    } else {
                         paymentStatus = 'partial';
                    }
               }

               const updateData = {
                    paidAmount: newPaidAmount,
                    paymentStatus,
                    paymentMethod: paymentData.paymentMethod,
                    paymentDate: serverTimestamp(),
               };

               return await this.update(registrationId, updateData);
          } catch (error: any) {
               console.error('Error updating payment:', error);
               return {
                    data: null,
                    error: error.message || 'Failed to update payment',
                    loading: false,
               };
          }
     }

     // Get pending registrations
     async getPendingRegistrations(options?: QueryOptions): Promise<PaginatedResponse<FirestoreRegistration>> {
          return this.getRegistrations({ status: 'pending' }, options);
     }

     // Get user registrations
     async getUserRegistrations(
          userId: string,
          options?: QueryOptions
     ): Promise<PaginatedResponse<FirestoreRegistration>> {
          return this.getRegistrations({ userId }, options);
     }

     // Get course registrations
     async getCourseRegistrations(
          courseId: string,
          options?: QueryOptions
     ): Promise<PaginatedResponse<FirestoreRegistration>> {
          return this.getRegistrations({ classId: courseId }, options);
     }

     // Get registration statistics
     async getRegistrationStats(): Promise<ServiceResponse<RegistrationStats>> {
          try {
               const allRegistrations = await this.getAll({ limit: 1000 });

               if (allRegistrations.error) {
                    throw new Error(allRegistrations.error);
               }

               const registrations = allRegistrations.data;

               // Calculate basic statistics
               const totalRegistrations = registrations.length;
               const pendingRegistrations = registrations.filter(r => r.status === 'pending').length;
               const approvedRegistrations = registrations.filter(r => r.status === 'approved').length;
               const rejectedRegistrations = registrations.filter(r => r.status === 'rejected').length;

               // Calculate revenue
               const totalRevenue = registrations
                    .filter(r => r.paidAmount)
                    .reduce((sum, r) => sum + (r.paidAmount || 0), 0);

               const pendingPayments = registrations
                    .filter(r => r.paymentStatus === 'pending' || r.paymentStatus === 'partial')
                    .reduce((sum, r) => sum + ((r.totalAmount || 0) - (r.paidAmount || 0)), 0);

               // Popular courses
               const courseCount: { [key: string]: number } = {};
               registrations.forEach(registration => {
                    courseCount[registration.classId] = (courseCount[registration.classId] || 0) + 1;
               });

               const popularCourses = Object.entries(courseCount)
                    .map(([classId, count]) => ({ classId, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5);

               // Recent registrations (last 7 days)
               const sevenDaysAgo = new Date();
               sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

               const recentRegistrations = registrations.filter(registration => {
                    if (!registration.createdAt) return false;
                    return registration.createdAt.toDate() > sevenDaysAgo;
               }).length;

               const stats: RegistrationStats = {
                    totalRegistrations,
                    pendingRegistrations,
                    approvedRegistrations,
                    rejectedRegistrations,
                    totalRevenue,
                    pendingPayments,
                    popularCourses,
                    recentRegistrations,
               };

               return {
                    data: stats,
                    error: null,
                    loading: false,
               };
          } catch (error: any) {
               console.error('Error getting registration stats:', error);
               return {
                    data: null,
                    error: error.message || 'Failed to get registration statistics',
                    loading: false,
               };
          }
     }

     // Subscribe to pending registrations for admin dashboard
     subscribeToPendingRegistrations(callback: (registrations: FirestoreRegistration[]) => void) {
          return this.subscribeToCollection(callback, {
               where: [{ field: 'status', operator: '==', value: 'pending' }],
               orderBy: [{ field: 'createdAt', direction: 'desc' }],
               limit: 50,
          });
     }

     // Subscribe to user registrations
     subscribeToUserRegistrations(userId: string, callback: (registrations: FirestoreRegistration[]) => void) {
          return this.subscribeToCollection(callback, {
               where: [{ field: 'userId', operator: '==', value: userId }],
               orderBy: [{ field: 'createdAt', direction: 'desc' }],
               limit: 20,
          });
     }

     // Subscribe to all registrations for admin
     subscribeToAllRegistrations(callback: (registrations: FirestoreRegistration[]) => void) {
          return this.subscribeToCollection(callback, {
               orderBy: [{ field: 'createdAt', direction: 'desc' }],
               limit: 100,
          });
     }

     // Bulk approve registrations
     async bulkApproveRegistrations(
          registrationIds: string[],
          approvedBy: string
     ): Promise<ServiceResponse<boolean>> {
          try {
               const promises = registrationIds.map(id =>
                    this.approveRegistration(id, approvedBy)
               );

               const results = await Promise.allSettled(promises);
               const successCount = results.filter(result => result.status === 'fulfilled').length;

               if (successCount === registrationIds.length) {
                    return {
                         data: true,
                         error: null,
                         loading: false,
                    };
               } else {
                    return {
                         data: false,
                         error: `Only ${successCount}/${registrationIds.length} registrations were approved`,
                         loading: false,
                    };
               }
          } catch (error: any) {
               console.error('Error bulk approving registrations:', error);
               return {
                    data: false,
                    error: error.message || 'Failed to bulk approve registrations',
                    loading: false,
               };
          }
     }
}

// Export singleton instance
export const registrationsService = new RegistrationsService();
export default registrationsService; 
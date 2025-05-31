// Firebase Firestore utilities will be imported as needed
import { BaseFirestoreService, QueryOptions, ServiceResponse, PaginatedResponse } from './base';
import { FirestoreCourse, COLLECTIONS } from '../../types/firestore';

export interface CourseFilters {
     level?: string;
     subject?: string;
     priceRange?: { min: number; max: number };
     isActive?: boolean;
     hasAvailableSpots?: boolean;
}

export interface CourseStats {
     totalCourses: number;
     activeCourses: number;
     totalStudents: number;
     averagePrice: number;
     popularSubjects: { subject: string; count: number }[];
     recentEnrollments: number;
}

class CoursesService extends BaseFirestoreService<FirestoreCourse> {
     constructor() {
          super(COLLECTIONS.COURSES);
     }

     // Get courses with filters
     async getCourses(filters?: CourseFilters, options?: QueryOptions): Promise<PaginatedResponse<FirestoreCourse>> {
          try {
               const whereClause: { field: string; operator: any; value: any }[] = [];

               // Apply filters
               if (filters?.level) {
                    whereClause.push({ field: 'level', operator: '==', value: filters.level });
               }

               if (filters?.isActive !== undefined) {
                    whereClause.push({ field: 'isActive', operator: '==', value: filters.isActive });
               }

               if (filters?.subject) {
                    whereClause.push({ field: 'subjects', operator: 'array-contains', value: filters.subject });
               }

               // Price range filter will be handled client-side for now
               // Firestore doesn't support range queries with other conditions easily

               const queryOptions: QueryOptions = {
                    ...options,
                    where: [...(options?.where || []), ...whereClause],
                    orderBy: options?.orderBy || [
                         { field: 'isActive', direction: 'desc' },
                         { field: 'createdAt', direction: 'desc' }
                    ]
               };

               const result = await this.getAll(queryOptions);

               // Client-side filtering for price range and available spots
               if (filters?.priceRange || filters?.hasAvailableSpots) {
                    result.data = result.data.filter(course => {
                         // Price range filter
                         if (filters.priceRange) {
                              if (course.price < filters.priceRange.min || course.price > filters.priceRange.max) {
                                   return false;
                              }
                         }

                         // Available spots filter
                         if (filters.hasAvailableSpots) {
                              const hasSpots = !course.maxStudents ||
                                   !course.currentStudents ||
                                   course.currentStudents < course.maxStudents;
                              if (!hasSpots) return false;
                         }

                         return true;
                    });
               }

               return result;
          } catch (error: any) {
               console.error('Error getting courses with filters:', error);
               return {
                    data: [],
                    hasMore: false,
                    lastDoc: null,
                    error: error.message || 'Failed to get courses',
               };
          }
     }

     // Get active courses only
     async getActiveCourses(options?: QueryOptions): Promise<PaginatedResponse<FirestoreCourse>> {
          return this.getCourses({ isActive: true }, options);
     }

     // Get courses by subject
     async getCoursesBySubject(subject: string, options?: QueryOptions): Promise<PaginatedResponse<FirestoreCourse>> {
          return this.getCourses({ subject, isActive: true }, options);
     }

     // Get courses by level
     async getCoursesByLevel(level: string, options?: QueryOptions): Promise<PaginatedResponse<FirestoreCourse>> {
          return this.getCourses({ level, isActive: true }, options);
     }

     // Search courses by title or description
     async searchCourses(searchTerm: string, options?: QueryOptions): Promise<PaginatedResponse<FirestoreCourse>> {
          // Note: Firestore doesn't support full-text search natively
          // This is a basic implementation that can be enhanced with Algolia or similar
          const allCourses = await this.getActiveCourses(options);

          if (!searchTerm.trim()) {
               return allCourses;
          }

          const searchTermLower = searchTerm.toLowerCase();
          const filteredCourses = allCourses.data.filter(course =>
               course.title.toLowerCase().includes(searchTermLower) ||
               course.description.toLowerCase().includes(searchTermLower) ||
               course.subjects.some(subject => subject.toLowerCase().includes(searchTermLower))
          );

          return {
               ...allCourses,
               data: filteredCourses,
          };
     }

     // Update course enrollment count
     async updateEnrollmentCount(courseId: string, increment: number): Promise<ServiceResponse<FirestoreCourse>> {
          try {
               const courseResult = await this.getById(courseId);
               if (!courseResult.data) {
                    return {
                         data: null,
                         error: 'Course not found',
                         loading: false,
                    };
               }

               const currentStudents = (courseResult.data.currentStudents || 0) + increment;

               // Prevent negative enrollment
               if (currentStudents < 0) {
                    return {
                         data: null,
                         error: 'Invalid enrollment count',
                         loading: false,
                    };
               }

               // Check max students limit
               if (courseResult.data.maxStudents && currentStudents > courseResult.data.maxStudents) {
                    return {
                         data: null,
                         error: 'Course is full',
                         loading: false,
                    };
               }

               return await this.update(courseId, { currentStudents });
          } catch (error: any) {
               console.error('Error updating enrollment count:', error);
               return {
                    data: null,
                    error: error.message || 'Failed to update enrollment count',
                    loading: false,
               };
          }
     }

     // Toggle course active status
     async toggleActiveStatus(courseId: string): Promise<ServiceResponse<FirestoreCourse>> {
          try {
               const courseResult = await this.getById(courseId);
               if (!courseResult.data) {
                    return {
                         data: null,
                         error: 'Course not found',
                         loading: false,
                    };
               }

               return await this.update(courseId, { isActive: !courseResult.data.isActive });
          } catch (error: any) {
               console.error('Error toggling course status:', error);
               return {
                    data: null,
                    error: error.message || 'Failed to toggle course status',
                    loading: false,
               };
          }
     }

     // Get course statistics
     async getCourseStats(): Promise<ServiceResponse<CourseStats>> {
          try {
               const allCourses = await this.getAll({ limit: 1000 }); // Get reasonable limit

               if (allCourses.error) {
                    throw new Error(allCourses.error);
               }

               const courses = allCourses.data;
               const activeCourses = courses.filter(c => c.isActive);

               // Calculate statistics
               const totalCourses = courses.length;
               const totalActiveCourses = activeCourses.length;
               const totalStudents = courses.reduce((sum, course) => sum + (course.currentStudents || 0), 0);
               const averagePrice = courses.length > 0
                    ? courses.reduce((sum, course) => sum + course.price, 0) / courses.length
                    : 0;

               // Popular subjects
               const subjectCount: { [key: string]: number } = {};
               courses.forEach(course => {
                    course.subjects.forEach(subject => {
                         subjectCount[subject] = (subjectCount[subject] || 0) + 1;
                    });
               });

               const popularSubjects = Object.entries(subjectCount)
                    .map(([subject, count]) => ({ subject, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5);

               // Recent enrollments (last 30 days)
               const thirtyDaysAgo = new Date();
               thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

               const recentEnrollments = courses.reduce((sum, course) => {
                    if (course.createdAt && course.createdAt.toDate() > thirtyDaysAgo) {
                         return sum + (course.currentStudents || 0);
                    }
                    return sum;
               }, 0);

               const stats: CourseStats = {
                    totalCourses,
                    activeCourses: totalActiveCourses,
                    totalStudents,
                    averagePrice,
                    popularSubjects,
                    recentEnrollments,
               };

               return {
                    data: stats,
                    error: null,
                    loading: false,
               };
          } catch (error: any) {
               console.error('Error getting course stats:', error);
               return {
                    data: null,
                    error: error.message || 'Failed to get course statistics',
                    loading: false,
               };
          }
     }

     // Duplicate course
     async duplicateCourse(courseId: string, newTitle?: string): Promise<ServiceResponse<FirestoreCourse>> {
          try {
               const originalCourse = await this.getById(courseId);
               if (!originalCourse.data) {
                    return {
                         data: null,
                         error: 'Original course not found',
                         loading: false,
                    };
               }

               const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, currentStudents: _currentStudents, ...courseData } = originalCourse.data;

               const duplicatedCourse = {
                    ...courseData,
                    title: newTitle || `${courseData.title} (Copy)`,
                    currentStudents: 0,
                    isActive: false, // Duplicated courses start as inactive
               };

               return await this.create(duplicatedCourse);
          } catch (error: any) {
               console.error('Error duplicating course:', error);
               return {
                    data: null,
                    error: error.message || 'Failed to duplicate course',
                    loading: false,
               };
          }
     }

     // Get courses for admin dashboard
     async getAdminCourses(options?: QueryOptions): Promise<PaginatedResponse<FirestoreCourse>> {
          const queryOptions: QueryOptions = {
               ...options,
               orderBy: [
                    { field: 'isActive', direction: 'desc' },
                    { field: 'updatedAt', direction: 'desc' }
               ]
          };

          return this.getAll(queryOptions);
     }

     // Subscribe to course changes for real-time updates
     subscribeToActiveCourses(callback: (courses: any[]) => void) {
          return this.subscribeToCollection(callback, {
               // No where clause to get all courses since data structure doesn't have isActive
               limit: 50,
          });
     }

     // Subscribe to course statistics for admin dashboard
     subscribeToCoursesForAdmin(callback: (courses: any[]) => void) {
          return this.subscribeToCollection(callback, {
               limit: 100,
          });
     }
}

// Export singleton instance
export const coursesService = new CoursesService();
export default coursesService; 
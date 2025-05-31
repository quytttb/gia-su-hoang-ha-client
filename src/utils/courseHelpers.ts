import { Course } from '../types';

/**
 * Convert Firestore course data to Course type
 * Handles both old and new data structures
 */
export const convertFirestoreCourse = (firestoreCourse: any): Course => {
     return {
          id: firestoreCourse.id,
          name: firestoreCourse.name || firestoreCourse.title || 'Khóa học',
          description: firestoreCourse.description || '',
          targetAudience: firestoreCourse.targetAudience || 'Học sinh',
          schedule: firestoreCourse.schedule || 'Linh hoạt',
          price: firestoreCourse.price || 0,
          imageUrl: firestoreCourse.imageUrl || firestoreCourse.image || '/images/default-course.jpg',
          featured: firestoreCourse.featured !== undefined ? firestoreCourse.featured : false,
          category: firestoreCourse.category || 'Khác',
          // Handle discount fields
          discount: firestoreCourse.discount,
          discountEndDate: firestoreCourse.discountEndDate,
     };
};

/**
 * Extract unique categories from course data
 */
export const extractCourseCategories = (courses: any[]): string[] => {
     const allCategories = courses.map(course => course.category).filter(Boolean);
     return Array.from(new Set(allCategories));
};

/**
 * Filter courses by category
 */
export const filterCoursesByCategory = (courses: Course[], category: string): Course[] => {
     if (category === 'all') {
          return courses;
     }
     return courses.filter(course => course.category === category);
};

/**
 * Get featured courses only
 */
export const getFeaturedCourses = (courses: Course[], limit?: number): Course[] => {
     const featured = courses.filter(course => course.featured);
     return limit ? featured.slice(0, limit) : featured;
}; 
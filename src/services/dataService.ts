import { mockData } from './mockData';
import { Banner, CenterInfo, Course, Inquiry, Registration, Schedule, Tutor, User } from '../types';
import { generateId } from '../utils/helpers';
import axios from 'axios';

// Base URL for API calls
// TODO: Update this to your actual API URL when deploying
const API_BASE_URL = process.env.NODE_ENV === 'production'
     ? 'https://api.giasuhoangha.com/api'
     : '/api';

// Create axios instance
const api = axios.create({
     baseURL: API_BASE_URL,
     headers: {
          'Content-Type': 'application/json'
     }
});

// Function to determine whether to use mock data or real API
// Set this to false when the backend API is ready
const USE_MOCK_DATA = true;

// Get center information
export const getCenterInfo = async (): Promise<CenterInfo> => {
     // TODO: Replace with real API call when backend is ready
     // GET /api/center-info
     if (!USE_MOCK_DATA) {
          try {
               const response = await api.get('/center-info');
               return response.data;
          } catch (error) {
               console.error('Error fetching center info:', error);
               throw error;
          }
     }

     // Using mock data
     return new Promise((resolve) => {
          setTimeout(() => {
               resolve(mockData.centerInfo);
          }, 300);
     });
};

// Get banners
export const getBanners = async (): Promise<Banner[]> => {
     // TODO: Replace with real API call when backend is ready
     // GET /api/banners
     if (!USE_MOCK_DATA) {
          try {
               const response = await api.get('/banners');
               return response.data;
          } catch (error) {
               console.error('Error fetching banners:', error);
               throw error;
          }
     }

     // Using mock data
     return new Promise((resolve) => {
          setTimeout(() => {
               resolve(mockData.banners);
          }, 300);
     });
};

// Get tutors
export const getTutors = async (): Promise<Tutor[]> => {
     // TODO: Replace with real API call when backend is ready
     // GET /api/tutors
     if (!USE_MOCK_DATA) {
          try {
               const response = await api.get('/tutors');
               return response.data;
          } catch (error) {
               console.error('Error fetching tutors:', error);
               throw error;
          }
     }

     // Using mock data
     return new Promise((resolve) => {
          setTimeout(() => {
               resolve(mockData.tutors);
          }, 300);
     });
};

// Get all courses
export const getAllCourses = async (): Promise<Course[]> => {
     // TODO: Replace with real API call when backend is ready
     // GET /api/courses
     if (!USE_MOCK_DATA) {
          try {
               const response = await api.get('/courses');
               return response.data;
          } catch (error) {
               console.error('Error fetching courses:', error);
               throw error;
          }
     }

     // Using mock data
     return new Promise((resolve) => {
          setTimeout(() => {
               resolve(mockData.courses);
          }, 300);
     });
};

// Get featured courses
export const getFeaturedCourses = async (): Promise<Course[]> => {
     // TODO: Replace with real API call when backend is ready
     // GET /api/courses/featured
     if (!USE_MOCK_DATA) {
          try {
               const response = await api.get('/courses/featured');
               return response.data;
          } catch (error) {
               console.error('Error fetching featured courses:', error);
               throw error;
          }
     }

     // Using mock data
     return new Promise((resolve) => {
          setTimeout(() => {
               const featured = mockData.courses.filter(course => course.featured);
               resolve(featured);
          }, 300);
     });
};

// Get course by ID
export const getCourseById = async (id: string): Promise<Course | undefined> => {
     // TODO: Replace with real API call when backend is ready
     // GET /api/courses/:id
     if (!USE_MOCK_DATA) {
          try {
               const response = await api.get(`/courses/${id}`);
               return response.data;
          } catch (error) {
               console.error(`Error fetching course with ID ${id}:`, error);
               throw error;
          }
     }

     // Using mock data
     return new Promise((resolve) => {
          setTimeout(() => {
               const course = mockData.courses.find(course => course.id === id);
               resolve(course);
          }, 300);
     });
};

// Get courses by category
export const getCoursesByCategory = async (category: string): Promise<Course[]> => {
     // TODO: Replace with real API call when backend is ready
     // GET /api/courses/category/:category
     if (!USE_MOCK_DATA) {
          try {
               const response = await api.get(`/courses/category/${category}`);
               return response.data;
          } catch (error) {
               console.error(`Error fetching courses in category ${category}:`, error);
               throw error;
          }
     }

     // Using mock data
     return new Promise((resolve) => {
          setTimeout(() => {
               const filtered = mockData.courses.filter(course => course.category === category);
               resolve(filtered);
          }, 300);
     });
};

// Get all schedules
export const getAllSchedules = async (): Promise<Schedule[]> => {
     // TODO: Replace with real API call when backend is ready
     // GET /api/schedules
     if (!USE_MOCK_DATA) {
          try {
               const response = await api.get('/schedules');
               return response.data;
          } catch (error) {
               console.error('Error fetching schedules:', error);
               throw error;
          }
     }

     // Using mock data
     return new Promise((resolve) => {
          setTimeout(() => {
               resolve(mockData.schedules);
          }, 300);
     });
};

// Get schedules by date
export const getSchedulesByDate = async (date: string): Promise<Schedule[]> => {
     // TODO: Replace with real API call when backend is ready
     // GET /api/schedules/date/:date
     if (!USE_MOCK_DATA) {
          try {
               const response = await api.get(`/schedules/date/${date}`);
               return response.data;
          } catch (error) {
               console.error(`Error fetching schedules for date ${date}:`, error);
               throw error;
          }
     }

     // Using mock data
     return new Promise((resolve) => {
          setTimeout(() => {
               const filtered = mockData.schedules.filter(schedule => schedule.date === date);
               resolve(filtered);
          }, 300);
     });
};

// Get schedules by course ID
export const getSchedulesByCourseId = async (courseId: string): Promise<Schedule[]> => {
     // TODO: Replace with real API call when backend is ready
     // GET /api/schedules/course/:courseId
     if (!USE_MOCK_DATA) {
          try {
               const response = await api.get(`/schedules/course/${courseId}`);
               return response.data;
          } catch (error) {
               console.error(`Error fetching schedules for course ${courseId}:`, error);
               throw error;
          }
     }

     // Using mock data
     return new Promise((resolve) => {
          setTimeout(() => {
               const filtered = mockData.schedules.filter(schedule => schedule.courseId === courseId);
               resolve(filtered);
          }, 300);
     });
};

// Get schedules by user phone
export const getSchedulesByUserPhone = async (phone: string): Promise<Schedule[]> => {
     // TODO: Replace with real API call when backend is ready
     // GET /api/schedules/phone/:phone
     if (!USE_MOCK_DATA) {
          try {
               const response = await api.get(`/schedules/phone/${phone}`);
               return response.data;
          } catch (error) {
               console.error(`Error fetching schedules for phone ${phone}:`, error);
               throw error;
          }
     }

     // Using mock data
     return new Promise((resolve) => {
          setTimeout(() => {
               // Find the user by phone
               const user = mockData.users.find(user => user.phone === phone);

               if (!user || !user.registrations) {
                    resolve([]);
                    return;
               }

               // Get course IDs the user is registered for
               const courseIds = user.registrations.map(reg => reg.courseId);

               // Filter schedules by those course IDs
               const filtered = mockData.schedules.filter(schedule =>
                    courseIds.includes(schedule.courseId) &&
                    schedule.studentIds.includes(user.id)
               );

               resolve(filtered);
          }, 300);
     });
};

// Register for a course
export const registerForCourse = async (
     name: string,
     phone: string,
     email: string,
     courseId: string
): Promise<Registration> => {
     // TODO: Replace with real API call when backend is ready
     // POST /api/register
     if (!USE_MOCK_DATA) {
          try {
               const response = await api.post('/register', {
                    name,
                    phone,
                    email,
                    courseId
               });
               return response.data;
          } catch (error) {
               console.error('Error registering for course:', error);
               throw error;
          }
     }

     // Using mock data
     return new Promise((resolve) => {
          setTimeout(() => {
               // In a real app, this would be a server-side operation
               // Here we're simulating it with local data

               // Check if user exists, otherwise create new
               let user = mockData.users.find(user => user.phone === phone);
               let userId = user?.id || '';

               if (!user) {
                    userId = `user${generateId()}`;
                    const newUser: User = {
                         id: userId,
                         name,
                         phone,
                         email,
                         registrations: []
                    };

                    mockData.users.push(newUser);
                    user = newUser;
               }

               // Create registration
               const registration: Registration = {
                    id: `reg${generateId()}`,
                    userId,
                    courseId,
                    registrationDate: new Date().toISOString().split('T')[0],
                    status: 'pending',
                    paymentStatus: 'pending'
               };

               // Add to user's registrations
               if (user.registrations) {
                    user.registrations.push(registration);
               } else {
                    user.registrations = [registration];
               }

               resolve(registration);
          }, 600);
     });
};

// Submit inquiry
export const submitInquiry = async (
     name: string,
     phone: string,
     email: string,
     message: string
): Promise<Inquiry> => {
     // TODO: Replace with real API call when backend is ready
     // POST /api/inquiry
     if (!USE_MOCK_DATA) {
          try {
               const response = await api.post('/inquiry', {
                    name,
                    phone,
                    email,
                    message
               });
               return response.data;
          } catch (error) {
               console.error('Error submitting inquiry:', error);
               throw error;
          }
     }

     // Using mock data
     return new Promise((resolve) => {
          setTimeout(() => {
               // Check if user exists, otherwise create new
               let user = mockData.users.find(user => user.phone === phone);
               let userId = user?.id || '';

               if (!user) {
                    userId = `user${generateId()}`;
                    const newUser: User = {
                         id: userId,
                         name,
                         phone,
                         email,
                         inquiries: []
                    };

                    mockData.users.push(newUser);
                    user = newUser;
               }

               // Create inquiry
               const inquiry: Inquiry = {
                    id: `inq${generateId()}`,
                    userId,
                    message,
                    date: new Date().toISOString().split('T')[0],
                    status: 'new'
               };

               // Add to user's inquiries
               if (user.inquiries) {
                    user.inquiries.push(inquiry);
               } else {
                    user.inquiries = [inquiry];
               }

               resolve(inquiry);
          }, 600);
     });
}; 
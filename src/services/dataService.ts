import { Banner, CenterInfo, Class, Inquiry, Registration, Schedule, Tutor } from '../types';

// Create axios instance for API calls
// import axios from 'axios';
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
// });

// Whether to use mock data for development
const USE_MOCK_DATA = true;

// Get all courses
export const getCourses = async (): Promise<Class[]> => {
  // TODO: Replace with real API call when backend is ready
  // GET /api/classes
  if (!USE_MOCK_DATA) {
    try {
      // const response = await api.get('/classes');
      // return response.data;
    } catch (error) {
      console.error('Error fetching courses from API:', error);
      throw error;
    }
  }

  // Return empty array since mockData is removed
  return [];
};

// Get a single course by ID
export const getCourseById = async (id: string): Promise<Class | undefined> => {
  // TODO: Replace with real API call when backend is ready
  // GET /api/classes/:id
  if (!USE_MOCK_DATA) {
    try {
      // const response = await api.get(`/classes/${id}`);
      // return response.data;
    } catch (error) {
      console.error(`Error fetching course ${id} from API:`, error);
      throw error;
    }
  }

  // Return undefined since mockData is removed
  return undefined;
};

// Get featured courses
export const getFeaturedCourses = async (): Promise<Class[]> => {
  // TODO: Replace with real API call when backend is ready
  // GET /api/classes/featured
  if (!USE_MOCK_DATA) {
    try {
      // const response = await api.get('/classes/featured');
      // return response.data;
    } catch (error) {
      console.error('Error fetching featured courses from API:', error);
      throw error;
    }
  }

  // Return empty array since mockData is removed
  return [];
};

// Get courses by category
export const getCoursesByCategory = async (category: string): Promise<Class[]> => {
  // TODO: Replace with real API call when backend is ready
  // GET /api/classes/category/:category
  if (!USE_MOCK_DATA) {
    try {
      // const response = await api.get(`/classes/category/${category}`);
      // return response.data;
    } catch (error) {
      console.error(`Error fetching courses in category ${category} from API:`, error);
      throw error;
    }
  }

  // Return empty array since mockData is removed
  return [];
};

// Get all schedules
export const getSchedules = async (): Promise<Schedule[]> => {
  // TODO: Replace with real API call when backend is ready
  // GET /api/schedules
  if (!USE_MOCK_DATA) {
    try {
      // const response = await api.get('/schedules');
      // return response.data;
    } catch (error) {
      console.error('Error fetching schedules from API:', error);
      throw error;
    }
  }

  // Return empty array since mockData is removed
  return [];
};

// Get available schedule dates
export const getAvailableScheduleDates = async (): Promise<string[]> => {
  // TODO: Replace with real API call when backend is ready
  // GET /api/schedules/dates
  if (!USE_MOCK_DATA) {
    try {
      // const response = await api.get('/schedules/dates');
      // return response.data;
    } catch (error) {
      console.error('Error fetching available schedule dates from API:', error);
      throw error;
    }
  }

  // Return empty array since mockData is removed
  return [];
};

// Get schedules by date
export const getSchedulesByDate = async (date: string): Promise<Schedule[]> => {
  // TODO: Replace with real API call when backend is ready
  // GET /api/schedules/date/:date
  if (!USE_MOCK_DATA) {
    try {
      // const response = await api.get(`/schedules/date/${date}`);
      // return response.data;
    } catch (error) {
      console.error(`Error fetching schedules for date ${date} from API:`, error);
      throw error;
    }
  }

  // Return empty array since mockData is removed
  return [];
};

// Get schedules by course ID
export const getSchedulesByCourseId = async (courseId: string): Promise<Schedule[]> => {
  // TODO: Replace with real API call when backend is ready
  // GET /api/schedules/course/:courseId
  if (!USE_MOCK_DATA) {
    try {
      // const response = await api.get(`/schedules/course/${courseId}`);
      // return response.data;
    } catch (error) {
      console.error(`Error fetching schedules for course ${courseId}:`, error);
      throw error;
    }
  }

  // Return empty array since mockData is removed
  return [];
};

// Get schedules by user phone
export const getSchedulesByUserPhone = async (phone: string): Promise<Schedule[]> => {
  // TODO: Replace with real API call when backend is ready
  // GET /api/schedules/user/:phone
  if (!USE_MOCK_DATA) {
    try {
      // const response = await api.get(`/schedules/user/${phone}`);
      // return response.data;
    } catch (error) {
      console.error(`Error fetching schedules for user ${phone} from API:`, error);
      throw error;
    }
  }

  // Return empty array since mockData is removed
  return [];
};

// Get all tutors
export const getTutors = async (): Promise<Tutor[]> => {
  // TODO: Replace with real API call when backend is ready
  // GET /api/tutors
  if (!USE_MOCK_DATA) {
    try {
      // const response = await api.get('/tutors');
      // return response.data;
    } catch (error) {
      console.error('Error fetching tutors from API:', error);
      throw error;
    }
  }

  // Return empty array since mockData is removed
  return [];
};

// Get center information
export const getCenterInfo = async (): Promise<CenterInfo> => {
  // TODO: Replace with real API call when backend is ready
  // GET /api/center-info
  if (!USE_MOCK_DATA) {
    try {
      // const response = await api.get('/center-info');
      // return response.data;
    } catch (error) {
      console.error('Error fetching center info from API:', error);
      throw error;
    }
    throw new Error('Center info not available');
  }

  // Return default center info since mockData is removed
  return {
    id: '1',
    name: 'Trung tâm Gia Sư Hoàng Hà',
    description: 'Trung tâm Gia Sư Hoàng Hà tự hào là nơi cung cấp dịch vụ gia sư chất lượng cao tại Thanh Hóa.',
    address: '265 - ĐƯỜNG 06 - MẶT BẰNG 08, PHƯỜNG NAM NGẠN, THÀNH PHỐ THANH HOÁ, TỈNH THANH HOÁ',
    phone: '0385.510.892 - 0962.390.161',
    email: 'lienhe@giasuhoangha.com',
    history: 'Trung tâm Gia Sư Hoàng Hà được thành lập vào năm 2015.',
    mission: 'Cung cấp môi trường học tập chất lượng, hiệu quả.',
    vision: 'Trở thành trung tâm gia sư hàng đầu tại Thanh Hóa.',
    workingHours: {
      weekdays: '7:30 - 20:00',
      weekend: '8:00 - 17:00',
    },
    slogan: 'DẪN LỐI TRI THỨC - VỮNG BƯỚC TƯƠNG LAI',
  };
};

// Get all banners
export const getBanners = async (): Promise<Banner[]> => {
  // TODO: Replace with real API call when backend is ready
  // GET /api/banners
  if (!USE_MOCK_DATA) {
    try {
      // const response = await api.get('/banners');
      // return response.data;
    } catch (error) {
      console.error('Error fetching banners from API:', error);
      throw error;
    }
  }

  // Return empty array since mockData is removed
  return [];
};

// Submit contact inquiry
export const submitInquiry = async (inquiry: Omit<Inquiry, 'id' | 'createdAt'>): Promise<void> => {
  // TODO: Replace with real API call when backend is ready
  // POST /api/inquiries
  if (!USE_MOCK_DATA) {
    try {
      // const response = await api.post('/inquiries', inquiry);
      // return response.data;
    } catch (error) {
      console.error('Error submitting inquiry to API:', error);
      throw error;
    }
  }

  // Simulate successful submission
  console.log('Inquiry submitted (mock):', inquiry);
};

// Submit course registration
export const submitRegistration = async (registration: Omit<Registration, 'id' | 'registrationDate'>): Promise<void> => {
  // TODO: Replace with real API call when backend is ready
  // POST /api/registrations
  if (!USE_MOCK_DATA) {
    try {
      // const response = await api.post('/registrations', registration);
      // return response.data;
    } catch (error) {
      console.error('Error submitting registration to API:', error);
      throw error;
    }
  }

  // Simulate successful registration
  console.log('Registration submitted (mock):', registration);
};

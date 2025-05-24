// Center information types
export interface CenterInfo {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  history: string;
  mission: string;
  vision: string;
  slogan: string;
  workingHours: WorkingHours;
}

export interface WorkingHours {
  weekdays: string;
  weekend: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  link?: string;
}

// Team types
export interface Tutor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  imageUrl: string;
}

// Course types
export interface Course {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  schedule: string;
  price: number;
  discount?: number;
  discountEndDate?: string;
  imageUrl: string;
  featured: boolean;
  category: string;
}

// Schedule types
export interface Schedule {
  id: string;
  courseId: string;
  courseName: string;
  date: string;
  startTime: string;
  endTime: string;
  tutor: string;
  room: string;
  studentIds: string[];
}

// User types
export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  registrations?: Registration[];
  inquiries?: Inquiry[];
}

export interface Registration {
  id: string;
  userId: string;
  courseId: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'cancelled';
  paymentStatus: 'pending' | 'completed';
}

export interface Inquiry {
  id: string;
  userId: string;
  message: string;
  date: string;
  status: 'new' | 'in-progress' | 'resolved';
  response?: string;
}

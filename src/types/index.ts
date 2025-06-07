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
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Team types
export interface Tutor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  imageUrl: string;
}

// Class types
export interface Class {
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
  isActive?: boolean;
}

// Schedule types
export interface Schedule {
  id: string;
  classId: string;
  className: string;
  date: string;
  startTime: string;
  endTime: string;
  tutor: string;
  room: string;
  maxStudents?: number;
  studentPhones: string[];
  studentIds?: string[];
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
  classId: string;
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

export interface BlogPost {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  imageUrl: string;
  category: BlogCategory;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  readTime: number; // in minutes
  viewCount?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface BlogComment {
  id: string;
  postId: string;
  author: string;
  email: string;
  content: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  parentId?: string; // for replies
}

import { BlogPost, BlogCategory } from '../types'; // legacy type reference; categories retained

// NOTE: Static blog posts removed after Firestore migration. Only categories remain.
export const blogCategories: BlogCategory[] = [
  {
    id: '1',
    name: 'Toán THCS',
    slug: 'toan-thcs',
    description: 'Phương pháp học Toán lớp 6, 7, 8, 9',
    color: '#3B82F6',
  },
  {
    id: '2',
    name: 'Văn THCS',
    slug: 'van-thcs',
    description: 'Kỹ năng học Văn lớp 6, 7, 8, 9',
    color: '#10B981',
  },
  {
    id: '3',
    name: 'Ôn thi lớp 10',
    slug: 'on-thi-lop-10',
    description: 'Luyện thi vào lớp 10 Toán, Văn',
    color: '#F59E0B',
  },
  {
    id: '4',
    name: 'Tiền tiểu học',
    slug: 'tien-tieu-hoc',
    description: 'Chuẩn bị cho bé vào lớp 1',
    color: '#EF4444',
  },
  {
    id: '5',
    name: 'Kỹ năng học tập',
    slug: 'ky-nang-hoc-tap',
    description: 'Phương pháp và mẹo học hiệu quả',
    color: '#8B5CF6',
  },
  {
    id: '6',
    name: 'Làm bài kiểm tra',
    slug: 'lam-bai-kiem-tra',
    description: 'Kỹ thuật làm bài thi và kiểm tra',
    color: '#06B6D4',
  },
];

// Deprecated exports kept for backward compatibility (return empty arrays)
export const blogPosts: BlogPost[] = [];
export const getFeaturedPosts = (): BlogPost[] => [];
// Prefix parameters with underscore to indicate intentional unused for compat
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getPostsByCategory = (_: string): BlogPost[] => [];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getLatestPosts = (_limit: number = 6): BlogPost[] => [];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getPostById = (_id: string): BlogPost | undefined => undefined;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getRelatedPosts = (_postId: string, _limit: number = 3): BlogPost[] => [];

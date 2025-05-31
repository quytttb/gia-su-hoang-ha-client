import { Banner, CenterInfo, Course, Schedule, Tutor, User } from '../types';

// Center Information
export const centerInfo: CenterInfo = {
  id: '1',
  name: 'Trung tâm Gia Sư Hoàng Hà',
  description:
    'Trung tâm Gia Sư Hoàng Hà tự hào là nơi cung cấp dịch vụ gia sư chất lượng cao tại Thanh Hóa. Với đội ngũ giáo viên giỏi, nhiệt tình, chúng tôi cam kết mang đến những khóa học hiệu quả, giúp học sinh nâng cao kiến thức và kỹ năng.',
  address: '265 - ĐƯỜNG 06 - MẶT BẰNG 08, PHƯỜNG NAM NGẠN, THÀNH PHỐ THANH HOÁ, TỈNH THANH HOÁ',
  phone: '0385.510.892 - 0962.390.161',
  email: 'lienhe@giasuhoangha.com',
  history:
    'Trung tâm Gia Sư Hoàng Hà được thành lập vào năm 2015 với mục tiêu ban đầu là cung cấp các dịch vụ gia sư cho học sinh tiểu học và THCS. Trải qua 10 năm hoạt động, chúng tôi đã không ngừng phát triển và mở rộng các khóa học, từ mầm non đến luyện thi đại học, đáp ứng nhu cầu học tập đa dạng của học sinh Thanh Hóa.',
  mission:
    'Sứ mệnh của chúng tôi là cung cấp môi trường học tập chất lượng, hiệu quả, giúp học sinh phát triển toàn diện về kiến thức và kỹ năng sống.',
  vision:
    'Trở thành trung tâm gia sư hàng đầu tại Thanh Hóa, mang đến giải pháp giáo dục toàn diện cho học sinh các cấp.',
  workingHours: {
    weekdays: '7:30 - 20:00',
    weekend: '8:00 - 17:00',
  },
  slogan: 'DẪN LỐI TRI THỨC - VỮNG BƯỚC TƯƠNG LAI',
};

// Banners
export const banners: Banner[] = [
  {
    id: '1',
    imageUrl: '/banner1.jpg',
    title: 'Giảm 10% học phí',
    subtitle: 'Đăng ký trước ngày 30/05/2025 để nhận ưu đãi đặc biệt',
    link: '/courses',
    isActive: true,
    order: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    imageUrl: '/banner2.jpg',
    title: 'Lớp luyện thi đại học 2025',
    subtitle: 'Giáo viên giỏi, phương pháp hiệu quả',
    link: '/courses/luyen-thi-dai-hoc',
    isActive: true,
    order: 2,
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
  },
  {
    id: '3',
    imageUrl: '/banner3.jpg',
    title: 'Khóa học hè 2025',
    subtitle: 'Vừa học vừa chơi, phát triển toàn diện',
    link: '/courses',
    isActive: false,
    order: 3,
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-20T16:45:00Z',
  },
];

// Tutors
export const tutors: Tutor[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    specialty: 'Toán học',
    bio: 'Thạc sĩ Toán học, 10 năm kinh nghiệm giảng dạy, chuyên luyện thi THPT Quốc Gia.',
    imageUrl: '/tutor1.jpg',
  },
  {
    id: '2',
    name: 'Trần Thị B',
    specialty: 'Ngữ văn',
    bio: 'Cử nhân Văn học Việt Nam, 8 năm kinh nghiệm giảng dạy văn học các cấp.',
    imageUrl: '/tutor2.jpg',
  },
  {
    id: '3',
    name: 'Lê Văn C',
    specialty: 'Tiếng Anh',
    bio: 'Thạc sĩ Ngôn ngữ Anh, chứng chỉ IELTS 8.0, 5 năm kinh nghiệm giảng dạy.',
    imageUrl: '/tutor3.jpg',
  },
  {
    id: '4',
    name: 'Phạm Thị D',
    specialty: 'Vật lý',
    bio: 'Thạc sĩ Vật lý, đạt giải nhất giáo viên dạy giỏi cấp tỉnh năm 2022.',
    imageUrl: '/tutor4.jpg',
  },
  {
    id: '5',
    name: 'Hoàng Văn E',
    specialty: 'Hóa học',
    bio: 'Tiến sĩ Hóa học, 12 năm kinh nghiệm giảng dạy, tác giả nhiều sách tham khảo.',
    imageUrl: '/tutor5.jpg',
  },
];

// Courses
export const courses: Course[] = [
  {
    id: '1',
    name: 'Luyện thi Toán THPT Quốc Gia',
    description:
      'Khóa học cung cấp kiến thức toàn diện và kỹ năng làm bài thi Toán THPT Quốc Gia, giúp học sinh đạt điểm cao.',
    targetAudience: 'Học sinh lớp 12',
    schedule: 'Thứ 2, 4, 6 (18:00 - 20:00)',
    price: 2500000,
    discount: 10,
    discountEndDate: '2025-05-30',
    imageUrl: '/course1.jpg',
    featured: true,
    category: 'THPT',
  },
  {
    id: '2',
    name: 'Tiếng Anh giao tiếp',
    description:
      'Khóa học giúp học sinh phát triển kỹ năng giao tiếp tiếng Anh thông qua các hoạt động thực tế và tình huống hàng ngày.',
    targetAudience: 'Học sinh từ 10-15 tuổi',
    schedule: 'Thứ 3, 5, 7 (16:00 - 17:30)',
    price: 1800000,
    imageUrl: '/course2.jpg',
    featured: true,
    category: 'Ngoại ngữ',
  },
  {
    id: '3',
    name: 'Khóa học hè - Tiểu học',
    description:
      'Khóa học giúp học sinh ôn tập kiến thức, phát triển kỹ năng đọc, viết và làm toán trong thời gian hè.',
    targetAudience: 'Học sinh lớp 1-5',
    schedule: 'Thứ 2 đến thứ 6 (8:00 - 10:30)',
    price: 3500000,
    discount: 15,
    discountEndDate: '2025-05-30',
    imageUrl: '/course3.jpg',
    featured: false,
    category: 'Tiểu học',
  },
  {
    id: '4',
    name: 'Luyện thi vào lớp 10',
    description:
      'Khóa học tập trung vào ôn tập kiến thức và kỹ năng làm bài thi môn Toán, Văn, Tiếng Anh cho kỳ thi vào lớp 10.',
    targetAudience: 'Học sinh lớp 9',
    schedule: 'Thứ 2, 4, 6, 7 (18:00 - 20:30)',
    price: 4000000,
    imageUrl: '/course4.jpg',
    featured: true,
    category: 'THCS',
  },
  {
    id: '5',
    name: 'Hóa học THPT chuyên sâu',
    description:
      'Khóa học cung cấp kiến thức chuyên sâu về hóa học, giúp học sinh giỏi chuẩn bị cho các kỳ thi học sinh giỏi và đại học.',
    targetAudience: 'Học sinh lớp 10-12 khá giỏi',
    schedule: 'Thứ 3, 5, 7 (18:00 - 20:00)',
    price: 2800000,
    imageUrl: '/course5.jpg',
    featured: false,
    category: 'THPT',
  },
  {
    id: '6',
    name: 'Lập trình cho trẻ em',
    description:
      'Khóa học giúp trẻ làm quen với tư duy lập trình thông qua các trò chơi và bài tập tương tác thú vị.',
    targetAudience: 'Học sinh từ 8-15 tuổi',
    schedule: 'Thứ 7, Chủ nhật (9:00 - 11:00)',
    price: 3200000,
    discount: 10,
    discountEndDate: '2025-06-15',
    imageUrl: '/course6.jpg',
    featured: true,
    category: 'Kỹ năng',
  },
];

// Schedules
export const schedules: Schedule[] = [
  {
    id: '1',
    courseId: '1',
    courseName: 'Luyện thi Toán THPT Quốc Gia',
    date: '2025-05-20',
    startTime: '18:00',
    endTime: '20:00',
    tutor: 'Nguyễn Văn A',
    room: 'P201',
    studentIds: ['user1', 'user2', 'user3'],
  },
  {
    id: '2',
    courseId: '1',
    courseName: 'Luyện thi Toán THPT Quốc Gia',
    date: '2025-05-22',
    startTime: '18:00',
    endTime: '20:00',
    tutor: 'Nguyễn Văn A',
    room: 'P201',
    studentIds: ['user1', 'user2', 'user3'],
  },
  {
    id: '3',
    courseId: '2',
    courseName: 'Tiếng Anh giao tiếp',
    date: '2025-05-21',
    startTime: '16:00',
    endTime: '17:30',
    tutor: 'Lê Văn C',
    room: 'P103',
    studentIds: ['user4', 'user5'],
  },
  {
    id: '4',
    courseId: '3',
    courseName: 'Khóa học hè - Tiểu học',
    date: '2025-05-20',
    startTime: '8:00',
    endTime: '10:30',
    tutor: 'Trần Thị B',
    room: 'P102',
    studentIds: ['user6', 'user7', 'user8'],
  },
  {
    id: '5',
    courseId: '4',
    courseName: 'Luyện thi vào lớp 10',
    date: '2025-05-20',
    startTime: '18:00',
    endTime: '20:30',
    tutor: 'Phạm Thị D',
    room: 'P202',
    studentIds: ['user9', 'user10'],
  },
];

// Users
export const users: User[] = [
  {
    id: 'user1',
    name: 'Nguyễn Thị Hương',
    phone: '0912345678',
    email: 'huong@example.com',
    registrations: [
      {
        id: 'reg1',
        userId: 'user1',
        courseId: '1',
        registrationDate: '2025-05-10',
        status: 'approved',
        paymentStatus: 'completed',
      },
    ],
  },
  {
    id: 'user2',
    name: 'Trần Văn Minh',
    phone: '0923456789',
    email: 'minh@example.com',
    registrations: [
      {
        id: 'reg2',
        userId: 'user2',
        courseId: '1',
        registrationDate: '2025-05-12',
        status: 'approved',
        paymentStatus: 'completed',
      },
    ],
  },
  {
    id: 'user3',
    name: 'Lê Thị Lan',
    phone: '0934567890',
    email: 'lan@example.com',
    registrations: [
      {
        id: 'reg3',
        userId: 'user3',
        courseId: '1',
        registrationDate: '2025-05-08',
        status: 'approved',
        paymentStatus: 'completed',
      },
    ],
    inquiries: [
      {
        id: 'inq1',
        userId: 'user3',
        message: 'Tôi muốn biết thêm về khóa học Tiếng Anh giao tiếp.',
        date: '2025-05-15',
        status: 'resolved',
        response: 'Chúng tôi đã gửi thông tin chi tiết về khóa học qua email của bạn.',
      },
    ],
  },
];

// Export collections for easy access
export const mockData = {
  centerInfo,
  banners,
  tutors,
  courses,
  schedules,
  users,
};

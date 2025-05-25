import { useState, useEffect, FormEvent } from 'react';
import { Tab } from '@headlessui/react';
import Layout from '../components/layout/Layout';
import { Course, Inquiry, Registration, Schedule } from '../types';
import { getAllCourses, getAllSchedules } from '../services/dataService';
import { formatCurrency, formatDate, generateId } from '../utils/helpers';
import { mockData } from '../services/mockData';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';

// Helper to get the color based on status
const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
    case 'completed':
    case 'resolved':
      return 'bg-green-100 text-green-800';
    case 'pending':
    case 'new':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
    case 'in-progress':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const AdminPage = () => {
  // Main state
  const [selectedTab, setSelectedTab] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Course form state
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseFormData, setCourseFormData] = useState<Partial<Course>>({
    name: '',
    description: '',
    targetAudience: '',
    schedule: '',
    price: 0,
    discount: 0,
    imageUrl: '/course-placeholder.jpg',
    featured: false,
    category: '',
  });

  // Schedule form state
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [scheduleFormData, setScheduleFormData] = useState<Partial<Schedule>>({
    courseId: '',
    date: '',
    startTime: '',
    endTime: '',
    tutor: '',
    room: '',
    studentIds: [],
  });

  // Inquiry response state
  const [respondingToInquiry, setRespondingToInquiry] = useState<string | null>(null);
  const [inquiryResponse, setInquiryResponse] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch courses and schedules
        const [coursesData, schedulesData] = await Promise.all([
          getAllCourses(),
          getAllSchedules(),
        ]);

        setCourses(coursesData);
        setSchedules(schedulesData);

        // Get registrations and inquiries from mock data
        // In a real app, these would come from API calls
        const allRegistrations: Registration[] = [];
        const allInquiries: Inquiry[] = [];

        mockData.users.forEach(user => {
          if (user.registrations) {
            allRegistrations.push(...user.registrations);
          }
          if (user.inquiries) {
            allInquiries.push(...user.inquiries);
          }
        });

        setRegistrations(allRegistrations);
        setInquiries(allInquiries);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Course form handlers
  const handleCourseFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setCourseFormData({
        ...courseFormData,
        [name]: checkbox.checked,
      });
    } else if (type === 'number') {
      setCourseFormData({
        ...courseFormData,
        [name]: Number(value),
      });
    } else {
      setCourseFormData({
        ...courseFormData,
        [name]: value,
      });
    }
  };

  const handleAddCourse = () => {
    setEditingCourse(null);
    setCourseFormData({
      name: '',
      description: '',
      targetAudience: '',
      schedule: '',
      price: 0,
      discount: 0,
      imageUrl: '/course-placeholder.jpg',
      featured: false,
      category: '',
    });
    setShowCourseForm(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseFormData({ ...course });
    setShowCourseForm(true);
  };

  const handleDeleteCourse = (courseId: string) => {
    // Check if there are schedules for this course
    const hasSchedules = schedules.some(schedule => schedule.courseId === courseId);

    if (hasSchedules) {
      alert('Không thể xóa khóa học này vì đã có lịch học. Vui lòng xóa lịch học trước.');
      return;
    }

    // Check if there are registrations for this course
    const hasRegistrations = registrations.some(reg => reg.courseId === courseId);

    if (hasRegistrations) {
      alert(
        'Không thể xóa khóa học này vì đã có học viên đăng ký. Vui lòng hủy các đăng ký trước.'
      );
      return;
    }

    // Remove the course
    setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
  };

  const handleSubmitCourse = (e: FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!courseFormData.name || !courseFormData.description || !courseFormData.category) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    if (editingCourse) {
      // Update existing course
      setCourses(prevCourses =>
        prevCourses.map(course =>
          course.id === editingCourse.id ? ({ ...course, ...courseFormData } as Course) : course
        )
      );
    } else {
      // Add new course
      const newCourse: Course = {
        id: `course-${generateId()}`,
        name: courseFormData.name || '',
        description: courseFormData.description || '',
        targetAudience: courseFormData.targetAudience || '',
        schedule: courseFormData.schedule || '',
        price: courseFormData.price || 0,
        discount: courseFormData.discount,
        discountEndDate: courseFormData.discountEndDate,
        imageUrl: courseFormData.imageUrl || '/course-placeholder.jpg',
        featured: courseFormData.featured || false,
        category: courseFormData.category || '',
      };

      setCourses(prevCourses => [...prevCourses, newCourse]);
    }

    setShowCourseForm(false);
  };

  // Handler for marking inquiry as resolved
  const handleResolveInquiry = (inquiryId: string) => {
    setInquiries(prev =>
      prev.map(inquiry =>
        inquiry.id === inquiryId
          ? { ...inquiry, status: 'resolved', response: 'Đã phản hồi qua email/điện thoại.' }
          : inquiry
      )
    );
  };

  // Handler for marking inquiry as in-progress
  const handleInProgressInquiry = (inquiryId: string) => {
    setInquiries(prev =>
      prev.map(inquiry =>
        inquiry.id === inquiryId ? { ...inquiry, status: 'in-progress' } : inquiry
      )
    );
  };

  // Handler for approving registration
  const handleApproveRegistration = (registrationId: string) => {
    setRegistrations(prev =>
      prev.map(registration =>
        registration.id === registrationId ? { ...registration, status: 'approved' } : registration
      )
    );
  };

  // Handler for cancelling registration
  const handleCancelRegistration = (registrationId: string) => {
    setRegistrations(prev =>
      prev.map(registration =>
        registration.id === registrationId ? { ...registration, status: 'cancelled' } : registration
      )
    );
  };

  // Helper to find course by ID
  const findCourseById = (id: string) => {
    return courses.find(course => course.id === id);
  };

  // Helper to find user by ID
  const findUserById = (id: string) => {
    return mockData.users.find(user => user.id === id);
  };

  // Schedule form handlers
  const handleScheduleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'courseId') {
      const selectedCourse = courses.find(course => course.id === value);
      setScheduleFormData({
        ...scheduleFormData,
        courseId: value,
        courseName: selectedCourse ? selectedCourse.name : '',
      });
    } else {
      setScheduleFormData({
        ...scheduleFormData,
        [name]: value,
      });
    }
  };

  const handleAddSchedule = () => {
    setEditingSchedule(null);
    setScheduleFormData({
      courseId: '',
      date: '',
      startTime: '',
      endTime: '',
      tutor: '',
      room: '',
      studentIds: [],
    });
    setShowScheduleForm(true);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setScheduleFormData({ ...schedule });
    setShowScheduleForm(true);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    // Check if there are students registered for this schedule
    const schedule = schedules.find(s => s.id === scheduleId);

    if (schedule && schedule.studentIds.length > 0) {
      alert('Không thể xóa lịch học này vì đã có học viên đăng ký. Vui lòng xóa học viên trước.');
      return;
    }

    // Remove the schedule
    setSchedules(prevSchedules => prevSchedules.filter(s => s.id !== scheduleId));
  };

  const handleSubmitSchedule = (e: FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !scheduleFormData.courseId ||
      !scheduleFormData.date ||
      !scheduleFormData.startTime ||
      !scheduleFormData.endTime
    ) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    const selectedCourse = courses.find(course => course.id === scheduleFormData.courseId);
    const courseName = selectedCourse ? selectedCourse.name : '';

    if (editingSchedule) {
      // Update existing schedule
      setSchedules(prevSchedules =>
        prevSchedules.map(schedule =>
          schedule.id === editingSchedule.id
            ? ({
              ...schedule,
              ...scheduleFormData,
              courseName,
            } as Schedule)
            : schedule
        )
      );
    } else {
      // Add new schedule
      const newSchedule: Schedule = {
        id: `schedule-${generateId()}`,
        courseId: scheduleFormData.courseId || '',
        courseName: courseName,
        date: scheduleFormData.date || '',
        startTime: scheduleFormData.startTime || '',
        endTime: scheduleFormData.endTime || '',
        tutor: scheduleFormData.tutor || '',
        room: scheduleFormData.room || '',
        studentIds: [],
      };

      setSchedules(prevSchedules => [...prevSchedules, newSchedule]);
    }

    setShowScheduleForm(false);
  };

  // Inquiry response handlers
  const handleInquiryResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInquiryResponse(e.target.value);
  };

  const handleRespondToInquiry = (inquiryId: string) => {
    setRespondingToInquiry(inquiryId);

    // Find the current response if any
    const inquiry = inquiries.find(inq => inq.id === inquiryId);
    if (inquiry && inquiry.response) {
      setInquiryResponse(inquiry.response);
    } else {
      setInquiryResponse('');
    }
  };

  const handleSubmitResponse = (inquiryId: string) => {
    if (!inquiryResponse.trim()) {
      alert('Vui lòng nhập nội dung phản hồi.');
      return;
    }

    setInquiries(prev =>
      prev.map(inquiry =>
        inquiry.id === inquiryId
          ? {
            ...inquiry,
            status: 'resolved',
            response: inquiryResponse,
          }
          : inquiry
      )
    );

    setRespondingToInquiry(null);
    setInquiryResponse('');
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Admin Dashboard Header */}
      <section className="bg-gray-100 py-8">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý Nhân viên</h1>
          <p className="text-gray-600">
            Quản lý khóa học, lịch học, đăng ký và phản hồi của học viên
          </p>
        </div>
      </section>

      {error && (
        <div className="container-custom py-4">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Admin Dashboard Tabs */}
      <section className="py-8">
        <div className="container-custom">
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-50 p-1 mb-8">
              <Tab
                className={({ selected }: { selected: boolean }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                  ${selected ? 'bg-primary text-white shadow' : 'text-gray-700 hover:bg-blue-100'}
                  `
                }
              >
                Khóa học
              </Tab>
              <Tab
                className={({ selected }: { selected: boolean }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                  ${selected ? 'bg-primary text-white shadow' : 'text-gray-700 hover:bg-blue-100'}
                  `
                }
              >
                Lịch học
              </Tab>
              <Tab
                className={({ selected }: { selected: boolean }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                  ${selected ? 'bg-primary text-white shadow' : 'text-gray-700 hover:bg-blue-100'}
                  `
                }
              >
                Đăng ký
              </Tab>
              <Tab
                className={({ selected }: { selected: boolean }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                  ${selected ? 'bg-primary text-white shadow' : 'text-gray-700 hover:bg-blue-100'}
                  `
                }
              >
                Tin nhắn
              </Tab>
              <Tab
                className={({ selected }: { selected: boolean }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                  ${selected ? 'bg-primary text-white shadow' : 'text-gray-700 hover:bg-blue-100'}
                  `
                }
              >
                Analytics
              </Tab>
            </Tab.List>

            <Tab.Panels>
              {/* Courses Panel */}
              <Tab.Panel>
                {showCourseForm ? (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {editingCourse ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
                      </h2>
                      <button
                        onClick={() => setShowCourseForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ← Quay lại
                      </button>
                    </div>

                    <form onSubmit={handleSubmitCourse}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                              Tên khóa học <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={courseFormData.name || ''}
                              onChange={handleCourseFormChange}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              required
                            />
                          </div>

                          <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                              Danh mục <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="category"
                              value={courseFormData.category || ''}
                              onChange={handleCourseFormChange}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              required
                            >
                              <option value="">-- Chọn danh mục --</option>
                              <option value="THPT">THPT</option>
                              <option value="THCS">THCS</option>
                              <option value="Tiểu học">Tiểu học</option>
                              <option value="Ngoại ngữ">Ngoại ngữ</option>
                              <option value="Kỹ năng">Kỹ năng</option>
                            </select>
                          </div>

                          <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                              Đối tượng học
                            </label>
                            <input
                              type="text"
                              name="targetAudience"
                              value={courseFormData.targetAudience || ''}
                              onChange={handleCourseFormChange}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>

                          <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Lịch học</label>
                            <input
                              type="text"
                              name="schedule"
                              value={courseFormData.schedule || ''}
                              onChange={handleCourseFormChange}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>

                          <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                              Giá (VND)
                            </label>
                            <input
                              type="number"
                              name="price"
                              value={courseFormData.price || 0}
                              onChange={handleCourseFormChange}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              min="0"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                              Mô tả <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              name="description"
                              value={courseFormData.description || ''}
                              onChange={handleCourseFormChange}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              rows={5}
                              required
                            ></textarea>
                          </div>

                          <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                              Giảm giá (%)
                            </label>
                            <input
                              type="number"
                              name="discount"
                              value={courseFormData.discount || 0}
                              onChange={handleCourseFormChange}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              min="0"
                              max="100"
                            />
                          </div>

                          <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                              Ngày kết thúc giảm giá
                            </label>
                            <input
                              type="date"
                              name="discountEndDate"
                              value={courseFormData.discountEndDate || ''}
                              onChange={handleCourseFormChange}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>

                          <div className="mb-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                name="featured"
                                checked={courseFormData.featured || false}
                                onChange={handleCourseFormChange}
                                className="mr-2"
                              />
                              <span className="text-gray-700">Hiển thị nổi bật</span>
                            </label>
                          </div>

                          <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                              URL Hình ảnh
                            </label>
                            <input
                              type="text"
                              name="imageUrl"
                              value={courseFormData.imageUrl || ''}
                              onChange={handleCourseFormChange}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Nhập đường dẫn đến hình ảnh (ví dụ: /course1.jpg)
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4 mt-6">
                        <button
                          type="button"
                          onClick={() => setShowCourseForm(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Hủy
                        </button>
                        <button type="submit" className="btn-primary">
                          {editingCourse ? 'Cập nhật' : 'Thêm khóa học'}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-800">Danh sách khóa học</h2>
                      <button className="btn-primary" onClick={handleAddCourse}>
                        Thêm khóa học mới
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                              Tên khóa học
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                              Danh mục
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                              Đối tượng
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                              Học phí
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                              Trạng thái
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {courses.map(course => (
                            <tr key={course.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                {course.name}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">{course.category}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {course.targetAudience}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {formatCurrency(course.price)}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${course.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                                >
                                  {course.featured ? 'Nổi bật' : 'Thường'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-right">
                                <button
                                  className="text-blue-600 hover:text-blue-800 mr-3"
                                  onClick={() => handleEditCourse(course)}
                                >
                                  Sửa
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-800"
                                  onClick={() => handleDeleteCourse(course.id)}
                                >
                                  Xóa
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </Tab.Panel>

              {/* Schedules Panel */}
              <Tab.Panel>
                {showScheduleForm ? (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {editingSchedule ? 'Chỉnh sửa lịch học' : 'Thêm lịch học mới'}
                      </h2>
                      <button
                        onClick={() => setShowScheduleForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ← Quay lại
                      </button>
                    </div>

                    <form onSubmit={handleSubmitSchedule}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                              Khóa học <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="courseId"
                              value={scheduleFormData.courseId || ''}
                              onChange={handleScheduleFormChange}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              required
                            >
                              <option value="">-- Chọn khóa học --</option>
                              {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                  {course.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                              Ngày <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              name="date"
                              value={scheduleFormData.date || ''}
                              onChange={handleScheduleFormChange}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="mb-4">
                              <label className="block text-gray-700 font-medium mb-2">
                                Giờ bắt đầu <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="time"
                                name="startTime"
                                value={scheduleFormData.startTime || ''}
                                onChange={handleScheduleFormChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                              />
                            </div>

                            <div className="mb-4">
                              <label className="block text-gray-700 font-medium mb-2">
                                Giờ kết thúc <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="time"
                                name="endTime"
                                value={scheduleFormData.endTime || ''}
                                onChange={handleScheduleFormChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                              Giáo viên
                            </label>
                            <input
                              type="text"
                              name="tutor"
                              value={scheduleFormData.tutor || ''}
                              onChange={handleScheduleFormChange}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>

                          <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                              Phòng học
                            </label>
                            <input
                              type="text"
                              name="room"
                              value={scheduleFormData.room || ''}
                              onChange={handleScheduleFormChange}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4 mt-6">
                        <button
                          type="button"
                          onClick={() => setShowScheduleForm(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Hủy
                        </button>
                        <button type="submit" className="btn-primary">
                          {editingSchedule ? 'Cập nhật' : 'Thêm lịch học'}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-800">Lịch học</h2>
                      <button className="btn-primary" onClick={handleAddSchedule}>
                        Thêm lịch học mới
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                              Khóa học
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                              Ngày
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                              Thời gian
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                              Giáo viên
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                              Phòng
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                              Số học viên
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {schedules.map(schedule => (
                            <tr key={schedule.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                {schedule.courseName}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {formatDate(schedule.date)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {schedule.startTime} - {schedule.endTime}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">{schedule.tutor}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{schedule.room}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {schedule.studentIds.length}
                              </td>
                              <td className="px-4 py-3 text-sm text-right">
                                <button
                                  className="text-blue-600 hover:text-blue-800 mr-3"
                                  onClick={() => handleEditSchedule(schedule)}
                                >
                                  Sửa
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-800"
                                  onClick={() => handleDeleteSchedule(schedule.id)}
                                >
                                  Xóa
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </Tab.Panel>

              {/* Registrations Panel */}
              <Tab.Panel>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Đăng ký</h2>
                    <div className="flex space-x-2">
                      <select className="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="all">Tất cả trạng thái</option>
                        <option value="pending">Đang chờ xử lý</option>
                        <option value="approved">Đã xác nhận</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                      <button className="btn-primary">Xuất dữ liệu</button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Mã đăng ký
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Học viên
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Khóa học
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Ngày đăng ký
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Trạng thái
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Thanh toán
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {registrations.map(registration => {
                          const user = findUserById(registration.userId);
                          const course = findCourseById(registration.courseId);

                          return (
                            <tr key={registration.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                {registration.id}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {user ? (
                                  <div>
                                    <p>{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.phone}</p>
                                  </div>
                                ) : (
                                  'Không tìm thấy'
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {course ? course.name : 'Không tìm thấy'}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {formatDate(registration.registrationDate)}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${getStatusColor(registration.status)}`}
                                >
                                  {registration.status === 'approved'
                                    ? 'Đã xác nhận'
                                    : registration.status === 'pending'
                                      ? 'Đang chờ'
                                      : 'Đã hủy'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${getStatusColor(registration.paymentStatus)}`}
                                >
                                  {registration.paymentStatus === 'completed'
                                    ? 'Đã thanh toán'
                                    : 'Chưa thanh toán'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-right">
                                {registration.status === 'pending' && (
                                  <div className="flex justify-end space-x-2">
                                    <button
                                      className="text-green-600 hover:text-green-800"
                                      onClick={() => handleApproveRegistration(registration.id)}
                                    >
                                      Xác nhận
                                    </button>
                                    <button
                                      className="text-red-600 hover:text-red-800"
                                      onClick={() => handleCancelRegistration(registration.id)}
                                    >
                                      Hủy
                                    </button>
                                  </div>
                                )}
                                {registration.status !== 'pending' && (
                                  <button className="text-blue-600 hover:text-blue-800">
                                    Chi tiết
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Tab.Panel>

              {/* Inquiries Panel */}
              <Tab.Panel>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Tin nhắn / Yêu cầu</h2>
                    <select className="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="all">Tất cả trạng thái</option>
                      <option value="new">Mới</option>
                      <option value="in-progress">Đang xử lý</option>
                      <option value="resolved">Đã xử lý</option>
                    </select>
                  </div>

                  <div className="space-y-6">
                    {inquiries.map(inquiry => {
                      const user = findUserById(inquiry.userId);

                      return (
                        <div key={inquiry.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-medium text-gray-800">
                                {user ? user.name : 'Không tìm thấy'}
                              </h3>
                              <div className="flex space-x-4 text-sm text-gray-500 mt-1">
                                <p>{user?.phone}</p>
                                <p>{user?.email}</p>
                              </div>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${getStatusColor(inquiry.status)}`}
                            >
                              {inquiry.status === 'new'
                                ? 'Mới'
                                : inquiry.status === 'in-progress'
                                  ? 'Đang xử lý'
                                  : 'Đã xử lý'}
                            </span>
                          </div>

                          <div className="bg-gray-50 p-3 rounded mb-3">
                            <p className="text-gray-700 whitespace-pre-line">{inquiry.message}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              Gửi lúc: {formatDate(inquiry.date)}
                            </p>
                          </div>

                          {inquiry.response && respondingToInquiry !== inquiry.id && (
                            <div className="bg-blue-50 p-3 rounded mb-3">
                              <p className="text-sm font-medium text-gray-800 mb-1">Phản hồi:</p>
                              <p className="text-gray-700">{inquiry.response}</p>
                            </div>
                          )}

                          {respondingToInquiry === inquiry.id ? (
                            <div className="mt-4">
                              <label className="block text-gray-700 font-medium mb-2">
                                Nội dung phản hồi
                              </label>
                              <textarea
                                value={inquiryResponse}
                                onChange={handleInquiryResponseChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                rows={4}
                              ></textarea>
                              <div className="flex justify-end mt-3 space-x-2">
                                <button
                                  onClick={() => setRespondingToInquiry(null)}
                                  className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                                >
                                  Hủy
                                </button>
                                <button
                                  onClick={() => handleSubmitResponse(inquiry.id)}
                                  className="px-3 py-1 bg-primary text-white rounded hover:bg-blue-600"
                                >
                                  Gửi phản hồi
                                </button>
                              </div>
                            </div>
                          ) : (
                            inquiry.status !== 'resolved' && (
                              <div className="flex justify-end space-x-2">
                                {inquiry.status === 'new' && (
                                  <button
                                    className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                                    onClick={() => handleInProgressInquiry(inquiry.id)}
                                  >
                                    Đánh dấu đang xử lý
                                  </button>
                                )}
                                <button
                                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                                  onClick={() => handleRespondToInquiry(inquiry.id)}
                                >
                                  Trả lời
                                </button>
                                <button
                                  className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
                                  onClick={() => handleResolveInquiry(inquiry.id)}
                                >
                                  Đánh dấu đã xử lý
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      );
                    })}

                    {inquiries.length === 0 && (
                      <div className="text-center py-8 text-gray-500">Không có tin nhắn nào.</div>
                    )}
                  </div>
                </div>
              </Tab.Panel>

              {/* Analytics Panel */}
              <Tab.Panel>
                <AnalyticsDashboard />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </section>
    </Layout>
  );
};

export default AdminPage;

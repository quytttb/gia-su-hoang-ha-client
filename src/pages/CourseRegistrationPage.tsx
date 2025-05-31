import { useEffect, useState, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Course, Registration } from '../types';
import coursesService from '../services/firestore/coursesService';
import { sendRegistrationEmail, sendAutoReplyEmail, initEmailJS } from '../services/emailService';
import {
  calculateDiscountedPrice,
  formatCurrency,
  isDiscountValid,
  generateId,
} from '../utils/helpers';
import {
  validateAndSanitizeEmail,
  validateAndSanitizePhone,
  validateAndSanitizeName,
  defaultRateLimiter,
  getClientIdentifier,
} from '../utils/security';
import { convertFirestoreCourse } from '../utils/courseHelpers';
import Chatbot from '../components/shared/Chatbot';

const CourseRegistrationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const result = await coursesService.getById(id);
        if (result.data) {
          setCourse(convertFirestoreCourse(result.data));
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();

    // Initialize EmailJS
    initEmailJS();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate and sanitize name
    const nameValidation = validateAndSanitizeName(formData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error || 'Họ tên không hợp lệ';
    }

    // Validate and sanitize phone
    const phoneValidation = validateAndSanitizePhone(formData.phone);
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.error || 'Số điện thoại không hợp lệ';
    }

    // Validate and sanitize email
    const emailValidation = validateAndSanitizeEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error || 'Email không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Check rate limiting
    const clientId = getClientIdentifier();
    if (!defaultRateLimiter.isAllowed(clientId)) {
      const remaining = defaultRateLimiter.getRemainingRequests(clientId);
      alert(`Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau. Còn lại: ${remaining} yêu cầu.`);
      return;
    }

    if (!validateForm() || !id || !course) {
      return;
    }

    // Get sanitized data
    const nameValidation = validateAndSanitizeName(formData.name);
    const phoneValidation = validateAndSanitizePhone(formData.phone);
    const emailValidation = validateAndSanitizeEmail(formData.email);

    // Double-check all validations passed
    if (!nameValidation.isValid || !phoneValidation.isValid || !emailValidation.isValid) {
      return;
    }

    try {
      setSubmitting(true);

      // Send registration email
      const result = await sendRegistrationEmail(
        nameValidation.sanitized,
        emailValidation.sanitized,
        phoneValidation.sanitized,
        course.name,
        id
      );

      if (result.success) {
        // Send auto-reply to student
        await sendAutoReplyEmail(nameValidation.sanitized, emailValidation.sanitized, true);

        // Create registration object for display
        const registrationData: Registration = {
          id: generateId(),
          userId: generateId(), // Generate a user ID for this registration
          courseId: id,
          registrationDate: new Date().toLocaleDateString('vi-VN'),
          status: 'pending',
          paymentStatus: 'pending',
        };

        setRegistration(registrationData);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('Đã có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua WhatsApp.');
    } finally {
      setSubmitting(false);
    }
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

  if (!course) {
    return (
      <Layout>
        <div className="container-custom py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Không tìm thấy khóa học</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link to="/courses" className="btn-primary">
            Quay lại danh sách khóa học
          </Link>
        </div>
      </Layout>
    );
  }

  if (registration) {
    return (
      <Layout>
        <div className="container-custom py-16">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Đăng ký thành công!</h2>
              <p className="text-gray-600 dark:text-gray-400">Cảm ơn bạn đã đăng ký khóa học với Gia Sư Hoàng Hà.</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Thông tin đăng ký:</h3>
              <p className="text-gray-700 dark:text-gray-200 mb-1">
                <strong>Khóa học:</strong> {course.name}
              </p>
              <p className="text-gray-700 dark:text-gray-200 mb-1">
                <strong>Mã đăng ký:</strong> {registration.id}
              </p>
              <p className="text-gray-700 dark:text-gray-200 mb-1">
                <strong>Trạng thái:</strong> Chờ xác nhận
              </p>
              <p className="text-gray-700 dark:text-gray-200">
                <strong>Ngày đăng ký:</strong> {registration.registrationDate}
              </p>
            </div>

            <div className="text-center">
              <button onClick={() => navigate('/courses')} className="btn-primary w-full">
                Quay lại trang khóa học
              </button>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đăng ký.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const hasValidDiscount = course.discount && isDiscountValid(course.discountEndDate);
  const finalPrice = hasValidDiscount
    ? calculateDiscountedPrice(course.price, course.discount)
    : course.price;

  return (
    <Layout>
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">Đăng ký khóa học</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Thông tin học viên</h2>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400`}
                      placeholder="Nhập họ và tên"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400`}
                      placeholder="Nhập số điện thoại"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400`}
                      placeholder="Nhập địa chỉ email"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary w-full flex items-center justify-center mb-4"
                    >
                      {submitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Đang xử lý...
                        </>
                      ) : (
                        'Đăng ký ngay'
                      )}
                    </button>

                    {/* Facebook Alternative */}
                    <div className="text-center">
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Hoặc tư vấn qua:</p>
                      <button
                        type="button"
                        onClick={() =>
                          window.open(
                            'https://www.facebook.com/profile.php?id=61575087818708',
                            '_blank'
                          )
                        }
                        className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span>Tư vấn qua Facebook</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Thông tin khóa học</h3>

                <div className="mb-4">
                  <img
                    src={course.imageUrl}
                    alt={course.name}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>

                <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">{course.name}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {course.description.substring(0, 100)}...
                </p>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 dark:text-gray-200">Học phí:</span>
                    <span className="text-gray-700 dark:text-gray-200">{formatCurrency(course.price)}</span>
                  </div>

                  {hasValidDiscount && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 dark:text-gray-200">Giảm giá:</span>
                      <span className="text-green-600">-{course.discount}%</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-primary">
                      {formatCurrency(finalPrice)}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>* Học phí sẽ được thanh toán tại trung tâm sau khi đăng ký được xác nhận.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
    </Layout>
  );
};

export default CourseRegistrationPage;

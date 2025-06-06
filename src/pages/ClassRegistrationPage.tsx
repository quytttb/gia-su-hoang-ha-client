import { useEffect, useState, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Class, Registration, Schedule } from '../types';
import classesService from '../services/firestore/classesService';
import { convertFirestoreClass } from '../utils/classHelpers';
import { formatCurrency, hasValidDiscount } from '../utils/helpers';
import Chatbot from '../components/shared/Chatbot';
import {
  validateAndSanitizePhone,
  validateAndSanitizeName,
  defaultRateLimiter,
  getClientIdentifier,
} from '../utils/security';
import { sendRegistrationEmail, sendAutoReplyEmail, initEmailJS } from '../services/emailService';
import schedulesService from '../services/firestore/schedulesService';
import confetti from 'canvas-confetti';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';

const CourseRegistrationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Class | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [registration] = useState<Registration | null>(null);
  const [formData, setFormData] = useState({
    parentName: '',
    parentPhone: '',
    parentAddress: '',
    name: '',
    school: '',
    academicDescription: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const result = await classesService.getById(id);
        if (result.data) {
          setCourse(convertFirestoreClass(result.data));
        }
        // Lấy lịch học
        const schedulesData = await schedulesService.getByCourseId(id);
        setSchedules(schedulesData);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate parent info
    if (!formData.parentName.trim()) {
      newErrors.parentName = 'Vui lòng nhập họ tên phụ huynh';
    }
    if (!formData.parentPhone.trim()) {
      newErrors.parentPhone = 'Vui lòng nhập số điện thoại phụ huynh';
    } else {
      const parentPhoneValidation = validateAndSanitizePhone(formData.parentPhone);
      if (!parentPhoneValidation.isValid) {
        newErrors.parentPhone = parentPhoneValidation.error || 'Số điện thoại phụ huynh không hợp lệ';
      }
    }
    if (!formData.parentAddress.trim()) {
      newErrors.parentAddress = 'Vui lòng nhập địa chỉ phụ huynh';
    }

    // Validate and sanitize name
    const nameValidation = validateAndSanitizeName(formData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error || 'Họ tên không hợp lệ';
    }

    // Validate school
    if (!formData.school.trim()) {
      newErrors.school = 'Vui lòng nhập trường học';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !id || !course) {
      return;
    }

    // Hiện dialog xác nhận thay vì submit ngay
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    if (!id || !course) {
      return;
    }

    // Check rate limiting
    const clientId = getClientIdentifier();
    if (!defaultRateLimiter.isAllowed(clientId)) {
      const remaining = defaultRateLimiter.getRemainingRequests(clientId);
      alert(`Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau. Còn lại: ${remaining} yêu cầu.`);
      return;
    }

    // Get sanitized data
    const nameValidation = validateAndSanitizeName(formData.name);
    const parentPhoneValidation = validateAndSanitizePhone(formData.parentPhone);

    // Double-check all validations passed
    if (!nameValidation.isValid || !parentPhoneValidation.isValid) {
      return;
    }

    try {
      setSubmitting(true);
      setShowConfirmDialog(false);

      // Send registration email
      const result = await sendRegistrationEmail(
        nameValidation.sanitized,
        '',
        parentPhoneValidation.sanitized,
        course.name,
        id
      );

      if (result.success) {
        // Send auto-reply to student
        await sendAutoReplyEmail(nameValidation.sanitized, '', true);

        // Hiệu ứng pháo hoa
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        // Hiện dialog thành công
        setShowSuccessDialog(true);
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

  const triggerMoreConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 }
    });
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
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Không tìm thấy lớp học</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link to="/classes" className="btn-primary">
            Quay lại danh sách lớp học
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
              <p className="text-gray-600 dark:text-gray-400">Cảm ơn bạn đã đăng ký lớp học với Gia Sư Hoàng Hà.</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Thông tin đăng ký:</h3>
              <p className="text-gray-700 dark:text-gray-200 mb-1">
                <strong>Lớp học:</strong> {course.name}
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
              <button onClick={() => navigate('/classes')} className="btn-primary w-full">
                Quay lại trang lớp học
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

  const hasValidDiscountValue = hasValidDiscount(course.discount, course.discountEndDate);

  return (
    <Layout>
      <div className="container-custom py-16 pb-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">Đăng ký lớp học</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:h-[500px]">
            <div className="md:col-span-2 flex flex-col h-full">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md flex flex-col h-full">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Cột phụ huynh */}
                    <div>
                      <h2 className="text-lg font-semibold text-black dark:text-white mb-4">Thông tin Phụ Huynh</h2>
                      <div className="mb-5">
                        <label htmlFor="parentName" className="block text-black dark:text-white text-sm font-medium mb-2">Họ và tên phụ huynh <span className="text-red-500">*</span></label>
                        <input type="text" id="parentName" name="parentName" value={formData.parentName} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.parentName ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm`} placeholder="Nhập họ và tên phụ huynh" />
                        {errors.parentName && <p className="text-red-500 text-xs mt-2">{errors.parentName}</p>}
                      </div>
                      <div className="mb-5">
                        <label htmlFor="parentPhone" className="block text-black dark:text-white text-sm font-medium mb-2">Số điện thoại phụ huynh <span className="text-red-500">*</span></label>
                        <input type="tel" id="parentPhone" name="parentPhone" value={formData.parentPhone} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.parentPhone ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm`} placeholder="Nhập số điện thoại phụ huynh" />
                        {errors.parentPhone && <p className="text-red-500 text-xs mt-2">{errors.parentPhone}</p>}
                      </div>
                      <div className="mb-5">
                        <label htmlFor="parentAddress" className="block text-black dark:text-white text-sm font-medium mb-2">Địa chỉ phụ huynh <span className="text-red-500">*</span></label>
                        <input type="text" id="parentAddress" name="parentAddress" value={formData.parentAddress} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.parentAddress ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm`} placeholder="Nhập địa chỉ phụ huynh" />
                        {errors.parentAddress && <p className="text-red-500 text-xs mt-2">{errors.parentAddress}</p>}
                      </div>
                    </div>
                    {/* Cột học viên */}
                    <div>
                      <h2 className="text-lg font-semibold text-black dark:text-white mb-4">Thông tin Học Viên</h2>
                      <div className="mb-5">
                        <label htmlFor="name" className="block text-black dark:text-white text-sm font-medium mb-2">Họ và tên <span className="text-red-500">*</span></label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm`} placeholder="Nhập họ và tên" />
                        {errors.name && <p className="text-red-500 text-xs mt-2">{errors.name}</p>}
                      </div>
                      <div className="mb-5">
                        <label htmlFor="school" className="block text-black dark:text-white text-sm font-medium mb-2">Trường học <span className="text-red-500">*</span></label>
                        <input type="text" id="school" name="school" value={formData.school} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.school ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm`} placeholder="Nhập tên trường học" />
                        {errors.school && <p className="text-red-500 text-xs mt-2">{errors.school}</p>}
                      </div>
                      <div className="mb-5">
                        <label htmlFor="academicDescription" className="block text-black dark:text-white text-sm font-medium mb-2">Mô tả lực học <span className="text-gray-500 text-xs">(không bắt buộc)</span></label>
                        <textarea id="academicDescription" name="academicDescription" value={formData.academicDescription} onChange={handleChange} rows={3} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm resize-none`} placeholder="Mô tả ngắn gọn về lực học hiện tại của học viên (ví dụ: học khá, cần cải thiện toán, giỏi văn...)" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center mb-4 text-base py-3">
                      {submitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang xử lý...
                        </>
                      ) : (
                        'Đăng ký ngay'
                      )}
                    </button>
                    {/* Zalo Alternative */}
                    <div className="text-center">
                      <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">Hoặc tư vấn qua:</p>
                      <button type="button" onClick={() => window.open('https://zalo.me/0385510892', '_blank')} className="w-full inline-flex items-center justify-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm">
                        <img src="/assets/zalo-logo.svg" alt="Zalo" className="w-5 h-5" />
                        <span>Tư vấn qua Zalo</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="flex flex-col h-full">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col h-full">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Thông tin lớp học</h3>
                <div className="mb-4 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={course.imageUrl}
                    alt={course.name}
                    style={{ width: '100%', maxWidth: '1180px', height: 'auto', aspectRatio: '1180/800', objectFit: 'contain' }}
                    className="bg-white dark:bg-gray-800"
                  />
                </div>
                <h4 className="font-bold text-black dark:text-white mb-2">{course.name}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {course.description.substring(0, 100)}...
                </p>
                <div className="mt-2 mb-4">
                  <h5 className="font-semibold text-black dark:text-white mb-2">Lịch học</h5>
                  {schedules.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Chưa có lịch học.</p>
                  ) : (
                    <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
                      {schedules.map(sch => (
                        <li key={sch.id} className="border-b border-gray-100 dark:border-gray-700 pb-1 last:border-0">
                          <span className="font-medium">{sch.date}</span> - {sch.startTime}~{sch.endTime} | {sch.tutor} | Phòng: {sch.room}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-black dark:text-white">Học phí:</span>
                    <span className="font-semibold text-black dark:text-white">{formatCurrency(course.price)}</span>
                  </div>
                  {hasValidDiscountValue && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-black dark:text-white">Giảm giá:</span>
                      <span className="text-green-600">-{course.discount}%</span>
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                  <p>* Học phí sẽ được thanh toán tại trung tâm sau khi đăng ký được xác nhận.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
      {/* Dialog xác nhận đăng ký */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận đăng ký lớp học</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn đăng ký lớp học "{course?.name}" với thông tin đã nhập không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmSubmit} disabled={submitting}>
              {submitting ? 'Đang xử lý...' : 'Xác nhận đăng ký'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog thành công */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">🎉 Đăng ký thành công!</DialogTitle>
            <DialogDescription className="text-center">
              Cảm ơn bạn đã đăng ký lớp học với Gia Sư Hoàng Hà.<br />
              Nhân viên tư vấn sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận thông tin.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center space-x-2">
            <Button variant="outline" onClick={triggerMoreConfetti}>
              🎊 Pháo hoa
            </Button>
            <Button onClick={() => {
              setShowSuccessDialog(false);
              navigate('/classes');
            }}>
              Quay lại trang lớp học
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default CourseRegistrationPage;

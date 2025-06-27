import { useEffect, useState, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Class } from '../types';
import classesService from '../services/firestore/classesService';
import registrationsService from '../services/firestore/registrationsService';
import { convertFirestoreClass } from '../utils/classHelpers';
import { formatCurrency, hasValidDiscount } from '../utils/helpers';
import Chatbot from '../components/shared/Chatbot';
import DevFormHelper from '../components/dev/DevFormHelper';
import {
  validateAndSanitizePhone,
  validateAndSanitizeName,
  defaultRateLimiter,
  getClientIdentifier,
} from '../utils/security';
import { sendRegistrationEmail, sendAutoReplyEmail, initEmailJS } from '../services/emailService';
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
  const [formData, setFormData] = useState({
    parentName: '',
    parentPhone: '',
    parentAddress: '',
    name: '',
    school: '',
    academicDescription: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      const result = await classesService.getById(id);
      setCourse(result.data ? convertFirestoreClass(result.data) : undefined);
      setLoading(false);
    };
    fetchCourse();

    // Initialize EmailJS
    initEmailJS();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Dev helper functions
  const handleDevFillForm = (data: any) => {
    setFormData(data);
    setErrors({}); // Clear any existing errors
  };

  const handleDevClearForm = () => {
    setFormData({
      parentName: '',
      parentPhone: '',
      parentAddress: '',
      name: '',
      school: '',
      academicDescription: '',
    });
    setErrors({});
  };

  // Expose dev functions globally for DevAdminHelper
  useEffect(() => {
    // Only expose in development mode
    if (process.env.NODE_ENV === 'development') {
      (window as any).__devFormFill = handleDevFillForm;
      (window as any).__devFormClear = handleDevClearForm;
    }

    // Cleanup on unmount
    return () => {
      if (process.env.NODE_ENV === 'development') {
        delete (window as any).__devFormFill;
        delete (window as any).__devFormClear;
      }
    };
  }, []);

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
      alert('Không tìm thấy thông tin lớp học. Vui lòng tải lại trang hoặc chọn lại lớp!');
      return;
    }

    // Fallback an toàn cho tên và lịch lớp học
    const courseName = course.name || 'Chưa xác định';
    const courseSchedule = course.schedule || 'Linh hoạt';

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

      const registrationData = {
        // Registration type
        type: 'class' as const,
        classId: id,
        className: courseName,
        classSchedule: courseSchedule,
        studentName: nameValidation.sanitized,
        studentPhone: formData.parentPhone, // Using parent phone for now
        studentSchool: formData.school, // Trường học của học viên
        parentName: formData.parentName,
        parentPhone: parentPhoneValidation.sanitized,
        parentAddress: formData.parentAddress, // Địa chỉ phụ huynh
        preferredSchedule: courseSchedule, // Sử dụng lịch với fallback
        notes: formData.academicDescription || undefined, // Mô tả lực học
        status: 'pending' as const,
      };

      // Debug: log registration data
      console.log('🔍 Registration data:', registrationData);

      const registrationResult = await registrationsService.createRegistration(registrationData);

      if (registrationResult.error) {
        alert(registrationResult.error);
        return;
      }

      // Send registration email
      const emailResult = await sendRegistrationEmail(
        nameValidation.sanitized,
        '',
        parentPhoneValidation.sanitized,
        courseName,
        id,
        courseSchedule
      );

      if (emailResult.success) {
        // Send auto-reply to student
        await sendAutoReplyEmail(nameValidation.sanitized, '', true);
      }

      // Show success regardless of email status
      // Hiệu ứng pháo hoa
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Hiện dialog thành công
      setShowSuccessDialog(true);

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
                        <img src="/images/zalo-logo.svg" alt="Zalo" className="w-5 h-5" />
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
                  <h5 className="font-semibold text-black dark:text-white mb-2">Thông tin lớp học</h5>
                  <div className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
                    <div className="border-b border-gray-100 dark:border-gray-700 pb-1">
                      <span className="font-medium">Lịch học:</span> thứ 2 đến 4
                    </div>
                    <div className="border-b border-gray-100 dark:border-gray-700 pb-1">
                      <span className="font-medium">Giờ học:</span> 19:30 đến 21:30
                    </div>
                    <div className="pb-1">
                      <span className="font-medium">Số lượng:</span> 12
                    </div>
                  </div>
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

      {/* Dev Form Helper - Only shows in development */}
      <DevFormHelper
        onFillForm={handleDevFillForm}
        onClearForm={handleDevClearForm}
      />
    </Layout>
  );
};

export default CourseRegistrationPage;

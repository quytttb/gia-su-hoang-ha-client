import { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Chatbot from '../components/shared/Chatbot';
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

const TutorRegistrationPage = () => {
     const navigate = useNavigate();
     const [searchParams] = useSearchParams();
     const tutorType = searchParams.get('type') as 'teacher' | 'student' | null;

     const [submitting, setSubmitting] = useState(false);
     const [formData, setFormData] = useState({
          parentName: '',
          parentPhone: '',
          parentAddress: '',
          name: '',
          school: '',
          academicDescription: '',
          tutorCriteria: '', // Thêm trường mô tả tiêu chí tìm Gia sư
     });
     const [errors, setErrors] = useState<Record<string, string>>({});
     const [showConfirmDialog, setShowConfirmDialog] = useState(false);
     const [showSuccessDialog, setShowSuccessDialog] = useState(false);

     useEffect(() => {
          // Initialize EmailJS
          initEmailJS();
     }, []);

     // Thông tin Gia sư
     const tutorInfo = {
          teacher: {
               name: 'Gia sư Giáo viên',
               price: '250,000đ/buổi',
               description: 'Giáo viên có kinh nghiệm, chuyên môn sâu rộng',
               color: 'blue'
          },
          student: {
               name: 'Gia sư Sinh viên',
               price: '160,000đ/buổi',
               description: 'Sinh viên xuất sắc, gần gũi, dễ tiếp cận',
               color: 'green'
          }
     };

     const currentTutorInfo = tutorType ? tutorInfo[tutorType] : null;

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

          // Validate student info
          const nameValidation = validateAndSanitizeName(formData.name);
          if (!nameValidation.isValid) {
               newErrors.name = nameValidation.error || 'Họ tên không hợp lệ';
          }

          if (!formData.school.trim()) {
               newErrors.school = 'Vui lòng nhập trường học';
          }

          if (!formData.tutorCriteria.trim()) {
               newErrors.tutorCriteria = 'Vui lòng mô tả tiêu chí tìm Gia sư';
          }

          setErrors(newErrors);
          return Object.keys(newErrors).length === 0;
     };

     const handleSubmit = async (e: FormEvent) => {
          e.preventDefault();

          if (!validateForm() || !currentTutorInfo) {
               return;
          }

          // Hiện dialog xác nhận thay vì submit ngay
          setShowConfirmDialog(true);
     };

     const handleConfirmSubmit = async () => {
          if (!currentTutorInfo) {
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

               // Send registration email for tutor search
               const result = await sendRegistrationEmail(
                    nameValidation.sanitized,
                    '',
                    parentPhoneValidation.sanitized,
                    `Tìm ${currentTutorInfo.name}`,
                    'tutor-search'
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
               console.error('Error submitting tutor search request:', error);
               alert('Đã có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua Zalo.');
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

     if (!tutorType || !currentTutorInfo) {
          return (
               <Layout>
                    <div className="container-custom py-20 text-center">
                         <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Loại Gia sư không hợp lệ</h2>
                         <p className="text-gray-600 dark:text-gray-400 mb-8">
                              Vui lòng chọn loại Gia sư từ trang tìm Gia sư.
                         </p>
                         <Link to="/tutor-search" className="btn-primary">
                              Quay lại trang tìm Gia sư
                         </Link>
                    </div>
               </Layout>
          );
     }

     return (
          <Layout>
               <div className="container-custom py-16 pb-40 min-h-screen">
                    <div className="max-w-6xl mx-auto">
                         <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center">
                              Đăng ký tìm Gia sư
                         </h1>

                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                              <div className="lg:col-span-2">
                                   <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                  {/* Cột phụ huynh */}
                                                  <div className="space-y-4">
                                                       <h2 className="text-lg font-semibold text-black dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                                                            Thông tin Phụ Huynh
                                                       </h2>
                                                       <div>
                                                            <label htmlFor="parentName" className="block text-black dark:text-white text-sm font-medium mb-2">
                                                                 Họ và tên phụ huynh <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                 type="text"
                                                                 id="parentName"
                                                                 name="parentName"
                                                                 value={formData.parentName}
                                                                 onChange={handleChange}
                                                                 className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.parentName ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm transition-all duration-200`}
                                                                 placeholder="Nhập họ và tên phụ huynh"
                                                            />
                                                            {errors.parentName && <p className="text-red-500 text-xs mt-1">{errors.parentName}</p>}
                                                       </div>
                                                       <div>
                                                            <label htmlFor="parentPhone" className="block text-black dark:text-white text-sm font-medium mb-2">
                                                                 Số điện thoại phụ huynh <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                 type="tel"
                                                                 id="parentPhone"
                                                                 name="parentPhone"
                                                                 value={formData.parentPhone}
                                                                 onChange={handleChange}
                                                                 className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.parentPhone ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm transition-all duration-200`}
                                                                 placeholder="Nhập số điện thoại phụ huynh"
                                                            />
                                                            {errors.parentPhone && <p className="text-red-500 text-xs mt-1">{errors.parentPhone}</p>}
                                                       </div>
                                                       <div>
                                                            <label htmlFor="parentAddress" className="block text-black dark:text-white text-sm font-medium mb-2">
                                                                 Địa chỉ phụ huynh <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                 type="text"
                                                                 id="parentAddress"
                                                                 name="parentAddress"
                                                                 value={formData.parentAddress}
                                                                 onChange={handleChange}
                                                                 className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.parentAddress ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm transition-all duration-200`}
                                                                 placeholder="Nhập địa chỉ phụ huynh"
                                                            />
                                                            {errors.parentAddress && <p className="text-red-500 text-xs mt-1">{errors.parentAddress}</p>}
                                                       </div>
                                                  </div>

                                                  {/* Cột học viên */}
                                                  <div className="space-y-4">
                                                       <h2 className="text-lg font-semibold text-black dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                                                            Thông tin Học Viên
                                                       </h2>
                                                       <div>
                                                            <label htmlFor="name" className="block text-black dark:text-white text-sm font-medium mb-2">
                                                                 Họ và tên <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                 type="text"
                                                                 id="name"
                                                                 name="name"
                                                                 value={formData.name}
                                                                 onChange={handleChange}
                                                                 className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm transition-all duration-200`}
                                                                 placeholder="Nhập họ và tên"
                                                            />
                                                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                                       </div>
                                                       <div>
                                                            <label htmlFor="school" className="block text-black dark:text-white text-sm font-medium mb-2">
                                                                 Trường học <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                 type="text"
                                                                 id="school"
                                                                 name="school"
                                                                 value={formData.school}
                                                                 onChange={handleChange}
                                                                 className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.school ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm transition-all duration-200`}
                                                                 placeholder="Nhập tên trường học"
                                                            />
                                                            {errors.school && <p className="text-red-500 text-xs mt-1">{errors.school}</p>}
                                                       </div>
                                                       <div>
                                                            <label htmlFor="academicDescription" className="block text-black dark:text-white text-sm font-medium mb-2">
                                                                 Mô tả lực học <span className="text-gray-500 text-xs">(không bắt buộc)</span>
                                                            </label>
                                                            <textarea
                                                                 id="academicDescription"
                                                                 name="academicDescription"
                                                                 value={formData.academicDescription}
                                                                 onChange={handleChange}
                                                                 rows={3}
                                                                 className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm resize-none transition-all duration-200`}
                                                                 placeholder="Mô tả ngắn gọn về lực học hiện tại"
                                                            />
                                                       </div>
                                                  </div>
                                             </div>

                                             {/* Tiêu chí tìm Gia sư - full width */}
                                             <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                                  <label htmlFor="tutorCriteria" className="block text-black dark:text-white text-sm font-medium mb-2">
                                                       Mô tả tiêu chí tìm Gia sư <span className="text-red-500">*</span>
                                                  </label>
                                                  <textarea
                                                       id="tutorCriteria"
                                                       name="tutorCriteria"
                                                       value={formData.tutorCriteria}
                                                       onChange={handleChange}
                                                       rows={4}
                                                       className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.tutorCriteria ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm resize-none transition-all duration-200`}
                                                       placeholder="Mô tả chi tiết về yêu cầu Gia sư (ví dụ: kinh nghiệm, chuyên môn, phương pháp dạy, thời gian học, địa điểm...)"
                                                  />
                                                  {errors.tutorCriteria && <p className="text-red-500 text-xs mt-1">{errors.tutorCriteria}</p>}
                                             </div>

                                             <div className="pt-6">
                                                  <button
                                                       type="submit"
                                                       disabled={submitting}
                                                       className="btn-primary w-full flex items-center justify-center mb-4 text-base py-3 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                                                  >
                                                       {submitting ? (
                                                            <>
                                                                 <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                 </svg>
                                                                 Đang xử lý...
                                                            </>
                                                       ) : (
                                                            'Gửi yêu cầu tìm Gia sư'
                                                       )}
                                                  </button>

                                                  {/* Zalo Alternative */}
                                                  <div className="text-center">
                                                       <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">Hoặc tư vấn qua:</p>
                                                       <button
                                                            type="button"
                                                            onClick={() => window.open('https://zalo.me/0385510892', '_blank')}
                                                            className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                                                       >
                                                            <img src="/assets/zalo-logo.svg" alt="Zalo" className="w-5 h-5" />
                                                            <span>Tư vấn qua Zalo</span>
                                                       </button>
                                                  </div>
                                             </div>
                                        </form>
                                   </div>
                              </div>

                              {/* Sidebar thông tin Gia sư */}
                              <div className="lg:col-span-1">
                                   <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-4">
                                        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Thông tin Gia sư</h3>

                                        <div className={`mb-6 p-4 rounded-lg bg-${currentTutorInfo.color}-50 dark:bg-${currentTutorInfo.color}-900/20 border border-${currentTutorInfo.color}-200 dark:border-${currentTutorInfo.color}-800`}>
                                             <h4 className={`font-bold text-${currentTutorInfo.color}-600 dark:text-${currentTutorInfo.color}-400 mb-2`}>
                                                  {currentTutorInfo.name}
                                             </h4>
                                             <p className="text-black dark:text-white text-sm mb-3">{currentTutorInfo.description}</p>
                                             <div className={`text-2xl font-bold text-${currentTutorInfo.color}-600 dark:text-${currentTutorInfo.color}-400`}>
                                                  {currentTutorInfo.price}
                                             </div>
                                        </div>

                                        <div className="space-y-4">
                                             <div>
                                                  <h5 className="font-semibold text-black dark:text-white mb-3">Quy trình</h5>
                                                  <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-2">
                                                       <li className="flex items-start">
                                                            <span className="text-blue-500 mr-2 font-medium">1.</span>
                                                            <span>Tiếp nhận yêu cầu</span>
                                                       </li>
                                                       <li className="flex items-start">
                                                            <span className="text-blue-500 mr-2 font-medium">2.</span>
                                                            <span>Tư vấn chi tiết</span>
                                                       </li>
                                                       <li className="flex items-start">
                                                            <span className="text-blue-500 mr-2 font-medium">3.</span>
                                                            <span>Tìm Gia sư phù hợp</span>
                                                       </li>
                                                       <li className="flex items-start">
                                                            <span className="text-blue-500 mr-2 font-medium">4.</span>
                                                            <span>Dạy thử miễn phí</span>
                                                       </li>
                                                       <li className="flex items-start">
                                                            <span className="text-blue-500 mr-2 font-medium">5.</span>
                                                            <span>Bắt đầu học chính thức</span>
                                                       </li>
                                                  </ul>
                                             </div>
                                        </div>

                                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                             <p className="mb-1">✓ Dạy thử miễn phí 1 buổi đầu tiên</p>
                                             <p>✓ Đổi Gia sư miễn phí nếu không phù hợp</p>
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
                              <DialogTitle>Xác nhận yêu cầu tìm Gia sư</DialogTitle>
                              <DialogDescription>
                                   Bạn có chắc chắn muốn gửi yêu cầu tìm "{currentTutorInfo.name}" với thông tin đã nhập không?
                              </DialogDescription>
                         </DialogHeader>
                         <DialogFooter>
                              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                                   Hủy
                              </Button>
                              <Button onClick={handleConfirmSubmit} disabled={submitting}>
                                   {submitting ? 'Đang xử lý...' : 'Xác nhận gửi yêu cầu'}
                              </Button>
                         </DialogFooter>
                    </DialogContent>
               </Dialog>

               {/* Dialog thành công */}
               <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                    <DialogContent>
                         <DialogHeader>
                              <DialogTitle className="text-center text-green-600">🎉 Gửi yêu cầu thành công!</DialogTitle>
                              <DialogDescription className="text-center">
                                   Cảm ơn bạn đã sử dụng dịch vụ tìm Gia sư của Gia Sư Hoàng Hà.<br />
                                   Nhân viên tư vấn sẽ liên hệ với bạn trong thời gian sớm nhất để tìm Gia sư phù hợp.
                              </DialogDescription>
                         </DialogHeader>
                         <DialogFooter className="flex justify-center space-x-2">
                              <Button variant="outline" onClick={triggerMoreConfetti}>
                                   🎊 Pháo hoa
                              </Button>
                              <Button onClick={() => {
                                   setShowSuccessDialog(false);
                                   navigate('/tutor-search');
                              }}>
                                   Quay lại trang tìm Gia sư
                              </Button>
                         </DialogFooter>
                    </DialogContent>
               </Dialog>
          </Layout>
     );
};

export default TutorRegistrationPage; 
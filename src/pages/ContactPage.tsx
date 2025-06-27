import { useState, FormEvent, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import {
  sendContactEmail,
  sendAutoReplyEmail,
  initEmailJS,
  getEmailServiceStatus,
} from '../services/emailService';
import { saveContactMessage } from '../services/contactService';

import {
  validateAndSanitizeEmail,
  validateAndSanitizePhone,
  validateAndSanitizeName,
  validateAndSanitizeMessage,
  defaultRateLimiter,
  getClientIdentifier,
} from '../utils/security';
import { updateSEO, seoData } from '../utils/seo';
import { useToastContext } from '../contexts/ToastContext';
import SectionHeading from '../components/shared/SectionHeading';
import EmailServiceStatus from '../components/shared/EmailServiceStatus';
import Chatbot from '../components/shared/Chatbot';
// Import Font Awesome components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import SkeletonLoading from '../components/shared/SkeletonLoading';

const ContactPage = () => {
  const toast = useToastContext();

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Update SEO for contact page
    updateSEO(seoData.contact);

    // Initialize EmailJS
    initEmailJS();

    // Check email service status
    const status = getEmailServiceStatus();

    if (!status.isConfigured) {
      console.warn('EmailJS not configured. Missing:', status.missingFields);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Dev helper functions for contact form
  const handleDevFillContactForm = (data: any) => {
    setFormData(data);
    setErrors({}); // Clear any existing errors
  };

  const handleDevClearContactForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      message: '',
    });
    setErrors({});
  };

  // Expose dev functions globally for DevAdminHelper
  useEffect(() => {
    // Only expose in development mode
    if (process.env.NODE_ENV === 'development') {
      (window as any).__devContactFormFill = handleDevFillContactForm;
      (window as any).__devContactFormClear = handleDevClearContactForm;
    }

    // Cleanup on unmount
    return () => {
      if (process.env.NODE_ENV === 'development') {
        delete (window as any).__devContactFormFill;
        delete (window as any).__devContactFormClear;
      }
    };
  }, []);

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

    // Validate and sanitize message
    const messageValidation = validateAndSanitizeMessage(formData.message);
    if (!messageValidation.isValid) {
      newErrors.message = messageValidation.error || 'Tin nhắn không hợp lệ';
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
      toast.warning(
        'Quá nhiều yêu cầu',
        `Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau. Còn lại: ${remaining} yêu cầu.`
      );
      return;
    }

    if (!validateForm()) {
      toast.error('Lỗi validation', 'Vui lòng kiểm tra lại thông tin đã nhập');
      return;
    }

    // Get sanitized data
    const nameValidation = validateAndSanitizeName(formData.name);
    const phoneValidation = validateAndSanitizePhone(formData.phone);
    const emailValidation = validateAndSanitizeEmail(formData.email);
    const messageValidation = validateAndSanitizeMessage(formData.message);

    // Double-check all validations passed
    if (
      !nameValidation.isValid ||
      !phoneValidation.isValid ||
      !emailValidation.isValid ||
      !messageValidation.isValid
    ) {
      toast.error('Lỗi validation', 'Thông tin không hợp lệ');
      return;
    }

    try {
      setLoading(true);

      // Save to Firestore first
      const saveResult = await saveContactMessage(
        nameValidation.sanitized,
        emailValidation.sanitized,
        phoneValidation.sanitized,
        messageValidation.sanitized
      );

      if (!saveResult.success) {
        console.warn('Failed to save to Firestore:', saveResult.error);
        // Continue with email sending even if Firestore fails
      }

      // Send contact email
      const emailResult = await sendContactEmail(
        nameValidation.sanitized,
        emailValidation.sanitized,
        phoneValidation.sanitized,
        messageValidation.sanitized
      );

      if (emailResult.success) {
        // Send auto-reply to customer
        await sendAutoReplyEmail(nameValidation.sanitized, emailValidation.sanitized, false);

        setSuccess(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          message: '',
        });

        // Show success toast
        toast.success(
          'Gửi tin nhắn thành công!',
          'Chúng tôi đã nhận được tin nhắn và sẽ phản hồi trong thời gian sớm nhất.'
        );
      } else {
        // Show error toast
        toast.error('Gửi tin nhắn thất bại', emailResult.message);
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error(
        'Có lỗi xảy ra',
        'Vui lòng thử lại sau hoặc liên hệ trực tiếp qua số điện thoại.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      {/* Xóa hero section tiêu đề ở đây */}

      <section className="section-padding" aria-labelledby="contact-info-heading">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <SectionHeading title="Thông Tin Liên Hệ" centered={false} id="contact-info-heading" />

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">Địa chỉ</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      265 - ĐƯỜNG 06 - MẶT BẰNG 08, PHƯỜNG NAM NGẠN, THÀNH PHỐ THANH HOÁ, TỈNH THANH
                      HOÁ
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                    <FontAwesomeIcon icon={faPhone} className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">Điện thoại</h3>
                    <p className="text-gray-600 dark:text-gray-400">0385.510.892 - 0962.390.161</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Thứ 2 - Thứ 6: 7:30 - 20:00</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Thứ 7 - Chủ nhật: 8:00 - 17:00</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                    <FontAwesomeIcon icon={faEnvelope} className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">Email</h3>
                    <p className="text-gray-600 dark:text-gray-400">giasuhoangha.tpth@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                    <FontAwesomeIcon icon={faFacebookF} className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">Facebook</h3>
                    <p className="text-gray-600 dark:text-gray-400">Gia Sư Hoàng Hà - TP Thanh Hoá</p>
                  </div>
                </div>
              </div>

              {/* Google Maps Placeholder */}
              <div className="mt-8 rounded-lg overflow-hidden shadow-md">
                <iframe
                  title="Google Maps - Gia Sư Hoàng Hà"
                  src="https://www.google.com/maps?q=265%20%C4%90%C6%B0%E1%BB%9Dng%2006%2C%20M%E1%BA%B7t%20B%E1%BA%B1ng%2008%2C%20Ph%C6%B0%E1%BB%9Dng%20Nam%20Ng%E1%BA%A1n%2C%20Th%C3%A0nh%20Ph%E1%BB%91%20Thanh%20Ho%C3%A1%2C%20T%E1%BB%89nh%20Thanh%20Ho%C3%A1&output=embed"
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <SectionHeading title="Gửi Tin Nhắn" centered={false} />

              {/* Email Service Status Warning */}
              <EmailServiceStatus />

              {success ? (
                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-green-500"
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
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-green-800">
                        Gửi tin nhắn thành công!
                      </h3>
                      <p className="mt-2 text-sm text-green-700">
                        Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ phản hồi lại trong thời
                        gian sớm nhất.
                      </p>
                      <div className="mt-4">
                        <button
                          type="button"
                          className="text-sm font-medium text-green-700 hover:text-green-600"
                          onClick={() => setSuccess(false)}
                        >
                          Gửi tin nhắn khác
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Họ tên *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.name
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-blue-500'
                        } focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white`}
                      placeholder="Nhập họ tên của bạn"
                      disabled={loading}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.phone
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-blue-500'
                        } focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white`}
                      placeholder="Nhập số điện thoại của bạn"
                      disabled={loading}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.email
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-blue-500'
                        } focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white`}
                      placeholder="Nhập địa chỉ email của bạn"
                      disabled={loading}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Tin nhắn *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.message
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-blue-500'
                        } focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white`}
                      placeholder="Nhập tin nhắn của bạn"
                      disabled={loading}
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="mr-2">Đang gửi</div>
                          <SkeletonLoading type="avatar" width="20px" height="20px" className="bg-blue-400" />
                        </div>
                      ) : (
                        'Gửi tin nhắn'
                      )}
                    </button>

                    {success && (
                      <span className="text-green-600 dark:text-green-400">
                        Tin nhắn đã được gửi thành công!
                      </span>
                    )}
                  </div>
                </form>
              )}

              {/* FAQ Section */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Câu hỏi thường gặp</h3>

                <div className="space-y-4">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Thời gian học tại trung tâm?</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Trung tâm mở cửa từ 7:30 - 20:00 các ngày trong tuần và 8:00 - 17:00 vào cuối
                      tuần. Thời gian cụ thể của mỗi lớp học sẽ được thông báo khi đăng ký.
                    </p>
                  </div>

                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                      Tôi có thể đăng ký học thử không?
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Có, bạn có thể đăng ký học thử 1 buổi miễn phí tại trung tâm để trải nghiệm
                      trước khi quyết định tham gia lớp học.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                      Chính sách hoàn tiền như thế nào?
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Trung tâm có chính sách hoàn tiền nếu học viên không hài lòng sau 3 buổi học
                      đầu tiên. Vui lòng liên hệ với chúng tôi để biết thêm chi tiết.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />
    </Layout>
  );
};

export default ContactPage;

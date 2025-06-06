import { useState, FormEvent, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import {
  sendContactEmail,
  sendAutoReplyEmail,
  initEmailJS,
  getEmailServiceStatus,
} from '../services/emailService';

import {
  validateAndSanitizeEmail,
  validateAndSanitizePhone,
  validateAndSanitizeName,
  validateAndSanitizeMessage,
  defaultRateLimiter,
  getClientIdentifier,
} from '../utils/security';
import { updateSEO, seoData } from '../utils/seo';
import SectionHeading from '../components/shared/SectionHeading';
import Chatbot from '../components/shared/Chatbot';
// Import Font Awesome components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';

const ContactPage = () => {
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
      alert(`Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau. Còn lại: ${remaining} yêu cầu.`);
      return;
    }

    if (!validateForm()) {
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
      return;
    }

    try {
      setLoading(true);

      // Send contact email
      const result = await sendContactEmail(
        nameValidation.sanitized,
        emailValidation.sanitized,
        phoneValidation.sanitized,
        messageValidation.sanitized
      );

      if (result.success) {
        // Send auto-reply to customer
        await sendAutoReplyEmail(nameValidation.sanitized, emailValidation.sanitized, false);

        setSuccess(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          message: '',
        });

        // Show success message
        alert(result.message);
      } else {
        // Show error message
        alert(result.message);
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Đã có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua số điện thoại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gray-100 dark:bg-gray-900 py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">Liên Hệ</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào về các lớp học
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <SectionHeading title="Thông Tin Liên Hệ" centered={false} />

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
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-800 dark:text-gray-200 font-medium mb-1">
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
                    <label htmlFor="phone" className="block text-gray-800 dark:text-gray-200 font-medium mb-1">
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
                    <label htmlFor="email" className="block text-gray-800 dark:text-gray-200 font-medium mb-1">
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

                  <div className="mb-4">
                    <label htmlFor="message" className="block text-gray-800 dark:text-gray-200 font-medium mb-1">
                      Tin nhắn <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400`}
                      placeholder="Nhập tin nhắn"
                    ></textarea>
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                    )}
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full flex items-center justify-center mb-4"
                    >
                      {loading ? (
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
                          Đang gửi...
                        </>
                      ) : (
                        'Gửi tin nhắn'
                      )}
                    </button>

                    {/* Facebook Alternative */}
                    <div className="text-center">
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Hoặc liên hệ trực tiếp qua:</p>
                      <a
                        href="https://www.facebook.com/profile.php?id=61575087818708"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        <FontAwesomeIcon icon={faFacebookF} className="w-5 h-5" />
                        <span>Trang Facebook chính thức</span>
                      </a>
                    </div>
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

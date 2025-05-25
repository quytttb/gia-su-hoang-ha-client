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
      <section className="bg-gray-100 py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Liên Hệ</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào về các khóa học
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
                  <div className="bg-primary bg-opacity-10 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">Địa chỉ</h3>
                    <p className="text-gray-600">
                      265 - ĐƯỜNG 06 - MẶT BẰNG 08, PHƯỜNG NAM NGẠN, THÀNH PHỐ THANH HOÁ, TỈNH THANH
                      HOÁ
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">Điện thoại</h3>
                    <p className="text-gray-600">0385.510.892 - 0962.390.161</p>
                    <p className="text-gray-500 text-sm">Thứ 2 - Thứ 6: 7:30 - 20:00</p>
                    <p className="text-gray-500 text-sm">Thứ 7 - Chủ nhật: 8:00 - 17:00</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">Email</h3>
                    <p className="text-gray-600">lienhe@giasuhoangha.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-full">
                    <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">Facebook</h3>
                    <p className="text-gray-600 mb-2">Gia Sư Hoàng Hà Official</p>
                    <button
                      onClick={() =>
                        window.open(
                          'https://www.facebook.com/profile.php?id=61575087818708',
                          '_blank'
                        )
                      }
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>Nhắn tin Facebook</span>
                    </button>
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
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nhập họ và tên"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nhập số điện thoại"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nhập địa chỉ email"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-1">
                      Tin nhắn <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.message ? 'border-red-500' : 'border-gray-300'
                      }`}
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
                      <p className="text-gray-500 text-sm mb-3">Hoặc liên hệ trực tiếp qua:</p>
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
                        <span>Nhắn tin qua Facebook</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* FAQ Section */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Câu hỏi thường gặp</h3>

                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="font-medium text-gray-800 mb-2">Thời gian học tại trung tâm?</h4>
                    <p className="text-gray-600 text-sm">
                      Trung tâm mở cửa từ 7:30 - 20:00 các ngày trong tuần và 8:00 - 17:00 vào cuối
                      tuần. Thời gian cụ thể của mỗi khóa học sẽ được thông báo khi đăng ký.
                    </p>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="font-medium text-gray-800 mb-2">
                      Tôi có thể đăng ký học thử không?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Có, bạn có thể đăng ký học thử 1 buổi miễn phí tại trung tâm để trải nghiệm
                      trước khi quyết định tham gia khóa học.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      Chính sách hoàn tiền như thế nào?
                    </h4>
                    <p className="text-gray-600 text-sm">
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

import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_gia_su_hoang_ha';
const EMAILJS_TEMPLATE_ID_CONTACT =
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONTACT || 'template_contact';
const EMAILJS_TEMPLATE_ID_REGISTRATION =
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID_REGISTRATION || 'template_registration';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key';

// Initialize EmailJS
export const initEmailJS = () => {
  emailjs.init(EMAILJS_PUBLIC_KEY);
};

// Email template parameters
interface ContactEmailParams {
  from_name: string;
  from_email: string;
  from_phone: string;
  message: string;
  to_name: string;
  reply_to: string;
  [key: string]: unknown;
}

interface RegistrationEmailParams {
  student_name: string;
  student_email: string;
  student_phone: string;
  course_name: string;
  course_id: string;
  registration_date: string;
  to_name: string;
  reply_to: string;
  [key: string]: unknown;
}

// Send contact form email
export const sendContactEmail = async (
  name: string,
  email: string,
  phone: string,
  message: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const templateParams: ContactEmailParams = {
      from_name: name,
      from_email: email,
      from_phone: phone,
      message: message,
      to_name: 'Trung tâm Gia Sư Hoàng Hà',
      reply_to: email,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_CONTACT,
      templateParams
    );

    if (response.status === 200) {
      return {
        success: true,
        message: 'Email đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.',
      };
    } else {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error('Error sending contact email:', error);
    return {
      success: false,
      message:
        'Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua số điện thoại.',
    };
  }
};

// Send course registration email
export const sendRegistrationEmail = async (
  studentName: string,
  studentEmail: string,
  studentPhone: string,
  courseName: string,
  courseId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const templateParams: RegistrationEmailParams = {
      student_name: studentName,
      student_email: studentEmail,
      student_phone: studentPhone,
      course_name: courseName,
      course_id: courseId,
      registration_date: new Date().toLocaleDateString('vi-VN'),
      to_name: 'Trung tâm Gia Sư Hoàng Hà',
      reply_to: studentEmail,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_REGISTRATION,
      templateParams
    );

    if (response.status === 200) {
      return {
        success: true,
        message:
          'Đăng ký thành công! Chúng tôi đã nhận được thông tin và sẽ liên hệ với bạn trong 24h.',
      };
    } else {
      throw new Error('Failed to send registration email');
    }
  } catch (error) {
    console.error('Error sending registration email:', error);
    return {
      success: false,
      message:
        'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua số điện thoại.',
    };
  }
};

// Send auto-reply email to customer
export const sendAutoReplyEmail = async (
  customerName: string,
  customerEmail: string,
  isRegistration: boolean = false
): Promise<void> => {
  try {
    const templateParams = {
      to_name: customerName,
      to_email: customerEmail,
      center_name: 'Trung tâm Gia Sư Hoàng Hà',
      center_phone: '0385.510.892 - 0962.390.161',
      center_address: '265 - Đường 06 - Mặt Bằng 08, Phường Nam Ngạn, Thanh Hóa',
      message_type: isRegistration ? 'đăng ký khóa học' : 'liên hệ',
      reply_to: 'lienhe@giasuhoangha.com',
    };

    await emailjs.send(EMAILJS_SERVICE_ID, 'template_auto_reply', templateParams);
  } catch (error) {
    console.error('Error sending auto-reply email:', error);
    // Don't throw error for auto-reply failure
  }
};

// Validate email configuration
export const validateEmailConfig = (): { isValid: boolean; missingFields: string[] } => {
  const missingFields: string[] = [];

  if (!EMAILJS_SERVICE_ID || EMAILJS_SERVICE_ID === 'service_gia_su_hoang_ha') {
    missingFields.push('VITE_EMAILJS_SERVICE_ID');
  }

  if (!EMAILJS_TEMPLATE_ID_CONTACT || EMAILJS_TEMPLATE_ID_CONTACT === 'template_contact') {
    missingFields.push('VITE_EMAILJS_TEMPLATE_ID_CONTACT');
  }

  if (
    !EMAILJS_TEMPLATE_ID_REGISTRATION ||
    EMAILJS_TEMPLATE_ID_REGISTRATION === 'template_registration'
  ) {
    missingFields.push('VITE_EMAILJS_TEMPLATE_ID_REGISTRATION');
  }

  if (!EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY === 'your_public_key') {
    missingFields.push('VITE_EMAILJS_PUBLIC_KEY');
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};

// Get email service status
export const getEmailServiceStatus = () => {
  const config = validateEmailConfig();

  return {
    isConfigured: config.isValid,
    missingFields: config.missingFields,
    serviceId: EMAILJS_SERVICE_ID,
    hasContactTemplate: EMAILJS_TEMPLATE_ID_CONTACT !== 'template_contact',
    hasRegistrationTemplate: EMAILJS_TEMPLATE_ID_REGISTRATION !== 'template_registration',
  };
};

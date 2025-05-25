// SEO utilities for dynamic meta tags management

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
}

/**
 * Update document meta tags dynamically
 */
export const updateSEO = (seoData: SEOData) => {
  // Update title
  document.title = seoData.title;

  // Update or create meta tags
  updateMetaTag('description', seoData.description);

  if (seoData.keywords) {
    updateMetaTag('keywords', seoData.keywords);
  }

  // Open Graph tags
  updateMetaProperty('og:title', seoData.ogTitle || seoData.title);
  updateMetaProperty('og:description', seoData.ogDescription || seoData.description);
  updateMetaProperty('og:url', seoData.ogUrl || window.location.href);

  if (seoData.ogImage) {
    updateMetaProperty('og:image', seoData.ogImage);
  }

  // Canonical URL
  if (seoData.canonical) {
    updateCanonicalLink(seoData.canonical);
  }
};

/**
 * Update or create a meta tag
 */
const updateMetaTag = (name: string, content: string) => {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;

  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }

  meta.content = content;
};

/**
 * Update or create a meta property tag (for Open Graph)
 */
const updateMetaProperty = (property: string, content: string) => {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;

  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }

  meta.content = content;
};

/**
 * Update canonical link
 */
const updateCanonicalLink = (href: string) => {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }

  link.href = href;
};

/**
 * SEO data for different pages
 */
export const seoData = {
  home: {
    title: 'Trung tâm Gia Sư Hoàng Hà - Dẫn lối tri thức, vững bước tương lai',
    description:
      'Trung tâm Gia Sư Hoàng Hà cung cấp dịch vụ gia sư chất lượng cao tại Thanh Hóa. Đội ngũ giáo viên giỏi, phương pháp giảng dạy hiệu quả, luyện thi THPT Quốc Gia.',
    keywords:
      'gia sư thanh hóa, trung tâm gia sư, luyện thi đại học, học thêm thanh hóa, gia sư toán, gia sư văn, gia sư tiếng anh',
    ogImage: 'https://giasuhoangha.com/og-image.jpg',
    canonical: 'https://giasuhoangha.com/',
  },

  about: {
    title: 'Về chúng tôi - Trung tâm Gia Sư Hoàng Hà',
    description:
      'Tìm hiểu về lịch sử, sứ mệnh và đội ngũ giáo viên của Trung tâm Gia Sư Hoàng Hà. Hơn 10 năm kinh nghiệm trong lĩnh vực giáo dục tại Thanh Hóa.',
    keywords:
      'về gia sư hoàng hà, lịch sử trung tâm, đội ngũ giáo viên, giáo viên gia sư thanh hóa',
    canonical: 'https://giasuhoangha.com/about',
  },

  courses: {
    title: 'Khóa học - Trung tâm Gia Sư Hoàng Hà',
    description:
      'Khám phá các khóa học chất lượng cao tại Trung tâm Gia Sư Hoàng Hà: Luyện thi THPT Quốc Gia, Tiếng Anh giao tiếp, Toán học, Văn học và nhiều khóa học khác.',
    keywords:
      'khóa học gia sư, luyện thi THPT quốc gia thanh hóa, học tiếng anh thanh hóa, học toán thanh hóa, khóa học hè',
    canonical: 'https://giasuhoangha.com/courses',
  },

  contact: {
    title: 'Liên hệ - Trung tâm Gia Sư Hoàng Hà',
    description:
      'Liên hệ với Trung tâm Gia Sư Hoàng Hà để được tư vấn miễn phí về các khóa học. Địa chỉ: 265 Đường 06, Phường Nam Ngạn, Thanh Hóa. Hotline: 0385.510.892',
    keywords:
      'liên hệ gia sư hoàng hà, địa chỉ trung tâm gia sư thanh hóa, số điện thoại gia sư, tư vấn khóa học',
    canonical: 'https://giasuhoangha.com/contact',
  },

  schedule: {
    title: 'Lịch học - Trung tâm Gia Sư Hoàng Hà',
    description:
      'Xem lịch học của các khóa học tại Trung tâm Gia Sư Hoàng Hà. Tra cứu lịch học theo ngày, khóa học hoặc số điện thoại đăng ký.',
    keywords: 'lịch học gia sư, thời khóa biểu, lịch học thanh hóa, tra cứu lịch học',
    canonical: 'https://giasuhoangha.com/schedule',
  },
};

/**
 * Generate course-specific SEO data
 */
export const generateCourseSEO = (
  courseName: string,
  courseDescription: string,
  courseId: string
): SEOData => {
  return {
    title: `${courseName} - Trung tâm Gia Sư Hoàng Hà`,
    description: `${courseDescription.substring(0, 150)}... Đăng ký ngay tại Trung tâm Gia Sư Hoàng Hà, Thanh Hóa.`,
    keywords: `${courseName.toLowerCase()}, khóa học ${courseName.toLowerCase()}, gia sư ${courseName.toLowerCase()}, học ${courseName.toLowerCase()} thanh hóa`,
    canonical: `https://giasuhoangha.com/courses/${courseId}`,
  };
};

/**
 * Generate registration page SEO data
 */
export const generateRegistrationSEO = (courseName: string): SEOData => {
  return {
    title: `Đăng ký ${courseName} - Trung tâm Gia Sư Hoàng Hà`,
    description: `Đăng ký khóa học ${courseName} tại Trung tâm Gia Sư Hoàng Hà. Quy trình đăng ký nhanh chóng, đội ngũ giáo viên chất lượng cao.`,
    keywords: `đăng ký ${courseName.toLowerCase()}, đăng ký khóa học, gia sư thanh hóa`,
    ogTitle: `Đăng ký ${courseName} - Gia Sư Hoàng Hà`,
  };
};

/**
 * Generate structured data for a course
 */
export const generateCourseStructuredData = (course: any) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Trung tâm Gia Sư Hoàng Hà',
      url: 'https://giasuhoangha.com',
    },
    courseCode: course.id,
    educationalLevel: course.category,
    audience: {
      '@type': 'EducationalAudience',
      audienceType: course.targetAudience,
    },
    offers: {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
      ...(course.discount &&
        course.discountEndDate && {
          priceValidUntil: course.discountEndDate,
          discount: course.discount,
        }),
    },
    image: course.imageUrl,
    url: `https://giasuhoangha.com/courses/${course.id}`,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'blended',
      location: {
        '@type': 'Place',
        name: 'Trung tâm Gia Sư Hoàng Hà',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '265 - Đường 06 - Mặt Bằng 08',
          addressLocality: 'Phường Nam Ngạn',
          addressRegion: 'Thành phố Thanh Hóa',
          addressCountry: 'VN',
        },
      },
      schedule: course.schedule,
    },
  };
};

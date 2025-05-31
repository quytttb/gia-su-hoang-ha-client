import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Banner from '../components/shared/Banner';
import SectionHeading from '../components/shared/SectionHeading';
import CourseCard from '../components/shared/CourseCard';
import { Banner as BannerType, CenterInfo, Course } from '../types';
import { bannerService } from '../services/bannerService';
import coursesService from '../services/firestore/coursesService';
import settingsService from '../services/firestore/settingsService';
import { updateSEO, seoData } from '../utils/seo';
import { convertFirestoreCourse, getFeaturedCourses } from '../utils/courseHelpers';
import Chatbot from '../components/shared/Chatbot';
import ErrorDisplay from '../components/shared/ErrorDisplay';

const HomePage = () => {
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [centerInfo, setCenterInfo] = useState<CenterInfo | null>(null);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Update SEO for homepage
    updateSEO(seoData.home);

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch banners from Firestore
        const bannersResult = await bannerService.getActiveBanners();
        setBanners(bannersResult);

        // Fetch center info from Firestore
        const centerInfoResult = await settingsService.getCenterInfo();
        setCenterInfo(centerInfoResult);

        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching home page data:', error);
        setError(error.message || 'Không thể tải dữ liệu trang chủ');
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time listener for featured courses
    const unsubscribe = coursesService.subscribeToActiveCourses((firestoreCourses) => {
      try {
        const coursesData = firestoreCourses.map(convertFirestoreCourse);
        const featuredOnly = getFeaturedCourses(coursesData, 6); // Limit to 6 featured courses
        setFeaturedCourses(featuredOnly);
      } catch (error: any) {
        console.error('Error processing courses:', error);
        setError(error.message || 'Không thể xử lý danh sách khóa học');
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorDisplay
          message="Không thể tải dữ liệu"
          details={error}
          retryLabel="Thử lại"
        />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Banner Section */}
      <section>
        <Banner banners={banners} />
      </section>

      {/* Introduction Section */}
      {centerInfo && (
        <section className="section-padding bg-gray-50 dark:bg-gray-900">
          <div className="container-custom">
            <SectionHeading
              title="Về Trung Tâm Gia Sư Hoàng Hà"
              subtitle="Đồng hành cùng sự phát triển của thế hệ trẻ"
            />

            <div className="max-w-4xl mx-auto">
              <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">{centerInfo.description}</p>

              <div className="flex justify-center">
                <Link to="/about" className="btn-accent">
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Courses Section */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-custom">
          <SectionHeading
            title="Khóa Học Nổi Bật"
            subtitle="Các khóa học được nhiều học viên lựa chọn và đánh giá cao"
          />

          {featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">Chưa có khóa học nào được đăng.</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link to="/courses" className="btn-primary">
              Xem tất cả khóa học
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="section-padding bg-primary text-white dark:bg-primary-700">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Bạn cần tư vấn về khóa học?</h2>
          <p className="mb-8 max-w-2xl mx-auto text-white dark:text-gray-200">
            Hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí về các khóa học phù hợp
            nhất với nhu cầu của bạn hoặc con em của bạn.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-600 dark:hover:bg-accent-400 transition-colors"
            >
              Liên hệ ngay
            </Link>
            <Link
              to="/courses"
              className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-primary dark:hover:bg-gray-900 dark:hover:text-white transition-colors"
            >
              Xem khóa học
            </Link>
          </div>
        </div>
      </section>
      <Chatbot />
    </Layout>
  );
};

export default HomePage;

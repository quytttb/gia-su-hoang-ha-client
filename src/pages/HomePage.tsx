import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Banner from '../components/shared/Banner';
import SectionHeading from '../components/shared/SectionHeading';
import ClassCard from '../components/shared/ClassCard';
import { Banner as BannerType, CenterInfo, Class } from '../types';
import { bannerService } from '../services/bannerService';
import classesService from '../services/firestore/classesService';
import settingsService from '../services/firestore/settingsService';
import { updateSEO, seoData } from '../utils/seo';
import { convertFirestoreClass, getFeaturedClasses } from '../utils/classHelpers';
import Chatbot from '../components/shared/Chatbot';
import ErrorDisplay from '../components/shared/ErrorDisplay';

const HomePage = () => {
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [centerInfo, setCenterInfo] = useState<CenterInfo | null>(null);
  const [featuredClasses, setFeaturedClasses] = useState<Class[]>([]);
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

    // Set up real-time listener for featured classes
    const unsubscribe = classesService.subscribeToActiveClasses((firestoreClasses) => {
      try {
        const classesData = firestoreClasses.map(convertFirestoreClass);
        const featuredOnly = getFeaturedClasses(classesData, 6); // Limit to 6 featured classes
        setFeaturedClasses(featuredOnly);
      } catch (error: any) {
        console.error('Error processing classes:', error);
        setError(error.message || 'Không thể xử lý danh sách lớp học');
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

      {/* Featured Classes Section */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-custom">
          <SectionHeading
            title="Lớp Học Nổi Bật"
            subtitle="Các lớp học được nhiều học viên lựa chọn và đánh giá cao"
          />

          {featuredClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredClasses.map(classData => (
                <ClassCard key={classData.id} class={classData} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">Chưa có lớp học nào được đăng.</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link to="/classes" className="btn-primary">
              Xem tất cả lớp học
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="section-padding bg-primary text-white dark:bg-primary-700">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Bạn cần tư vấn về lớp học?</h2>
          <p className="mb-8 max-w-2xl mx-auto text-white dark:text-gray-200">
            Hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí về các lớp học phù hợp
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
              to="/classes"
              className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-primary dark:hover:bg-gray-900 dark:hover:text-white transition-colors"
            >
              Xem lớp học
            </Link>
          </div>
        </div>
      </section>
      <Chatbot />
    </Layout>
  );
};

export default HomePage;

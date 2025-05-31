import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import SectionHeading from '../components/shared/SectionHeading';
import LazyImage from '../components/shared/LazyImage';
import { CenterInfo, Tutor } from '../types';
import tutorsService from '../services/firestore/tutorsService';
import settingsService from '../services/firestore/settingsService';
import { updateSEO, seoData } from '../utils/seo';
import Chatbot from '../components/shared/Chatbot';
import ErrorDisplay from '../components/shared/ErrorDisplay';

const AboutPage = () => {
  const [centerInfo, setCenterInfo] = useState<CenterInfo | null>(null);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Update SEO for about page
    updateSEO(seoData.about);

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch data from Firestore services
        const [centerInfoData, tutorsData] = await Promise.all([
          settingsService.getCenterInfo(),
          tutorsService.getActiveTutors()
        ]);

        setCenterInfo(centerInfoData);
        setTutors(tutorsData);
      } catch (error: any) {
        console.error('Error fetching about page data:', error);
        setError(error.message || 'Không thể tải dữ liệu trang giới thiệu');

        // Fallback to default data if there's an error
        setCenterInfo({
          id: '1',
          name: 'Trung tâm Gia Sư Hoàng Hà',
          description: 'Trung tâm Gia Sư Hoàng Hà tự hào là nơi cung cấp dịch vụ gia sư chất lượng cao tại Thanh Hóa.',
          address: '265 - ĐƯỜNG 06 - MẶT BẰNG 08, PHƯỜNG NAM NGẠN, THÀNH PHỐ THANH HOÁ, TỈNH THANH HOÁ',
          phone: '0385.510.892 - 0962.390.161',
          email: 'lienhe@giasuhoangha.com',
          history: 'Trung tâm Gia Sư Hoàng Hà được thành lập vào năm 2015 với mục tiêu ban đầu là cung cấp các dịch vụ gia sư cho học sinh tiểu học và THCS.',
          mission: 'Sứ mệnh của chúng tôi là cung cấp môi trường học tập chất lượng, hiệu quả, giúp học sinh phát triển toàn diện về kiến thức và kỹ năng sống.',
          vision: 'Trở thành trung tâm gia sư hàng đầu tại Thanh Hóa, mang đến giải pháp giáo dục toàn diện cho học sinh các cấp.',
          slogan: 'DẪN LỐI TRI THỨC - VỮNG BƯỚC TƯƠNG LAI',
          workingHours: {
            weekdays: '7:30 - 20:00',
            weekend: '8:00 - 17:00',
          },
        });
        setTutors([]); // Empty tutors array if error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  if (!centerInfo) {
    return (
      <Layout>
        <ErrorDisplay
          message="Không thể tải thông tin trung tâm"
          details="Vui lòng thử lại sau hoặc liên hệ với chúng tôi qua số điện thoại: 0385.510.892"
          retryLabel="Thử lại"
        />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Error notification */}
      {error && (
        <div className="container-custom my-4">
          <ErrorDisplay
            message="Thông báo"
            details="Một số dữ liệu có thể chưa được tải đầy đủ. Đang sử dụng thông tin mặc định."
          />
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gray-100 py-16 dark:bg-gray-900">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">Về Chúng Tôi</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Trung tâm Gia Sư Hoàng Hà - đối tác đáng tin cậy trong hành trình giáo dục của bạn
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-lg shadow-md dark:bg-gray-800">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Sứ mệnh</h3>
              <p className="text-gray-700 dark:text-gray-200">{centerInfo.mission}</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md dark:bg-gray-800">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Tầm nhìn</h3>
              <p className="text-gray-700 dark:text-gray-200">{centerInfo.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <SectionHeading
            title="Lịch sử phát triển"
            subtitle="Từ những ngày đầu thành lập đến hiện tại"
          />
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-700 text-lg leading-relaxed dark:text-gray-200">{centerInfo.history}</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {tutors.length > 0 ? (
        <section className="section-padding">
          <div className="container-custom">
            <SectionHeading
              title="Đội ngũ giáo viên"
              subtitle="Đội ngũ giáo viên có trình độ chuyên môn cao, giàu kinh nghiệm và tâm huyết với nghề"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tutors.map(tutor => (
                <div
                  key={tutor.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="h-64 overflow-hidden">
                    <LazyImage src={tutor.imageUrl} alt={tutor.name} className="w-full h-full" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1">{tutor.name}</h3>
                    <p className="text-primary font-medium mb-3 dark:text-gray-200">{tutor.specialty}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{tutor.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="section-padding">
          <div className="container-custom">
            <SectionHeading
              title="Đội ngũ giáo viên"
              subtitle="Thông tin đội ngũ giáo viên đang được cập nhật"
            />
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">Thông tin giáo viên sẽ được cập nhật sớm.</p>
            </div>
          </div>
        </section>
      )}

      {/* Information Section */}
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <SectionHeading title="Thông tin liên hệ" centered={false} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <div className="mb-5">
                <h4 className="text-lg font-semibold mb-2 dark:text-gray-200">Địa chỉ:</h4>
                <p className="text-gray-700 dark:text-gray-200">{centerInfo.address}</p>
              </div>
              <div className="mb-5">
                <h4 className="text-lg font-semibold mb-2 dark:text-gray-200">Điện thoại:</h4>
                <p className="text-gray-700 dark:text-gray-200">{centerInfo.phone}</p>
              </div>
              <div className="mb-5">
                <h4 className="text-lg font-semibold mb-2 dark:text-gray-200">Email:</h4>
                <p className="text-gray-700 dark:text-gray-200">{centerInfo.email}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 dark:text-gray-200">Giờ làm việc:</h4>
                <p className="text-gray-700 mb-1 dark:text-gray-200">
                  Thứ 2 - Thứ 6: {centerInfo.workingHours.weekdays}
                </p>
                <p className="text-gray-700 dark:text-gray-200">Thứ 7 - Chủ nhật: {centerInfo.workingHours.weekend}</p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-md">
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
        </div>
      </section>
      <Chatbot />
    </Layout>
  );
};

export default AboutPage;

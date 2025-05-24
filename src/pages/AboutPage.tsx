import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import SectionHeading from '../components/shared/SectionHeading';
import { CenterInfo, Tutor } from '../types';
import { getCenterInfo, getTutors } from '../services/dataService';
import Chatbot from '../components/shared/Chatbot';

const AboutPage = () => {
  const [centerInfo, setCenterInfo] = useState<CenterInfo | null>(null);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [centerInfoData, tutorsData] = await Promise.all([getCenterInfo(), getTutors()]);
        setCenterInfo(centerInfoData);
        setTutors(tutorsData);
      } catch (error) {
        console.error('Error fetching about page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !centerInfo) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gray-100 py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Về Chúng Tôi</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Trung tâm Gia Sư Hoàng Hà - đối tác đáng tin cậy trong hành trình giáo dục của bạn
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Sứ mệnh</h3>
              <p className="text-gray-700">{centerInfo.mission}</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Tầm nhìn</h3>
              <p className="text-gray-700">{centerInfo.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <SectionHeading
            title="Lịch sử phát triển"
            subtitle="Từ những ngày đầu thành lập đến hiện tại"
          />
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-700 text-lg leading-relaxed">{centerInfo.history}</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
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
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={tutor.imageUrl}
                    alt={tutor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{tutor.name}</h3>
                  <p className="text-primary font-medium mb-3">{tutor.specialty}</p>
                  <p className="text-gray-600 text-sm">{tutor.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <SectionHeading title="Thông tin liên hệ" centered={false} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <div className="mb-5">
                <h4 className="text-lg font-semibold mb-2">Địa chỉ:</h4>
                <p className="text-gray-700">
                  265 - ĐƯỜNG 06 - MẶT BẰNG 08, PHƯỜNG NAM NGẠN, THÀNH PHỐ THANH HOÁ, TỈNH THANH HOÁ
                </p>
              </div>
              <div className="mb-5">
                <h4 className="text-lg font-semibold mb-2">Điện thoại:</h4>
                <p className="text-gray-700">0385.510.892 - 0962.390.161</p>
              </div>
              <div className="mb-5">
                <h4 className="text-lg font-semibold mb-2">Email:</h4>
                <p className="text-gray-700">{centerInfo.email}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Giờ làm việc:</h4>
                <p className="text-gray-700 mb-1">
                  Thứ 2 - Thứ 6: {centerInfo.workingHours.weekdays}
                </p>
                <p className="text-gray-700">Thứ 7 - Chủ nhật: {centerInfo.workingHours.weekend}</p>
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

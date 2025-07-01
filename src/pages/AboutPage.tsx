import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SectionHeading from '../components/shared/SectionHeading';
import LazyImage from '../components/shared/LazyImage';
import { CenterInfo, Tutor } from '../types';
import tutorsService from '../services/firestore/tutorsService';
import settingsService from '../services/firestore/settingsService';
import { updateSEO, seoData } from '../utils/seo';
import Chatbot from '../components/shared/Chatbot';
import ErrorDisplay from '../components/shared/ErrorDisplay';
import SkeletonLoading from '../components/shared/SkeletonLoading';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { Home, Users, School, MessageCircle } from 'lucide-react';

const AboutPage = () => {
  const [centerInfo, setCenterInfo] = useState<CenterInfo | null>(null);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const location = useLocation();

  // Function to scroll to section
  const scrollToSection = (sectionId: string) => {
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  };

  // Handle scroll to section when page loads with hash
  useEffect(() => {
    if (location.hash && !loading) {
      const sectionId = location.hash.replace('#', '');
      scrollToSection(sectionId);
    }
  }, [location.hash, loading]);

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
          email: 'giasuhoangha.tpth@gmail.com',
          history: 'Trung tâm Gia sư Hoàng Hà ra đời từ tâm huyết của Nhà sáng lập Nguyễn Nguyên Hoàng – tốt nghiệp chuyên ngành Quản trị Kinh doanh thuộc Trường Đại học Mở Hà Nội, một người trẻ lớn lên trong gia đình có truyền thống giáo dục lâu đời và nhiều thế hệ tại vùng đất Thạch Thành, Thanh Hoá. Không chỉ thấm nhuần những giá trị sâu sắc về giáo dục từ trong chính ngôi nhà của mình, anh còn dành nhiều năm gắn bó trực tiếp với nghề gia sư trong suốt thời sinh viên. Chính những trải nghiệm đó đã hình thành nên lý tưởng giáo dục của Hoàng Hà, xây dựng một môi trường học tập gần gũi, niềm tin và giàu cảm hứng, nơi học sinh được quan tâm như chính người thân trong gia đình.',
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
        <div className="section-padding">
          <div className="container-custom">
            {/* Hero Section Skeleton */}
            <div className="text-center mb-16">
              <SkeletonLoading type="text" count={2} className="mx-auto" />
            </div>

            {/* Mission & Vision Section Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <SkeletonLoading type="text" count={4} />
              </div>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <SkeletonLoading type="text" count={4} />
              </div>
            </div>

            {/* History Section Skeleton */}
            <div className="mb-16">
              <div className="text-center mb-8">
                <SkeletonLoading type="text" count={2} className="mx-auto" />
              </div>
              <SkeletonLoading type="text" count={5} />
            </div>

            {/* Team Section Skeleton */}
            <div className="mb-16">
              <div className="text-center mb-8">
                <SkeletonLoading type="text" count={2} className="mx-auto" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <SkeletonLoading type="card" count={3} />
              </div>
            </div>
          </div>
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
      <section
        className="relative flex items-center justify-center min-h-[220px] md:min-h-[260px] bg-[#e3f0ff] dark:bg-gradient-to-b dark:from-[#182848] dark:to-[#35577d] py-8 md:py-10 overflow-hidden shadow-md border-b border-blue-200 dark:border-blue-900"
      >
        <img
          src="/assets/images/gia-su-hoang-ha-header.jpg"
          alt="Trung tâm Gia Sư Hoàng Hà"
          className="absolute inset-0 m-auto w-full h-full object-cover opacity-80 pointer-events-none select-none z-0"
          style={{ left: '0', right: '0', top: '0', bottom: '0' }}
        />
      </section>

      {/* Giới thiệu trung tâm */}
      <section className="section-padding bg-white dark:bg-gray-900" id="about-intro">
        <div className="container-custom flex flex-col items-center justify-center text-center gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-primary-700 dark:text-primary-400 uppercase">TRUNG TÂM GIA SƯ HOÀNG HÀ</h2>
            <div className="text-accent-500 font-semibold text-lg mb-2">Dẫn lối Tri thức - Vững bước Tương lai</div>
            <p className="text-lg text-gray-700 dark:text-gray-200 mb-2">
              Trung tâm Gia sư Hoàng Hà tự hào là một trong những Đơn vị Giáo dục uy tín hàng đầu tại Thành phố Thanh Hoá, nơi hội tụ đội ngũ giáo viên giỏi chuyên môn, tận tâm và am hiểu sâu sắc chương trình Giáo dục địa phương. Chúng tôi cam kết mang đến những tiết học chất lượng, hiệu quả và phù hợp với từng Học viên, hỗ trợ Quý Phụ huynh và đồng hành cùng các em trên hành trình chinh phục mục tiêu học tập.
            </p>
            <div className="text-gray-600 dark:text-gray-300 text-base">
              <div><b>Địa chỉ:</b> {centerInfo.address}</div>
              <div><b>Điện thoại:</b> {centerInfo.phone}</div>
              <div><b>Email:</b> giasuhoangha.tpth@gmail.com</div>
            </div>
          </div>
        </div>
      </section>

      {/* Lịch sử phát triển & Chân dung nhà sáng lập */}
      <section className="section-padding bg-gray-50 dark:bg-gray-900" id="history-founder">
        <div className="container-custom">
          <div className="w-full text-center">
            <SectionHeading title="Lịch sử phát triển" id="history-heading" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center mt-8">
            <div className="md:col-span-2">
              <p className="text-gray-700 text-lg leading-relaxed dark:text-gray-200 mb-6">
                Trung tâm Gia sư Hoàng Hà ra đời từ tâm huyết của Nhà sáng lập Nguyễn Nguyên Hoàng – tốt nghiệp chuyên ngành Quản trị Kinh doanh thuộc Trường Đại học Mở Hà Nội, một người trẻ lớn lên trong gia đình có truyền thống giáo dục lâu đời và nhiều thế hệ tại vùng đất Thạch Thành, Thanh Hoá. Không chỉ thấm nhuần những giá trị sâu sắc về giáo dục từ trong chính ngôi nhà của mình, anh còn dành nhiều năm gắn bó trực tiếp với nghề gia sư trong suốt thời sinh viên. Từ việc đồng hành cùng những học sinh mất gốc cần sự kiên trì, đến việc định hướng cho các em khá giỏi bứt phá, đã giúp anh hiểu rõ hơn những khó khăn, khát vọng và kỳ vọng của mỗi em học sinh cũng như những tâm tư của mỗi bậc phụ huynh trong hành trình học tập.
                <br /><br />
                Chính những trải nghiệm đó đã hình thành nên lý tưởng giáo dục của Hoàng Hà, xây dựng một môi trường học tập gần gũi, niềm tin và giàu cảm hứng, nơi học sinh được quan tâm như chính người thân trong gia đình, và được đặt vào sự tin tưởng để phát huy hết tiềm năng bản thân. Với tôn chỉ "Dẫn lối tri thức – Vững bước tương lai", Trung tâm Gia sư Hoàng Hà tự hào đồng hành cùng quý Phụ huynh và Học sinh Thanh Hoá trên chặng đường chinh phục tri thức và hướng đến một tương lai rộng mở phía trước.
              </p>
            </div>
            <div className="flex flex-col items-center md:col-span-1">
              <img src="/assets/images/founder.png" alt="Nhà sáng lập" className="w-64 h-64 object-cover rounded-full shadow-lg mb-6" />
              <div className="text-center">
                <div className="font-bold text-2xl text-yellow-500 mb-2">NGUYỄN NGUYÊN HOÀNG</div>
                <div className="font-semibold text-lg text-blue-600 mb-1">Nhà Sáng lập</div>
                <div className="text-gray-700 dark:text-gray-300">Trung tâm Gia sư Hoàng Hà</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tầm nhìn */}
      <section className="section-padding bg-white dark:bg-gray-900" id="vision">
        <div className="container-custom">
          <SectionHeading title="Tầm nhìn" id="vision-heading" />
          <p className="text-gray-700 dark:text-gray-200 text-center text-lg mt-8">
            Trở thành một điểm tựa tri thức uy tín cho mọi thế hệ Học sinh tại Thành phố Thanh Hoá. Bệ phóng giúp các em vượt lên chính mình, chinh phục mọi mục tiêu học tập và các mục tiêu đỗ đạt tại các ngôi trường danh tiếng tại địa phương như: THCS Trần Mai Ninh, THPT Chuyên Lam Sơn, THPT Hàm Rồng, THPT Đào Duy Từ,...
          </p>
        </div>
      </section>

      {/* Sứ mệnh */}
      <section className="section-padding bg-gray-50 dark:bg-gray-900" id="mission">
        <div className="container-custom">
          <SectionHeading title="Sứ mệnh" id="mission-heading" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div className="bg-white p-8 rounded-lg shadow-md dark:bg-gray-800">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-50 dark:bg-blue-900 flex-shrink-0">
                  <img src="/images/logo.png" alt="Logo Trung tâm" className="w-10 h-10 object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">Bệ phóng đáng tin cậy trên hành trình chinh phục kỳ thi vào lớp 10</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    Trung tâm Gia sư Hoàng Hà cam kết trở thành điểm tựa vững chắc cho mọi thế hệ học sinh Thành phố Thanh Hoá trong hành trình chinh phục các kỳ thi chuyển cấp – đặc biệt là kỳ thi vào lớp 10. Với lộ trình học tập bài bản, sát năng lực và chiến lược ôn luyện rõ ràng, chúng tôi đồng hành cùng học sinh từ những nền móng đầu tiên đến khi tự tin bứt phá.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md dark:bg-gray-800">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-50 dark:bg-green-900 flex-shrink-0">
                  <img src="/images/logo.png" alt="Logo Trung tâm" className="w-10 h-10 object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">Xây dựng môi trường học tập tốt, thân thiện</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    Chúng tôi chú trọng tạo dựng một không gian học tập tích cực, nơi mỗi học sinh đều được tôn trọng và tin tưởng vượt lên chính mình. Không chỉ là nơi dạy – học, Hoàng Hà còn là một góc học tập cởi mở, thân thiện, sẵn sàng lắng nghe và cùng nhau trưởng thành.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md dark:bg-gray-800">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-50 dark:bg-yellow-900 flex-shrink-0">
                  <img src="/images/logo.png" alt="Logo Trung tâm" className="w-10 h-10 object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">Lấy Học viên làm trung tâm - Tâm huyết làm nền tảng</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    Mọi hoạt động của Trung tâm đều xoay quanh nhu cầu và sự tiến bộ của học viên. Với tinh thần phụng sự và tâm huyết không ngừng nghỉ, chúng tôi luôn nỗ lực nâng cao chất lượng giảng dạy và phát triển nhân lực trí tuệ, đóng góp vào sự phát triển chung Giáo dục Tỉnh nhà.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md dark:bg-gray-800">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-50 dark:bg-purple-900 flex-shrink-0">
                  <img src="/images/logo.png" alt="Logo Trung tâm" className="w-10 h-10 object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">Không chỉ truyền dạy kiến thức – mà còn rèn luyện nhân cách</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    Tại Hoàng Hà, việc dạy chữ luôn song hành cùng rèn luyện con người. Chúng tôi đề cao việc hình thành nhân cách, thái độ học tập và trách nhiệm cá nhân cho học viên, để mỗi em không chỉ giỏi về kiến thức, mà còn sống tử tế, yêu thương Gia đình, sống có mục tiêu và biết vươn lên trong cuộc sống.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dịch vụ cung cấp */}
      <section className="section-padding bg-white dark:bg-gray-900" id="services">
        <div className="container-custom">
          <SectionHeading title="Chúng tôi cung cấp" id="services-heading" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 flex flex-col items-center">
              <div className="w-16 h-16 mb-3 rounded-full flex items-center justify-center bg-blue-50 dark:bg-blue-900">
                <Home className="w-10 h-10 text-blue-500 dark:text-blue-300" />
              </div>
              <div className="font-semibold mb-1 text-gray-900 dark:text-gray-100">Gia sư tại nhà 1 kèm 1</div>
              <div className="text-gray-600 dark:text-gray-300 text-sm text-center">
                Đội ngũ Gia sư bao gồm Giáo viên và Sinh viên chuyên môn tốt, tận tâm. Dạy kèm ngay tại nhà với phương pháp kèm cặp sát sao, giáo án được cá nhân hoá học sinh giúp tối ưu thời gian di chuyển và học tập.
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 flex flex-col items-center">
              <div className="w-16 h-16 mb-3 rounded-full flex items-center justify-center bg-green-50 dark:bg-green-900">
                <Users className="w-10 h-10 text-green-500 dark:text-green-300" />
              </div>
              <div className="font-semibold mb-1 text-gray-900 dark:text-gray-100">Gia sư nhóm nhỏ</div>
              <div className="text-gray-600 dark:text-gray-300 text-sm text-center">
                Gia sư dạy kèm tại nhà nhóm nhỏ từ 2 đến 3 bạn, với phương pháp kèm cặp sát sao, giáo án linh hoạt phù hợp từng bạn, giúp các bạn Học viên trải nghiệm học tập ngay tại nhà cũng như Phụ huynh giảm tải học phí mà vẫn hiệu quả.
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 flex flex-col items-center">
              <div className="w-16 h-16 mb-3 rounded-full flex items-center justify-center bg-yellow-50 dark:bg-yellow-900">
                <School className="w-10 h-10 text-yellow-500 dark:text-yellow-300" />
              </div>
              <div className="font-semibold mb-1 text-gray-900 dark:text-gray-100">Chiêu sinh mở lớp</div>
              <div className="text-gray-600 dark:text-gray-300 text-sm text-center">
                Các lớp học tại Trung tâm bao gồm Tiền Tiểu học, Lớp Toán, Văn và Tiếng Anh sĩ số từ 10 đến 12 học viên được đứng lớp bới các Giáo viên nhiều năm kinh nghiệm giảng dạy giúp Học viên trải nghiệm không gian học tập thoáng mát rộng rãi, phù hợp với các Phụ huynh có điều kiện thu nhập vừa hoặc thấp.
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 flex flex-col items-center">
              <div className="w-16 h-16 mb-3 rounded-full flex items-center justify-center bg-purple-50 dark:bg-purple-900">
                <MessageCircle className="w-10 h-10 text-purple-500 dark:text-purple-300" />
              </div>
              <div className="font-semibold mb-1 text-gray-900 dark:text-gray-100">Tư vấn, định hướng giáo dục</div>
              <div className="text-gray-600 dark:text-gray-300 text-sm text-center">
                Hỗ trợ tư vấn các Phụ huynh và Học viên bởi đội ngũ Giáo viên và Chuyên gia nhiều năm kinh nghiệm trong ngành giáo dục tại địa phương. Giúp các Phụ huynh hiểu hơn về lực học cũng như đưa ra các định hướng đúng đắn để giúp con em mình tiến bộ và đạt được mục tiêu học tập đã đề ra.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {tutors.length > 0 ? (
        <section id="team" className="section-padding bg-gray-50 dark:bg-gray-900" aria-labelledby="team-heading">
          <div className="container-custom">
            <SectionHeading
              title="Đội ngũ giáo viên"
              id="team-heading"
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
        <section id="team" className="section-padding bg-gray-50 dark:bg-gray-900" aria-labelledby="team-heading">
          <div className="container-custom">
            <SectionHeading
              title="Đội ngũ giáo viên"
              id="team-heading"
            />
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">Thông tin giáo viên sẽ được cập nhật sớm.</p>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      <section className="section-padding bg-white dark:bg-gray-900" aria-labelledby="gallery-heading" id="gallery">
        <div className="container-custom">
          <SectionHeading
            title="Hình ảnh thực tế"
            id="gallery-heading"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
            {loading
              ? Array(10).fill(0).map((_, idx) => (
                <div key={idx} className="overflow-hidden rounded-lg shadow-md group relative">
                  <SkeletonLoading type="banner" height="160px" />
                </div>
              ))
              : [
                '/images/real-photos/3d771690d24865163c59.jpg',
                '/images/real-photos/786448b78c6f3b31627e.jpg',
                '/images/real-photos/bf72059fc14776192f56.jpg',
                '/images/real-photos/37a0735db78500db5994.jpg',
                '/images/real-photos/e6bc4d52898a3ed4679b.jpg',
                '/images/real-photos/cf33f8c83c108b4ed201.jpg',
                '/images/real-photos/d7391421d0f967a73ee8.jpg',
                '/images/real-photos/0021e9c32d1b9a45c30a.jpg',
                '/images/real-photos/024a47b98361343f6d70.jpg',
                '/images/real-photos/fbf5ce260afebda0e4ef.jpg',
              ].map((url, idx) => (
                <div key={url} className="overflow-hidden rounded-lg shadow-md group relative cursor-pointer" onClick={() => setPreviewImg(url)}>
                  <img
                    src={url}
                    alt={`Hình thực tế ${idx + 1}`}
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
          </div>
          {/* Dialog preview */}
          <Dialog open={!!previewImg} onOpenChange={open => !open && setPreviewImg(null)}>
            <DialogContent className="max-w-3xl flex flex-col items-center">
              {previewImg ? (
                <img
                  src={previewImg}
                  alt="Preview"
                  className="w-full max-h-[80vh] object-contain rounded-lg"
                  loading="lazy"
                  onLoad={e => e.currentTarget.classList.remove('opacity-0')}
                  style={{ transition: 'opacity 0.3s' }}
                />
              ) : (
                <SkeletonLoading type="banner" height="400px" className="w-full" />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </section>
      {/* End Gallery Section */}

      {/* Thư ngỏ từ trung tâm */}
      <section className="section-padding bg-gray-50 dark:bg-gray-900" id="letter">
        <div className="container-custom flex flex-col md:flex-row items-center gap-8">
          <img src="https://images.unsplash.com/photo-1473186505569-9c61870c11f9?auto=format&fit=crop&w=800&q=80" alt="Thư ngỏ" className="min-w-[270px] max-w-[320px] w-full h-60 object-cover rounded-lg shadow mb-4 md:mb-0" />
          <div>
            <h2 className="text-2xl font-bold mb-2 text-primary-700 dark:text-primary-400">Thư ngỏ từ Trung tâm</h2>
            <p className="text-gray-700 dark:text-gray-200 text-lg mb-2">Kính gửi quý phụ huynh và học sinh,</p>
            <p className="text-gray-700 dark:text-gray-200 text-base mb-2">Trung tâm Gia Sư Hoàng Hà xin gửi lời cảm ơn chân thành đến quý phụ huynh và học sinh đã tin tưởng, đồng hành cùng chúng tôi trong suốt thời gian qua. Chúng tôi cam kết không ngừng nâng cao chất lượng giảng dạy, lấy sự tiến bộ của học sinh làm mục tiêu hàng đầu. Rất mong tiếp tục nhận được sự ủng hộ và hợp tác của quý vị!</p>
            <div className="mt-4 text-gray-600 dark:text-gray-300">Trân trọng,<br />Ban Giám Đốc Trung tâm Gia Sư Hoàng Hà</div>
          </div>
        </div>
      </section>

      <Chatbot />
    </Layout>
  );
};

export default AboutPage;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Banner from '../components/shared/Banner';
import SectionHeading from '../components/shared/SectionHeading';
import CourseCard from '../components/shared/CourseCard';
import { Banner as BannerType, CenterInfo, Course } from '../types';
import { getBanners, getCenterInfo, getFeaturedCourses } from '../services/dataService';
import Chatbot from '../components/shared/Chatbot';

const HomePage = () => {
     const [banners, setBanners] = useState<BannerType[]>([]);
     const [centerInfo, setCenterInfo] = useState<CenterInfo | null>(null);
     const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          const fetchData = async () => {
               try {
                    setLoading(true);
                    const [bannersData, centerInfoData, featuredCoursesData] = await Promise.all([
                         getBanners(),
                         getCenterInfo(),
                         getFeaturedCourses()
                    ]);

                    setBanners(bannersData);
                    setCenterInfo(centerInfoData);
                    setFeaturedCourses(featuredCoursesData);
               } catch (error) {
                    console.error('Error fetching home page data:', error);
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

     return (
          <Layout>
               {/* Banner Section */}
               <section>
                    <Banner banners={banners} />
               </section>

               {/* Introduction Section */}
               {centerInfo && (
                    <section className="section-padding bg-gray-50">
                         <div className="container-custom">
                              <SectionHeading
                                   title="Về Trung Tâm Gia Sư Hoàng Hà"
                                   subtitle="Đồng hành cùng sự phát triển của thế hệ trẻ"
                              />

                              <div className="max-w-4xl mx-auto">
                                   <p className="text-gray-700 mb-6 text-center">
                                        {centerInfo.description}
                                   </p>

                                   <div className="flex justify-center">
                                        <Link to="/about" className="btn-primary">
                                             Tìm hiểu thêm
                                        </Link>
                                   </div>
                              </div>
                         </div>
                    </section>
               )}

               {/* Featured Courses Section */}
               <section className="section-padding">
                    <div className="container-custom">
                         <SectionHeading
                              title="Khóa Học Nổi Bật"
                              subtitle="Các khóa học được nhiều học viên lựa chọn và đánh giá cao"
                         />

                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                              {featuredCourses.map(course => (
                                   <CourseCard key={course.id} course={course} />
                              ))}
                         </div>

                         <div className="mt-12 text-center">
                              <Link to="/courses" className="btn-primary">
                                   Xem tất cả khóa học
                              </Link>
                         </div>
                    </div>
               </section>

               {/* Contact CTA Section */}
               <section className="section-padding bg-primary text-white">
                    <div className="container-custom text-center">
                         <h2 className="text-3xl font-bold mb-4">Bạn cần tư vấn về khóa học?</h2>
                         <p className="mb-8 max-w-2xl mx-auto">
                              Hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí về các khóa học
                              phù hợp nhất với nhu cầu của bạn hoặc con em của bạn.
                         </p>
                         <div className="flex flex-col sm:flex-row justify-center gap-4">
                              <Link
                                   to="/contact"
                                   className="bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                              >
                                   Liên hệ ngay
                              </Link>
                              <Link
                                   to="/courses"
                                   className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-primary transition-colors"
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
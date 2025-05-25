import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SectionHeading from '../components/shared/SectionHeading';
import { Course, Schedule } from '../types';
import { getCourseById, getSchedulesByCourseId } from '../services/dataService';
import {
  calculateDiscountedPrice,
  formatCurrency,
  formatDate,
  isDiscountValid,
} from '../utils/helpers';
import { generateCourseSEO, generateCourseStructuredData } from '../utils/seo';
import SEOHead from '../components/shared/SEOHead';
import Chatbot from '../components/shared/Chatbot';

const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | undefined>(undefined);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const [courseData, schedulesData] = await Promise.all([
          getCourseById(id),
          getSchedulesByCourseId(id),
        ]);

        setCourse(courseData);
        setSchedules(schedulesData);
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="container-custom py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy khóa học</h2>
          <p className="text-gray-600 mb-8">
            Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link to="/courses" className="btn-primary">
            Quay lại danh sách khóa học
          </Link>
        </div>
      </Layout>
    );
  }

  const hasValidDiscount = course.discount && isDiscountValid(course.discountEndDate);
  const finalPrice = hasValidDiscount
    ? calculateDiscountedPrice(course.price, course.discount)
    : course.price;

  return (
    <Layout>
      {/* SEO Head */}
      {course && (
        <SEOHead
          seoData={generateCourseSEO(course.name, course.description, id!)}
          structuredData={generateCourseStructuredData(course)}
        />
      )}

      {/* Hero Section */}
      <section className="bg-gray-100 py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{course.name}</h1>
              <p className="text-gray-600 mb-6">{course.description}</p>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                  <p className="text-gray-700 mb-1">
                    <strong>Đối tượng:</strong> {course.targetAudience}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <strong>Lịch học:</strong> {course.schedule}
                  </p>
                  <p className="text-gray-700">
                    <strong>Thể loại:</strong> {course.category}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    {hasValidDiscount ? (
                      <div>
                        <span className="text-gray-500 line-through text-sm block">
                          {formatCurrency(course.price)}
                        </span>
                        <span className="text-primary font-bold text-2xl">
                          {formatCurrency(finalPrice)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-primary font-bold text-2xl">
                        {formatCurrency(course.price)}
                      </span>
                    )}
                  </div>

                  {hasValidDiscount && (
                    <div className="bg-primary text-white px-3 py-1 rounded-lg">
                      Giảm {course.discount}% đến{' '}
                      {course.discountEndDate && formatDate(course.discountEndDate)}
                    </div>
                  )}
                </div>

                <Link
                  to={`/courses/${course.id}/register`}
                  className="btn-primary w-full block text-center"
                >
                  Đăng ký ngay
                </Link>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-lg">
              <img src={course.imageUrl} alt={course.name} className="w-full h-96 object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      {schedules.length > 0 && (
        <section className="section-padding">
          <div className="container-custom">
            <SectionHeading
              title="Lịch học sắp tới"
              subtitle="Các buổi học được lên lịch cho khóa học này"
            />

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Ngày học</th>
                    <th className="py-3 px-4 text-left">Thời gian</th>
                    <th className="py-3 px-4 text-left">Giáo viên</th>
                    <th className="py-3 px-4 text-left">Phòng</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map(schedule => (
                    <tr key={schedule.id} className="border-t border-gray-200">
                      <td className="py-3 px-4">{formatDate(schedule.date)}</td>
                      <td className="py-3 px-4">
                        {schedule.startTime} - {schedule.endTime}
                      </td>
                      <td className="py-3 px-4">{schedule.tutor}</td>
                      <td className="py-3 px-4">{schedule.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Related Courses - would be implemented in a real app */}

      {/* Registration CTA */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Sẵn sàng để bắt đầu hành trình học tập?</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Đăng ký ngay hôm nay để được học với đội ngũ giáo viên chất lượng cao của chúng tôi.
          </p>
          <Link
            to={`/courses/${course.id}/register`}
            className="bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block"
          >
            Đăng ký khóa học
          </Link>
        </div>
      </section>
      <Chatbot />
    </Layout>
  );
};

export default CourseDetailPage;

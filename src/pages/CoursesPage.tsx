import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import SectionHeading from '../components/shared/SectionHeading';
import CourseCard from '../components/shared/CourseCard';
import { Course } from '../types';
import coursesService from '../services/firestore/coursesService';
import { updateSEO, seoData } from '../utils/seo';
import { convertFirestoreCourse, extractCourseCategories, filterCoursesByCategory } from '../utils/courseHelpers';
import Chatbot from '../components/shared/Chatbot';
import ErrorDisplay from '../components/shared/ErrorDisplay';

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Update SEO for courses page
    updateSEO(seoData.courses);

    setLoading(true);
    setError(null);

    // Set up real-time listener for active courses
    const unsubscribe = coursesService.subscribeToActiveCourses((firestoreCourses: any[]) => {
      try {
        // Convert Firestore courses to Course type
        const coursesData = firestoreCourses.map(convertFirestoreCourse);
        setCourses(coursesData);
        setFilteredCourses(coursesData);

        // Extract unique categories from courses
        const uniqueCategories = extractCourseCategories(firestoreCourses);
        setCategories(uniqueCategories);

        setLoading(false);
        setError(null);
      } catch (error: any) {
        console.error('Error processing courses:', error);
        setError(error.message || 'Không thể xử lý danh sách khóa học');
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const filtered = filterCoursesByCategory(courses, selectedCategory);
    setFilteredCourses(filtered);
  }, [selectedCategory, courses]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

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
          message="Không thể tải danh sách khóa học"
          details={error}
          retryLabel="Thử lại"
        />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gray-100 dark:bg-gray-900 py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">Khóa Học</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
            Khám phá các khóa học chất lượng cao, được thiết kế phù hợp với mọi lứa tuổi và nhu cầu
            học tập
          </p>
          <div className="flex justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div>
              <span className="font-semibold text-primary">{courses.length}</span> khóa học
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            title="Khóa Học"
            subtitle="Các khóa học được quản lý và cập nhật thường xuyên"
          />

          <div className="mb-10">
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-md ${selectedCategory === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'
                  } transition-colors`}
              >
                Tất cả
              </button>

              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-md ${selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'
                    } transition-colors`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">Không tìm thấy khóa học nào.</p>
            </div>
          )}
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />
    </Layout>
  );
};

export default CoursesPage;

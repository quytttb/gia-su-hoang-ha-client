import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import SectionHeading from '../components/shared/SectionHeading';
import CourseCard from '../components/shared/CourseCard';
import { Course } from '../types';
import { getAllCourses } from '../services/dataService';
import Chatbot from '../components/shared/Chatbot';

const CoursesPage = () => {
     const [courses, setCourses] = useState<Course[]>([]);
     const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
     const [categories, setCategories] = useState<string[]>([]);
     const [selectedCategory, setSelectedCategory] = useState<string>('all');
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          const fetchData = async () => {
               try {
                    setLoading(true);
                    const coursesData = await getAllCourses();
                    setCourses(coursesData);
                    setFilteredCourses(coursesData);

                    // Extract unique categories
                    const uniqueCategories = Array.from(new Set(coursesData.map(course => course.category)));
                    setCategories(uniqueCategories);
               } catch (error) {
                    console.error('Error fetching courses:', error);
               } finally {
                    setLoading(false);
               }
          };

          fetchData();
     }, []);

     useEffect(() => {
          if (selectedCategory === 'all') {
               setFilteredCourses(courses);
          } else {
               const filtered = courses.filter(course => course.category === selectedCategory);
               setFilteredCourses(filtered);
          }
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

     return (
          <Layout>
               {/* Hero Section */}
               <section className="bg-gray-100 py-16">
                    <div className="container-custom text-center">
                         <h1 className="text-4xl font-bold text-gray-800 mb-4">Khóa Học</h1>
                         <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                              Khám phá các khóa học chất lượng cao, được thiết kế phù hợp với mọi lứa tuổi và nhu cầu học tập
                         </p>
                    </div>
               </section>

               {/* Courses Section */}
               <section className="section-padding">
                    <div className="container-custom">
                         <div className="mb-10">
                              <div className="flex flex-wrap justify-center gap-3 mb-6">
                                   <button
                                        onClick={() => handleCategoryChange('all')}
                                        className={`px-4 py-2 rounded-md ${selectedCategory === 'all'
                                             ? 'bg-primary text-white'
                                             : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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

               {/* Registration CTA */}
               <section className="section-padding bg-gray-100">
                    <div className="container-custom text-center">
                         <SectionHeading
                              title="Bạn muốn đăng ký học?"
                              subtitle="Liên hệ với chúng tôi để được tư vấn và chọn khóa học phù hợp nhất"
                         />
                         <div className="max-w-lg mx-auto mt-6">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                   <a
                                        href="tel:0987654321"
                                        className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center"
                                   >
                                        Gọi ngay
                                   </a>
                                   <a
                                        href="mailto:lienhe@giasuhoangha.com"
                                        className="border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
                                   >
                                        Gửi Email
                                   </a>
                              </div>
                         </div>
                    </div>
               </section>
               <Chatbot />
          </Layout>
     );
};

export default CoursesPage;
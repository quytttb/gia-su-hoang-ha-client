import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import SectionHeading from '../components/shared/SectionHeading';
import ClassCard from '../components/shared/ClassCard';
import { Class } from '../types';
import classesService from '../services/firestore/classesService';
import { updateSEO, seoData } from '../utils/seo';
import { convertFirestoreClass, extractClassCategories, filterClassesByCategory } from '../utils/classHelpers';
import Chatbot from '../components/shared/Chatbot';
import ErrorDisplay from '../components/shared/ErrorDisplay';

const ClassesPage = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Update SEO for classes page
    updateSEO(seoData.classes);

    setLoading(true);
    setError(null);

    // Set up real-time listener for active classes
    const unsubscribe = classesService.subscribeToActiveClasses((firestoreClasses: any[]) => {
      try {
        // Convert Firestore classes to Class type
        const classesData = firestoreClasses.map(convertFirestoreClass);
        setClasses(classesData);
        setFilteredClasses(classesData);

        // Extract unique categories from classes
        const uniqueCategories = extractClassCategories();
        setCategories(uniqueCategories);

        setLoading(false);
        setError(null);
      } catch (error: any) {
        console.error('Error processing classes:', error);
        setError(error.message || 'Không thể xử lý danh sách lớp học');
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const filtered = filterClassesByCategory(classes, selectedCategory);
    setFilteredClasses(filtered);
  }, [selectedCategory, classes]);

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
          message="Không thể tải danh sách lớp học"
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
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">Lớp Học</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
            Khám phá các lớp học chất lượng cao, được thiết kế phù hợp với mọi lứa tuổi và nhu cầu
            học tập
          </p>
          <div className="flex justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div>
              <span className="font-semibold text-primary">{classes.length}</span> lớp học
            </div>
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            title="Lớp Học"
            subtitle="Các lớp học được quản lý và cập nhật thường xuyên"
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

          {filteredClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredClasses.map(classData => (
                <ClassCard key={classData.id} class={classData} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">Không tìm thấy lớp học nào.</p>
            </div>
          )}
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />
    </Layout>
  );
};

export default ClassesPage;

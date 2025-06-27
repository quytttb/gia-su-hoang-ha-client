import { useEffect, useState, Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Banner as BannerType, CenterInfo, Class } from '../types';
import { bannerService } from '../services/bannerService';
import classesService from '../services/firestore/classesService';
import settingsService from '../services/firestore/settingsService';
import { updateSEO, seoData } from '../utils/seo';
import { convertFirestoreClass, getFeaturedClasses } from '../utils/classHelpers';
import ErrorDisplay from '../components/shared/ErrorDisplay';
import BlogSection from '../components/home/BlogSection';
import BannerSection from '../components/home/BannerSection';
import IntroductionSection from '../components/home/IntroductionSection';
import FeaturedClassesSection from '../components/home/FeaturedClassesSection';
import ContactCTASection from '../components/home/ContactCTASection';
import ParentFeedbackSection from '../components/home/ParentFeedbackSection';

const Chatbot = lazy(() => import('../components/shared/Chatbot'));

const HomePage = () => {
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [centerInfo, setCenterInfo] = useState<CenterInfo | null>(null);
  const [featuredClasses, setFeaturedClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    // Update SEO for homepage
    updateSEO(seoData.home);

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch banners và center info song song
        const [bannersResult, centerInfoResult] = await Promise.all([
          bannerService.getActiveBanners(),
          settingsService.getCenterInfo(),
        ]);
        setBanners(bannersResult);
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
        <BannerSection banners={[]} loading />
        <IntroductionSection
          centerInfo={{
            id: '',
            name: '',
            description: '',
            address: '',
            phone: '',
            email: '',
            history: '',
            mission: '',
            vision: '',
            slogan: '',
            workingHours: { weekdays: '', weekend: '' }
          }}
          loading
        />
        <FeaturedClassesSection featuredClasses={[]} loading />
        <div className="section-padding" />
        <ContactCTASection />
        <ParentFeedbackSection loading />
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
      <div id="banner">
        <BannerSection banners={banners} />
      </div>
      <div id="introduction">
        {centerInfo && <IntroductionSection centerInfo={centerInfo} />}
      </div>
      <div id="featured-classes">
        <FeaturedClassesSection featuredClasses={featuredClasses} />
      </div>
      <div id="blog">
        <BlogSection />
      </div>
      <div id="feedback">
        <ParentFeedbackSection />
      </div>
      <div id="contact">
        <ContactCTASection />
      </div>
      <Suspense fallback={null}>
        <Chatbot />
      </Suspense>
    </Layout>
  );
};

export default HomePage;

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initGA, trackPageView, trackPerformance } from '../../utils/analytics';
import { initializeUserInteractionTracking } from '../../utils/userInteractionTracking';

const AnalyticsTracker = () => {
     const location = useLocation();

     // Initialize GA on mount
     useEffect(() => {
          initGA();
          trackPerformance();
          initializeUserInteractionTracking();
     }, []);

     // Track page views on route change
     useEffect(() => {
          const pageTitles: Record<string, string> = {
               '/': 'Trang Chủ - Trung Tâm Gia Sư Hoàng Hà',
               '/about': 'Giới Thiệu - Trung Tâm Gia Sư Hoàng Hà',
               '/courses': 'Khóa Học - Trung Tâm Gia Sư Hoàng Hà',
               '/schedule': 'Lịch Học - Trung Tâm Gia Sư Hoàng Hà',
               '/contact': 'Liên Hệ - Trung Tâm Gia Sư Hoàng Hà',
               '/admin': 'Quản Trị - Trung Tâm Gia Sư Hoàng Hà',
          };

          // Get page title
          let pageTitle = pageTitles[location.pathname];

          // Handle dynamic routes
          if (location.pathname.startsWith('/courses/') && location.pathname.includes('/register')) {
               pageTitle = 'Đăng Ký Khóa Học - Trung Tâm Gia Sư Hoàng Hà';
          } else if (location.pathname.startsWith('/courses/')) {
               pageTitle = 'Chi Tiết Khóa Học - Trung Tâm Gia Sư Hoàng Hà';
          }

          // Track page view
          trackPageView(location.pathname + location.search, pageTitle);
     }, [location]);

     return null; // This component doesn't render anything
};

export default AnalyticsTracker; 
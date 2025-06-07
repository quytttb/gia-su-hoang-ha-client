import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Loading from './components/shared/Loading';
import AnalyticsTracker from './components/shared/AnalyticsTracker';
import ScrollToTop from './components/common/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ClassesPage = lazy(() => import('./pages/ClassesPage'));
const ClassDetailPage = lazy(() => import('./pages/ClassDetailPage'));
const ClassRegistrationPage = lazy(() => import('./pages/ClassRegistrationPage'));
const TutorSearchPage = lazy(() => import('./pages/TutorSearchPage'));
const TutorRegistrationPage = lazy(() => import('./pages/TutorRegistrationPage'));
const SchedulePage = lazy(() => import('./pages/SchedulePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const TestPage = lazy(() => import('./pages/Test'));
const TestErrorPage = lazy(() => import('./pages/TestError'));

// Admin pages
const AdminClassesPage = lazy(() => import('./pages/admin/AdminClassesPage'));
const AdminSchedulesPage = lazy(() => import('./pages/admin/AdminSchedulesPage'));
const AdminRegistrationsPage = lazy(() => import('./pages/admin/AdminRegistrationsPage'));
const AdminInquiriesPage = lazy(() => import('./pages/admin/AdminInquiriesPage'));
const AdminBannersPage = lazy(() => import('./pages/admin/AdminBannersPage'));
const AdminStaffPage = lazy(() => import('./pages/admin/AdminStaffPage'));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));
const AdminTutorsPage = lazy(() => import('./pages/admin/AdminTutorsPage'));

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AnalyticsTracker />
          <Suspense fallback={<Loading message="Đang tải trang..." />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/classes" element={<ClassesPage />} />
              <Route path="/classes/:id" element={<ClassDetailPage />} />
              <Route path="/classes/:id/register" element={<ClassRegistrationPage />} />
              <Route path="/tutor-search" element={<TutorSearchPage />} />
              <Route path="/tutor-search/register" element={<TutorRegistrationPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/test-error" element={<TestErrorPage />} />
              {/* Panel Routes */}
              <Route
                path="/panel"
                element={
                  <ProtectedRoute requiredRoles={['admin', 'staff']}>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/panel/classes"
                element={
                  <ProtectedRoute requiredRoles={['admin', 'staff']}>
                    <AdminClassesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/panel/schedules"
                element={
                  <ProtectedRoute requiredRoles={['admin', 'staff']}>
                    <AdminSchedulesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/panel/registrations"
                element={
                  <ProtectedRoute requiredRoles={['admin', 'staff']}>
                    <AdminRegistrationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/panel/inquiries"
                element={
                  <ProtectedRoute requiredRoles={['admin', 'staff']}>
                    <AdminInquiriesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/panel/banners"
                element={
                  <ProtectedRoute requiredRoles={['admin', 'staff']}>
                    <AdminBannersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/panel/staff"
                element={
                  <ProtectedRoute requiredRoles={['admin']}>
                    <AdminStaffPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/panel/analytics"
                element={
                  <ProtectedRoute requiredRoles={['admin', 'staff']}>
                    <AdminAnalyticsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/panel/settings"
                element={
                  <ProtectedRoute requiredRoles={['admin']}>
                    <AdminSettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/panel/tutors"
                element={
                  <ProtectedRoute requiredRoles={['admin', 'staff']}>
                    <AdminTutorsPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

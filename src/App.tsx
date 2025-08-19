import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Loading from './components/shared/Loading';
import AnalyticsTracker from './components/shared/AnalyticsTracker';
import ScrollToTop from './components/shared/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { SpeedInsights } from '@vercel/speed-insights/react';

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
const PanelPage = lazy(() => import('./pages/PanelPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const TestPage = lazy(() => import('./pages/Test'));
const TestErrorPage = lazy(() => import('./pages/TestError'));

// Panel pages
const PanelClassesPage = lazy(() => import('./pages/panel/ClassesPage'));
const PanelSchedulesPage = lazy(() => import('./pages/panel/SchedulesPage'));
const PanelRegistrationsPage = lazy(() => import('./pages/panel/RegistrationsPage'));
const PanelInquiriesPage = lazy(() => import('./pages/panel/InquiriesPage'));
const PanelBannersPage = lazy(() => import('./pages/panel/BannersPage'));
const PanelStaffPage = lazy(() => import('./pages/panel/StaffPage'));
const PanelAnalyticsPage = lazy(() => import('./pages/panel/AnalyticsPage'));
const PanelSettingsPage = lazy(() => import('./pages/panel/SettingsPage'));
const PanelTutorsPage = lazy(() => import('./pages/panel/TutorsPage'));
const PanelBlogPostsPage = lazy(() => import('./pages/panel/BlogPostsPage'));

const NotFound = lazy(() => import('./pages/NotFound'));

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <ToastProvider>
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
                  <Route path="/blog/:slug" element={<BlogDetailPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/test" element={<TestPage />} />
                  <Route path="/test-error" element={<TestErrorPage />} />
                  {/* Panel Routes */}
                  <Route
                    path="/panel"
                    element={
                      <ProtectedRoute requiredRoles={['admin', 'staff']}>
                        <PanelPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/panel/classes"
                    element={
                      <ProtectedRoute requiredRoles={['admin', 'staff']}>
                        <PanelClassesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/panel/schedules"
                    element={
                      <ProtectedRoute requiredRoles={['admin', 'staff']}>
                        <PanelSchedulesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/panel/registrations"
                    element={
                      <ProtectedRoute requiredRoles={['admin', 'staff']}>
                        <PanelRegistrationsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/panel/inquiries"
                    element={
                      <ProtectedRoute requiredRoles={['admin', 'staff']}>
                        <PanelInquiriesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/panel/banners"
                    element={
                      <ProtectedRoute requiredRoles={['admin', 'staff']}>
                        <PanelBannersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/panel/staff"
                    element={
                      <ProtectedRoute requiredRoles={['admin']}>
                        <PanelStaffPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/panel/analytics"
                    element={
                      <ProtectedRoute requiredRoles={['admin', 'staff']}>
                        <PanelAnalyticsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/panel/settings"
                    element={
                      <ProtectedRoute requiredRoles={['admin']}>
                        <PanelSettingsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/panel/tutors"
                    element={
                      <ProtectedRoute requiredRoles={['admin', 'staff']}>
                        <PanelTutorsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/panel/blog-posts"
                    element={
                      <ProtectedRoute requiredRoles={['admin', 'staff']}>
                        <PanelBlogPostsPage />
                      </ProtectedRoute>
                    }
                  />
                  {/* Catch all route for 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ToastProvider>
        </NotificationProvider>
      </AuthProvider>
      <SpeedInsights />
    </ThemeProvider>
  );
};

export default App;

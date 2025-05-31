import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Loading from './components/shared/Loading';
import AnalyticsTracker from './components/shared/AnalyticsTracker';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
const CourseRegistrationPage = lazy(() => import('./pages/CourseRegistrationPage'));
const SchedulePage = lazy(() => import('./pages/SchedulePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const TestPage = lazy(() => import('./pages/Test'));
const TestErrorPage = lazy(() => import('./pages/TestError'));

// Admin pages
const AdminCoursesPage = lazy(() => import('./pages/admin/AdminCoursesPage'));
const AdminSchedulesPage = lazy(() => import('./pages/admin/AdminSchedulesPage'));
const AdminRegistrationsPage = lazy(() => import('./pages/admin/AdminRegistrationsPage'));
const AdminInquiriesPage = lazy(() => import('./pages/admin/AdminInquiriesPage'));
const AdminBannersPage = lazy(() => import('./pages/admin/AdminBannersPage'));
const AdminStaffPage = lazy(() => import('./pages/admin/AdminStaffPage'));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AnalyticsTracker />
          <Suspense fallback={<Loading message="Đang tải trang..." />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/courses/:id/register" element={<CourseRegistrationPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/contact" element={<ContactPage />} />
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
                path="/panel/courses"
                element={
                  <ProtectedRoute requiredRoles={['admin', 'staff']}>
                    <AdminCoursesPage />
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
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

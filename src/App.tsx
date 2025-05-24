import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import CourseRegistrationPage from './pages/CourseRegistrationPage';
import SchedulePage from './pages/SchedulePage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

const App = () => {
     return (
          <BrowserRouter>
               <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/courses/:id" element={<CourseDetailPage />} />
                    <Route path="/courses/:id/register" element={<CourseRegistrationPage />} />
                    <Route path="/schedule" element={<SchedulePage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/admin" element={<AdminPage />} />
               </Routes>
          </BrowserRouter>
     );
};

export default App; 
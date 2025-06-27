import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isContactPage = location.pathname === '/contact';
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <main className={`flex-grow page-transition relative z-10 pt-28 ${isHomePage ? 'pb-0' : 'pb-16'}`}>{children}</main>
      <Footer isContactPage={isContactPage} />
    </div>
  );
};

export default Layout;

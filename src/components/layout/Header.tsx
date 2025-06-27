import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import ThemeToggle from '../shared/ThemeToggle';
import Logo from '../shared/Logo';

interface DropdownItem {
  name: string;
  href: string;
}

interface NavigationItem {
  name: string;
  href: string;
  hasDropdown?: boolean;
  dropdown?: DropdownItem[];
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation: NavigationItem[] = [
    {
      name: 'Trang chủ',
      href: '/',
      hasDropdown: true,
      dropdown: [
        { name: 'Trang chủ', href: '/' },
        { name: 'Giới thiệu', href: '/#introduction' },
        { name: 'Lớp học nổi bật', href: '/#featured-classes' },
        { name: 'Chia sẻ của phụ huynh', href: '/#feedback' },
        { name: 'Tin tức & Blog', href: '/#blog' },
        { name: 'Liên hệ', href: '/#contact' },
      ]
    },
    {
      name: 'Về chúng tôi',
      href: '/about',
      hasDropdown: true,
      dropdown: [
        { name: 'Giới thiệu', href: '/about' },
        { name: 'Sứ mệnh & Tầm nhìn', href: '/about#mission-vision' },
        { name: 'Lịch sử phát triển', href: '/about#history' },
        { name: 'Đội ngũ giáo viên', href: '/about#team' },
      ]
    },
    { name: 'Lớp học', href: '/classes' },
    { name: 'Tìm gia sư', href: '/tutor-search' },
    { name: 'Lịch học', href: '/schedule' },
    {
      name: 'Blog',
      href: '/blog',
      hasDropdown: true,
      dropdown: [
        { name: 'Tất cả bài viết', href: '/blog' },
        { name: 'Bài viết nổi bật', href: '/blog#featured-posts' },
        { name: 'Chủ đề', href: '/blog#categories' },
        { name: 'Tìm kiếm', href: '/blog#search-filter' },
        { name: 'Bài viết mới nhất', href: '/blog#latest-posts' },
      ]
    },
    { name: 'Liên hệ', href: '/contact' },
  ];

  // Check if current path matches navigation item
  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href.split('#')[0]);
  };

  // Handle smooth scroll to section
  const handleSectionClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();

    if (href.includes('#')) {
      const [path, sectionId] = href.split('#');

      // If we're on the same page, just scroll
      if (location.pathname === path) {
        const element = document.getElementById(sectionId);
        if (element) {
          const headerHeight = 80; // Adjust based on your header height
          const elementPosition = element.offsetTop - headerHeight;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
        }
      } else {
        // Navigate to the page with hash
        navigate(href);
      }
    } else {
      // Regular navigation
      navigate(href);
    }

    // Close mobile menu if open
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900/20 transition-colors duration-200">
      <div className="container-custom">
        <div className="flex justify-between items-center py-3 md:py-4">
          <div className="flex items-center">
            <Logo variant="text" size="lg" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            {navigation.map(item => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <div className="relative group">
                    <Link
                      to={item.href}
                      className={`px-3 py-2 rounded-full font-medium transition-all duration-200 flex items-center ${isActive(item.href)
                        ? 'bg-primary text-white shadow-lg transform scale-105'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20'
                        }`}
                    >
                      {item.name}
                      <ChevronDownIcon className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180" />
                    </Link>

                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 dropdown-menu">
                      {/* Arrow pointer */}
                      <div className="dropdown-arrow"></div>
                      <div className="py-2">
                        {item.dropdown?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={dropdownItem.href}
                            onClick={(e) => handleSectionClick(dropdownItem.href, e)}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors duration-200"
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`px-3 py-2 rounded-full font-medium transition-all duration-200 ${isActive(item.href)
                      ? 'bg-primary text-white shadow-lg transform scale-105'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20'
                      }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            {/* Theme Toggle */}
            <ThemeToggle />
          </nav>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              type="button"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              {navigation.map(item => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <div>
                      <Link
                        to={item.href}
                        className={`block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${isActive(item.href)
                          ? 'text-white bg-primary shadow-md transform scale-105'
                          : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                      {/* Mobile Dropdown Items */}
                      <div className="ml-4 mt-1 space-y-1">
                        {item.dropdown?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={dropdownItem.href}
                            onClick={(e) => {
                              handleSectionClick(dropdownItem.href, e);
                              setIsOpen(false);
                            }}
                            className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${isActive(item.href)
                        ? 'text-white bg-primary shadow-md transform scale-105'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

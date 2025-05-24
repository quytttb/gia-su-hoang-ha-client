import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
     const [isOpen, setIsOpen] = useState(false);

     const navigation = [
          { name: 'Trang chủ', href: '/' },
          { name: 'Về chúng tôi', href: '/about' },
          { name: 'Khóa học', href: '/courses' },
          { name: 'Lịch học', href: '/schedule' },
          { name: 'Liên hệ', href: '/contact' },
     ];

     return (
          <header className="bg-white shadow-md">
               <div className="container-custom">
                    <div className="flex justify-between items-center py-4">
                         <div className="flex items-center">
                              <Link to="/" className="flex items-center">
                                   <span className="text-2xl font-bold text-primary">Gia Sư Hoàng Hà</span>
                              </Link>
                         </div>

                         {/* Desktop Navigation */}
                         <nav className="hidden md:flex space-x-8">
                              {navigation.map((item) => (
                                   <Link
                                        key={item.name}
                                        to={item.href}
                                        className="text-gray-700 hover:text-primary font-medium transition-colors"
                                   >
                                        {item.name}
                                   </Link>
                              ))}
                              <Link
                                   to="/admin"
                                   className="text-primary border border-primary px-4 py-2 rounded hover:bg-primary hover:text-white transition-colors"
                              >
                                   Nhân viên
                              </Link>
                         </nav>

                         {/* Mobile Navigation Button */}
                         <div className="md:hidden">
                              <button
                                   type="button"
                                   className="text-gray-500 hover:text-gray-700"
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
                         <div className="md:hidden">
                              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                   {navigation.map((item) => (
                                        <Link
                                             key={item.name}
                                             to={item.href}
                                             className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md"
                                             onClick={() => setIsOpen(false)}
                                        >
                                             {item.name}
                                        </Link>
                                   ))}
                                   <Link
                                        to="/admin"
                                        className="block px-3 py-2 text-base font-medium text-primary hover:bg-primary hover:text-white rounded-md transition-colors"
                                        onClick={() => setIsOpen(false)}
                                   >
                                        Nhân viên
                                   </Link>
                              </div>
                         </div>
                    )}
               </div>
          </header>
     );
};

export default Header; 
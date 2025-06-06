import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
     label: string;
     href?: string;
}

interface BreadcrumbProps {
     items?: BreadcrumbItem[];
     className?: string;
}

const routeLabels: Record<string, string> = {
     '/panel': 'Tổng quan',
     '/panel/classes': 'Lớp học',
     '/panel/schedules': 'Lịch học',
     '/panel/registrations': 'Đăng ký',
     '/panel/inquiries': 'Tin nhắn',
     '/panel/banners': 'Banner',
     '/panel/staff': 'Nhân viên',
     '/panel/analytics': 'Thống kê',
     '/panel/settings': 'Cài đặt',
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
     const location = useLocation();

     // Auto-generate breadcrumbs from pathname if items not provided
     const breadcrumbItems = items || (() => {
          const pathSegments = location.pathname.split('/').filter(Boolean);
          const generatedItems: BreadcrumbItem[] = [
               { label: 'Dashboard', href: '/panel' }
          ];

          let currentPath = '';
          pathSegments.forEach((segment, index) => {
               currentPath += `/${segment}`;

               if (currentPath !== '/panel') {
                    const label = routeLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
                    generatedItems.push({
                         label,
                         href: index === pathSegments.length - 1 ? undefined : currentPath
                    });
               }
          });

          return generatedItems;
     })();

     return (
          <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}>
               <Link
                    to="/"
                    className="flex items-center hover:text-foreground transition-colors"
               >
                    <Home className="h-4 w-4" />
               </Link>

               {breadcrumbItems.map((item, index) => (
                    <React.Fragment key={index}>
                         <ChevronRight className="h-4 w-4" />

                         {item.href ? (
                              <Link
                                   to={item.href}
                                   className="hover:text-foreground transition-colors"
                              >
                                   {item.label}
                              </Link>
                         ) : (
                              <span className="text-foreground font-medium">
                                   {item.label}
                              </span>
                         )}
                    </React.Fragment>
               ))}
          </nav>
     );
};

export default Breadcrumb; 
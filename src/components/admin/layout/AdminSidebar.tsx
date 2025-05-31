import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import {
     LayoutDashboard,
     BookOpen,
     Calendar,
     Users,
     MessageSquare,
     Image,
     UserCog,
     BarChart3,
     Settings,
     ChevronLeft,
     ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import Logo from '../../shared/Logo';

interface SidebarItem {
     title: string;
     href: string;
     icon: React.ComponentType<{ className?: string }>;
     badge?: string;
     adminOnly?: boolean;
}

const sidebarItems: SidebarItem[] = [
     {
          title: 'Tổng quan',
          href: '/panel',
          icon: LayoutDashboard,
     },
     {
          title: 'Banner',
          href: '/panel/banners',
          icon: Image,
     },
     {
          title: 'Khóa học',
          href: '/panel/courses',
          icon: BookOpen,
     },
     {
          title: 'Lịch học',
          href: '/panel/schedules',
          icon: Calendar,
     },
     {
          title: 'Đăng ký',
          href: '/panel/registrations',
          icon: Users,
          badge: 'Mới',
     },
     {
          title: 'Tin nhắn',
          href: '/panel/inquiries',
          icon: MessageSquare,
     },
     {
          title: 'Nhân viên',
          href: '/panel/staff',
          icon: UserCog,
          adminOnly: true,
     },
     {
          title: 'Thống kê',
          href: '/panel/analytics',
          icon: BarChart3,
     },
     {
          title: 'Cài đặt',
          href: '/panel/settings',
          icon: Settings,
          adminOnly: true,
     },
];

interface AdminSidebarProps {
     className?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ className }) => {
     const [collapsed, setCollapsed] = useState(false);
     const location = useLocation();
     const { user } = useAuth();

     const filteredItems = sidebarItems.filter(item => {
          if (item.adminOnly && user?.role !== 'admin') {
               return false;
          }
          return true;
     });

     const isActive = (href: string) => {
          if (href === '/panel') {
               return location.pathname === '/panel';
          }
          return location.pathname.startsWith(href);
     };

     return (
          <div className={cn(
               "relative flex flex-col h-full bg-card border-r transition-all duration-300",
               collapsed ? "w-16" : "w-64",
               className
          )}>
               {/* Header */}
               <div className={cn(
                    collapsed
                         ? "flex flex-col items-center justify-center h-16 w-full border-b"
                         : "flex items-center justify-between p-4 border-b"
               )}>
                    {!collapsed && (
                         <div className={cn(
                              "flex items-center space-x-2 transition-opacity duration-200"
                         )}>
                              <Logo variant="icon" size="sm" linkTo="/panel" />
                              <span className="text-lg font-semibold text-foreground">Bảng điều khiển</span>
                         </div>
                    )}
                    <Button
                         variant="ghost"
                         size="icon"
                         onClick={() => setCollapsed(!collapsed)}
                         className="h-8 w-8"
                    >
                         {collapsed ? (
                              <ChevronRight className="h-4 w-4 text-foreground" />
                         ) : (
                              <ChevronLeft className="h-4 w-4 text-foreground" />
                         )}
                    </Button>
               </div>

               {/* Navigation */}
               <nav className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-2">
                         {filteredItems.map((item) => {
                              const Icon = item.icon;
                              const active = isActive(item.href);

                              return (
                                   <Link
                                        key={item.href}
                                        to={item.href}
                                        className={cn(
                                             "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                             "hover:bg-primary/10 hover:text-primary",
                                             active && "bg-primary text-primary-foreground",
                                             collapsed && "justify-center px-2"
                                        )}
                                   >
                                        <Icon className="h-5 w-5 flex-shrink-0 text-foreground" />
                                        {!collapsed && (
                                             <>
                                                  <span className="flex-1 text-foreground">{item.title}</span>
                                                  {item.badge && (
                                                       <span className="px-2 py-1 text-xs bg-destructive text-destructive-foreground rounded-full">
                                                            {item.badge}
                                                       </span>
                                                  )}
                                             </>
                                        )}
                                   </Link>
                              );
                         })}
                    </div>

                    <Separator className="my-4" />

                    {/* User Section */}
                    <div className={cn(
                         "space-y-2",
                         collapsed && "text-center"
                    )}>
                         <div className={cn(
                              "px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
                              collapsed && "hidden"
                         )}>
                              Tài khoản
                         </div>
                         <div className={cn(
                              "flex items-center space-x-3 px-3 py-2 rounded-lg",
                              collapsed && "justify-center px-2"
                         )}>
                              {!collapsed && (
                                   <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                                        {user?.name?.[0] || 'A'}
                                   </div>
                              )}
                              {!collapsed && (
                                   <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                             {user?.name || 'Quản trị viên'}
                                        </p>
                                        <p className="text-xs text-muted-foreground capitalize">
                                             {user?.role || 'admin'}
                                        </p>
                                   </div>
                              )}
                         </div>
                    </div>
               </nav>

               {/* Footer */}
               <div className="p-4 border-t">
                    <div className={cn(
                         "text-xs text-muted-foreground text-center",
                         collapsed && "hidden"
                    )}>
                         Gia Sư Hoàng Hà © 2024
                    </div>
               </div>
          </div>
     );
};

export default AdminSidebar; 
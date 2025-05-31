import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { Button } from '../../ui/button';
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuLabel,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import {
     Bell,
     Home,
     LogOut,
     Settings,
     User,
     Moon,
     Sun,
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';

interface AdminHeaderProps {
     className?: string;
}

const routeTitles: Record<string, string> = {
     '/panel': 'Tổng quan',
     '/panel/courses': 'Quản lý Khóa học',
     '/panel/schedules': 'Quản lý Lịch học',
     '/panel/registrations': 'Quản lý Đăng ký',
     '/panel/inquiries': 'Quản lý Tin nhắn',
     '/panel/banners': 'Quản lý Banner',
     '/panel/staff': 'Quản lý Nhân viên',
     '/panel/analytics': 'Thống kê',
     '/panel/settings': 'Cài đặt Hệ thống',
};

const AdminHeader: React.FC<AdminHeaderProps> = ({ className }) => {
     const { user, signOut } = useAuth();
     const { theme, toggleTheme } = useTheme();
     const navigate = useNavigate();
     const location = useLocation();

     const currentTitle = routeTitles[location.pathname] || 'Dashboard';

     const handleSignOut = async () => {
          try {
               await signOut();
               navigate('/login');
          } catch (error) {
               console.error('Error signing out:', error);
          }
     };

     return (
          <header className={cn(
               "flex items-center justify-between px-6 py-4 bg-card border-b",
               className
          )}>
               <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-semibold text-foreground">
                         {currentTitle}
                    </h1>
               </div>

               <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <Button variant="ghost" size="icon" className="relative">
                         <Bell className="h-5 w-5 text-foreground" />
                         <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                              3
                         </span>
                    </Button>

                    {/* Theme Toggle */}
                    <Button variant="ghost" size="icon" onClick={toggleTheme}>
                         {theme === 'dark' ? (
                              <Sun className="h-5 w-5 text-foreground" />
                         ) : (
                              <Moon className="h-5 w-5 text-foreground" />
                         )}
                    </Button>

                    {/* Back to Website */}
                    <Button variant="outline" size="sm" asChild>
                         <Link to="/">
                              <Home className="h-4 w-4 mr-2 text-foreground" />
                              <span className="text-foreground">Trang chủ</span>
                         </Link>
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="flex items-center space-x-2 px-2">
                                   <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                                        {user?.name?.[0] || 'A'}
                                   </div>
                                   <div className="hidden sm:block text-left">
                                        <p className="text-sm font-medium text-foreground">
                                             {user?.name || 'Quản trị viên'}
                                        </p>
                                        <p className="text-xs text-muted-foreground capitalize">
                                             {user?.role || 'admin'}
                                        </p>
                                   </div>
                              </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                   <User className="mr-2 h-4 w-4" />
                                   Hồ sơ
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                   <Settings className="mr-2 h-4 w-4" />
                                   Cài đặt
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                   onClick={handleSignOut}
                                   className="text-destructive focus:text-destructive"
                              >
                                   <LogOut className="mr-2 h-4 w-4" />
                                   Đăng xuất
                              </DropdownMenuItem>
                         </DropdownMenuContent>
                    </DropdownMenu>
               </div>
          </header>
     );
};

export default AdminHeader; 
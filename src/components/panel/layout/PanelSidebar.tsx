import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  MessageSquare,
  Calendar,
  Image,
  BarChart,
  ChevronRight,
  ChevronLeft,
  User,
  Globe,
  FileText,
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
    title: 'Giáo viên',
    href: '/panel/tutors',
    icon: Users,
  },
  {
    title: 'Lớp học',
    href: '/panel/classes',
    icon: BookOpen,
  },
  {
    title: 'Blog',
    href: '/panel/blog-posts',
    icon: FileText,
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
  },
  {
    title: 'Tin nhắn',
    href: '/panel/inquiries',
    icon: MessageSquare,
  },
  {
    title: 'Nhân viên',
    href: '/panel/staff',
    icon: User,
    adminOnly: true,
  },
  {
    title: 'Thống kê',
    href: '/panel/analytics',
    icon: BarChart,
  },
  {
    title: 'Cài đặt',
    href: '/panel/settings',
    icon: Settings,
    adminOnly: true,
  },
];

interface PanelSidebarProps {
  className?: string;
}

const PanelSidebar: React.FC<PanelSidebarProps> = ({ className }) => {
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
    <div
      className={cn(
        'relative flex flex-col h-full bg-card border-r transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          collapsed
            ? 'flex flex-col items-center justify-center h-16 w-full border-b'
            : 'flex items-center justify-between p-4 border-b'
        )}
      >
        {!collapsed && (
          <div className={cn('flex items-center space-x-2 transition-opacity duration-200')}>
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
          {filteredItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-black dark:text-white',
                  'hover:bg-muted hover:text-black dark:hover:text-white',
                  active && 'bg-primary text-white',
                  collapsed && 'justify-center px-2'
                )}
              >
                <Icon
                  className={cn('h-5 w-5 flex-shrink-0', active ? 'text-white' : 'text-foreground')}
                />
                {!collapsed && (
                  <>
                    <span className={cn('flex-1', active ? 'text-white' : 'text-foreground')}>
                      {item.title}
                    </span>
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
      </nav>

      {/* Footer */}
      <div className="p-4 border-t flex flex-col gap-3">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-base transition-all',
            'bg-primary/90 text-primary-foreground shadow-lg hover:bg-primary',
            collapsed && 'px-2 py-2'
          )}
          style={{ minHeight: 48 }}
        >
          <Globe className="h-6 w-6" />
          {!collapsed && <span>Xem Website</span>}
        </Link>
        <div className={cn('text-xs text-muted-foreground text-center', collapsed && 'hidden')}>
          Gia Sư Hoàng Hà © 2025
        </div>
      </div>
    </div>
  );
};

export default PanelSidebar;

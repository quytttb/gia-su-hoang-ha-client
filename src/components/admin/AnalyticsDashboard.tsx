import React, { useState, useEffect } from 'react';
import {
     ChartBarIcon,
     UserGroupIcon,
     AcademicCapIcon,
     EyeIcon,
     CursorArrowRaysIcon,
     ClockIcon,
     TrophyIcon
} from '@heroicons/react/24/outline';

interface AnalyticsMetrics {
     totalUsers: number;
     pageViews: number;
     courseViews: number;
     registrations: number;
     chatbotInteractions: number;
     avgSessionDuration: number;
     bounceRate: number;
     conversionRate: number;
}

interface TopPage {
     page: string;
     views: number;
     percentage: number;
}

interface TopCourse {
     name: string;
     views: number;
     registrations: number;
     conversionRate: number;
}

const AnalyticsDashboard: React.FC = () => {
     const [metrics, setMetrics] = useState<AnalyticsMetrics>({
          totalUsers: 0,
          pageViews: 0,
          courseViews: 0,
          registrations: 0,
          chatbotInteractions: 0,
          avgSessionDuration: 0,
          bounceRate: 0,
          conversionRate: 0,
     });

     const [topPages] = useState<TopPage[]>([
          { page: 'Trang chủ', views: 1250, percentage: 35 },
          { page: 'Khóa học', views: 890, percentage: 25 },
          { page: 'Chi tiết khóa học', views: 650, percentage: 18 },
          { page: 'Liên hệ', views: 420, percentage: 12 },
          { page: 'Giới thiệu', views: 360, percentage: 10 },
     ]);

     const [topCourses] = useState<TopCourse[]>([
          { name: 'Toán lớp 10', views: 320, registrations: 45, conversionRate: 14.1 },
          { name: 'Lý lớp 11', views: 280, registrations: 38, conversionRate: 13.6 },
          { name: 'Hóa lớp 12', views: 250, registrations: 32, conversionRate: 12.8 },
          { name: 'Ôn thi THPT', views: 200, registrations: 28, conversionRate: 14.0 },
     ]);

     // Simulate real-time data updates
     useEffect(() => {
          const interval = setInterval(() => {
               setMetrics(prev => ({
                    ...prev,
                    totalUsers: Math.floor(Math.random() * 50) + 1200,
                    pageViews: Math.floor(Math.random() * 100) + 3500,
                    courseViews: Math.floor(Math.random() * 30) + 850,
                    registrations: Math.floor(Math.random() * 5) + 125,
                    chatbotInteractions: Math.floor(Math.random() * 20) + 280,
                    avgSessionDuration: Math.floor(Math.random() * 30) + 180,
                    bounceRate: Math.floor(Math.random() * 10) + 35,
                    conversionRate: Math.floor(Math.random() * 2) + 8,
               }));
          }, 5000);

          return () => clearInterval(interval);
     }, []);

     const MetricCard: React.FC<{
          title: string;
          value: string | number;
          icon: React.ReactNode;
          trend?: string;
          color: string;
     }> = ({ title, value, icon, trend, color }) => (
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
               <div className="flex items-center justify-between">
                    <div>
                         <p className="text-sm font-medium text-gray-600">{title}</p>
                         <p className="text-2xl font-bold text-gray-900">{value}</p>
                         {trend && (
                              <p className="text-sm text-green-600 mt-1">
                                   ↗ {trend}
                              </p>
                         )}
                    </div>
                    <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
                         {icon}
                    </div>
               </div>
          </div>
     );

     return (
          <div className="space-y-6">
               {/* Header */}
               <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                         <ClockIcon className="h-4 w-4" />
                         <span>Cập nhật: {new Date().toLocaleTimeString('vi-VN')}</span>
                    </div>
               </div>

               {/* Key Metrics */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                         title="Tổng người dùng"
                         value={metrics.totalUsers.toLocaleString()}
                         icon={<UserGroupIcon className="h-6 w-6 text-blue-600" />}
                         trend="+12% tuần này"
                         color="#3B82F6"
                    />
                    <MetricCard
                         title="Lượt xem trang"
                         value={metrics.pageViews.toLocaleString()}
                         icon={<EyeIcon className="h-6 w-6 text-green-600" />}
                         trend="+8% tuần này"
                         color="#10B981"
                    />
                    <MetricCard
                         title="Xem khóa học"
                         value={metrics.courseViews.toLocaleString()}
                         icon={<AcademicCapIcon className="h-6 w-6 text-purple-600" />}
                         trend="+15% tuần này"
                         color="#8B5CF6"
                    />
                    <MetricCard
                         title="Đăng ký"
                         value={metrics.registrations}
                         icon={<TrophyIcon className="h-6 w-6 text-orange-600" />}
                         trend="+22% tuần này"
                         color="#F59E0B"
                    />
               </div>

               {/* Secondary Metrics */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                         title="Chatbot tương tác"
                         value={metrics.chatbotInteractions}
                         icon={<CursorArrowRaysIcon className="h-6 w-6 text-indigo-600" />}
                         color="#6366F1"
                    />
                    <MetricCard
                         title="Thời gian trung bình"
                         value={`${Math.floor(metrics.avgSessionDuration / 60)}:${(metrics.avgSessionDuration % 60).toString().padStart(2, '0')}`}
                         icon={<ClockIcon className="h-6 w-6 text-pink-600" />}
                         color="#EC4899"
                    />
                    <MetricCard
                         title="Tỷ lệ thoát"
                         value={`${metrics.bounceRate}%`}
                         icon={<ChartBarIcon className="h-6 w-6 text-red-600" />}
                         color="#EF4444"
                    />
                    <MetricCard
                         title="Tỷ lệ chuyển đổi"
                         value={`${metrics.conversionRate}%`}
                         icon={<TrophyIcon className="h-6 w-6 text-emerald-600" />}
                         color="#059669"
                    />
               </div>

               {/* Charts and Tables */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Pages */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                         <h3 className="text-lg font-semibold text-gray-900 mb-4">Trang phổ biến nhất</h3>
                         <div className="space-y-3">
                              {topPages.map((page, index) => (
                                   <div key={index} className="flex items-center justify-between">
                                        <div className="flex-1">
                                             <div className="flex items-center justify-between mb-1">
                                                  <span className="text-sm font-medium text-gray-900">{page.page}</span>
                                                  <span className="text-sm text-gray-500">{page.views.toLocaleString()}</span>
                                             </div>
                                             <div className="w-full bg-gray-200 rounded-full h-2">
                                                  <div
                                                       className="bg-blue-600 h-2 rounded-full"
                                                       style={{ width: `${page.percentage}%` }}
                                                  ></div>
                                             </div>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    </div>

                    {/* Top Courses */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                         <h3 className="text-lg font-semibold text-gray-900 mb-4">Khóa học phổ biến</h3>
                         <div className="overflow-x-auto">
                              <table className="min-w-full">
                                   <thead>
                                        <tr className="border-b border-gray-200">
                                             <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                                                  Khóa học
                                             </th>
                                             <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                                                  Lượt xem
                                             </th>
                                             <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                                                  Đăng ký
                                             </th>
                                             <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                                                  Tỷ lệ
                                             </th>
                                        </tr>
                                   </thead>
                                   <tbody className="divide-y divide-gray-200">
                                        {topCourses.map((course, index) => (
                                             <tr key={index}>
                                                  <td className="py-2 text-sm font-medium text-gray-900">{course.name}</td>
                                                  <td className="py-2 text-sm text-gray-500 text-right">{course.views}</td>
                                                  <td className="py-2 text-sm text-gray-500 text-right">{course.registrations}</td>
                                                  <td className="py-2 text-sm text-right">
                                                       <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                            {course.conversionRate}%
                                                       </span>
                                                  </td>
                                             </tr>
                                        ))}
                                   </tbody>
                              </table>
                         </div>
                    </div>
               </div>

               {/* Real-time Activity */}
               <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động thời gian thực</h3>
                    <div className="text-sm text-gray-600">
                         <p>• Người dùng đang online: <span className="font-semibold text-green-600">23</span></p>
                         <p>• Trang được xem nhiều nhất: <span className="font-semibold">Khóa học Toán lớp 10</span></p>
                         <p>• Chatbot đang hoạt động: <span className="font-semibold text-blue-600">5 cuộc hội thoại</span></p>
                    </div>
               </div>
          </div>
     );
};

export default AnalyticsDashboard; 
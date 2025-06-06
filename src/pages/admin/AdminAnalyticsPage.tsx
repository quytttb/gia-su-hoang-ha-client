import React from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import AnalyticsDashboard from '../../components/admin/AnalyticsDashboard';
import ClassesStats from '../../components/admin/ClassesStats';

const AdminAnalyticsPage: React.FC = () => {
     return (
          <AdminLayout>
               <div className="space-y-6">
                    {/* Page Header */}
                    <div className="bg-card rounded-lg p-6 border">
                         <h2 className="text-2xl font-bold text-foreground mb-2">Analytics</h2>
                         <p className="text-muted-foreground">
                              Xem báo cáo chi tiết và phân tích dữ liệu hoạt động của trung tâm.
                         </p>
                    </div>

                    {/* Analytics Components */}
                    <ClassesStats />
                    <AnalyticsDashboard />
               </div>
          </AdminLayout>
     );
};

export default AdminAnalyticsPage; 
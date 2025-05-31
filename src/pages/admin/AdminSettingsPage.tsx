import React from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';

const AdminSettingsPage: React.FC = () => {
     return (
          <AdminLayout>
               <div className="space-y-6">
                    {/* Page Header */}
                    <div className="bg-card rounded-lg p-6 border">
                         <h2 className="text-2xl font-bold text-foreground mb-2">Cài đặt Hệ thống</h2>
                         <p className="text-muted-foreground">
                              Cấu hình các thiết lập chung của hệ thống và ứng dụng.
                         </p>
                    </div>

                    {/* Coming Soon */}
                    <div className="bg-card rounded-lg p-12 border text-center">
                         <h3 className="text-xl font-semibold text-foreground mb-4">Đang phát triển</h3>
                         <p className="text-muted-foreground">
                              Tính năng cài đặt hệ thống sẽ được triển khai trong giai đoạn tiếp theo.
                         </p>
                    </div>
               </div>
          </AdminLayout>
     );
};

export default AdminSettingsPage; 
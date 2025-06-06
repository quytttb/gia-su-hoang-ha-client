import React from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';

const AdminRegistrationsPage: React.FC = () => {
     return (
          <AdminLayout>
               <div className="space-y-6">
                    {/* Page Header */}
                    <div className="bg-card rounded-lg p-6 border">
                         <h2 className="text-2xl font-bold text-foreground mb-2">Quản lý Đăng ký</h2>
                         <p className="text-muted-foreground">
                              Xem và xử lý các đăng ký lớp học từ học viên.
                         </p>
                    </div>

                    {/* Coming Soon */}
                    <div className="bg-card rounded-lg p-12 border text-center">
                         <h3 className="text-xl font-semibold text-foreground mb-4">Đang phát triển</h3>
                         <p className="text-muted-foreground">
                              Tính năng quản lý đăng ký sẽ được triển khai trong giai đoạn tiếp theo.
                         </p>
                    </div>
               </div>
          </AdminLayout>
     );
};

export default AdminRegistrationsPage; 
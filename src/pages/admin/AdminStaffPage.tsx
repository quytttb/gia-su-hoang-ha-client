import React from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';

const AdminStaffPage: React.FC = () => {
     return (
          <AdminLayout>
               <div className="space-y-6">
                    {/* Page Header */}
                    <div className="bg-card rounded-lg p-6 border">
                         <h2 className="text-2xl font-bold text-foreground mb-2">Quản lý Nhân viên</h2>
                         <p className="text-muted-foreground">
                              Quản lý tài khoản và quyền hạn của nhân viên trong hệ thống.
                         </p>
                    </div>

                    {/* Coming Soon */}
                    <div className="bg-card rounded-lg p-12 border text-center">
                         <h3 className="text-xl font-semibold text-foreground mb-4">Đang phát triển</h3>
                         <p className="text-muted-foreground">
                              Tính năng quản lý nhân viên sẽ được triển khai trong Phase 2.
                         </p>
                    </div>
               </div>
          </AdminLayout>
     );
};

export default AdminStaffPage; 
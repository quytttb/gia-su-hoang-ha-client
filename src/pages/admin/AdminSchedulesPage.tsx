import React from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import { Button } from '../../components/ui/button';

const AdminSchedulesPage: React.FC = () => {
     return (
          <AdminLayout>
               <div className="space-y-6">
                    {/* Page Header */}
                    <div className="bg-card rounded-lg p-6 border">
                         <div className="flex items-center justify-between">
                              <div>
                                   <h2 className="text-2xl font-bold text-foreground mb-2">Quản lý Lịch Học</h2>
                                   <p className="text-muted-foreground">Thêm, chỉnh sửa và quản lý lịch học của trung tâm.</p>
                              </div>
                              <Button>+ Thêm lịch học</Button>
                         </div>
                    </div>

                    {/* Coming Soon */}
                    <div className="bg-card rounded-lg border p-12">
                         <div className="text-center">
                              <h3 className="text-lg font-semibold text-foreground mb-2">
                                   Chức năng đang phát triển
                              </h3>
                              <p className="text-muted-foreground">
                                   Quản lý lịch học sẽ sớm được hoàn thiện
                              </p>
                         </div>
                    </div>
               </div>
          </AdminLayout>
     );
};

export default AdminSchedulesPage; 
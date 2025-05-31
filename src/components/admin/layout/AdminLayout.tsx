import React from 'react';
import { cn } from '../../../lib/utils';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

interface AdminLayoutProps {
     children: React.ReactNode;
     className?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, className }) => {
     return (
          <div className="min-h-screen bg-background">
               <div className="flex h-screen">
                    {/* Sidebar */}
                    <AdminSidebar />

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                         {/* Header */}
                         <AdminHeader />

                         {/* Page Content */}
                         <main className={cn(
                              "flex-1 overflow-y-auto p-6",
                              className
                         )}>
                              <div className="max-w-7xl mx-auto">
                                   {children}
                              </div>
                         </main>
                    </div>
               </div>
          </div>
     );
};

export default AdminLayout; 
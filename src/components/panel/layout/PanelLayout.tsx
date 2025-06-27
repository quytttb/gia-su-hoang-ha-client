import React from 'react';
import { cn } from '../../../lib/utils';
import PanelSidebar from './PanelSidebar';
import PanelHeader from './PanelHeader';

interface PanelLayoutProps {
     children: React.ReactNode;
     className?: string;
}

const PanelLayout: React.FC<PanelLayoutProps> = ({ children, className }) => {
     return (
          <div className="min-h-screen bg-background">
               <div className="flex h-screen">
                    {/* Sidebar */}
                    <PanelSidebar />

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                         {/* Header */}
                         <PanelHeader />

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

export default PanelLayout; 
import React, { useState } from 'react';
import ErrorDisplay from '../components/shared/ErrorDisplay';
import Loading from '../components/shared/Loading';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const TestError: React.FC = () => {
     const [showLoading, setShowLoading] = useState(false);

     if (showLoading) {
          return (
               <Loading
                    message="Đang tải dữ liệu"
                    fullPage={false}
                    description="Vui lòng đợi trong giây lát..."
               />
          );
     }

     return (
          <div className="container mx-auto py-12 px-4">
               <h1 className="text-3xl font-bold mb-8 text-center">Demo Hiển Thị Lỗi</h1>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Error type */}
                    <Card className="p-6">
                         <h2 className="text-xl font-semibold mb-4">Lỗi thông thường</h2>
                         <div className="h-[400px] flex items-center justify-center">
                              <ErrorDisplay
                                   fullPage={false}
                                   message="Đã có lỗi xảy ra"
                                   details="Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại."
                                   type="error"
                              />
                         </div>
                    </Card>

                    {/* Warning type */}
                    <Card className="p-6">
                         <h2 className="text-xl font-semibold mb-4">Cảnh báo</h2>
                         <div className="h-[400px] flex items-center justify-center">
                              <ErrorDisplay
                                   fullPage={false}
                                   message="Cảnh báo"
                                   details="Phiên đăng nhập của bạn sắp hết hạn. Vui lòng đăng nhập lại để tiếp tục."
                                   type="warning"
                              />
                         </div>
                    </Card>

                    {/* Info type */}
                    <Card className="p-6">
                         <h2 className="text-xl font-semibold mb-4">Thông tin</h2>
                         <div className="h-[400px] flex items-center justify-center">
                              <ErrorDisplay
                                   fullPage={false}
                                   message="Thông báo"
                                   details="Hệ thống sẽ bảo trì vào 22:00 tối nay. Vui lòng lưu lại công việc của bạn."
                                   type="info"
                              />
                         </div>
                    </Card>

                    {/* Loading state */}
                    <Card className="p-6">
                         <h2 className="text-xl font-semibold mb-4">Trạng thái tải</h2>
                         <div className="h-[400px] flex items-center justify-center">
                              <Button onClick={() => setShowLoading(!showLoading)}>
                                   {showLoading ? "Ẩn loading" : "Hiển thị loading"}
                              </Button>
                         </div>
                    </Card>
               </div>
          </div>
     );
};

export default TestError; 
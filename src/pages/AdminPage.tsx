import { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/layout/AdminLayout';
import coursesService from '../services/firestore/classesService';
import schedulesService from '../services/firestore/schedulesService';

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch courses and schedules for validation
        await Promise.all([
          coursesService.getAll(),
          schedulesService.getAll(),
        ]);

        // Data loaded successfully
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Error Display */}
      {error && (
        <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-md mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {/* Dashboard Overview */}
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-2xl font-bold text-foreground mb-2">Chào mừng trở lại!</h2>
          <p className="text-muted-foreground">
            Tổng quan về hoạt động hệ thống và các số liệu quan trọng.
          </p>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="text-sm font-medium text-muted-foreground">Tổng lớp học</h3>
            <p className="text-2xl font-bold text-foreground">24</p>
            <p className="text-xs text-muted-foreground">+2 từ tháng trước</p>
          </div>
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="text-sm font-medium text-muted-foreground">Học viên hoạt động</h3>
            <p className="text-2xl font-bold text-foreground">1,234</p>
            <p className="text-xs text-muted-foreground">+15% từ tháng trước</p>
          </div>
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="text-sm font-medium text-muted-foreground">Đăng ký mới</h3>
            <p className="text-2xl font-bold text-foreground">89</p>
            <p className="text-xs text-muted-foreground">Tuần này</p>
          </div>
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="text-sm font-medium text-muted-foreground">Doanh thu</h3>
            <p className="text-2xl font-bold text-foreground">₫45.2M</p>
            <p className="text-xs text-muted-foreground">Tháng này</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Thao tác nhanh</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 rounded-lg border hover:bg-accent transition-colors">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <span className="text-primary text-xl">📚</span>
              </div>
              <span className="text-sm font-medium text-foreground">Thêm lớp học</span>
            </button>
            <button className="flex flex-col items-center p-4 rounded-lg border hover:bg-accent transition-colors">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <span className="text-primary text-xl">📅</span>
              </div>
              <span className="text-sm font-medium text-foreground">Lập lịch</span>
            </button>
            <button className="flex flex-col items-center p-4 rounded-lg border hover:bg-accent transition-colors">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <span className="text-primary text-xl">👥</span>
              </div>
              <span className="text-sm font-medium text-foreground">Xem đăng ký</span>
            </button>
            <button className="flex flex-col items-center p-4 rounded-lg border hover:bg-accent transition-colors">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <span className="text-primary text-xl">📊</span>
              </div>
              <span className="text-sm font-medium text-foreground">Xem báo cáo</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;

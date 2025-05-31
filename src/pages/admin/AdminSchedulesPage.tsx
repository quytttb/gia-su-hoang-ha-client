import React, { useState } from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import ScheduleTable, { Schedule } from '../../components/admin/schedules/ScheduleTable';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from '../../components/ui/select';

const sampleSchedules: Schedule[] = [
     {
          id: '1',
          name: 'Toán nâng cao lớp 10',
          time: 'Thứ 2, 18:00 - 20:00',
          teacher: 'Nguyễn Văn A',
          classroom: 'Phòng 101',
          status: 'active',
     },
     {
          id: '2',
          name: 'Tiếng Anh giao tiếp',
          time: 'Thứ 4, 19:00 - 21:00',
          teacher: 'Trần Thị B',
          classroom: 'Phòng 202',
          status: 'inactive',
     },
];

const AdminSchedulesPage: React.FC = () => {
     const [schedules, setSchedules] = useState<Schedule[]>(sampleSchedules);
     const [search, setSearch] = useState('');
     const [status, setStatus] = useState('all');

     const handleEdit = (schedule: Schedule) => {
          // Chưa cần logic, chỉ alert
          alert(`Sửa lịch: ${schedule.name}`);
     };

     const handleDelete = (schedule: Schedule) => {
          if (window.confirm(`Bạn có chắc muốn xóa lịch: ${schedule.name}?`)) {
               setSchedules(prev => prev.filter(s => s.id !== schedule.id));
          }
     };

     // Lọc và tìm kiếm
     const filteredSchedules = schedules.filter(s => {
          const matchStatus = status === 'all' || s.status === status;
          const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
          return matchStatus && matchSearch;
     });

     return (
          <AdminLayout>
               <div className="space-y-6">
                    <div className="bg-card rounded-lg p-6 border flex items-center justify-between">
                         <div>
                              <h2 className="text-2xl font-bold text-foreground mb-2">Quản lý Lịch học</h2>
                              <p className="text-muted-foreground">Thêm, chỉnh sửa và quản lý lịch học của trung tâm.</p>
                         </div>
                         <Button>+ Thêm lịch học</Button>
                    </div>
                    {/* Filter & Search */}
                    <form className="flex flex-wrap gap-2 items-end mb-4">
                         <div className="w-full sm:w-auto flex-1 min-w-[180px]">
                              <Input
                                   type="text"
                                   placeholder="Tìm kiếm tên lịch học..."
                                   value={search}
                                   onChange={e => setSearch(e.target.value)}
                              />
                         </div>
                         <div className="min-w-[160px]">
                              <Select value={status} onValueChange={setStatus}>
                                   <SelectTrigger className="text-foreground">
                                        <SelectValue placeholder="Tất cả trạng thái" />
                                   </SelectTrigger>
                                   <SelectContent>
                                        <SelectItem className="text-foreground" value="all">Tất cả trạng thái</SelectItem>
                                        <SelectItem className="text-foreground" value="active">Đang mở</SelectItem>
                                        <SelectItem className="text-foreground" value="inactive">Đã ẩn</SelectItem>
                                   </SelectContent>
                              </Select>
                         </div>
                    </form>
                    <ScheduleTable schedules={filteredSchedules} onEdit={handleEdit} onDelete={handleDelete} />
               </div>
          </AdminLayout>
     );
};

export default AdminSchedulesPage; 
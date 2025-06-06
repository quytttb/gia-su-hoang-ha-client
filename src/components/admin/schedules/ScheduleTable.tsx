import React from 'react';
import { Button } from '../../ui/button';

export interface Schedule {
     id: string;
     name: string;
     time: string;
     teacher: string;
     classroom: string;
     status?: 'active' | 'inactive';
     maxStudents?: number;
     studentPhones?: string[];
     room: string;
}

interface ScheduleTableProps {
     schedules: Schedule[];
     onEdit: (schedule: Schedule) => void;
     onDelete: (schedule: Schedule) => void;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedules, onEdit, onDelete }) => {
     return (
          <div className="overflow-x-auto rounded-lg border bg-background">
               <table className="min-w-full text-sm">
                    <thead>
                         <tr className="bg-muted">
                              <th className="p-3 text-left font-semibold text-foreground">Tên lịch</th>
                              <th className="p-3 text-left font-semibold text-foreground">Thời gian</th>
                              <th className="p-3 text-left font-semibold text-foreground">Giáo viên</th>
                              <th className="p-3 text-left font-semibold text-foreground">Lớp học</th>
                              <th className="p-3 text-left font-semibold text-foreground">Trạng thái</th>
                              <th className="p-3 text-left font-semibold text-foreground">Học viên</th>
                              <th className="p-3 text-left font-semibold text-foreground">Hành động</th>
                         </tr>
                    </thead>
                    <tbody>
                         {schedules.length === 0 ? (
                              <tr>
                                   <td colSpan={6} className="text-center py-8 text-muted-foreground">Không có lịch học nào.</td>
                              </tr>
                         ) : (
                              schedules.map(schedule => (
                                   <tr key={schedule.id} className="border-b last:border-0 hover:bg-accent/40 transition-colors">
                                        <td className="p-3 align-middle font-semibold text-foreground">{schedule.name}</td>
                                        <td className="p-3 align-middle text-foreground">{schedule.time}</td>
                                        <td className="p-3 align-middle text-foreground">{schedule.teacher}</td>
                                        <td className="p-3 align-middle text-foreground">{schedule.classroom}</td>
                                        <td className="p-3 align-middle">
                                             {schedule.status === 'active' ? (
                                                  <span className="inline-block px-2 py-1 text-xs rounded bg-green-600 text-white font-semibold">Đang mở</span>
                                             ) : (
                                                  <span className="inline-block px-2 py-1 text-xs rounded bg-gray-700 text-gray-200 font-semibold">Đã ẩn</span>
                                             )}
                                        </td>
                                        <td className="p-3 align-middle">
                                             {(schedule.studentPhones || []).length} / {schedule.maxStudents || 0}
                                        </td>
                                        <td className="p-3 align-middle space-x-2">
                                             <Button variant="outline" size="sm" className="text-foreground" onClick={() => onEdit(schedule)}>
                                                  Sửa
                                             </Button>
                                             <Button variant="destructive" size="sm" onClick={() => onDelete(schedule)}>
                                                  Xóa
                                             </Button>
                                        </td>
                                   </tr>
                              ))
                         )}
                    </tbody>
               </table>
          </div>
     );
};

export default ScheduleTable; 
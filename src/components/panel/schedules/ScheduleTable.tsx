import React from 'react';
import { Button } from '../../ui/button';
import { Edit2, Trash2, Users, Calendar, Clock } from 'lucide-react';

export interface Schedule {
  id: string;
  name: string;
  time: string;
  teacher: string;
  classroom: string;
  status?: 'active' | 'inactive';
  maxStudents?: number;
  studentPhones?: string[];
}

interface ScheduleTableProps {
  schedules: Schedule[];
  onEdit: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedules, onEdit, onDelete }) => {
  const getStatusBadge = (status?: 'active' | 'inactive') => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
          Hoạt động
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
        Đã qua
      </span>
    );
  };

  const getStudentCountBadge = (current: number, max: number) => {
    const percentage = max > 0 ? (current / max) * 100 : 0;
    let colorClass = 'bg-green-100 text-green-800';

    if (percentage >= 80) {
      colorClass = 'bg-red-100 text-red-800';
    } else if (percentage >= 60) {
      colorClass = 'bg-yellow-100 text-yellow-800';
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
      >
        <Users className="w-3 h-3 mr-1" />
        {current}/{max}
      </span>
    );
  };

  if (schedules.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-semibold text-foreground">Không có lịch học</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Chưa có lịch học nào được tạo. Hãy tạo lịch học đầu tiên.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-background">
      <table className="w-full text-sm table-auto">
        <thead>
          <tr className="bg-muted/70 text-xs uppercase tracking-wide text-black dark:text-white">
            <th className="p-2 text-left font-semibold w-1/3">Lớp học</th>
            <th className="p-2 text-left font-semibold w-32">Thời gian</th>
            <th className="p-2 text-left font-semibold w-40">Giáo viên</th>
            <th className="p-2 text-center font-semibold w-28">Trạng thái</th>
            <th className="p-2 text-center font-semibold w-28">Học viên</th>
            <th className="p-2 text-center font-semibold w-24">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map(schedule => (
            <tr
              key={schedule.id}
              className="border-b last:border-0 hover:bg-accent/30 transition-colors group"
            >
              <td className="p-2 align-top">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 dark:bg-primary/20 rounded-md flex items-center justify-center shadow-sm group-hover:shadow">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p
                      className="font-semibold leading-snug text-black dark:text-white truncate"
                      title={schedule.name}
                    >
                      {schedule.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {schedule.classroom}
                    </p>
                  </div>
                </div>
              </td>
              <td className="p-2 align-top">
                <div className="flex items-center gap-1 text-xs font-medium text-foreground">
                  <Clock className="w-3 h-3 text-muted-foreground" /> {schedule.time}
                </div>
              </td>
              <td className="p-2 align-top">
                <div className="flex items-center gap-1 text-xs font-medium text-foreground">
                  <Users className="w-3 h-3 text-muted-foreground" /> {schedule.teacher}
                </div>
              </td>
              <td className="p-2 align-top text-center">{getStatusBadge(schedule.status)}</td>
              <td className="p-2 align-top text-center">
                {getStudentCountBadge(
                  (schedule.studentPhones || []).length,
                  schedule.maxStudents || 0
                )}
              </td>
              <td className="p-2 align-top text-center">
                <div className="flex items-start justify-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0 flex items-center justify-center"
                    onClick={() => onEdit(schedule)}
                    title="Sửa"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-7 w-7 p-0 flex items-center justify-center"
                    onClick={() => onDelete(schedule)}
                    title="Xóa"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;

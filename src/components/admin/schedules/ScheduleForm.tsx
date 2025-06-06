import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface ScheduleFormProps {
     isOpen: boolean;
     onClose: () => void;
     onSave: (data: any) => Promise<void>;
     courses: { id: string; name: string }[];
     tutors: { id: string; name: string }[];
     initialData?: any;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ isOpen, onClose, onSave, courses, tutors, initialData }) => {
     const [formData, setFormData] = useState({
          courseId: '',
          tutorId: '',
          date: '',
          startTime: '',
          endTime: '',
          room: '',
          maxStudents: 10,
     });
     const [errors, setErrors] = useState<Record<string, string>>({});
     const [isSubmitting, setIsSubmitting] = useState(false);
     const [successMessage, setSuccessMessage] = useState<string | null>(null);

     useEffect(() => {
          if (initialData) {
               setFormData({
                    courseId: initialData.courseId || '',
                    tutorId: initialData.tutorId || '',
                    date: initialData.date || '',
                    startTime: initialData.startTime || '',
                    endTime: initialData.endTime || '',
                    room: initialData.room || '',
                    maxStudents: initialData.maxStudents || 10,
               });
          } else {
               setFormData({ courseId: '', tutorId: '', date: '', startTime: '', endTime: '', room: '', maxStudents: 10 });
          }
          setErrors({});
          setSuccessMessage(null);
          setIsSubmitting(false);
     }, [initialData, isOpen]);

     const validateForm = () => {
          const newErrors: Record<string, string> = {};
          if (!formData.courseId) newErrors.courseId = 'Chọn lớp học';
          if (!formData.tutorId) newErrors.tutorId = 'Chọn giáo viên';
          if (!formData.date) newErrors.date = 'Chọn ngày';
          if (!formData.startTime) newErrors.startTime = 'Nhập giờ bắt đầu';
          if (!formData.endTime) newErrors.endTime = 'Nhập giờ kết thúc';
          if (!formData.room) newErrors.room = 'Nhập phòng học';
          if (!formData.maxStudents || formData.maxStudents <= 0) newErrors.maxStudents = 'Nhập số học viên tối đa';
          setErrors(newErrors);
          return Object.keys(newErrors).length === 0;
     };

     const handleChange = (field: string, value: string) => {
          if (field === 'maxStudents') {
               setFormData(prev => ({ ...prev, [field]: parseInt(value) || 0 }));
          } else {
               setFormData(prev => ({ ...prev, [field]: value }));
          }
          if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
          if (successMessage) setSuccessMessage(null);
     };

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          if (!validateForm()) return;
          setIsSubmitting(true);
          setErrors({});
          setSuccessMessage(null);
          try {
               await onSave(formData);
               setSuccessMessage('Đã lưu lịch học!');
               setTimeout(() => { onClose(); }, 1200);
          } catch (error: any) {
               setErrors(prev => ({ ...prev, general: error.message || 'Có lỗi khi lưu lịch học' }));
          } finally {
               setIsSubmitting(false);
          }
     };

     return (
          <Dialog open={isOpen} onOpenChange={onClose}>
               <DialogContent className="max-w-lg">
                    <DialogHeader>
                         <DialogTitle>{initialData ? 'Chỉnh sửa lịch học' : 'Thêm lịch học mới'}</DialogTitle>
                         <DialogDescription>
                              {initialData ? 'Cập nhật thông tin lịch học.' : 'Nhập thông tin cho lịch học mới.'}
                         </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                         {successMessage && (
                              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                   <p className="text-sm text-green-700">{successMessage}</p>
                              </div>
                         )}
                         {errors.general && (
                              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                   <p className="text-sm text-red-700">{errors.general}</p>
                              </div>
                         )}
                         <div className="space-y-2">
                              <Label>Khóa học *</Label>
                              <Select value={formData.courseId} onValueChange={v => handleChange('courseId', v)}>
                                   <SelectTrigger>
                                        <SelectValue placeholder="Chọn lớp học" />
                                   </SelectTrigger>
                                   <SelectContent>
                                        {courses.map(c => (
                                             <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                   </SelectContent>
                              </Select>
                              {errors.courseId && <p className="text-sm text-destructive">{errors.courseId}</p>}
                         </div>
                         <div className="space-y-2">
                              <Label>Giáo viên *</Label>
                              <Select value={formData.tutorId} onValueChange={v => handleChange('tutorId', v)}>
                                   <SelectTrigger>
                                        <SelectValue placeholder="Chọn giáo viên" />
                                   </SelectTrigger>
                                   <SelectContent>
                                        {tutors.map(t => (
                                             <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                        ))}
                                   </SelectContent>
                              </Select>
                              {errors.tutorId && <p className="text-sm text-destructive">{errors.tutorId}</p>}
                         </div>
                         <div className="space-y-2">
                              <Label>Ngày *</Label>
                              <Input type="date" value={formData.date} onChange={e => handleChange('date', e.target.value)} />
                              {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                   <Label>Giờ bắt đầu *</Label>
                                   <Input type="time" value={formData.startTime} onChange={e => handleChange('startTime', e.target.value)} />
                                   {errors.startTime && <p className="text-sm text-destructive">{errors.startTime}</p>}
                              </div>
                              <div className="space-y-2">
                                   <Label>Giờ kết thúc *</Label>
                                   <Input type="time" value={formData.endTime} onChange={e => handleChange('endTime', e.target.value)} />
                                   {errors.endTime && <p className="text-sm text-destructive">{errors.endTime}</p>}
                              </div>
                         </div>
                         <div className="space-y-2">
                              <Label>Phòng học *</Label>
                              <Input value={formData.room} onChange={e => handleChange('room', e.target.value)} placeholder="Nhập phòng học" />
                              {errors.room && <p className="text-sm text-destructive">{errors.room}</p>}
                         </div>
                         <div className="space-y-2">
                              <Label>Số học viên tối đa *</Label>
                              <Input
                                   type="number"
                                   min="1"
                                   value={formData.maxStudents}
                                   onChange={e => handleChange('maxStudents', e.target.value)}
                                   placeholder="Nhập số học viên tối đa"
                              />
                              {errors.maxStudents && <p className="text-sm text-destructive">{errors.maxStudents}</p>}
                         </div>
                         <DialogFooter className="mt-6 flex justify-end">
                              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Hủy</Button>
                              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Đang lưu...' : (initialData ? 'Cập nhật' : 'Thêm mới')}</Button>
                         </DialogFooter>
                    </form>
               </DialogContent>
          </Dialog>
     );
};

export default ScheduleForm; 
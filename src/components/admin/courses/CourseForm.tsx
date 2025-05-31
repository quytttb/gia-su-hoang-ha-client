import React, { useState, useEffect, useRef } from 'react';
import { Course } from '../../../types';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from '../../ui/select';
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogFooter,
     DialogHeader,
     DialogTitle,
} from '../../ui/dialog';
import { Dialog as PreviewDialog, DialogContent as PreviewDialogContent } from '../../ui/dialog';
import { Upload, X, Loader2, CheckCircle } from 'lucide-react';
import { UploadService, UploadProgress } from '../../../services/uploadService';

// Props cho CourseForm
interface CourseFormProps {
     course?: Course; // Nếu có course là sửa, không có là thêm mới
     isOpen: boolean;
     onClose: () => void;
     onSave: (courseData: Partial<Course>) => Promise<void>;
     categories: string[]; // Danh sách thể loại khóa học
}

const CourseForm: React.FC<CourseFormProps> = ({
     course,
     isOpen,
     onClose,
     onSave,
     categories,
}) => {
     // State cho form
     const [formData, setFormData] = useState<Partial<Course>>({
          name: '',
          description: '',
          price: 0,
          category: '',
          imageUrl: '',
          featured: false,
          isActive: true,
          discount: 0,
          discountEndDate: '',
     });

     // State cho loading
     const [loading, setLoading] = useState(false);
     const [errors, setErrors] = useState<Record<string, string>>({});
     const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
          progress: 0,
          isUploading: false,
     });
     const [selectedFile, setSelectedFile] = useState<File | null>(null);
     const [successMessage, setSuccessMessage] = useState<string | null>(null);
     const fileInputRef = useRef<HTMLInputElement>(null);
     const [isPreviewOpen, setIsPreviewOpen] = useState(false);

     // Cập nhật formData khi course thay đổi (khi mở form sửa)
     useEffect(() => {
          if (course) {
               setFormData({
                    name: course.name || '',
                    description: course.description || '',
                    price: course.price || 0,
                    category: course.category || '',
                    imageUrl: course.imageUrl || '',
                    featured: course.featured || false,
                    isActive: course.isActive !== false, // Mặc định là true nếu không có
                    discount: course.discount || 0,
                    discountEndDate: course.discountEndDate || '',
               });
          } else {
               // Reset form khi tạo mới
               setFormData({
                    name: '',
                    description: '',
                    price: 0,
                    category: '',
                    imageUrl: '',
                    featured: false,
                    isActive: true,
                    discount: 0,
                    discountEndDate: '',
               });
          }
          setErrors({});
          setSelectedFile(null);
          setUploadProgress({ progress: 0, isUploading: false });
          setSuccessMessage(null);
     }, [course, isOpen]);

     // Xử lý thay đổi input
     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          const { name, value } = e.target;

          if (name === 'price') {
               // Chỉ cho phép nhập số và dấu chấm/phẩy
               const filteredValue = value.replace(/[^\d.,]/g, '');
               // Chuyển đổi dấu phẩy thành dấu chấm
               const normalizedValue = filteredValue.replace(/,/g, '.');
               // Chuyển về số
               const numericValue = normalizedValue ? parseFloat(normalizedValue) : 0;

               setFormData(prev => ({
                    ...prev,
                    [name]: numericValue,
               }));
          } else if (name === 'discount') {
               // Chỉ cho phép nhập số từ 0-100
               const filteredValue = value.replace(/[^\d]/g, '');
               const numericValue = filteredValue ? parseInt(filteredValue, 10) : 0;
               // Giới hạn giá trị từ 0-100
               const limitedValue = Math.min(100, Math.max(0, numericValue));

               setFormData(prev => ({
                    ...prev,
                    [name]: limitedValue,
               }));
          } else {
               setFormData(prev => ({
                    ...prev,
                    [name]: value,
               }));
          }

          // Clear error when user starts typing
          if (errors[name]) {
               setErrors(prev => ({
                    ...prev,
                    [name]: '',
               }));
          }
     };

     // Xử lý thay đổi select
     const handleSelectChange = (name: string, value: string) => {
          setFormData(prev => ({
               ...prev,
               [name]: value,
          }));

          // Clear error when user selects a value
          if (errors[name]) {
               setErrors(prev => ({
                    ...prev,
                    [name]: '',
               }));
          }
     };

     // Xử lý thay đổi switch
     const handleSwitchChange = (name: string, checked: boolean) => {
          setFormData(prev => ({
               ...prev,
               [name]: checked,
          }));
     };

     // Validate form
     const validateForm = () => {
          const newErrors: Record<string, string> = {};

          if (!formData.name?.trim()) {
               newErrors.name = 'Tên khóa học là bắt buộc';
          }

          if (!formData.category) {
               newErrors.category = 'Thể loại là bắt buộc';
          }

          if (formData.price === undefined || formData.price < 0) {
               newErrors.price = 'Giá phải lớn hơn hoặc bằng 0';
          }

          setErrors(newErrors);
          return Object.keys(newErrors).length === 0;
     };

     // Xử lý submit form
     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();

          // Validate form
          if (!validateForm()) {
               return;
          }

          try {
               setLoading(true);
               setErrors({});
               setSuccessMessage(null);

               let finalImageUrl = formData.imageUrl;

               // Upload file if a new file is selected
               if (selectedFile) {
                    console.log('Uploading file:', selectedFile.name);
                    const uploadedUrl = await handleFileUpload();
                    if (!uploadedUrl) {
                         setLoading(false);
                         return; // Upload failed
                    }
                    finalImageUrl = uploadedUrl;
                    console.log('Upload successful:', finalImageUrl);
               }

               // Save course with final image URL
               await onSave({
                    ...formData,
                    imageUrl: finalImageUrl,
               });

               // Show success message briefly before closing
               setSuccessMessage(course ? 'Khóa học đã được cập nhật thành công!' : 'Khóa học đã được tạo thành công!');

               // Close form after a short delay
               setTimeout(() => {
                    onClose();
               }, 1500);
          } catch (error: any) {
               console.error('Lỗi khi lưu khóa học:', error);
               setErrors(prev => ({
                    ...prev,
                    general: error.message || 'Có lỗi xảy ra khi lưu khóa học. Vui lòng thử lại.',
               }));
          } finally {
               setLoading(false);
          }
     };

     // Handle file selection
     const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          if (file) {
               console.log('File selected:', file.name, file.size, file.type);
               setSelectedFile(file);
               // Create preview URL
               const previewUrl = URL.createObjectURL(file);
               setFormData(prev => ({
                    ...prev,
                    imageUrl: previewUrl,
               }));
               // Clear any existing error
               if (errors.imageUrl) {
                    setErrors(prev => ({
                         ...prev,
                         imageUrl: '',
                    }));
               }
          }
     };

     // Handle file upload
     const handleFileUpload = async (): Promise<string | null> => {
          if (!selectedFile) return null;

          try {
               console.log('Starting upload for:', selectedFile.name);
               const result = await UploadService.uploadFile(
                    selectedFile,
                    'courses',
                    setUploadProgress,
                    formData.name,
                    formData.price
               );
               console.log('Upload completed:', result);
               return result.url;
          } catch (error: any) {
               console.error('Upload error:', error);
               setErrors(prev => ({
                    ...prev,
                    imageUrl: error.message || 'Lỗi upload hình ảnh',
               }));
               return null;
          }
     };

     // Remove selected file
     const handleRemoveFile = () => {
          setSelectedFile(null);
          setFormData(prev => ({
               ...prev,
               imageUrl: course?.imageUrl || '',
          }));
          if (fileInputRef.current) {
               fileInputRef.current.value = '';
          }
     };

     const isLoading = uploadProgress.isUploading || loading;

     return (
          <Dialog open={isOpen} onOpenChange={onClose}>
               <DialogContent className="md:max-w-[900px] max-w-3xl">
                    <DialogHeader>
                         <DialogTitle>{course ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}</DialogTitle>
                         <DialogDescription>
                              {course ? 'Cập nhật thông tin khóa học' : 'Nhập thông tin cho khóa học mới'}
                         </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                         {/* Success Message */}
                         {successMessage && (
                              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                   <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        <p className="text-sm text-green-700 dark:text-green-300">{successMessage}</p>
                                   </div>
                              </div>
                         )}

                         {/* General Error */}
                         {errors.general && (
                              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                   <p className="text-sm text-red-700 dark:text-red-300">{errors.general}</p>
                              </div>
                         )}

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Cột trái: Thông tin khóa học */}
                              <div className="space-y-4">
                                   {/* Tên khóa học */}
                                   <div className="space-y-2">
                                        <Label htmlFor="name">Tên khóa học *</Label>
                                        <Input
                                             id="name"
                                             name="name"
                                             value={formData.name}
                                             onChange={handleChange}
                                             placeholder="Nhập tên khóa học"
                                             className={errors.name ? 'border-destructive' : ''}
                                             disabled={isLoading}
                                        />
                                        {errors.name && (
                                             <p className="text-sm text-destructive">{errors.name}</p>
                                        )}
                                   </div>

                                   {/* Mô tả */}
                                   <div className="space-y-2">
                                        <Label htmlFor="description">Mô tả</Label>
                                        <textarea
                                             id="description"
                                             name="description"
                                             value={formData.description}
                                             onChange={handleChange}
                                             placeholder="Mô tả chi tiết về khóa học"
                                             rows={3}
                                             className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                                             disabled={isLoading}
                                        />
                                   </div>

                                   {/* Giá */}
                                   <div className="space-y-2">
                                        <Label htmlFor="price">Giá (VNĐ) *</Label>
                                        <Input
                                             id="price"
                                             name="price"
                                             value={formData.price?.toLocaleString('vi-VN') || ''}
                                             onChange={handleChange}
                                             placeholder="Nhập giá khóa học"
                                             className={errors.price ? 'border-destructive' : ''}
                                             disabled={isLoading}
                                        />
                                        {errors.price && (
                                             <p className="text-sm text-destructive">{errors.price}</p>
                                        )}
                                   </div>

                                   {/* Giảm giá và Thời gian kết thúc */}
                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                             <Label htmlFor="discount">Giảm giá (%)</Label>
                                             <Input
                                                  id="discount"
                                                  name="discount"
                                                  value={formData.discount || ''}
                                                  onChange={handleChange}
                                                  placeholder="Nhập % giảm giá"
                                                  disabled={isLoading}
                                             />
                                        </div>
                                        <div className="space-y-2">
                                             <Label htmlFor="discountEndDate">Thời gian kết thúc</Label>
                                             <Input
                                                  id="discountEndDate"
                                                  name="discountEndDate"
                                                  type="date"
                                                  value={formData.discountEndDate}
                                                  onChange={handleChange}
                                                  placeholder="Ngày kết thúc giảm giá"
                                                  disabled={isLoading}
                                             />
                                        </div>
                                   </div>

                                   {/* Thể loại */}
                                   <div className="space-y-2">
                                        <Label htmlFor="category">Thể loại *</Label>
                                        <Select
                                             value={formData.category}
                                             onValueChange={(value) => handleSelectChange('category', value)}
                                             disabled={isLoading}
                                        >
                                             <SelectTrigger className={`text-foreground ${errors.category ? 'border-destructive' : ''}`}>
                                                  <SelectValue placeholder="Chọn thể loại" />
                                             </SelectTrigger>
                                             <SelectContent>
                                                  {categories.map(cat => (
                                                       <SelectItem key={cat} value={cat} className="text-foreground">{cat}</SelectItem>
                                                  ))}
                                             </SelectContent>
                                        </Select>
                                        {errors.category && (
                                             <p className="text-sm text-destructive">{errors.category}</p>
                                        )}
                                   </div>

                                   {/* Nổi bật & Trạng thái */}
                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-center space-x-2">
                                             <Switch
                                                  id="featured"
                                                  checked={formData.featured}
                                                  onCheckedChange={(checked) => handleSwitchChange('featured', checked)}
                                                  disabled={isLoading}
                                             />
                                             <Label htmlFor="featured">Khóa học nổi bật</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                             <Switch
                                                  id="isActive"
                                                  checked={formData.isActive}
                                                  onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
                                                  disabled={isLoading}
                                             />
                                             <Label htmlFor="isActive">Hiển thị khóa học</Label>
                                        </div>
                                   </div>
                              </div>

                              {/* Cột phải: Upload và xem trước ảnh */}
                              <div className="space-y-4 flex flex-col items-center justify-start">
                                   <div className="w-full space-y-2">
                                        <Label htmlFor="imageFile">Ảnh khóa học</Label>
                                        <div className="space-y-3">
                                             {/* File Input */}
                                             <div className="flex items-center space-x-2">
                                                  <input
                                                       ref={fileInputRef}
                                                       id="imageFile"
                                                       type="file"
                                                       accept="image/*"
                                                       onChange={handleFileSelect}
                                                       className="hidden"
                                                       disabled={isLoading}
                                                  />
                                                  <Button
                                                       type="button"
                                                       variant="outline"
                                                       onClick={() => fileInputRef.current?.click()}
                                                       disabled={isLoading}
                                                       className="flex items-center space-x-2"
                                                  >
                                                       {uploadProgress.isUploading ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                       ) : (
                                                            <Upload className="h-4 w-4" />
                                                       )}
                                                       <span>
                                                            {selectedFile ? 'Thay đổi ảnh' : 'Chọn ảnh'}
                                                       </span>
                                                  </Button>
                                                  {selectedFile && (
                                                       <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={handleRemoveFile}
                                                            disabled={isLoading}
                                                       >
                                                            <X className="h-4 w-4" />
                                                       </Button>
                                                  )}
                                             </div>

                                             {/* Upload Progress */}
                                             {uploadProgress.isUploading && (
                                                  <div className="space-y-1">
                                                       <div className="flex justify-between text-sm">
                                                            <span>Đang tải lên...</span>
                                                            <span>{uploadProgress.progress}%</span>
                                                       </div>
                                                       <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                 className="bg-primary h-2 rounded-full transition-all duration-300"
                                                                 style={{ width: `${uploadProgress.progress}%` }}
                                                            />
                                                       </div>
                                                  </div>
                                             )}

                                             {/* File Info */}
                                             {selectedFile && (
                                                  <div className="text-sm text-muted-foreground">
                                                       <p>Tệp đã chọn: {selectedFile.name}</p>
                                                       <p>Kích thước: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                                  </div>
                                             )}

                                             {/* Error */}
                                             {errors.imageUrl && (
                                                  <p className="text-sm text-destructive">{errors.imageUrl}</p>
                                             )}

                                             {/* Preview */}
                                             {formData.imageUrl && (
                                                  <div className="mt-2 w-full flex flex-col items-center justify-center">
                                                       <img
                                                            src={formData.imageUrl}
                                                            alt="Preview"
                                                            className="h-40 w-auto max-w-full object-cover rounded-md border cursor-zoom-in"
                                                            onClick={() => setIsPreviewOpen(true)}
                                                            onError={(e) => {
                                                                 e.currentTarget.style.display = 'none';
                                                            }}
                                                       />
                                                       <span className="text-xs text-muted-foreground mt-1">Nhấn vào hình để phóng to</span>
                                                  </div>
                                             )}
                                        </div>
                                   </div>
                              </div>
                         </div>

                         <DialogFooter className="mt-6 flex justify-end">
                              <Button
                                   type="button"
                                   variant="outline"
                                   className="text-foreground"
                                   onClick={onClose}
                                   disabled={isLoading}
                              >
                                   Hủy
                              </Button>
                              <Button
                                   type="submit"
                                   disabled={isLoading || !!successMessage}
                                   className="flex items-center space-x-2"
                              >
                                   {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                   <span>
                                        {isLoading
                                             ? (uploadProgress.isUploading ? 'Đang tải lên...' : 'Đang lưu...')
                                             : (course ? 'Cập nhật' : 'Thêm mới')
                                        }
                                   </span>
                              </Button>
                         </DialogFooter>
                    </form>
               </DialogContent>

               {/* Dialog phóng to ảnh */}
               {formData.imageUrl && (
                    <PreviewDialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                         <PreviewDialogContent className="max-w-4xl flex flex-col items-center">
                              <button
                                   className="absolute top-2 right-2 text-foreground bg-background rounded-full p-1 hover:bg-muted"
                                   onClick={() => setIsPreviewOpen(false)}
                                   type="button"
                                   aria-label="Đóng"
                              >
                                   <X className="h-5 w-5" />
                              </button>
                              <img
                                   src={formData.imageUrl}
                                   alt="Phóng to ảnh khóa học"
                                   className="max-h-[90vh] w-auto max-w-full object-contain rounded-md border"
                              />
                         </PreviewDialogContent>
                    </PreviewDialog>
               )}
          </Dialog>
     );
};

export default CourseForm; 
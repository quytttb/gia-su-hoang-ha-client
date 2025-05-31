import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import coursesService from '../../services/firestore/coursesService';
import { Course } from '../../types';
import { FirestoreCourse } from '../../types/firestore';
import { extractCourseCategories, convertFirestoreCourse } from '../../utils/courseHelpers';
import CourseTable from '../../components/admin/courses/CourseTable';
import CourseForm from '../../components/admin/courses/CourseForm';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Loader2, Plus } from 'lucide-react';
import { PartialWithFieldValue } from 'firebase/firestore';

const PAGE_SIZE = 10;

const AdminCoursesPage: React.FC = () => {
     const [courses, setCourses] = useState<Course[]>([]);
     const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
     const [categories, setCategories] = useState<string[]>([]);
     const [totalCourses, setTotalCourses] = useState(0);

     // Pagination
     const [page, setPage] = useState(1);

     // Search & Filter
     const [searchKeyword, setSearchKeyword] = useState('');
     const [filterCategory, setFilterCategory] = useState('all');
     const [filterStatus, setFilterStatus] = useState('all');

     // Modal states
     const [isFormOpen, setIsFormOpen] = useState(false);
     const [editingCourse, setEditingCourse] = useState<Course | undefined>(undefined);
     const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
     const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
     const [actionLoading, setActionLoading] = useState(false);

     // Load courses on mount
     useEffect(() => {
          loadCourses();
     }, []);

     // Load courses from Firebase
     const loadCourses = async () => {
          try {
               const res = await coursesService.getAll();
               const data = res.data.map(convertFirestoreCourse);

               setCourses(data);
               setTotalCourses(data.length);

               // Extract unique categories
               const cats = extractCourseCategories(data);
               setCategories(cats);

               // Apply initial filtering
               applyFilters(data, searchKeyword, filterCategory, filterStatus);
          } catch (err) {
               console.error('Error loading courses:', err);
          } finally {
          }
     };

     // Apply filters
     const applyFilters = (courseList: Course[], search: string, category: string, status: string) => {
          let filtered = [...courseList];

          // Filter by search
          if (search) {
               filtered = filtered.filter(course =>
                    course.name.toLowerCase().includes(search.toLowerCase())
               );
          }

          // Filter by category
          if (category !== 'all') {
               filtered = filtered.filter(course => course.category === category);
          }

          // Filter by status
          if (status !== 'all') {
               filtered = filtered.filter(course => {
                    if (status === 'active') return course.isActive !== false;
                    return course.isActive === false;
               });
          }

          setFilteredCourses(filtered);
          setTotalCourses(filtered.length);
     };

     // Handle search
     const handleSearch = (keyword: string) => {
          setSearchKeyword(keyword);
          setPage(1);
          applyFilters(courses, keyword, filterCategory, filterStatus);
     };

     // Handle filter change
     const handleFilterChange = ({ category, status }: { category?: string; status?: string }) => {
          const newCategory = category !== undefined ? category : filterCategory;
          const newStatus = status !== undefined ? status : filterStatus;

          setFilterCategory(newCategory);
          setFilterStatus(newStatus);
          setPage(1);

          applyFilters(courses, searchKeyword, newCategory, newStatus);
     };

     // Handle page change
     const handlePageChange = (newPage: number) => {
          setPage(newPage);
     };

     // Handle edit course
     const handleEditCourse = (course: Course) => {
          setEditingCourse(course);
          setIsFormOpen(true);
     };

     // Handle delete click
     const handleDeleteClick = (course: Course) => {
          setCourseToDelete(course);
          setDeleteConfirmOpen(true);
     };

     // Handle delete confirm
     const handleDeleteConfirm = async () => {
          if (!courseToDelete) return;

          try {
               setActionLoading(true);
               await coursesService.delete(courseToDelete.id);

               // Update local state
               setCourses(prev => prev.filter(c => c.id !== courseToDelete.id));
               setFilteredCourses(prev => prev.filter(c => c.id !== courseToDelete.id));
               setTotalCourses(prev => prev - 1);

               setDeleteConfirmOpen(false);
               setCourseToDelete(null);
          } catch (err) {
               console.error('Error deleting course:', err);
               alert('Không thể xóa khóa học. Vui lòng thử lại.');
          } finally {
               setActionLoading(false);
          }
     };

     // Handle save course (create/update)
     const handleSaveCourse = async (courseData: Partial<Course>) => {
          try {
               setActionLoading(true);

               if (editingCourse) {
                    // Update existing course
                    const updatedCourse = await coursesService.update(
                         editingCourse.id,
                         courseData as unknown as PartialWithFieldValue<Omit<FirestoreCourse, "id" | "createdAt">>
                    );
                    const convertedCourse = convertFirestoreCourse(updatedCourse);

                    setCourses(prev => prev.map(c => c.id === convertedCourse.id ? convertedCourse : c));
                    setFilteredCourses(prev => prev.map(c => c.id === convertedCourse.id ? convertedCourse : c));
               } else {
                    // Create new course
                    const newCourse = await coursesService.create(
                         courseData as unknown as Omit<FirestoreCourse, "id" | "createdAt" | "updatedAt">
                    );
                    const convertedCourse = convertFirestoreCourse(newCourse);

                    setCourses(prev => [...prev, convertedCourse]);

                    // Re-apply filters
                    applyFilters([...courses, convertedCourse], searchKeyword, filterCategory, filterStatus);
               }

               setIsFormOpen(false);
               setEditingCourse(undefined);
          } catch (err) {
               console.error('Error saving course:', err);
               throw err; // Will be caught by the form
          } finally {
               setActionLoading(false);
          }
     };

     // Get paginated courses
     const paginatedCourses = filteredCourses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

     return (
          <AdminLayout>
               <div className="space-y-6">
                    {/* Header */}
                    <div className="bg-card rounded-lg p-6 border flex items-center justify-between">
                         <div>
                              <h2 className="text-2xl font-bold text-foreground mb-2">Quản lý Khóa học</h2>
                              <p className="text-muted-foreground">Thêm, chỉnh sửa và quản lý các khóa học của trung tâm.</p>
                         </div>
                         <Button onClick={() => {
                              setEditingCourse(undefined);
                              setIsFormOpen(true);
                         }}>
                              <Plus className="h-4 w-4 mr-2" />
                              Thêm khóa học
                         </Button>
                    </div>

                    {/* Course Table */}
                    <CourseTable
                         courses={paginatedCourses}
                         page={page}
                         pageSize={PAGE_SIZE}
                         total={totalCourses}
                         onEdit={handleEditCourse}
                         onDelete={handleDeleteClick}
                         onPageChange={handlePageChange}
                         onFilterChange={handleFilterChange}
                         onSearch={handleSearch}
                         categories={categories}
                    />

                    {/* Course Form Modal */}
                    <CourseForm
                         course={editingCourse}
                         isOpen={isFormOpen}
                         onClose={() => {
                              setIsFormOpen(false);
                              setEditingCourse(undefined);
                         }}
                         onSave={handleSaveCourse}
                         categories={categories}
                    />

                    {/* Delete Confirmation Dialog */}
                    <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                         <DialogContent>
                              <DialogHeader>
                                   <DialogTitle>Xác nhận xóa khóa học</DialogTitle>
                                   <DialogDescription>
                                        Bạn có chắc chắn muốn xóa khóa học "{courseToDelete?.name}"? Hành động này không thể hoàn tác.
                                   </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                   <Button
                                        variant="outline"
                                        className="text-foreground"
                                        onClick={() => setDeleteConfirmOpen(false)}
                                        disabled={actionLoading}
                                   >
                                        Hủy
                                   </Button>
                                   <Button
                                        variant="destructive"
                                        onClick={handleDeleteConfirm}
                                        disabled={actionLoading}
                                   >
                                        {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                        Xóa
                                   </Button>
                              </DialogFooter>
                         </DialogContent>
                    </Dialog>
               </div>
          </AdminLayout>
     );
};

export default AdminCoursesPage; 
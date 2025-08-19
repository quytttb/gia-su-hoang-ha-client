import React, { useState } from 'react';
import { Class } from '../../../types';
import { formatCurrency, hasValidDiscount } from '../../../utils/helpers';
import { Button } from '../../ui/button';
import { Edit, Trash2, Users2 } from 'lucide-react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface ClassTableProps {
  classes: Class[];
  page: number;
  pageSize: number;
  total: number;
  onEdit: (classItem: Class) => void;
  onDelete: (classItem: Class) => void;
  onViewRegistrations: (classItem: Class) => void;
  onPageChange: (page: number) => void;
  onFilterChange: (filter: { category?: string; status?: string }) => void;
  onSearch: (keyword: string) => void;
  categories: string[];
}

const ClassTable: React.FC<ClassTableProps> = ({
  classes,
  page,
  pageSize,
  total,
  onEdit,
  onDelete,
  onViewRegistrations,
  onPageChange,
  onFilterChange,
  onSearch,
  categories,
}) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  const totalPages = Math.ceil(total / pageSize);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(search);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onFilterChange({ category: value, status });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilterChange({ category, status: value });
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <form onSubmit={handleSearch} className="flex flex-wrap gap-2 items-end mb-4">
        <div className="w-full sm:w-auto flex-1 min-w-[180px]">
          <Label htmlFor="search" className="sr-only">
            Tìm kiếm
          </Label>
          <Input
            id="search"
            type="text"
            placeholder="Tìm kiếm tên lớp học..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className=""
          />
        </div>
        <Button type="submit" className="h-10">
          Tìm kiếm
        </Button>
        <div className="min-w-[160px]">
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="text-foreground">
              <SelectValue placeholder="Tất cả thể loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="text-foreground" value="all">
                Tất cả thể loại
              </SelectItem>
              {categories.map(cat => (
                <SelectItem className="text-foreground" key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[160px]">
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="text-foreground">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="text-foreground" value="all">
                Tất cả trạng thái
              </SelectItem>
              <SelectItem className="text-foreground" value="active">
                Đang mở
              </SelectItem>
              <SelectItem className="text-foreground" value="inactive">
                Đã ẩn
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border bg-background">
        <table className="min-w-full text-sm table-auto">
          <thead>
            <tr className="bg-muted/70 text-xs uppercase tracking-wide text-black dark:text-white">
              <th className="p-2 text-left font-semibold w-20">Ảnh</th>
              <th className="p-2 text-left font-semibold">Lớp học</th>
              <th className="p-2 text-center font-semibold w-40">Học phí</th>
              <th className="p-2 text-center font-semibold w-40">Trạng thái</th>
              <th className="p-2 text-center font-semibold w-32">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {classes.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground">
                  Không có lớp học nào.
                </td>
              </tr>
            ) : (
              classes.map(classItem => {
                const hasDiscountValue = hasValidDiscount(
                  classItem.discount,
                  classItem.discountEndDate
                );
                return (
                  <tr
                    key={classItem.id}
                    className="border-b last:border-0 hover:bg-accent/30 transition-colors group"
                  >
                    <td className="p-2 align-top">
                      <img
                        src={classItem.imageUrl}
                        alt={classItem.name}
                        className="h-12 w-12 object-cover rounded-md border shadow-sm group-hover:shadow"
                        onError={e => {
                          e.currentTarget.src = '/placeholder-image.jpg';
                        }}
                      />
                    </td>
                    <td className="p-2 align-top">
                      <div className="space-y-1 max-w-3xl">
                        <p
                          className="font-semibold text-base leading-snug text-black dark:text-white line-clamp-2"
                          title={classItem.name}
                        >
                          {classItem.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Thể loại: {classItem.category}
                        </p>
                        {hasDiscountValue ? (
                          <p className="text-xs font-medium text-green-700 dark:text-green-300">
                            Giảm {classItem.discount}% đến {classItem.discountEndDate}
                          </p>
                        ) : null}
                      </div>
                    </td>
                    <td className="p-2 align-top text-center">
                      {hasDiscountValue ? (
                        <div className="inline-flex flex-col gap-0.5 items-center">
                          <span className="line-through text-muted-foreground text-[11px]">
                            {formatCurrency(classItem.price)}
                          </span>
                          <span className="font-bold text-foreground">
                            {formatCurrency(
                              classItem.price - (classItem.price * (classItem.discount || 0)) / 100
                            )}
                          </span>
                        </div>
                      ) : (
                        <span className="font-bold text-foreground">
                          {formatCurrency(classItem.price)}
                        </span>
                      )}
                    </td>
                    <td className="p-2 align-top text-center">
                      <div className="flex flex-col items-center gap-1">
                        {classItem.featured && (
                          <span className="inline-block px-2 py-0.5 text-[11px] rounded-full bg-yellow-400 text-black dark:bg-yellow-600 dark:text-black">
                            Nổi bật
                          </span>
                        )}
                        {classItem.isActive !== false ? (
                          <span className="inline-block px-2 py-0.5 text-[11px] rounded-full bg-green-600 text-white dark:bg-green-500 dark:text-black">
                            Đang mở
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 text-[11px] rounded-full bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            Đã ẩn
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-2 align-top text-center">
                      <div className="flex items-start justify-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0 flex items-center justify-center"
                          onClick={() => onEdit(classItem)}
                          title="Sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0 flex items-center justify-center text-blue-600"
                          onClick={() => onViewRegistrations(classItem)}
                          title="Đăng ký"
                        >
                          <Users2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-7 w-7 p-0 flex items-center justify-center"
                          onClick={() => onDelete(classItem)}
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          className="text-foreground"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          Trước
        </Button>
        <span className="text-sm text-muted-foreground">
          Trang {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="text-foreground"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          Sau
        </Button>
      </div>
    </div>
  );
};

export default ClassTable;

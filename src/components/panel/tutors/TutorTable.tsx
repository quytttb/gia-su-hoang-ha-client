import React, { useState } from 'react';
import { Tutor } from '../../../types';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Edit, Trash2 } from 'lucide-react';

interface TutorTableProps {
  tutors: Tutor[];
  page: number;
  pageSize: number;
  total: number;
  onEdit: (tutor: Tutor) => void;
  onDelete: (tutor: Tutor) => void;
  onPageChange: (page: number) => void;
  onSearch: (keyword: string) => void;
}

const TutorTable: React.FC<TutorTableProps> = ({
  tutors,
  page,
  pageSize,
  total,
  onEdit,
  onDelete,
  onPageChange,
  onSearch,
}) => {
  const [search, setSearch] = useState('');
  const totalPages = Math.ceil(total / pageSize);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(search);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex flex-wrap gap-2 items-end mb-4">
        <div className="w-full sm:w-auto flex-1 min-w-[180px]">
          <Label htmlFor="search" className="sr-only">
            Tìm kiếm
          </Label>
          <Input
            id="search"
            type="text"
            placeholder="Tìm kiếm tên giáo viên..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Button type="submit" className="h-10">
          Tìm kiếm
        </Button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border bg-background">
        <table className="min-w-full text-sm table-auto">
          <thead>
            <tr className="bg-muted/70 text-xs uppercase tracking-wide text-black dark:text-white">
              <th className="p-2 text-left font-semibold w-20">Ảnh</th>
              <th className="p-2 text-left font-semibold">Giáo viên</th>
              <th className="p-2 text-center font-semibold w-28">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {tutors.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">
                  Không có giáo viên nào.
                </td>
              </tr>
            ) : (
              tutors.map(tutor => (
                <tr
                  key={tutor.id}
                  className="border-b last:border-0 hover:bg-accent/30 transition-colors group"
                >
                  <td className="p-2 align-top">
                    <img
                      src={tutor.imageUrl}
                      alt={tutor.name}
                      className="h-12 w-12 object-cover rounded-md border shadow-sm group-hover:shadow"
                      onError={e => {
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                    />
                  </td>
                  <td className="p-2 align-top">
                    <div className="space-y-1 max-w-3xl">
                      <p
                        className="font-semibold text-base leading-snug text-black dark:text-white"
                        title={tutor.name}
                      >
                        {tutor.name}
                      </p>
                      {tutor.specialty && (
                        <p
                          className="text-xs text-muted-foreground line-clamp-1"
                          title={tutor.specialty}
                        >
                          {tutor.specialty}
                        </p>
                      )}
                      {tutor.bio && (
                        <p className="text-xs line-clamp-2 text-foreground/90" title={tutor.bio}>
                          {tutor.bio}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-2 align-top text-center">
                    <div className="flex items-start justify-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0 flex items-center justify-center"
                        onClick={() => onEdit(tutor)}
                        title="Sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-7 w-7 p-0 flex items-center justify-center"
                        onClick={() => onDelete(tutor)}
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
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

export default TutorTable;

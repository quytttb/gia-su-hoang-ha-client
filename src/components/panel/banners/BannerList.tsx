import React, { useState } from 'react';
import { Banner } from '../../../types';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Edit, Trash2, Eye, EyeOff, GripVertical, ExternalLink } from 'lucide-react';

interface BannerListProps {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (bannerId: string) => void;
  onToggleActive: (bannerId: string, isActive: boolean) => void;
  onReorder: (banners: Banner[]) => void;
}

const BannerList: React.FC<BannerListProps> = ({
  banners,
  onEdit,
  onDelete,
  onToggleActive,
  onReorder,
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    banner: Banner | null;
  }>({
    isOpen: false,
    banner: null,
  });

  const [draggedItem, setDraggedItem] = useState<Banner | null>(null);

  const handleDeleteClick = (banner: Banner) => {
    setDeleteConfirm({
      isOpen: true,
      banner,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm.banner) {
      onDelete(deleteConfirm.banner.id);
      setDeleteConfirm({
        isOpen: false,
        banner: null,
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, banner: Banner) => {
    setDraggedItem(banner);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetBanner: Banner) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.id === targetBanner.id) {
      setDraggedItem(null);
      return;
    }

    const newBanners = [...banners];
    const draggedIndex = newBanners.findIndex(b => b.id === draggedItem.id);
    const targetIndex = newBanners.findIndex(b => b.id === targetBanner.id);

    // Remove dragged item and insert at target position
    newBanners.splice(draggedIndex, 1);
    newBanners.splice(targetIndex, 0, draggedItem);

    // Update order values
    const reorderedBanners = newBanners.map((banner, index) => ({
      ...banner,
      order: index + 1,
    }));

    onReorder(reorderedBanners);
    setDraggedItem(null);
  };

  // removed updatedAt column -> formatDate no longer needed

  if (banners.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Chưa có banner nào được tạo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-background">
      <table className="min-w-full text-sm table-auto">
        <thead>
          <tr className="bg-muted/70 text-xs uppercase tracking-wide text-black dark:text-white">
            <th className="p-2 text-left font-semibold w-20">Thứ tự</th>
            <th className="p-2 text-left font-semibold w-40">Hình ảnh</th>
            <th className="p-2 text-left font-semibold">Tiêu đề</th>
            <th className="p-2 font-semibold text-center w-32">Trạng thái</th>
            <th className="p-2 font-semibold text-center w-32">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {banners
            .sort((a, b) => a.order - b.order)
            .map(banner => (
              <tr
                key={banner.id}
                className="border-b last:border-0 hover:bg-accent/30 transition-colors group"
                draggable
                onDragStart={e => handleDragStart(e, banner)}
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, banner)}
              >
                <td className="p-2 align-middle">
                  <div className="flex items-center gap-2">
                    <GripVertical
                      className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing opacity-60 group-hover:opacity-100"
                      aria-label="Kéo để sắp xếp"
                      role="button"
                      aria-grabbed={false}
                    />
                    <span className="font-medium" title={`Thứ tự: ${banner.order}`}>
                      {banner.order}
                    </span>
                  </div>
                </td>
                <td className="p-2 align-middle">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-24 h-14 object-cover rounded-md border shadow-sm group-hover:shadow"
                    onError={e => {
                      e.currentTarget.src = '/placeholder-image.jpg';
                    }}
                  />
                </td>
                <td className="p-2 align-middle">
                  <div className="space-y-1">
                    <p className="font-semibold leading-snug text-black dark:text-white line-clamp-2">
                      {banner.title}
                    </p>
                    {banner.subtitle && (
                      <p className="text-xs leading-snug opacity-70 line-clamp-1">
                        {banner.subtitle}
                      </p>
                    )}
                    {banner.link && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <ExternalLink className="h-3 w-3 opacity-60" />
                        <span
                          className="text-[11px] underline break-all opacity-70 max-w-[260px] line-clamp-1"
                          title={banner.link}
                        >
                          {banner.link}
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-2 align-middle text-center">
                  <button
                    type="button"
                    onClick={() => onToggleActive(banner.id, !banner.isActive)}
                    title={banner.isActive ? 'Nhấp để ẩn' : 'Nhấp để hiển thị'}
                    className={
                      'inline-flex items-center gap-1 h-7 px-3 text-xs font-semibold rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 ' +
                      (banner.isActive
                        ? 'bg-green-600 border-green-600 text-white hover:bg-green-600/90 dark:bg-green-400 dark:border-green-400 dark:text-black dark:hover:bg-green-400/90'
                        : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600')
                    }
                  >
                    {banner.isActive ? (
                      <span className="flex items-center gap-1 text-white dark:text-black">
                        <Eye className="h-3 w-3" /> Hiển thị
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                        <EyeOff className="h-3 w-3" /> Ẩn
                      </span>
                    )}
                  </button>
                </td>
                <td className="p-2 align-middle text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0 flex items-center justify-center"
                      onClick={() => onEdit(banner)}
                      title="Sửa"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-7 w-7 p-0 flex items-center justify-center"
                      onClick={() => handleDeleteClick(banner)}
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
      {/* Xác nhận xóa */}
      <Dialog
        open={deleteConfirm.isOpen}
        onOpenChange={open => setDeleteConfirm({ isOpen: open, banner: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa banner</DialogTitle>
            <DialogDescription>Bạn có chắc chắn muốn xóa banner này không?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm({ isOpen: false, banner: null })}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BannerList;

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../staff/components/sample/ui/dialog';
import { Input } from '../../../staff/components/booking/ui/input';
import { Textarea } from '../../../staff/components/booking/ui/textarea';
import { Button } from '../../../staff/components/sample/ui/button';
import type { BlogResponse } from '../../types/blogs';
import Checkbox from '../common/Checkbox';

interface BlogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: {
    title: string;
    content: string;
    thumbnailURL: string | File; // Có thể là string (khi edit) hoặc File (khi upload)
    thumbnailPreview?: string;   
    status: string;
    authorId: string;
    authorName: string;
  };
  setForm: (form: any) => void;
  onSave: () => void;
  editingBlog: BlogResponse | null;
}

const BlogDialog: React.FC<BlogDialogProps> = ({
  open,
  onOpenChange,
  form,
  setForm,
  onSave,
  editingBlog,
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setForm((prev: any) => ({
      ...prev,
      thumbnailURL: file,
      thumbnailPreview: file ? URL.createObjectURL(file) : prev.thumbnailPreview,
    }));
  }, [setForm]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-800">
            {editingBlog ? 'Chỉnh sửa bài viết' : 'Thêm bài viết'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
          <Input
            className="w-full"
            placeholder="Tiêu đề bài viết"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          {/* Chọn file ảnh thumbnail bằng react-dropzone */}
          <div>
            <label className="block mb-1 font-medium text-blue-800">Ảnh thumbnail</label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive
                ? "Thả ảnh vào đây..."
                : "Nhấn vào đây hoặc kéo-thả ảnh vào để chọn ảnh thumbnail"}
            </div>
            {(form.thumbnailPreview || (editingBlog && typeof form.thumbnailURL === 'string')) && (
              <img
                src={
                  form.thumbnailPreview
                    ? form.thumbnailPreview
                    : (typeof form.thumbnailURL === 'string' ? form.thumbnailURL : '')
                }
                alt="Thumbnail preview"
                className="mt-2 rounded max-h-40 object-contain border"
              />
            )}
          </div>

          <Textarea
            className="w-full"
            placeholder="Nội dung bài viết"
            rows={10}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          <div className="flex items-center gap-2">
            <Checkbox
              checked={form.status === 'Hiển thị' || form.status === '1'}
              onChange={(checked) =>
                setForm((prev: any) => ({
                  ...prev,
                  status: checked ? 'Hiển thị' : 'Ẩn', // hoặc '1' : '0' nếu muốn lưu số
                }))
              }
              label="Hiển thị (Công khai)"
            />
          </div>
          <Button
            onClick={onSave}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            {editingBlog ? 'Lưu thay đổi' : 'Thêm bài viết'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogDialog;

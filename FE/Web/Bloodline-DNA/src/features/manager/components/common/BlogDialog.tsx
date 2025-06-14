import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../staff/components/sample/ui/dialog';
import { Input } from '../../../staff/components/booking/ui/input';
import { Textarea } from '../../../staff/components/booking/ui/textarea';
import { Button } from '../../../staff/components/sample/ui/button';
import type { Blog } from '../../types/blogs';

interface BlogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: {
    title: string;
    content: string;
    thumbnailURL: string;
    status: string;
    authorId: string;
    authorName: string;
  };
  setForm: (form: any) => void;
  onSave: () => void;
  editingBlog: Blog | null;
}

const BlogDialog: React.FC<BlogDialogProps> = ({
  open,
  onOpenChange,
  form,
  setForm,
  onSave,
  editingBlog,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl w-full">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-blue-800">
          {editingBlog ? 'Chỉnh sửa bài viết' : 'Thêm bài viết'}
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
        <Input
          className="w-full"
          placeholder="Tiêu đề bài viết"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <Input
          className="w-full"
          placeholder="Ảnh thumbnail URL"
          value={form.thumbnailURL}
          onChange={(e) => setForm({ ...form, thumbnailURL: e.target.value })}
        />
        <Textarea
          className="w-full"
          placeholder="Nội dung bài viết"
          rows={5}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
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

export default BlogDialog;

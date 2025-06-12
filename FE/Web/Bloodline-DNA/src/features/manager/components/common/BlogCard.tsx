import { Card, CardContent } from '../../../staff/components/sample/ui/card';
import { Button } from '../../../staff/components/sample/ui/button';
import { format } from 'date-fns';
import type { Blog } from '../../types/blogs';

interface BlogCardProps {
  blog: Blog;
  onEdit: (blog: Blog) => void;
  onDelete: (id: string) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onEdit, onDelete }) => (
  <Card className="shadow-md border border-blue-100">
    <CardContent className="p-4 space-y-3">
      <img src={blog.thumbnailURL} alt={blog.title} className="w-full h-48 object-cover rounded-md" />
      <h2 className="text-xl font-semibold text-blue-700 truncate" title={blog.title}>{blog.title}</h2>
      <p className="text-sm text-gray-600">Tác giả: <span className="font-medium">{blog.authorName}</span></p>
      <p className="text-sm text-gray-500">Ngày tạo: {format(new Date(blog.createdAt), 'dd/MM/yyyy')}</p>
      <div className="flex justify-between pt-2 gap-2">
        <Button variant="outline" onClick={() => onEdit(blog)} className="flex-1">Sửa</Button>
        <Button variant="destructive" onClick={() => onDelete(blog.id)} className="flex-1">Xóa</Button>
      </div>
    </CardContent>
  </Card>
);

export default BlogCard;
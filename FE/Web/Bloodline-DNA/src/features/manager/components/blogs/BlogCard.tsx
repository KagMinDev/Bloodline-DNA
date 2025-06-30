import { Card, CardContent } from '../../../staff/components/sample/ui/card';
import { Button } from '../../../staff/components/sample/ui/button';
import { format } from 'date-fns';
import { FaEdit, FaTrash } from 'react-icons/fa';
import type { BlogResponse } from '../../types/blogs';

interface BlogCardProps {
  blog: BlogResponse;
  onEdit: (blog: BlogResponse) => void;
  onDelete: (id: string) => void;
}

const getStatusText = (status: string) => {
  if (status === '1') return 'Công khai';
  if (status === '0') return 'Bản nháp';
  return status;
};

const BlogCard: React.FC<BlogCardProps> = ({ blog, onEdit, onDelete }) => (
  <Card className="shadow-md border border-blue-100 relative">
    <CardContent className="space-y-3 flex flex-col">
      <img
        src={blog.thumbnailURL}
        alt={blog.title}
        className="w-full h-70 object-cover rounded-md"
      />
      <h2 className="text-xl font-semibold text-blue-700 truncate" title={blog.title}>
        {blog.title}
      </h2>

      {/* Hiển thị Tag (nếu có) */}
      {blog.tagName && (
        <div className="flex flex-wrap gap-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            {blog.tagName}
          </span>
        </div>
      )}

      <p className="text-sm text-gray-600">
        Trạng thái: <span className="font-medium">{getStatusText(blog.status)}</span>
      </p>
      <p className="text-sm text-gray-600">
        Tác giả: <span className="font-medium">{blog.authorName}</span>
      </p>
      <p className="text-sm text-gray-500">
        Ngày tạo: {format(new Date(blog.createdAt), 'dd/MM/yyyy')}
      </p>

      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          className="flex-1 flex items-center gap-2 border-blue-600 text-blue-700 hover:bg-blue-50"
          onClick={() => onEdit(blog)}
        >
          <FaEdit /> Sửa
        </Button>
        <Button
          variant="outline"
          className="flex-1 flex items-center gap-2 border-red-500 text-red-600 hover:bg-red-50"
          onClick={() => onDelete(blog.id)}
        >
          <FaTrash /> Xóa
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default BlogCard;

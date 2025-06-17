import { useState, useEffect, useCallback } from 'react';
import { Button } from '../../staff/components/sample/ui/button';
import BlogCard from '../components/blogs/BlogCard';
import BlogDialog from '../components/blogs/BlogDialog';
import { FaPlus } from 'react-icons/fa';
import { getBlogsApi, createBlogApi } from '../api/blogsApi';
import type { BlogResponse } from '../types/blogs';

function Blogs() {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogResponse | null>(null);
  const accountId = localStorage.getItem('accountId') || '';
  const accountName = localStorage.getItem('accountName') || '';
  const authorId = accountId;

  const [form, setForm] = useState({
    title: '',
    content: '',
    thumbnailURL: '' as string | File,
    thumbnailPreview: '',
    status: '',
    authorId: authorId,
    authorName: accountName,
  });

  // Tách fetchBlogs để có thể gọi lại sau khi thêm mới
  const fetchBlogs = useCallback(async () => {
    try {
      const blogsData = await getBlogsApi();
      setBlogs(blogsData);
    } catch (error) {
      alert('Không thể tải danh sách bài viết');
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleSave = async () => {
    if (editingBlog) {
      // Xử lý cập nhật bài viết nếu có API update
    } else {
      try {
        const statusNumber = form.status === 'Hiển thị' ? 1 : 0;
        if (!form.thumbnailURL || typeof form.thumbnailURL === 'string') {
          alert('Vui lòng chọn file ảnh thumbnail!');
          return;
        }
        await createBlogApi({
          title: form.title,
          content: form.content,
          status: statusNumber,
          authorId: form.authorId,
          thumbnailURL: form.thumbnailURL as File,
        });
        // Gọi lại fetchBlogs để cập nhật giao diện
        await fetchBlogs();
      } catch (error: any) {
        alert(error.message || 'Tạo bài viết thất bại');
      }
    }

    setShowDialog(false);
    setEditingBlog(null);
    setForm({
      title: '',
      content: '',
      thumbnailURL: '',
      thumbnailPreview: '',
      status: '',
      authorId: authorId,
      authorName: accountName,
    });
  };

  const handleEdit = (blog: BlogResponse) => {
    setEditingBlog(blog);
    setForm({
      title: blog.title,
      content: blog.content,
      thumbnailURL: blog.thumbnailURL,
      thumbnailPreview: blog.thumbnailURL,
      status: (typeof blog.status === 'string' ? Number(blog.status) : blog.status) === 1 ? 'Hiển thị' : 'Ẩn',
      authorId: blog.authorId,
      authorName: blog.authorName,
    });
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa bài viết này?')) {
      setBlogs(blogs.filter(b => b.id !== id));
    }
  };

  return (
    <div className="h-screen flex flex-col items-center bg-blue-50 p-6 relative overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800">Quản lý bài viết</h1>
          <Button
            onClick={() => setShowDialog(true)}
            className="flex items-center gap-2 bg-[#1F2B6C] hover:bg-blue-800 px-4 py-2 rounded-lg shadow"
          >
            <FaPlus className="text-lg text-white" />
            <span className="text-white">Thêm bài viết</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(blog => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      <BlogDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        form={form}
        setForm={setForm}
        onSave={handleSave}
        editingBlog={editingBlog}
      />
    </div>
  );
}

export default Blogs;

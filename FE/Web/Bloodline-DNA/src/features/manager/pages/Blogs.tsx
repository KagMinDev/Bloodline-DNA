import { useCallback, useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Loading } from '../../../components';
import { Button } from '../../staff/components/sample/ui/button';
import { createBlogApi, deleteBlogApi, getBlogByIdApi, getBlogsApi, updateBlogApi } from '../api/blogsApi';
import { getTagsApi } from '../api/tagApi'; // import hàm getTagsApi
import BlogCard from '../components/blogs/BlogCard';
import BlogDialog from '../components/blogs/BlogDialog';
import type { BlogCreateRequest, BlogResponse, BlogUpdateRequest } from '../types/blogs';
import type { TagResponse } from '../types/tags';

function BlogsManager() {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<TagResponse[]>([]);
  const accountId = localStorage.getItem('accountId') || '';
  const accountName = localStorage.getItem('accountName') || '';
  const authorId = accountId;

  const [form, setForm] = useState<{
    title: string;
    content: string;
    thumbnailURL: string | File;
    thumbnailPreview: string;
    status: string;
    authorId: string;
    authorName: string;
    tagIds: string;
  }>({
    title: '',
    content: '',
    thumbnailURL: '',
    thumbnailPreview: '',
    status: '',
    authorId: authorId,
    authorName: accountName,
    tagIds: '',
  });

  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const blogsData = await getBlogsApi();
      if (Array.isArray(blogsData)) {
        setBlogs(blogsData);
      } else {
        console.error('fetchBlogs: Invalid data format', blogsData);
        setBlogs([]);
      }
    } catch (error) {
      console.error('fetchBlogs error:', error);
      alert('Không thể tải danh sách bài viết');
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    return () => {
      if (form.thumbnailPreview) {
        URL.revokeObjectURL(form.thumbnailPreview);
      }
    };
  }, [form.thumbnailPreview]);

  const handleSave = useCallback(async () => {
    try {
      setIsLoading(true);
      const statusNumber = form.status === 'Hiển thị' ? 1 : 0;

      if (editingBlog) {
        const blogRequest: BlogUpdateRequest = {
          id: editingBlog.id,
          title: form.title,
          content: form.content,
          status: statusNumber,
          authorId: form.authorId,
          thumbnailURL: typeof form.thumbnailURL === 'string' ? form.thumbnailURL : undefined,
          tagIds: form.tagIds || '',
        };

        const updatedBlog = await updateBlogApi(editingBlog.id, blogRequest);
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) => (blog.id === editingBlog.id ? { ...blog, ...updatedBlog } : blog))
        );
        alert('Cập nhật bài viết thành công');
      } else {
        if (!(form.thumbnailURL instanceof File)) {
          alert('Vui lòng chọn file ảnh thumbnail!');
          return;
        }
        const blogRequest: BlogCreateRequest = {
          title: form.title,
          content: form.content,
          status: statusNumber,
          authorId: form.authorId,
          thumbnailURL: form.thumbnailURL,
          tagIds: form.tagIds || '',
        };
        await createBlogApi(blogRequest);
        await fetchBlogs();
        alert('Tạo bài viết thành công');
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
        tagIds: '',
      });
    } catch (error: any) {
      console.error('handleSave error:', error);
      alert(error.message || (editingBlog ? 'Cập nhật bài viết thất bại' : 'Tạo bài viết thất bại'));
    } finally {
      setIsLoading(false);
    }
  }, [form, editingBlog, authorId, accountName, fetchBlogs]);

  const handleEdit = useCallback(async (blog: BlogResponse) => {
    try {
      setIsLoading(true);
      const blogData = await getBlogByIdApi(blog.id);
      setEditingBlog(blogData);
      setForm({
        title: blogData.title,
        content: blogData.content,
        thumbnailURL: blogData.thumbnailURL,
        thumbnailPreview: blogData.thumbnailURL,
        status: (typeof blogData.status === 'string' ? Number(blogData.status) : blogData.status) === 1 ? 'Hiển thị' : 'Ẩn',
        authorId: blogData.authorId,
        authorName: blogData.authorName,
        tagIds: blogData.tagIds || '',
      });
      setShowDialog(true);
    } catch (error: any) {
      console.error('handleEdit error:', error);
      alert(error.message || 'Không thể tải thông tin bài viết');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa bài viết này?')) {
      try {
        setIsLoading(true);
        await deleteBlogApi(id);
        setBlogs((prevBlogs) => prevBlogs.filter((b) => b.id !== id));
        alert('Xóa bài viết thành công');
      } catch (error: any) {
        console.error('handleDelete error:', error);
        alert(error.message || 'Xóa bài viết thất bại');
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  const handleAddNewBlog = useCallback(() => {
    setForm({
      title: '',
      content: '',
      thumbnailURL: '',
      thumbnailPreview: '',
      status: '',
      authorId: authorId,
      authorName: accountName,
      tagIds: '',
    });
    setEditingBlog(null);
    setShowDialog(true);
  }, [authorId, accountName]);

  useEffect(() => {
    getTagsApi().then(setTags).catch(() => setTags([]));
  }, []);

  return (
    <>
      <div className="h-screen flex flex-col items-center bg-blue-50 p-6 relative overflow-auto">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-800">Quản lý bài viết</h1>
            <Button
              onClick={handleAddNewBlog}
              className="flex items-center gap-2 bg-[#1F2B6C] hover:bg-blue-800 px-4 py-2 rounded-lg shadow"
              disabled={isLoading}
            >
              <FaPlus className="text-lg text-white" />
              <span className="text-white">Thêm bài viết</span>
            </Button>
          </div>

          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Không có bài viết nào để hiển thị.</p>
          )}
        </div>

        <BlogDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          form={form}
          setForm={setForm}
          onSave={handleSave}
          editingBlog={editingBlog}
          isLoading={isLoading}
          tags={tags} // truyền thêm prop này
        />
      </div>
      {isLoading && <Loading message="Đang tải..." fullScreen={true} />}
    </>
  );
}

export default BlogsManager;
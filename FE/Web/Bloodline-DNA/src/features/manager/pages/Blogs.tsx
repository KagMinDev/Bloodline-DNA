import { useState } from 'react';
import type { Blog } from '../types/blogs';
import { Button } from '../../staff/components/sample/ui/button';
import BlogCard from '../components/common/BlogCard';
import BlogDialog from '../components/common/BlogDialog';

const initialBlogs: Blog[] = [
	{
		id: '1',
		title: 'Giới thiệu xét nghiệm ADN',
		content: 'Đây là bài viết giới thiệu về xét nghiệm ADN...',
		thumbnailURL: 'https://via.placeholder.com/150',
		status: 'Hiển thị',
		authorId: 'admin',
		authorName: 'Admin',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: '2',
		title: 'Lợi ích của xét nghiệm huyết thống',
		content: 'Bài viết về lợi ích của xét nghiệm huyết thống, giúp xác định mối quan hệ huyết thống một cách chính xác và nhanh chóng.',
		thumbnailURL: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
		status: 'Hiển thị',
		authorId: 'staff1',
		authorName: 'Nguyễn Văn B',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: '3',
		title: 'Quy trình lấy mẫu xét nghiệm',
		content: 'Hướng dẫn quy trình lấy mẫu xét nghiệm ADN đúng chuẩn, đảm bảo kết quả chính xác nhất.',
		thumbnailURL: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
		status: 'Hiển thị',
		authorId: 'staff2',
		authorName: 'Trần Thị C',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: '4',
		title: 'Những điều cần biết trước khi xét nghiệm',
		content: 'Một số lưu ý quan trọng trước khi làm xét nghiệm ADN để đảm bảo kết quả chính xác.',
		thumbnailURL: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
		status: 'Hiển thị',
		authorId: 'staff3',
		authorName: 'Lê Văn D',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: '5',
		title: 'Câu hỏi thường gặp về xét nghiệm ADN',
		content: 'Tổng hợp các câu hỏi thường gặp về xét nghiệm ADN và giải đáp chi tiết.',
		thumbnailURL: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80',
		status: 'Hiển thị',
		authorId: 'staff4',
		authorName: 'Phạm Thị E',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
];

function Blogs() {
	const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
	const [showDialog, setShowDialog] = useState(false);
	const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

	const [form, setForm] = useState<Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>>({
		title: '',
		content: '',
		thumbnailURL: '',
		status: 'Hiển thị',
		authorId: 'admin',
		authorName: 'Admin',
	});

	const handleSave = () => {
		if (editingBlog) {
			setBlogs(
				blogs.map(b =>
					b.id === editingBlog.id
						? {
								...editingBlog,
								...form,
								updatedAt: new Date().toISOString(),
						  }
						: b
				)
			);
		} else {
			setBlogs([
				...blogs,
				{
					...form,
					id: crypto.randomUUID(),
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
			]);
		}

		setShowDialog(false);
		setEditingBlog(null);
		setForm({
			title: '',
			content: '',
			thumbnailURL: '',
			status: 'Hiển thị',
			authorId: 'admin',
			authorName: 'Admin',
		});
	};

	const handleEdit = (blog: Blog) => {
		setEditingBlog(blog);
		setForm({
			title: blog.title,
			content: blog.content,
			thumbnailURL: blog.thumbnailURL,
			status: blog.status,
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
		<div className="p-8 bg-gray-50 min-h-screen overflow-auto">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold text-blue-800">Quản lý bài viết</h1>
				<Button onClick={() => setShowDialog(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
					Thêm bài viết
				</Button>
			</div>

			<div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{blogs.map(blog => (
					<BlogCard key={blog.id} blog={blog} onEdit={handleEdit} onDelete={handleDelete} />
				))}
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

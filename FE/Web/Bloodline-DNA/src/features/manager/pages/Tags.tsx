import { useState, useEffect, useCallback } from 'react';
import { Button } from '../../staff/components/sample/ui/button';
import { FaPlus } from 'react-icons/fa';
import { getTagsApi, createTagApi, updateTagApi, deleteTagApi } from '../api/tagApi';
import type { TagRequest, TagResponse, TagUpdateRequest } from '../types/tags';
import { Loading } from '../../../components';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../../staff/components/sample/ui/dropdown-menu';
import TagDialog from '../components/blogs/TagDialog';

function Tags() {
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTag, setEditingTag] = useState<TagResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<{ name: string }>({ name: '' });

  const fetchTags = useCallback(async () => {
    try {
      setIsLoading(true);
      const tagsData = await getTagsApi();
      setTags(Array.isArray(tagsData) ? tagsData : []);
    } catch (error) {
      alert('Không thể tải danh sách tag');
      setTags([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleSave = useCallback(async () => {
    try {
      setIsLoading(true);
      if (editingTag) {
        const tagRequest: TagUpdateRequest = { id: editingTag.id, name: form.name };
        await updateTagApi(tagRequest);
        setTags((prev) =>
          prev.map((tag) => (tag.id === editingTag.id ? { ...tag, name: form.name } : tag))
        );
        alert('Cập nhật tag thành công');
      } else {
        const tagRequest: TagRequest = { name: form.name };
        await createTagApi(tagRequest);
        await fetchTags();
        alert('Tạo tag thành công');
      }
      setShowDialog(false);
      setEditingTag(null);
      setForm({ name: '' });
    } catch (error: any) {
      alert(error.message || (editingTag ? 'Cập nhật tag thất bại' : 'Tạo tag thất bại'));
    } finally {
      setIsLoading(false);
    }
  }, [form, editingTag, fetchTags]);

  const handleEdit = (tag: TagResponse) => {
    setEditingTag(tag);
    setForm({ name: tag.name });
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa tag này?')) {
      try {
        setIsLoading(true);
        await deleteTagApi(id);
        setTags((prev) => prev.filter((t) => t.id !== id));
        alert('Xóa tag thành công');
      } catch (error: any) {
        alert(error.message || 'Xóa tag thất bại');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddNewTag = () => {
    setForm({ name: '' });
    setEditingTag(null);
    setShowDialog(true);
  };

  return (
    <>
      <div className="min-h-screen bg-blue-50 p-6 overflow-auto">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-[#1F2B6C]">Quản lý Tag</h1>
            <Button
              onClick={handleAddNewTag}
              className="flex items-center gap-2 bg-[#1F2B6C] hover:bg-[#26388c] px-4 py-2 text-white shadow rounded-md"
              disabled={isLoading}
            >
              <FaPlus className="text-white" />
              <span className="text-white">Thêm tag</span>
            </Button>
          </div>

          {isLoading ? (
            <Loading message="Đang tải danh sách tag..." fullScreen={false} />
          ) : tags.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800">{tag.name}</h3>
                    <p className="text-sm text-gray-500">
                      Tạo: {tag.createdAt ? new Date(tag.createdAt).toLocaleString() : 'N/A'} <br />
                      Cập nhật: {tag.updatedAt ? new Date(tag.updatedAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-2 rounded-md hover:bg-gray-100 transition"
                        aria-label="Tùy chọn"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem onClick={() => handleEdit(tag)}>
                        ✏️ <span className="ml-1">Sửa</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(tag.id)}
                        className="text-red-600"
                      >
                        🗑️ <span className="ml-1">Xóa</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 italic">Không có tag nào để hiển thị.</p>
          )}
        </div>
      </div>

      {/* Modal Dialog */}
      <TagDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onSubmit={handleSave}
        form={form}
        setForm={setForm}
        editingTag={!!editingTag}
        isLoading={isLoading}
      />
    </>
  );
}

export default Tags;

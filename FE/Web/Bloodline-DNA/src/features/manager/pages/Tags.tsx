import { useState, useEffect, useCallback } from 'react';
import { Button } from '../../staff/components/sample/ui/button';
import { FaPlus } from 'react-icons/fa';
import { getTagsApi, createTagApi, updateTagApi, deleteTagApi } from '../api/tagApi';
import type { TagRequest, TagResponse, TagUpdateRequest } from '../types/tags';
import { Loading } from '../../../components';
import TagDialog from '../components/blogs/TagDialog';
import {
  Card,
  CardContent,
} from '../../staff/components/sample/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../../staff/components/sample/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../../staff/components/sample/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

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
    } catch {
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
      <div className="min-h-screen bg-blue-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h1 className="text-3xl font-bold text-blue-700 ml-5">Quản lý Tag</h1>
                <Button
                  onClick={handleAddNewTag}
                  className="flex items-center gap-2 bg-[#1F2B6C] hover:bg-blue-800 px-4 py-2 text-white shadow rounded-md"
                  disabled={isLoading}
                >
                  <FaPlus className="text-white" />
                  <span className="text-white">Thêm tag</span>
                </Button>
              </div>
          <Card className="shadow-md border rounded-2xl">
            <CardContent className="p-6">
              {/* Bảng */}
              {isLoading ? (
                <Loading message="Đang tải danh sách tag..." fullScreen={false} />
              ) : tags.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">Tên</TableHead>
                        <TableHead className="text-center">Ngày tạo</TableHead>
                        <TableHead className="text-center">Ngày cập nhật</TableHead>
                        <TableHead className="text-center">Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tags.map((tag) => (
                        <TableRow key={tag.id}>
                          <TableCell className="text-center font-semibold text-blue-800">{tag.name}</TableCell>
                          <TableCell className="text-center text-sm text-gray-600">
                            {tag.createdAt ? new Date(tag.createdAt).toLocaleString() : 'N/A'}
                          </TableCell>
                          <TableCell className="text-center text-sm text-gray-600">
                            {tag.updatedAt ? new Date(tag.updatedAt).toLocaleString() : 'N/A'}
                          </TableCell>
                          <TableCell className="text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-5 w-5 text-blue-700" />
                                </Button>
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
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-gray-500 italic">Không có tag nào để hiển thị.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog */}
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

import React, { useState, useEffect } from 'react';
import { FaPlus, FaEllipsisV } from 'react-icons/fa';
import { Button } from '../components/sample/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/sample/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/sample/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/sample/ui/table';
import type { TestKitRequest, TestKitResponse } from '../types/testKit';
import ModalTestKit from '../components/testKit/ModalTestKit';
import { createTestKitApi, deleteTestKitApi, getTestKitsApi } from '../api/testKitApi';
import { toast } from 'react-toastify';

const TestKit: React.FC = () => {
  const [testKits, setTestKits] = useState<TestKitResponse[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token') || '';
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<TestKitRequest>({
    bookingId: '',
    shippedAt: '',
    receivedAt: '',
    sentToLabAt: '',
    labReceivedAt: '',
    note: '',
    sampleCount: 0,
  });

  // Fetch TestKits on mount
  useEffect(() => {
    if (!token) {
      setError('Không tìm thấy token xác thực');
      setIsLoading(false);
      toast.error('Vui lòng đăng nhập lại');
      return;
    }
    const fetchTestKits = async () => {
      try {
        const response = await getTestKitsApi(token);
        setTestKits(response);
      } catch (err) {
        setError('Không thể tải danh sách TestKit. Vui lòng thử lại.');
        toast.error('Lỗi khi tải danh sách TestKit.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestKits();
  }, [token]);

  const validateForm = (form: TestKitRequest): string | null => {
    if (!form.bookingId.trim()) return 'Mã đặt là bắt buộc.';
    if (form.sampleCount < 0) return 'Số mẫu không thể âm.';
    return null;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'sampleCount' ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    const validationError = validateForm(form);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      setError(null);
      // Create new TestKit
      const newTestKit = await createTestKitApi(form, token);
      setTestKits((prev) => [...prev, newTestKit]);
      setOpenModal(false);
      setForm({
        bookingId: '',
        shippedAt: '',
        receivedAt: '',
        sentToLabAt: '',
        labReceivedAt: '',
        note: '',
        sampleCount: 0,
      });
      toast.success('Tạo TestKit thành công!');
    } catch (err) {
      setError('Lỗi khi tạo TestKit. Vui lòng thử lại.');
      toast.error('Lỗi khi tạo TestKit.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTestKitApi(id);
      setTestKits((prev) => prev.filter((kit) => kit.id !== id));
      toast.success('Xóa TestKit thành công!');
    } catch (err) {
      setError('Lỗi khi xóa TestKit. Vui lòng thử lại.');
      toast.error('Lỗi khi xóa TestKit.');
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Quản lý TestKit</h1>
        <Button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            setOpenModal(true);
            setError(null);
          }}
        >
          <FaPlus className="text-white" />
          Thêm TestKit
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center text-gray-600 py-6">Đang tải...</div>
      ) : (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-blue-600">Danh sách TestKit</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã Đặt</TableHead>
                  <TableHead>Gửi đi</TableHead>
                  <TableHead>Nhận được</TableHead>
                  <TableHead>Gửi Lab</TableHead>
                  <TableHead>Lab Nhận</TableHead>
                  <TableHead>Ghi chú</TableHead>
                  <TableHead>Số mẫu</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testKits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-400 py-6">
                      Chưa có TestKit nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  testKits.map((kit) => (
                    <TableRow key={kit.id}>
                      <TableCell>{kit.bookingId}</TableCell>
                      <TableCell>{kit.shippedAt || '-'}</TableCell>
                      <TableCell>{kit.receivedAt || '-'}</TableCell>
                      <TableCell>{kit.sentToLabAt || '-'}</TableCell>
                      <TableCell>{kit.labReceivedAt || '-'}</TableCell>
                      <TableCell>{kit.note || '-'}</TableCell>
                      <TableCell>{kit.sampleCount}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <FaEllipsisV className="text-blue-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => alert('Chức năng sửa chưa khả dụng.')}
                              className="text-gray-400 cursor-not-allowed"
                            >
                              Sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(kit.id)}
                              className="text-red-600 focus:bg-red-50 focus:text-red-800"
                            >
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <ModalTestKit
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setError(null);
        }}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isEditing={false}
      />
    </div>
  );
};

export default TestKit;
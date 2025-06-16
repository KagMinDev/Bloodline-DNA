import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaEllipsisV } from 'react-icons/fa';
import { Button } from '../../staff/components/sample/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../staff/components/sample/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../staff/components/sample/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../staff/components/sample/ui/table';
import type { UserResponse } from '../types/User';
import ModalUser from '../components/user/ModalUser';
import { createStaffApi, getAllUserApi } from '../api/userApi';

const UserMangement: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem('token') || '';

  // Định nghĩa fetchUsers với useCallback
  const fetchUsers = useCallback(async () => {
    try {
      const res = await getAllUserApi(token);
      setUsers(res);
    } catch (error) {
      alert('Không thể tải danh sách người dùng');
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleUserStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === 'Hoạt động' ? 'Đã khóa' : 'Hoạt động',
            }
          : user
      )
    );
  };

  const handleAddUser = async (data: any) => {
    try {
      await createStaffApi(data, token);
      await fetchUsers(); // Gọi lại fetchUsers để cập nhật danh sách
      setShowModal(false);
    } catch (error: any) {
      alert(error.message || 'Tạo người dùng thất bại');
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <ModalUser open={showModal} onClose={() => setShowModal(false)} onSubmit={handleAddUser} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Quản lý người dùng</h1>
        <Button
          className="flex items-center gap-2 bg-[#1F2B6C] hover:bg-blue-800"
          onClick={() => setShowModal(true)}
        >
          <FaPlus className="text-white" />
          <span className="text-white">Thêm người dùng</span>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-blue-600">Danh sách người dùng</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400 py-6">
                    Không có người dùng nào.
                  </TableCell>
                </TableRow>
              ) : (
                users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-blue-700">{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full
                        ${user.status === 'Hoạt động'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'}`}>
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <FaEllipsisV className="text-blue-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => alert(`Chỉnh sửa: ${user.name}`)}>
                            Sửa tài khoản
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toggleUserStatus(user.id)}
                            className={user.status === 'Hoạt động'
                              ? 'text-red-600 focus:bg-red-50 focus:text-red-800'
                              : 'text-green-600 focus:bg-green-50 focus:text-green-800'}
                          >
                            {user.status === 'Hoạt động' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
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
    </div>
  );
};

export default UserMangement;

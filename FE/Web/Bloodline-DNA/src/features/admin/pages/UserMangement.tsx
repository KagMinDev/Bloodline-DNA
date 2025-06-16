import React, { useState } from 'react';
import { FaPlus, FaEllipsisV } from 'react-icons/fa';
import { Button } from '../../staff/components/sample/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../staff/components/sample/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../staff/components/sample/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../staff/components/sample/ui/table';
import type { User } from '../types/UserManager';

const initialUsers: User[] = [
  { id: 1, name: 'Nguyễn Văn A', email: 'a@gmail.com', role: 'Admin', status: 'Hoạt động' },
  { id: 2, name: 'Trần Thị B', email: 'b@gmail.com', role: 'Nhân viên', status: 'Đã khóa' },
];

const UserMangement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);

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

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Quản lý người dùng</h1>
        <Button
          className="flex items-center gap-2 bg-[#1F2B6C] hover:bg-blue-800"
          onClick={() => alert('Chức năng thêm người dùng sẽ được triển khai sau.')}
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

import { useState } from 'react';
import type { User } from '../types/UserManager';

const initialUsers: User[] = [
  { id: 1, name: 'Nguyễn Văn A', email: 'a@gmail.com', role: 'Admin', status: 'Hoạt động' },
  { id: 2, name: 'Trần Thị B', email: 'b@gmail.com', role: 'Nhân viên', status: 'Đã khóa' },
];

const UserManager = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  
  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý người dùng</h2>
      <button style={{ marginBottom: 16 }}>+ Thêm người dùng</button>
      <table border={1} cellPadding={8} cellSpacing={0} width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>
                <button>Sửa</button>
                <button style={{ marginLeft: 8, color: 'red' }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManager;
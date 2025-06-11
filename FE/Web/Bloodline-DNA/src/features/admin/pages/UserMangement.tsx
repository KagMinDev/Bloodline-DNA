import { Lock, MoreVertical, Pencil, Unlock } from 'lucide-react';
import { useState } from 'react';
import type { User } from '../types/UserManager';

const initialUsers: User[] = [
  { id: 1, name: 'Nguyễn Văn A', email: 'a@gmail.com', role: 'Admin', status: 'Hoạt động' },
  { id: 2, name: 'Trần Thị B', email: 'b@gmail.com', role: 'Nhân viên', status: 'Đã khóa' },
];

function UserMangement() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

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
    setOpenMenuId(null);
  };

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-blue-700">Quản lý người dùng</h2>
          <button className="flex items-center gap-2 px-4 py-2 text-white transition bg-blue-600 shadow rounded-xl hover:bg-blue-700">
            + Thêm người dùng
          </button>
        </div>

        <div className="relative z-0 overflow-x-auto bg-white border border-blue-100 shadow-lg rounded-xl">
          <table className="relative z-0 min-w-full text-sm text-left">
            <thead>
              <tr className="text-xs tracking-wider text-blue-700 uppercase bg-blue-100">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Họ tên</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Vai trò</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="relative transition border-b hover:bg-blue-50">
                  <td className="px-5 py-3">{user.id}</td>
                  <td className="px-5 py-3 font-medium">{user.name}</td>
                  <td className="px-5 py-3">{user.email}</td>
                  <td className="px-5 py-3">{user.role}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full
                      ${user.status === 'Hoạt động' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="relative px-5 py-3 text-center">
                    <button
                      type="button"
                      title="Thêm hành động"
                      className="p-2 rounded-full hover:bg-blue-100"
                      onClick={() =>
                        setOpenMenuId(openMenuId === user.id ? null : user.id)
                      }
                    >
                      <MoreVertical size={20} />
                    </button>

                    {openMenuId === user.id && (
                      <div className="absolute z-10 w-48 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg right-5">
                        <button
                          onClick={() => {
                            alert(`Chỉnh sửa: ${user.name}`);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center w-full gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          <Pencil size={16} />
                          Chỉnh sửa tài khoản
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className="flex items-center w-full gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          {user.status === 'Hoạt động' ? (
                            <>
                              <Lock size={16} />
                              Khóa tài khoản
                            </>
                          ) : (
                            <>
                              <Unlock size={16} />
                              Mở khóa tài khoản
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">
                    Không có người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserMangement;

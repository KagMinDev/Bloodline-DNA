import React, { useState } from 'react';
import type { TestOrder } from '../types/OrderTest';
import { FaPlus, FaEllipsisV } from 'react-icons/fa';

const OrderTest: React.FC = () => {
  const [orders, setOrders] = useState<TestOrder[]>([
    { id: 'ORD001', customerName: 'Nguyen Van A', testType: 'Máu', status: 'Chờ xử lý', date: '2025-05-22' },
    { id: 'ORD002', customerName: 'Tran Thi B', testType: 'Nước tiểu', status: 'Đã thu mẫu', date: '2025-05-21' },
    { id: 'ORD003', customerName: 'Le Van C', testType: 'X-Quang', status: 'Đang xét nghiệm', date: '2025-05-20' },
    { id: 'ORD004', customerName: 'Le Van C', testType: 'X-Quang', status: 'Đang xét nghiệm', date: '2025-05-20' },
    { id: 'ORD005', customerName: 'Le Van C', testType: 'X-Quang', status: 'Đang xét nghiệm', date: '2025-05-20' },
    { id: 'ORD006', customerName: 'Le Van C', testType: 'X-Quang', status: 'Đang xét nghiệm', date: '2025-05-20' },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('Tất cả');
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterTestType, setFilterTestType] = useState<string>('Tất cả');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const filteredOrders = orders.filter(order => {
    return (
      (filterStatus === 'Tất cả' || order.status === filterStatus) &&
      (filterDate === '' || order.date === filterDate) &&
      (filterTestType === 'Tất cả' || order.testType === filterTestType)
    );
  });

  const updateStatus = (id: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
    setShowDropdown(null);
  };

  const toggleDropdown = (id: string) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#fff] p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#1F2B6C]">
          Quản lý đơn xét nghiệm
        </h1>
        <button
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1F2B6C] text-white shadow-lg hover:bg-[#d0dcf6] hover:text-[#1F2B6C] transition text-2xl"
          onClick={() => alert('Chức năng thêm đơn xét nghiệm sẽ được triển khai sau.')}
          title="Thêm đơn xét nghiệm"
        >
          <FaPlus className='text-white' />
        </button>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-[#1F2B6C]">Trạng thái</label>
          <select 
            className="mt-1 w-full px-4 py-2 border border-[#BFD2F8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d5dff3] bg-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>Tất cả</option>
            <option>Chờ xử lý</option>
            <option>Đã thu mẫu</option>
            <option>Đang xét nghiệm</option>
            <option>Hoàn thành</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-[#1F2B6C]">Ngày</label>
          <input
            type="date"
            className="mt-1 w-full px-4 py-2 border border-[#BFD2F8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BFD2F8] bg-white"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-[#1F2B6C]">Loại xét nghiệm</label>
          <select 
            className="mt-1 w-full px-4 py-2 border border-[#BFD2F8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BFD2F8] bg-white"
            value={filterTestType}
            onChange={(e) => setFilterTestType(e.target.value)}
          >
            <option>Tất cả</option>
            <option>Máu</option>
            <option>Nước tiểu</option>
            <option>X-Quang</option>
          </select>
        </div>
      </div>

      {/* Order List */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-[#BFD2F8]">
        <h2 className="text-xl font-semibold mb-4 text-[#1F2B6C]">
          Danh sách đơn xét nghiệm
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-[#BFD2F8] text-sm">
            <thead>
              <tr className="bg-[#BFD2F8] text-[#1F2B6C] text-left">
                <th className="py-3 px-4 border border-[#BFD2F8] font-bold">Mã đơn</th>
                <th className="py-3 px-4 border border-[#BFD2F8] font-bold">Tên khách hàng</th>
                <th className="py-3 px-4 border border-[#BFD2F8] font-bold">Loại xét nghiệm</th>
                <th className="py-3 px-4 border border-[#BFD2F8] font-bold">Trạng thái</th>
                <th className="py-3 px-4 border border-[#BFD2F8] font-bold">Ngày</th>
                <th className="py-3 px-4 border border-[#BFD2F8] font-bold"></th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-6">
                    Chưa có đơn xét nghiệm nào.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} >
                    <td className="py-3 px-4 border border-[#BFD2F8] font-medium text-[#1F2B6C]">{order.id}</td>
                    <td className="py-3 px-4 border border-[#BFD2F8]">{order.customerName}</td>
                    <td className="py-3 px-4 border border-[#BFD2F8]">{order.testType}</td>
                    <td className="py-3 px-4 border border-[#BFD2F8]">{order.status}</td>
                    <td className="py-3 px-4 border border-[#BFD2F8]">{order.date}</td>
                    <td className="py-3 px-4 border border-[#BFD2F8] relative">
                      <button
                        className="text-[#1F2B6C] hover:text-[#1F2B6C]/80 hover:bg-[#BFD2F8] rounded-full p-2 transition"
                        onClick={() => toggleDropdown(order.id)}
                        title="Hành động"
                      >
                        <FaEllipsisV />
                      </button>
                      {showDropdown === order.id && (
                        <div className="absolute right-4 top-10 bg-white border border-[#BFD2F8] rounded-lg shadow-lg z-10 min-w-[200px]">
                          {['Chờ xử lý', 'Đã thu mẫu', 'Đang xét nghiệm', 'Hoàn thành'].map(status => (
                            <button
                              key={status}
                              className="block w-full text-left px-4 py-2 text-[#1F2B6C] hover:bg-[#BFD2F8] hover:text-[#1F2B6C] transition"
                              onClick={() => updateStatus(order.id, status)}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderTest;
import React, { useState } from 'react';
import { FaPlus, FaEllipsisV } from 'react-icons/fa';
import type { SampleTest } from '../types/sampleTest';

const SampleManagement: React.FC = () => {
  const [samples, setSamples] = useState<SampleTest[]>([
    { id: 'ORD001', kitId: 'KIT001', sampleCode: 'SAMPLE001', donorName: 'Nguyen Van A', relationshipToSubject: 'Bố', sampleType: 'Máu', collectedById: 'COLLECTOR001' },
    { id: 'ORD002', kitId: 'KIT002', sampleCode: 'SAMPLE002', donorName: 'Tran Thi B', relationshipToSubject: 'Mẹ', sampleType: 'Nước tiểu', collectedById: 'COLLECTOR002' },
    { id: 'ORD003', kitId: 'KIT003', sampleCode: 'SAMPLE003', donorName: 'Le Van C', relationshipToSubject: 'Ông', sampleType: 'X-Quang', collectedById: 'COLLECTOR003' },
    { id: 'ORD004', kitId: 'KIT004', sampleCode: 'SAMPLE004', donorName: 'Le Van C', relationshipToSubject: 'Bà', sampleType: 'X-Quang', collectedById: 'COLLECTOR004' },
    { id: 'ORD005', kitId: 'KIT005', sampleCode: 'SAMPLE005', donorName: 'Le Van C', relationshipToSubject: 'Cháu', sampleType: 'X-Quang', collectedById: 'COLLECTOR005' },
    { id: 'ORD006', kitId: 'KIT006', sampleCode: 'SAMPLE006', donorName: 'Le Van C', relationshipToSubject: 'Cháu', sampleType: 'X-Quang', collectedById: 'COLLECTOR006' },
  ]);

  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-blue-600">
          Quản lý mẫu xét nghiệm
        </h1>
        <button
          className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition text-2xl"
          onClick={() => alert('Chức năng thêm mẫu sẽ được triển khai sau.')}
          title="Thêm mẫu"
        >
          <FaPlus />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          Danh sách mẫu xét nghiệm
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-blue-200 text-sm">
            <thead>
              <tr className="bg-blue-100 text-blue-700 text-left">
                <th className="py-3 px-4 border-b font-bold">Mã đơn</th>
                <th className="py-3 px-4 border-b font-bold">Mã kit</th>
                <th className="py-3 px-4 border-b font-bold">Mã mẫu</th>
                <th className="py-3 px-4 border-b font-bold">Người cho mẫu</th>
                <th className="py-3 px-4 border-b font-bold">Quan hệ</th>
                <th className="py-3 px-4 border-b font-bold">Loại mẫu</th>
                <th className="py-3 px-4 border-b font-bold">Người thu mẫu</th>
                <th className="py-3 px-4 border-b font-bold"></th>
              </tr>
            </thead>
            <tbody>
              {samples.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-gray-400 py-6">
                    Chưa có mẫu xét nghiệm nào.
                  </td>
                </tr>
              ) : (
                samples.map(sample => (
                  <tr key={sample.id} className="hover:bg-blue-50 transition">
                    <td className="py-3 px-4 border-b text-blue-700 font-medium">{sample.id}</td>
                    <td className="py-3 px-4 border-b">{sample.kitId}</td>
                    <td className="py-3 px-4 border-b">{sample.sampleCode}</td>
                    <td className="py-3 px-4 border-b">{sample.donorName}</td>
                    <td className="py-3 px-4 border-b">{sample.relationshipToSubject}</td>
                    <td className="py-3 px-4 border-b">{sample.sampleType}</td>
                    <td className="py-3 px-4 border-b">{sample.collectedById}</td>
                    <td className="py-3 px-4 border-b relative">
                      <button
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full p-2 transition"
                        onClick={() => toggleDropdown(sample.id)}
                        title="Hành động"
                      >
                        <FaEllipsisV />
                      </button>
                      {showDropdown === sample.id && (
                        <div className="absolute right-4 top-10 bg-white border border-blue-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                          <button
                            className="block w-full text-left px-4 py-2 text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition"
                            onClick={() => { setShowDropdown(null); alert('Chức năng sửa sẽ bổ sung sau'); }}
                          >
                            Sửa
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-800 transition"
                            onClick={() => { setShowDropdown(null); alert('Chức năng xóa sẽ bổ sung sau'); }}
                          >
                            Xóa
                          </button>
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

export default SampleManagement;
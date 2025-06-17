import { useEffect, useState } from 'react';
import { getTestsApi, createTestApi } from '../api/testApi';
import type { PriceServiceRequest, PriceServiceResponse, TestResponse } from '../types/testService';
import ModalTest from '../components/testManagement/ModalTest';
import ModalPrice from '../components/testManagement/ModalPrice';
import ModalDetail from '../components/testManagement/ModalDetail';
import TestList from '../components/testManagement/TestList';
import { Button } from '../../staff/components/sample/ui/button';
import { FaPlus } from 'react-icons/fa';

export default function TestManagement() {
  const [tests, setTests] = useState<TestResponse[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<PriceServiceResponse | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [showAddTest, setShowAddTest] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [detailTest, setDetailTest] = useState<TestResponse | null>(null);

  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    getTestsApi(token).then(setTests).catch(() => {});
  }, [token]);

  // Mở modal ở chế độ thêm mới giá
  const handleAdd = (testId: string) => {
    setEditData(null);
    setSelectedTestId(testId);
    setShowModal(true);
  };

  // Mở modal ở chế độ chỉnh sửa giá
  const handleEdit = (item: PriceServiceResponse, testId: string) => {
    setEditData(item);
    setSelectedTestId(testId);
    setShowModal(true);
  };

  // Xử lý submit cho thêm/sửa giá dịch vụ
  const handleSubmit = async (data: PriceServiceRequest, ) => {
    try {
      if (!selectedTestId) return;
      const test = tests.find(t => t.id === selectedTestId);
      if (!test) return;
      await createTestApi({
        name: test.name,
        description: test.description,
        type: test.type,
        isActive: test.isActive,
        priceServices: [data], // Dùng đúng dữ liệu giá vừa nhập
      }, token);
      setShowModal(false);
      setEditData(null);
      const newTests = await getTestsApi(token);
      setTests(newTests);
    } catch (err) {
      alert('Có lỗi xảy ra!');
    }
  };

  // Hàm thêm dịch vụ mới
  const handleAddTest = async (data: {
    name: string;
    description: string;
    type: number;
    isActive: boolean;
    priceService: PriceServiceRequest;
  }) => {
    try {
      await createTestApi(
        {
          name: data.name,
          description: data.description,
          type: data.type,
          isActive: data.isActive,
          priceServices: [data.priceService],
        },
        token
      );
      setShowAddTest(false);
      const newTests = await getTestsApi(token);
      setTests(newTests);
    } catch (err) {
      alert('Có lỗi xảy ra!');
    }
  };

  const handleShowDetail = (test: TestResponse) => {
    setDetailTest(test);
    setShowDetail(true);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      {/* Modal thêm dịch vụ */}
      <ModalTest
        open={showAddTest}
        onClose={() => setShowAddTest(false)}
        onSubmit={handleAddTest}
      />

      {/* Modal thêm/sửa giá dịch vụ */}
      <ModalPrice
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditData(null);
        }}
        onSubmit={handleSubmit}
        initialData={editData}
      />

      {/* Modal chi tiết dịch vụ */}
      <ModalDetail open={showDetail} onClose={() => setShowDetail(false)} test={detailTest} />

      {/* Nút thêm dịch vụ mới */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Quản lý dịch vụ xét nghiệm</h1>
        <Button
          onClick={() => setShowAddTest(true)}
          className="flex items-center gap-2 bg-[#1F2B6C] hover:bg-blue-800 px-4 py-2 rounded-lg shadow"
        >
          <FaPlus className="text-lg text-white" />
          <span className="text-white">Thêm dịch vụ</span>
        </Button>
      </div>

      {/* Danh sách dịch vụ */}
      <TestList
        tests={tests}
        onAddPrice={handleAdd}
        onEditPrice={handleEdit}
        onShowDetail={handleShowDetail}
      />
    </div>
  );
}

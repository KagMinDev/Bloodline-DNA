import { useEffect, useState } from 'react';
import { getTestsApi, createTestApi, updateTestApi, deleteTestApi, getTestByIdApi } from '../api/testApi';
import type { PriceServiceRequest, TestRequest, TestResponse, TestUpdateRequest } from '../types/testService';
import ModalTest from '../components/testManagement/ModalTest';
import ModalDetail from '../components/testManagement/ModalDetail';
import TestList from '../components/testManagement/TestList';
import { Button } from '../../staff/components/sample/ui/button';
import { FaPlus } from 'react-icons/fa';
import ModalEdit from '../components/testManagement/ModalEdit';

export default function TestManagement() {
  const [tests, setTests] = useState<TestResponse[]>([]);
  const [showAddTest, setShowAddTest] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [detailTest, setDetailTest] = useState<TestResponse | null>(null);

  // Sửa dịch vụ
  const [showEditTest, setShowEditTest] = useState(false);
  const [editTestData, setEditTestData] = useState<TestResponse | null>(null);

  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    getTestsApi(token)
      .then(setTests)
      .catch(() => {});
  }, [token]);

  // Thêm dịch vụ mới (POST)
  const handleAddTest = async (data: {
    name: string;
    description: string;
    category: string;
    isActive: boolean;
    sampleCount: number;
    priceService: PriceServiceRequest;
  }) => {
    try {
      const requestData: TestRequest = {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
        sampleCount: data.sampleCount,
        priceServices: [data.priceService],
      };

      await createTestApi(requestData, token);
      alert('Thêm dịch vụ thành công!');
      setShowAddTest(false);
      const newTests = await getTestsApi(token);
      setTests(newTests);
    } catch (err) {
      console.error('Error adding test:', err);
      alert(`Có lỗi xảy ra: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Lấy chi tiết để sửa
  const handleEditTest = async (testId: string) => {
    try {
      const test = await getTestByIdApi(testId, token);
      setEditTestData(test);
      setShowEditTest(true);
    } catch {
      alert('Không lấy được thông tin dịch vụ!');
    }
  };

  // Sửa dịch vụ (PUT)
  const handleUpdateTest = async (data: TestUpdateRequest) => {
    try {
      console.log('Update request:', data);
      await updateTestApi(data, token);
      setShowEditTest(false);
      const newTests = await getTestsApi(token);
      setTests(newTests);
      alert('Cập nhật dịch vụ thành công!');
    } catch (err) {
      alert('Có lỗi xảy ra khi cập nhật dịch vụ!');
    }
  };

  // Xóa dịch vụ
  const handleDeleteTest = async (id: string) => {
    try {
      await deleteTestApi(id, token);
      setTests(tests.filter((t) => t.id !== id));
      alert('Đã xóa dịch vụ!');
    } catch (err) {
      alert('Có lỗi xảy ra khi xóa dịch vụ!');
    }
  };

  // Xem chi tiết
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

      {/* Modal chỉnh sửa toàn bộ dịch vụ (bao gồm giá) */}
      <ModalEdit
        open={showEditTest}
        onClose={() => setShowEditTest(false)}
        onSubmit={handleUpdateTest}
        initialData={editTestData}
      />

      {/* Modal chi tiết */}
      <ModalDetail
        open={showDetail}
        onClose={() => setShowDetail(false)}
        test={detailTest}
      />

      {/* Header */}
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
        onShowDetail={handleShowDetail}
        onEditTest={handleEditTest}
        onDeleteTest={handleDeleteTest}
      />
    </div>
  );
}

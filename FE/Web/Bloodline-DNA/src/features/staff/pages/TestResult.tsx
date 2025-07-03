import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../staff/components/sample/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/sample/ui/table";
import ModalTestResult from "../components/common/ModalTestResult";
import {
  createTestResultApi,
  deleteTestResultApi,
  getAllTestResultApi,
  updateTestResultApi,
} from "../api/testResultApi";
import type { TestResultRequest, TestResultResponse } from "../types/testResult";

function TestResultPage() {
  const [results, setResults] = useState<TestResultResponse[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<
    Omit<TestResultRequest, "resultDate"> & { resultDate: string }
  >({
    id: "",
    testBookingId: "",
    resultSummary: "",
    resultDate: "",
    resultFileUrl: "",
  });
  const token = localStorage.getItem("token") || "";

  // Fetch all results
  useEffect(() => {
    if (!token) return;
    getAllTestResultApi(token)
      .then(setResults)
      .catch(() => setResults([]));
  }, [token]);

  const openCreateModal = () => {
    setEditIndex(null);
    setForm({ id: "", testBookingId: "", resultSummary: "", resultDate: "", resultFileUrl: "" });
    setShowModal(true);
  };

  const openEditModal = (idx: number) => {
    const r = results[idx];
    setEditIndex(idx);
    setForm({
      ...r,
      resultDate: r.resultDate ? new Date(r.resultDate).toISOString().slice(0, 10) : "",
    });
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const req: TestResultRequest = {
      ...form,
      resultDate: new Date(form.resultDate),
    };
    try {
      if (editIndex === null) {
        // Create
        const created = await createTestResultApi(req, token);
        setResults((prev) => [...prev, created]);
      } else {
        // Update
        const updated = await updateTestResultApi(req, token);
        setResults((prev) =>
          prev.map((r, idx) => (idx === editIndex ? updated : r))
        );
      }
      setShowModal(false);
    } catch {
      alert("Có lỗi khi lưu kết quả!");
    }
  };

  const handleDelete = async (idx: number) => {
    if (!token) return;
    const id = results[idx].id;
    if (!id) return;
    if (!window.confirm("Bạn chắc chắn muốn xóa kết quả này?")) return;
    try {
      await deleteTestResultApi(id, token);
      setResults((prev) => prev.filter((_, i) => i !== idx));
    } catch {
      alert("Xóa thất bại!");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="flex items-center justify-between mb-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1F2B6C]">Kết quả xét nghiệm</h1>
        <button
          className="flex items-center gap-2 bg-[#1F2B6C] hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold"
          onClick={openCreateModal}
        >
          <span className="text-white">+ Thêm kết quả</span>
        </button>
      </div>
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#1F2B6C]">Danh sách kết quả xét nghiệm</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã kết quả</TableHead>
                  <TableHead>Mã đặt xét nghiệm</TableHead>
                  <TableHead>Ngày trả kết quả</TableHead>
                  <TableHead>File kết quả</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center text-gray-400 py-6">
                      Chưa có kết quả xét nghiệm nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  results.map((result, idx) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium text-blue-700 text-center">{result.id}</TableCell>
                      <TableCell className="text-center">{result.testBookingId}</TableCell>
                      <TableCell className="text-center">{result.resultSummary}</TableCell>
                      <TableCell className="text-center">
                        {result.resultDate
                          ? new Date(result.resultDate).toLocaleDateString("vi-VN")
                          : ""}
                      </TableCell>
                      <TableCell className="text-center">
                        <a
                          href={result.resultFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Xem file
                        </a>
                      </TableCell>
                      <TableCell className="text-center">{result.client?.fullName || ""}</TableCell>           
                      <TableCell className="text-center">
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition mr-2"
                          onClick={() => openEditModal(idx)}
                        >
                          Sửa
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition"
                          onClick={() => handleDelete(idx)}
                        >
                          Xóa
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <ModalTestResult
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        form={form}
        onChange={handleChange}
        editIndex={editIndex}
      />
    </div>
  );
}

export default TestResultPage;

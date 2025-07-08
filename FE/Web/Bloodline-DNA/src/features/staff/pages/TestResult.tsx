import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../staff/components/sample/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/sample/ui/table";
import ModalTestResult from "../components/testResult/ModalTestResult";
import { createTestResultApi, deleteTestResultApi, getAllTestResultApi } from "../api/testResultApi";
import { getTestBookingApi } from "../api/testBookingApi";
import type { TestResultRequest, TestResultResponse } from "../types/testResult";
import type { TestBookingResponse } from "../types/testBooking";
import { Button } from "../components/sample/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/sample/ui/dropdown-menu";
import { MoreVertical, Trash2 } from "lucide-react";

interface BookingOption {
  id: string;
  clientName: string;
  email: string;
  appointmentDate: string;
  status: string;
}

function TestResultPage() {
  const [results, setResults] = useState<TestResultResponse[]>([]);
  const [bookings, setBookings] = useState<BookingOption[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Omit<TestResultRequest, "resultDate"> & { resultDate: string }>({
    id: "",
    testBookingId: "",
    resultSummary: "",
    resultDate: "",
    resultFileUrl: "",
  });

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchResults = async () => {
      if (!token) return;
      setIsLoadingResults(true);
      try {
        const data = await getAllTestResultApi(token);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setIsLoadingResults(false);
      }
    };
    fetchResults();
  }, [token]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) return;
      setIsLoadingBookings(true);
      try {
        const bookingData = await getTestBookingApi(token);
        const bookingOptions: BookingOption[] = bookingData.map((booking: TestBookingResponse) => ({
          id: booking.id,
          clientName: booking.clientName,
          email: booking.email,
          appointmentDate: booking.appointmentDate,
          status: booking.status,
        }));
        setBookings(bookingOptions);
      } catch {
        setBookings([]);
      } finally {
        setIsLoadingBookings(false);
      }
    };
    fetchBookings();
  }, [token]);

  const openCreateModal = () => {
    setForm({ id: "", testBookingId: "", resultSummary: "", resultDate: "", resultFileUrl: "" });
    setShowModal(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("Không tìm thấy token xác thực!");
      return;
    }

    const req: TestResultRequest = {
      ...form,
      resultDate: new Date(form.resultDate),
    };

    try {
      await createTestResultApi(req, token);
      const updatedResults = await getAllTestResultApi(token);
      setResults(updatedResults);
      setShowModal(false);
      setForm({
        id: "",
        testBookingId: "",
        resultSummary: "",
        resultDate: "",
        resultFileUrl: "",
      });
    } catch (error) {
      console.error("Lỗi tạo kết quả:", error);
      alert("Có lỗi xảy ra khi tạo kết quả!");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#1F2B6C]">Quản lý kết quả xét nghiệm</h1>
        <Button
          className="flex items-center gap-2 bg-[#1F2B6C] hover:bg-blue-800 text-white"
          onClick={openCreateModal}
        >
          <span className="text-white">+ Thêm kết quả</span>
        </Button>
      </div>

      <div className="max-w-7xl mx-auto">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-[#1F2B6C]">Danh sách kết quả xét nghiệm</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Mã đặt xét nghiệm</TableHead>
                  <TableHead className="text-center">Tóm tắt kết quả</TableHead>
                  <TableHead className="text-center">Ngày trả</TableHead>
                  <TableHead className="text-center">File kết quả</TableHead>
                  <TableHead className="text-center">Khách hàng</TableHead>
                  <TableHead className="text-center">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingResults ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-gray-500">Đang tải dữ liệu...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : results.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="text-gray-500">Chưa có kết quả nào</div>
                    </TableCell>
                  </TableRow>
                ) : (
                  results.map((result, idx) => (
                    <TableRow key={result.id || idx}>
                      <TableCell className="text-center text-xs font-mono">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                          {result.testBookingId}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-left">
                        {result.resultSummary}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {result.resultDate
                          ? new Date(result.resultDate).toLocaleDateString("vi-VN")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {result.resultFileUrl ? (
                          <a
                            href={result.resultFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-xs underline hover:text-blue-800"
                          >
                            Xem file
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">Chưa có file</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {result.client?.fullName || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-2 rounded-full hover:bg-gray-200 transition"
                              title="Tùy chọn"
                            >
                              <MoreVertical className="h-5 w-5 text-gray-600" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleDelete(idx)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
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
      </div>

      <ModalTestResult
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        form={form}
        onChange={handleChange}
        bookingOptions={bookings}
        isLoadingBookings={isLoadingBookings}
      />
    </div>
  );
}

export default TestResultPage;

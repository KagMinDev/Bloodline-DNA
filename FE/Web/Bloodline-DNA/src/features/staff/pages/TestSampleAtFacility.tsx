import { Button } from "antd";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Loading } from "../../../components";
import {Card,CardContent} from "../components/sample/ui/card";
import { getTestBookingApi } from "../api/testBookingApi";
import { Table, TableBody,TableCell,TableHead, TableHeader, TableRow,} from "../components/sample/ui/table";
import TestSampleModal from "../components/testSample/TestSampleModal";
import { STATUS_LABEL_MAP } from "../components/booking/utils/statusmapping";
import { statusToNumber } from "../components/booking/utils/statusUtils";

export default function TestSampleAtFacility() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token") || "";

  const fetchData = useCallback(async () => {
    if (!token) {
      alert("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn!");
      return;
    }
    setLoading(true);
    try {
      const res = await getTestBookingApi();
      const filtered = res.filter((b: any) =>
        b.collectionMethod === "AtFacility" &&
        (b.status === "CheckIn" || b.status === "StaffGettingSample")
      );
      setBookings(filtered);
    } catch {
      alert("Không thể tải dữ liệu booking");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-blue-50">
      <TestSampleModal
        open={open}
        onClose={() => {
          setOpen(false);
          fetchData();
        }}
      />
      <div className="flex items-center justify-between flex-shrink-0">
        <li className="text-lg w-full bg-white p-5 text-[#1F2B6C]">
          Quản lý booking lấy mẫu tại cơ sở
        </li>
      </div>
      <div className="flex-1 p-2 overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>
        <Card className="flex flex-col h-full shadow-lg">
          <CardContent className="flex-1 p-0 overflow-hidden">
            <div className="h-full overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-white shadow-sm">
                  <TableRow className="[&_th]:font-bold [&_th]:py-3">
                    <TableHead className="text-center">Mã Booking</TableHead>
                    <TableHead className="text-center">Khách hàng</TableHead>
                    <TableHead className="text-center">Số điện thoại</TableHead>
                    <TableHead className="text-center">Địa chỉ</TableHead>
                    <TableHead className="text-center">Ngày hẹn</TableHead>
                    <TableHead className="text-center">Giá</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                    <TableHead className="text-center">Ghi chú</TableHead>
                    <TableHead className="text-center">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={11} className="py-6 text-center text-blue-500">
                        <div className="flex items-center justify-center h-[550px]">
                          <Loading message="Đang tải danh sách booking..." />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : bookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="py-6 text-center text-gray-400">
                        Không có booking nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    bookings.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="text-center">{item.id}</TableCell>
                        <TableCell className="text-center">{item.clientName}</TableCell>
                        <TableCell className="text-center">{item.phone || "-"}</TableCell>
                        <TableCell className="text-center">{item.address || "-"}</TableCell>
                        <TableCell className="text-center">{format(new Date(item.appointmentDate), "dd/MM/yyyy")}</TableCell>
                        <TableCell className="text-center">{item.price?.toLocaleString("vi-VN")}</TableCell>
                        <TableCell className="text-center">{STATUS_LABEL_MAP[statusToNumber(item.status)] || item.status}</TableCell>
                        <TableCell className="text-center">{item.note || "-"}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            className="bg-blue-600 text-white hover:bg-blue-800"
                            onClick={() => {
                              setOpen(true);
                            }}
                          >
                            Thêm mẫu
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
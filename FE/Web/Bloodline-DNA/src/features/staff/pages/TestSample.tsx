import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { getRelationshipLabelVi, getSampleTypeLabelVi, type SampleTestResponse } from "../types/sampleTest";
import { getAllTestSampleApi } from "../api/testSampleApi";
import { Button } from "antd";
import { Card, CardContent, CardHeader, CardTitle } from "../../staff/components/sample/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/sample/ui/table";
import TestSampleModal from "../components/testSample/TestSampleModal";

export default function TestSamplePage() {
  const [data, setData] = useState<SampleTestResponse[]>([]);
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token") || "";

  const fetchData = useCallback(async () => {
    if (!token) {
      alert("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn!");
      return;
    }
    try {
      const res = await getAllTestSampleApi(token);
      setData(res);
    } catch {
      alert("Không thể tải dữ liệu mẫu");
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <TestSampleModal open={open} onClose={() => { setOpen(false); fetchData(); }} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#1F2B6C]">Quản lý mẫu xét nghiệm</h1>
        <Button
          className="flex items-center gap-2 bg-[#1F2B6C] hover:bg-blue-800 text-white"
          onClick={() => setOpen(true)}
        >
          + Thêm mẫu
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#1F2B6C]">Danh sách mẫu xét nghiệm</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Mẫu</TableHead>
                <TableHead>Người Cho</TableHead>
                <TableHead>Quan Hệ</TableHead>
                <TableHead>Loại Mẫu</TableHead>
                <TableHead>Ngày Thu</TableHead>
                <TableHead>Ngày Nhận Lab</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400 py-6">
                    Không có mẫu nào.
                  </TableCell>
                </TableRow>
              ) : (
                data.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-blue-700">{item.sampleCode}</TableCell>
                    <TableCell>{item.donorName}</TableCell>
                    <TableCell>{getRelationshipLabelVi(item.relationshipToSubject)}</TableCell>
                    <TableCell>{getSampleTypeLabelVi(item.sampleType)}</TableCell>
                    <TableCell>{format(new Date(item.collectedAt), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{format(new Date(item.labReceivedAt), "dd/MM/yyyy")}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

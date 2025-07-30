import { Button } from "antd";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../staff/components/sample/ui/card";
import { getAllTestSampleApi } from "../api/testSampleApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/sample/ui/table";
import TestSampleModal from "../components/testSample/TestSampleModal";
import {
  getRelationshipLabelViByKey,
  getSampleTypeLabelViByKey,
  type SampleTestResponse,
} from "../types/sampleTest";

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
    <div className="min-h-screen bg-blue-50">
      <TestSampleModal
        open={open}
        onClose={() => {
          setOpen(false);
          fetchData();
        }}
      />
      <div className="flex items-center justify-between">
        <li className="text-lg w-full bg-white p-5 text-[#1F2B6C]">
          Quản lý mẫu xét nghiệm
        </li>
      </div>
      <div className="py-2">
        <Card className="shadow-lg">
          <div className="flex flex-row justify-between">
            <CardHeader className="w-full">
              <CardTitle className="text-[#1F2B6C]">
                Danh sách mẫu xét nghiệm
              </CardTitle>
            </CardHeader>
            <div className="pr-6">
              <Button
                className="flex items-center gap-2] hover:bg-blue-800 text-white"
                onClick={() => setOpen(true)}
              >
                + Thêm mẫu
              </Button>
            </div>
          </div>
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
                    <TableCell
                      colSpan={6}
                      className="py-6 text-center text-gray-400"
                    >
                      Không có mẫu nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-blue-700">
                        {item.sampleCode}
                      </TableCell>
                      <TableCell>{item.donorName}</TableCell>
                      <TableCell>
                        {getRelationshipLabelViByKey(
                          item.relationshipToSubject
                        )}
                      </TableCell>
                      <TableCell>
                        {getSampleTypeLabelViByKey(item.sampleType)}
                      </TableCell>
                      <TableCell>
                        {format(new Date(item.collectedAt), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        {item.labReceivedAt
                          ? format(new Date(item.labReceivedAt), "dd/MM/yyyy")
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

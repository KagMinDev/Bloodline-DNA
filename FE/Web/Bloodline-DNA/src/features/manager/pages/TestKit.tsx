import { useEffect, useState } from "react";
import type { TestKitRequest, TestKitResponse } from "../types/testKit";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { createTestKitApi, deleteTestKitApi, getAllTestKitApi, updateTestKitApi } from "../api/testKitApi";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "../../staff/components/sample/ui/dialog";
import { Input } from "../../staff/components/booking/ui/input";
import { Textarea } from "../../staff/components/booking/ui/textarea";

const TestKitPage = () => {
  const [list, setList] = useState<TestKitResponse[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<TestKitRequest & { id?: string }>>({});

  const fetchData = async () => {
    const res = await getAllTestKitApi();
    setList(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      if (editing?.id) {
        await updateTestKitApi(editing as any);
      } else {
        await createTestKitApi(editing as TestKitRequest);
      }
      setOpen(false);
      fetchData();
    } catch (err) {
      console.error("Lỗi gửi dữ liệu:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc muốn xoá?")) {
      await deleteTestKitApi(id);
      fetchData();
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-blue-800">Quản lý Test Kit</h2>
        <Button
          className="bg-blue-700 text-white"
          onClick={() => {
            setEditing({ bookingId: "", note: "", sampleCount: 0, shippedAt: "", receivedAt: "", sentToLabAt: "", labReceivedAt: "" });
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Thêm Test Kit
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Booking ID</TableHead>
            <TableHead>Shipped</TableHead>
            <TableHead>Received</TableHead>
            <TableHead>To Lab</TableHead>
            <TableHead>Lab Received</TableHead>
            <TableHead>Samples</TableHead>
            <TableHead>Ghi chú</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.bookingId}</TableCell>
              <TableCell>{item.shippedAt?.split("T")[0]}</TableCell>
              <TableCell>{item.receivedAt?.split("T")[0]}</TableCell>
              <TableCell>{item.sentToLabAt?.split("T")[0]}</TableCell>
              <TableCell>{item.labReceivedAt?.split("T")[0]}</TableCell>
              <TableCell>{item.sampleCount}</TableCell>
              <TableCell className="max-w-xs truncate">{item.note}</TableCell>
              <TableCell className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => { setEditing(item); setOpen(true); }}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Cập nhật Test Kit" : "Tạo mới Test Kit"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              placeholder="Booking ID"
              value={editing.bookingId ?? ""}
              onChange={e => setEditing(prev => ({ ...prev!, bookingId: e.target.value }))}
            />
            <Input
              type="datetime-local"
              value={editing.shippedAt ?? ""}
              onChange={e => setEditing(prev => ({ ...prev!, shippedAt: e.target.value }))}
            />
            <Input
              type="datetime-local"
              value={editing.receivedAt ?? ""}
              onChange={e => setEditing(prev => ({ ...prev!, receivedAt: e.target.value }))}
            />
            <Input
              type="datetime-local"
              value={editing.sentToLabAt ?? ""}
              onChange={e => setEditing(prev => ({ ...prev!, sentToLabAt: e.target.value }))}
            />
            <Input
              type="datetime-local"
              value={editing.labReceivedAt ?? ""}
              onChange={e => setEditing(prev => ({ ...prev!, labReceivedAt: e.target.value }))}
            />
            <Input
              type="number"
              placeholder="Số lượng mẫu"
              value={editing.sampleCount ?? 0}
              onChange={e => setEditing(prev => ({ ...prev!, sampleCount: Number(e.target.value) }))}
            />
            <Textarea
              placeholder="Ghi chú"
              value={editing.note ?? ""}
              onChange={e => setEditing(prev => ({ ...prev!, note: e.target.value }))}
            />
          </div>
          <Button onClick={handleSubmit} className="mt-4 w-full bg-blue-700 text-white hover:bg-blue-800">
            {editing?.id ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestKitPage;

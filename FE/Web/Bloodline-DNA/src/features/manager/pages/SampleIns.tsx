// SampleIns.tsx
import { useEffect, useState } from "react";
import type { SampleInsRequest, SampleInsResponse, SampleInsUpdateRequest } from "../types/sample-ins";
import {
  createSampleInsApi,
  deleteSampleInsApi,
  getSampleInsListApi,
  updateSampleInsApi,
} from "../api/sample-insApi";
import { Button } from "../../staff/components/sample/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../staff/components/sample/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../staff/components/sample/ui/dialog";
import { Input } from "../../staff/components/booking/ui/input";
import { Textarea } from "../../staff/components/booking/ui/textarea";

const SampleIns = () => {
  const [list, setList] = useState<SampleInsResponse[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SampleInsRequest | SampleInsUpdateRequest | null>(null);

  const fetchData = async () => {
    const res = await getSampleInsListApi();
    setList(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getSampleTypeLabel = (type: number): string => {
    switch (type) {
      case 1:
        return "Tăm bông miệng";
      case 2:
        return "Máu";
      case 3:
        return "Tóc có chân";
      case 4:
        return "Móng tay";
      case 5:
        return "Nước bọt";
      case 99:
        return "Khác";
      case 0:
        return "Không xác định";
      default:
        return `Loại #${type}`;
    }
  };

  const handleSubmit = async () => {
    try {
      if (editing && 'id' in editing) {
        const { id, ...rest } = editing;
        await updateSampleInsApi({ id, ...rest });
      } else if (editing) {
        const { sampleType, instructionText, mediaUrl } = editing;
        await createSampleInsApi({ sampleType, instructionText, mediaUrl });
      }
      setOpen(false);
      fetchData();
    } catch (err) {
      console.error("Submit error", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xoá?")) {
      await deleteSampleInsApi(id.toString());
      fetchData();
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-blue-700">Hướng dẫn lấy mẫu</h2>
        <Button
          className="bg-blue-800"
          onClick={() => {
            setEditing({ sampleType: 1, instructionText: "", mediaUrl: "" });
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2 text-white" /> <span className="text-white">Thêm hướng dẫn</span>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Loại mẫu</TableHead>
            <TableHead>Hướng dẫn</TableHead>
            <TableHead>Media</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <span className="inline-block px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded">
                  {getSampleTypeLabel(item.sampleType)}
                </span>
              </TableCell>
              <TableCell className="max-w-sm truncate">{item.instructionText}</TableCell>
              <TableCell>
                {item.mediaUrl?.includes("youtube") ? (
                  <iframe
                    className="w-32 h-20"
                    src={item.mediaUrl}
                    title="Video"
                    allowFullScreen
                  />
                ) : (
                  <img src={item.mediaUrl} alt="media" className="w-20 h-14 object-cover rounded" />
                )}
              </TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const { id, sampleType, instructionText, mediaUrl } = item;
                    setEditing({ id, sampleType, instructionText, mediaUrl });
                    setOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-blue-800">
              {editing && 'id' in editing ? "Chỉnh sửa hướng dẫn" : "Thêm hướng dẫn"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Loại mẫu (số)</label>
              <Input
                className="h-10"
                placeholder="Ví dụ: 1"
                value={editing?.sampleType ?? ""}
                onChange={(e) =>
                  setEditing((prev) => ({ ...prev!, sampleType: Number(e.target.value) }))
                }
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Hướng dẫn chi tiết</label>
              <Textarea
                placeholder="Nhập hướng dẫn lấy mẫu chi tiết..."
                className="min-h-[200px] resize-y"
                value={editing?.instructionText ?? ""}
                onChange={(e) =>
                  setEditing((prev) => ({ ...prev!, instructionText: e.target.value }))
                }
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Media URL (ảnh hoặc video)</label>
              <Input
                placeholder="https://example.com/image.jpg hoặc YouTube embed link"
                value={editing?.mediaUrl ?? ""}
                onChange={(e) =>
                  setEditing((prev) => ({ ...prev!, mediaUrl: e.target.value }))
                }
              />
            </div>

            <div className="mt-4">
              <Button
                onClick={handleSubmit}
                className="w-full bg-blue-800 text-white hover:bg-blue-900"
              >
                {editing && 'id' in editing ? "Cập nhật" : "Tạo mới"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SampleIns;
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../staff/components/sample/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../staff/components/sample/ui/table";
import { Button } from "../../staff/components/sample/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../staff/components/sample/ui/dialog";
import { Input } from "../../staff/components/booking/ui/input";
import { Textarea } from "../../staff/components/booking/ui/textarea";
import { MoreVertical } from "lucide-react";
import type { SampleInsResponse, SampleInsUpdateRequest } from "../types/sample-ins";
import { deleteSampleInsApi, getSampleInsListApi, updateSampleInsApi } from "../api/sample-insApi";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../staff/components/sample/ui/dropdown-menu";

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

const SampleIns = () => {
  const [list, setList] = useState<SampleInsResponse[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SampleInsUpdateRequest | null>(null);

  const fetchData = async () => {
    const res = await getSampleInsListApi();
    setList(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
  try {
    if (editing && 'id' in editing) {
            console.log("📤 Gửi update với:", editing);
      const { id, sampleType, instructionText, mediaUrl } = editing;
      await updateSampleInsApi({
        id,
        sampleType,
        instructionText,
        mediaUrl,
      });

      setOpen(false);
      fetchData();
    }
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
    <div className="min-h-screen bg-blue-50 p-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-blue-600 text-2xl font-semibold">
            📋 Hướng dẫn lấy mẫu
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Loại mẫu</TableHead>
                <TableHead className="text-center">Hướng dẫn</TableHead>
                <TableHead className="text-center">Media</TableHead>
                <TableHead className="text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((item) => (
                <TableRow key={item.id} className="text-center">
                  <TableCell className="text-center">
                    <span className="inline-block px-2 py-1 text-sm font-bold ">
                      {getSampleTypeLabel(item.sampleType)}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-sm truncate text-center">
                    {item.instructionText}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.mediaUrl?.includes("youtube") ? (
                      <iframe
                        className="w-32 h-20 mx-auto"
                        src={item.mediaUrl}
                        title="Video"
                        allowFullScreen
                      />
                    ) : (
                      <img
                        src={item.mediaUrl}
                        alt="media"
                        className="w-20 h-14 object-cover rounded mx-auto"
                      />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            console.log("📝 Set editing item:", item);
                            const { id, sampleType, instructionText, mediaUrl } = item;
                            setEditing({ id, sampleType, instructionText, mediaUrl });
                            setOpen(true);
                          }}
                        >
                          ✏️ Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(item.id)}
                        >
                          🗑️ Xoá
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </CardContent>
      </Card>

      {/* Dialog chỉnh sửa */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-blue-700 font-semibold text-lg">
              🛠️ Chỉnh sửa hướng dẫn
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 mt-4">
            <div>
              <label className="text-sm font-medium">Loại mẫu (số)</label>
              <Input
                className="h-10"
                placeholder="Ví dụ: 1"
                value={editing?.sampleType ?? ""}
                onChange={(e) =>
                  setEditing((prev) =>
                    prev ? { ...prev, sampleType: Number(e.target.value) } : prev
                  )
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Hướng dẫn chi tiết</label>
              <Textarea
                placeholder="Nhập hướng dẫn..."
                className="min-h-[150px]"
                value={editing?.instructionText ?? ""}
                onChange={(e) =>
                  setEditing((prev) =>
                    prev ? { ...prev, instructionText: e.target.value } : prev
                  )
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Media URL (ảnh hoặc video)</label>
              <Input
                placeholder="https://..."
                value={editing?.mediaUrl ?? ""}
                onChange={(e) =>
                  setEditing((prev) =>
                    prev ? { ...prev, mediaUrl: e.target.value } : prev
                  )
                }
              />
            </div>

            <div className="pt-2">
              <Button
                onClick={handleSubmit}
                className="w-full bg-blue-700 text-white hover:bg-blue-800"
              >
                Cập nhật hướng dẫn
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SampleIns;

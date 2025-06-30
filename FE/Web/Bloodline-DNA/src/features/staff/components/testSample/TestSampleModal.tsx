import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { Input } from "antd";
import {
  RelationshipToSubjectLabelVi,
  SampleTypeLabelVi,
} from "../../types/sampleTest";
import { Button } from "../sample/ui/button";
import DatePickerField from "./DatePickerField";
import { createTestSampleApi } from "../../api/testSampleApi";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../sample/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../booking/ui/select";

const formSchema = z.object({
  kitId: z.string().min(1),
  sampleCode: z.string().min(1),
  donorName: z.string().min(1),
  relationshipToSubject: z.string().min(1),
  collectedById: z.string().min(1),
  collectedAt: z.date(),
  sampleType: z.string().min(1),
  labReceivedAt: z.date(),
});

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function TestSampleModal({ open, onClose }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collectedAt: new Date(),
      labReceivedAt: new Date(),
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const token = localStorage.getItem("token") || "";
    try {
      await createTestSampleApi(
        {
          ...data,
          relationshipToSubject: +data.relationshipToSubject,
          sampleType: +data.sampleType,
        },
        token
      );
      toast.success("Tạo mẫu thành công");
      reset();
      onClose();
    } catch {
      toast.error("Lỗi khi tạo mẫu");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Thêm Mẫu Xét Nghiệm</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 mt-4">
          <Input {...register("kitId")} placeholder="Mã Kit" className="h-10" />
          <Input {...register("sampleCode")} placeholder="Mã Mẫu" className="h-10" />
          <Input {...register("donorName")} placeholder="Người Cho Mẫu" className="h-10" />
          <Input {...register("collectedById")} placeholder="Người Thu Mẫu" className="h-10" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mối quan hệ</label>
            <Select onValueChange={(v) => setValue("relationshipToSubject", v)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Chọn mối quan hệ" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(RelationshipToSubjectLabelVi).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại mẫu</label>
            <Select onValueChange={(v) => setValue("sampleType", v)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Chọn loại mẫu" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SampleTypeLabelVi).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DatePickerField
            label="Ngày thu mẫu"
            value={watch("collectedAt")}
            onChange={(date) => setValue("collectedAt", date)}
          />
          <DatePickerField
            label="Ngày nhận lab"
            value={watch("labReceivedAt")}
            onChange={(date) => setValue("labReceivedAt", date)}
          />

          <Button type="submit" className="w-full mt-2 bg-[#1F2B6C] hover:bg-blue-800">
            <span className="text-white">Lưu mẫu</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { Input, DatePicker } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  createTestSampleApi,
  createTestSampleFromStaffApi,
  getKitAllApi
} from "../../api/testSampleApi";
import type { TestKitResponse } from "../../types/testKit";
import {
  RelationshipToSubjectLabelVi,
  SampleTypeLabelVi,
} from "../../types/sampleTest";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../sample/ui/dialog";
import { Button } from "../sample/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../booking/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../booking/ui/tabs";

// Định nghĩa schema
const commonSchema = z.object({
  kitId: z.string().min(1, "Vui lòng chọn Kit"),
  donorName: z.string().min(1, "Vui lòng nhập tên người cho mẫu"),
  relationshipToSubject: z.string().min(1, "Chọn mối quan hệ"),
  sampleType: z.string().min(1, "Chọn loại mẫu"),
});

const atFacilitySchema = commonSchema.extend({
  collectedById: z.string().min(1, "Nhập người thu mẫu"),
  collectedAt: z.date({ required_error: "Chọn ngày thu mẫu" }),
  labReceivedAt: z.date({ required_error: "Chọn ngày nhận tại lab" }),
});

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function TestSampleModal({ open, onClose }: Props) {
  const [kits, setKits] = useState<TestKitResponse[]>([]);
  const [tab, setTab] = useState<"home" | "facility">("home");

  const isFacility = tab === "facility";

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(isFacility ? atFacilitySchema : commonSchema),
  });

  useEffect(() => {
    const fetchKits = async () => {
      const token = localStorage.getItem("token") || "";
      if (!token) return;
      try {
        const res = await getKitAllApi(token);
        setKits(res);
      } catch {
        toast.error("Lỗi khi tải danh sách kit");
      }
    };
    if (open) fetchKits();
  }, [open]);

  const onSubmit = async (data: any) => {
  const token = localStorage.getItem("token") || "";
  if (!token) return;

  try {
    const payload = {
      ...data,
      relationshipToSubject: Number(data.relationshipToSubject),
      sampleType: Number(data.sampleType),
    };

    if (isFacility) {
      await createTestSampleFromStaffApi(payload, token);
    } else {
      await createTestSampleApi(payload, token);
    }

    toast.success("Tạo mẫu thành công");
    reset();
    onClose();
  } catch (error) {
    console.error("❌ Lỗi:", error);
    toast.error("Tạo mẫu thất bại");
  }
};


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Thêm Mẫu Xét Nghiệm</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v: any) => setTab(v)} className="mt-4">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="home">Tại nhà</TabsTrigger>
            <TabsTrigger value="facility">Tại cơ sở</TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              <FormFields kits={kits} control={control} errors={errors} />
              <Button type="submit" className="w-full mt-2 bg-[#1F2B6C] hover:bg-blue-800">
                <span className="text-white">Thêm mẫu</span>
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="facility">
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              <FormFields kits={kits} control={control} errors={errors} />

              {/* Người thu mẫu */}
              <div>
                <Controller
                  name="collectedById"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Người thu mẫu" className="h-10" />
                  )}
                />
              </div>

              {/* Ngày thu mẫu */}
              <div>
                <label className="block mb-1 text-sm">Ngày thu mẫu</label>
                <Controller
                  name="collectedAt"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      className="w-full"
                      value={field.value ? dayjs(field.value) : null}
                      format="YYYY-MM-DD"
                      onChange={(date) => field.onChange(date?.toDate())}
                    />
                  )}
                />
              </div>

              {/* Ngày nhận tại Lab */}
              <div>
                <label className="block mb-1 text-sm">Ngày nhận tại Lab</label>
                <Controller
                  name="labReceivedAt"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      className="w-full"
                      value={field.value ? dayjs(field.value) : null}
                      format="YYYY-MM-DD"
                      onChange={(date) => field.onChange(date?.toDate())}
                    />
                  )}
                />
              </div>

              <Button type="submit" className="w-full mt-2 bg-[#1F2B6C] hover:bg-blue-800">
                <span className="text-white">Thêm mẫu</span>
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

type FieldProps = {
  kits: TestKitResponse[];
  control: any;
  errors: any;
};

function FormFields({ kits, control, errors }: FieldProps) {
  return (
    <>
      {/* Chọn Kit */}
      <div>
        <label className="block text-sm mb-1">Chọn Kit</label>
        <Controller
          name="kitId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Chọn mã kit" />
              </SelectTrigger>
              <SelectContent>
                {kits.map((kit) => (
                  <SelectItem key={kit.id} value={kit.id}>
                    {kit.id} ({kit.sampleCount} mẫu)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.kitId && (
          <p className="text-sm text-red-500 mt-1">{errors.kitId.message}</p>
        )}
      </div>

      {/* Người cho mẫu */}
      <div>
        <Controller
          name="donorName"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Người cho mẫu" className="h-10" />
          )}
        />
        {errors.donorName && (
          <p className="text-sm text-red-500 mt-1">{errors.donorName.message}</p>
        )}
      </div>

      {/* Mối quan hệ */}
      <div>
        <label className="block text-sm mb-1">Mối quan hệ</label>
        <Controller
          name="relationshipToSubject"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Chọn mối quan hệ" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(RelationshipToSubjectLabelVi).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.relationshipToSubject && (
          <p className="text-sm text-red-500 mt-1">{errors.relationshipToSubject.message}</p>
        )}
      </div>

      {/* Loại mẫu */}
      <div>
        <label className="block text-sm mb-1">Loại mẫu</label>
        <Controller
          name="sampleType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Chọn loại mẫu" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SampleTypeLabelVi).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.sampleType && (
          <p className="text-sm text-red-500 mt-1">{errors.sampleType.message}</p>
        )}
      </div>
    </>
  );
}

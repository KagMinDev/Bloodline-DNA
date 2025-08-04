import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { Input, DatePicker } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { createTestSampleFromStaffApi } from "../../api/testSampleApi";
import { getTestBookingByIdApi } from "../../api/testBookingApi";
import type { TestBookingResponse } from "../../types/testBooking";
import { RelationshipToSubjectLabelVi, SampleTypeLabelVi, } from "../../types/sampleTest";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "../sample/ui/dialog";
import { Button } from "../sample/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../booking/ui/select";
import { getUserInfoApi } from "../../../auth/api/loginApi";

const atFacilitySchema = z.object({
  donorName: z.string().min(1, "Vui lòng nhập tên người cho mẫu"),
  relationshipToSubject: z.string().min(1, "Chọn mối quan hệ"),
  sampleType: z.string().min(1, "Chọn loại mẫu"),
  collectedById: z.string().min(1, "Nhập người thu mẫu"),
  collectedAt: z.date({ required_error: "Chọn ngày thu mẫu" }),
});

type Props = { open: boolean; onClose: () => void; bookingId?: string | null };

export default function TestSampleModal({ open, onClose, bookingId }: Props) {
  const [booking, setBooking] = useState<TestBookingResponse | null>(null);
  const [collectedById, setCollectedById] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(atFacilitySchema),
    defaultValues: {
      collectedAt: new Date(),
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        collectedAt: new Date(),
      });
      // Lấy user info để điền collectedById
      const fetchUser = async () => {
        const token = localStorage.getItem("token") || "";
        if (!token) return;
        try {
          const user = await getUserInfoApi(token);
          setCollectedById(user.fullName); // Lấy tên người dùng
          setValue("collectedById", user.fullName); // Điền vào form
        } catch {
          toast.error("Không lấy được thông tin người dùng!");
        }
      };
      fetchUser();
      if (bookingId) {
        const fetchBooking = async () => {
          try {
            const res = await getTestBookingByIdApi(bookingId);
            setBooking(res);
          } catch {
            toast.error("Không tìm thấy thông tin booking!");
          }
        };
        fetchBooking();
      }
    }
  }, [open, reset, bookingId, setValue]);

  const onSubmit = async (data: any) => {
    if (loading) return;
    setLoading(true);
    const token = localStorage.getItem("token") || "";
    if (!token) {
      setLoading(false);
      return;
    }
    if (!booking) {
      toast.error("Không tìm thấy thông tin booking!");
      setLoading(false);
      return;
    }
    const payload = {
      ...data,
      bookingId: booking.id,
      kitId: booking.testKitId,
      donorName: data.donorName,
      relationshipToSubject: Number(data.relationshipToSubject),
      sampleType: Number(data.sampleType),
      labReceivedAt: new Date(),
      collectedById: collectedById || data.collectedById,
    };
    console.log("[DEBUG] Gọi API tạo mẫu với payload:", payload);
    try {
      await createTestSampleFromStaffApi(payload, token);
      toast.success("Tạo mẫu thành công");
      reset();
      onClose();
    } catch (error) {
      console.error("❌ Lỗi:", error);
      toast.error("Tạo mẫu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Thêm Mẫu Xét Nghiệm</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mt-4">
          {/* Người thu mẫu */}
          <div>
            <label className="block text-sm mb-1">Người thu mẫu</label>
            <Input value={collectedById} readOnly className="h-10 bg-gray-100" />
          </div>

          <FormFields control={control} errors={errors} />

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

          <Button type="submit" className="w-full mt-2 bg-[#1F2B6C] hover:bg-blue-800" disabled={loading}>
            <span className="text-white">{loading ? "Đang xử lý..." : "Thêm mẫu"}</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type FieldProps = {
  control: any;
  errors: any;
};

function FormFields({ control, errors }: FieldProps) {
  return (
    <>
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

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "../../staff/components/booking/ui/dialog";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../staff/components/booking/ui/select";
import { submitSampleInfoApi, type SampleInfoPayload } from "../api/sampleApi";
import { AlertCircleIcon, CheckCircle, Loader2 } from "lucide-react";

// Enums for dropdowns, mirroring staff implementation
const RelationshipToSubjectLabelVi: Record<number, string> = {
  0: "Cha",
  1: "Mẹ",
  2: "Con",
  3: "Anh/Chị/Em",
  4: "Khác",
};

const SampleTypeLabelVi: Record<number, string> = {
  0: "Máu",
  1: "Tóc",
  2: "Móng",
  3: "Nước bọt",
  4: "Khác",
};

interface SampleInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  onSubmitSuccess: () => void;
}

export const SampleInfoModal: React.FC<SampleInfoModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  onSubmitSuccess,
}) => {
  const [formData, setFormData] = useState({
    sampleCode: "",
    donorName: "",
    relationshipToSubject: "",
    sampleType: "",
    collectedAt: new Date().toISOString().split("T")[0], // Default to today
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setFormData({
        sampleCode: "",
        donorName: "",
        relationshipToSubject: "",
        sampleType: "",
        collectedAt: new Date().toISOString().split("T")[0],
      });
      setErrors({});
      setApiError(null);
    }
  }, [isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.sampleCode.trim()) newErrors.sampleCode = "Vui lòng nhập mã mẫu.";
    if (!formData.donorName.trim()) newErrors.donorName = "Vui lòng nhập tên người cho mẫu.";
    if (!formData.relationshipToSubject) newErrors.relationshipToSubject = "Vui lòng chọn mối quan hệ.";
    if (!formData.sampleType) newErrors.sampleType = "Vui lòng chọn loại mẫu.";
    if (!formData.collectedAt) newErrors.collectedAt = "Vui lòng chọn ngày thu mẫu.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError(null);

    const payload: SampleInfoPayload = {
      sampleCode: formData.sampleCode,
      donorName: formData.donorName,
      relationshipToSubject: Number(formData.relationshipToSubject),
      sampleType: Number(formData.sampleType),
      collectedAt: new Date(formData.collectedAt).toISOString(),
    };

    const response = await submitSampleInfoApi(bookingId, payload);

    setIsSubmitting(false);

    if (response.success) {
      onSubmitSuccess();
      onClose();
    } else {
      setApiError(response.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-white rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-900">Điền thông tin mẫu xét nghiệm</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
            {apiError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-center gap-2">
                    <AlertCircleIcon className="w-4 h-4" />
                    <span>{apiError}</span>
                </div>
            )}
          <div>
            <label className="text-sm font-medium">Mã mẫu *</label>
            <Input
              value={formData.sampleCode}
              onChange={(e) => setFormData({ ...formData, sampleCode: e.target.value })}
              placeholder="Nhập mã dán trên ống nghiệm"
              className="mt-1"
            />
            {errors.sampleCode && <p className="text-sm text-red-600 mt-1">{errors.sampleCode}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Tên người cho mẫu *</label>
            <Input
              value={formData.donorName}
              onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
              placeholder="Họ và tên người cung cấp mẫu"
              className="mt-1"
            />
            {errors.donorName && <p className="text-sm text-red-600 mt-1">{errors.donorName}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Mối quan hệ với người đăng ký *</label>
            <Select onValueChange={(value: string) => setFormData({ ...formData, relationshipToSubject: value })}>
                <SelectTrigger className="w-full mt-1"><SelectValue placeholder="Chọn mối quan hệ" /></SelectTrigger>
                <SelectContent>
                    {Object.entries(RelationshipToSubjectLabelVi).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {errors.relationshipToSubject && <p className="text-sm text-red-600 mt-1">{errors.relationshipToSubject}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Loại mẫu *</label>
            <Select onValueChange={(value: string) => setFormData({ ...formData, sampleType: value })}>
                <SelectTrigger className="w-full mt-1"><SelectValue placeholder="Chọn loại mẫu" /></SelectTrigger>
                <SelectContent>
                    {Object.entries(SampleTypeLabelVi).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {errors.sampleType && <p className="text-sm text-red-600 mt-1">{errors.sampleType}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Ngày thu mẫu *</label>
            <Input
              type="date"
              value={formData.collectedAt}
              onChange={(e) => setFormData({ ...formData, collectedAt: e.target.value })}
              className="mt-1"
            />
             {errors.collectedAt && <p className="text-sm text-red-600 mt-1">{errors.collectedAt}</p>}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>Hủy</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
            Lưu thông tin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "../../staff/components/booking/ui/dialog";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../staff/components/booking/ui/select";
import { submitSampleInfoApi, getTestKitByBookingIdApi, type SampleInfoPayload } from "../api/sampleApi";
import { AlertCircleIcon, CheckCircle, Loader2 } from "lucide-react";

// Enums for dropdowns, matching backend enums exactly
const RelationshipToSubjectLabelVi: Record<number, string> = {
  0: "Không xác định",
  1: "Cha",
  2: "Mẹ", 
  3: "Con",
  4: "Ông nội",
  5: "Bà nội",
  6: "Cháu",
  7: "Anh trai",
  8: "Chị/Em gái",
  9: "Chú/Bác trai",
  10: "Cô/Dì",
  11: "Cháu trai",
  12: "Cháu gái",
  99: "Khác",
};

const SampleTypeLabelVi: Record<number, string> = {
  0: "Không xác định",
  1: "Tăm bông miệng",
  2: "Máu",
  3: "Tóc có chân tóc",
  4: "Móng tay",
  5: "Nước bọt",
  99: "Khác",
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
    donorName: "",
    relationshipToSubject: "",
    sampleType: "",
  });
  const [kitId, setKitId] = useState<string>("");
  const [isLoadingKit, setIsLoadingKit] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch TestKit information when modal opens
  useEffect(() => {
    const fetchTestKit = async () => {
      if (isOpen && bookingId) {
        setIsLoadingKit(true);
        setApiError(null);
        
        try {
          console.log('🔄 Fetching TestKit for booking:', bookingId);
          const response = await getTestKitByBookingIdApi(bookingId);
          
          if (response.success && response.data?.id) {
            setKitId(response.data.id);
            console.log('✅ TestKit ID found:', response.data.id);
          } else {
            setApiError(response.message || "Không tìm thấy TestKit cho booking này.");
          }
        } catch (error) {
          console.error('❌ Error fetching TestKit:', error);
          setApiError("Lỗi khi lấy thông tin TestKit.");
        } finally {
          setIsLoadingKit(false);
        }
      }
    };

    fetchTestKit();
  }, [isOpen, bookingId]);

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setFormData({
        donorName: "",
        relationshipToSubject: "",
        sampleType: "",
      });
      setKitId("");
      setErrors({});
      setApiError(null);
    }
  }, [isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!kitId.trim()) newErrors.kitId = "Không tìm thấy mã Kit. Vui lòng thử lại.";
    if (!formData.donorName.trim()) newErrors.donorName = "Vui lòng nhập tên người cho mẫu.";
    if (!formData.relationshipToSubject) newErrors.relationshipToSubject = "Vui lòng chọn mối quan hệ.";
    if (!formData.sampleType) newErrors.sampleType = "Vui lòng chọn loại mẫu.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError(null);

    const payload: SampleInfoPayload = {
      kitId: kitId,
      donorName: formData.donorName,
      relationshipToSubject: Number(formData.relationshipToSubject),
      sampleType: Number(formData.sampleType),
    };

    const response = await submitSampleInfoApi(payload);

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
        
        <div className="space-y-4">
          {apiError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-center gap-2">
              <AlertCircleIcon className="w-4 h-4" />
              <span>{apiError}</span>
            </div>
          )}

          {isLoadingKit && (
            <div className="bg-blue-50 text-blue-700 p-3 rounded-md flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang tải thông tin TestKit...</span>
            </div>
          )}

          {kitId && (
            <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>TestKit đã được tìm thấy: <strong>{kitId}</strong></span>
            </div>
          )}

          {errors.kitId && <p className="text-sm text-red-600">{errors.kitId}</p>}

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
                {Object.entries(RelationshipToSubjectLabelVi)
                  .filter(([key]) => key !== "0") // Exclude "Unknown" option
                  .map(([key, label]) => (
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
                {Object.entries(SampleTypeLabelVi)
                  .filter(([key]) => key !== "0") // Exclude "Unknown" option
                  .map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.sampleType && <p className="text-sm text-red-600 mt-1">{errors.sampleType}</p>}
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>Hủy</Button>
          </DialogClose>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || isLoadingKit || !kitId}
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
            Lưu thông tin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 
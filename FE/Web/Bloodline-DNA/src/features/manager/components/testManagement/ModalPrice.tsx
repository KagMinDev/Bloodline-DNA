import React, { useState, useEffect } from "react";
import type { PriceServiceRequest, PriceServiceResponse } from "../../types/testService";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../staff/components/sample/ui/dialog";
import { Label } from "../../../staff/components/booking/ui/label";
import { Input } from "../../../staff/components/booking/ui/input";
import Checkbox from "../common/Checkbox";
import { Button } from "../../../staff/components/sample/ui/button";

interface ModalPriceProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PriceServiceRequest, id?: string) => Promise<void>;
  initialData?: PriceServiceResponse | null;
}

const defaultForm: PriceServiceRequest = {
  price: 0,
  collectionMethod: 0,
  effectiveFrom: "",
  effectiveTo: "",
  isActive: true,
};

const ModalPrice: React.FC<ModalPriceProps> = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState<PriceServiceRequest>(defaultForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        price: initialData.price,
        collectionMethod: initialData.collectionMethod,
        effectiveFrom: initialData.effectiveFrom.slice(0, 10),
        effectiveTo: initialData.effectiveTo.slice(0, 10),
        isActive: initialData.isActive,
      });
    } else {
      setForm(defaultForm);
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form, initialData?.id);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full rounded-xl">
        <DialogHeader>
          <DialogTitle>{initialData ? "Sửa giá dịch vụ" : "Thêm giá dịch vụ"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="price">Giá</Label>
            <Input
              type="text"
              id="price"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              placeholder="Nhập giá dịch vụ"
            />
          </div>
          <div>
            <Label htmlFor="collectionMethod">Phương thức thu</Label>
            <select
              id="collectionMethod"
              name="collectionMethod"
              value={form.collectionMethod}
              onChange={handleChange}
              className="w-full border border-input rounded-md px-3 py-2"
            >
              <option value={0}>Trực tiếp</option>
              <option value={1}>Khác</option>
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="effectiveFrom">Hiệu lực từ</Label>
              <Input
                type="date"
                name="effectiveFrom"
                id="effectiveFrom"
                value={form.effectiveFrom}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="effectiveTo">Hiệu lực đến</Label>
              <Input
                type="date"
                name="effectiveTo"
                id="effectiveTo"
                value={form.effectiveTo}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={form.isActive}
              onChange={(checked) => setForm((prev) => ({ ...prev, isActive: checked }))}
              label="Đang áp dụng"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">{initialData ? "Lưu" : "Thêm"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalPrice;
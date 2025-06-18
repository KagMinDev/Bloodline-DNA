import React, { useState, useEffect } from "react";
import type { TestResponse, PriceServiceResponse, TestUpdateRequest } from "../../types/testService";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../staff/components/sample/ui/dialog";
import { Label } from "../../../staff/components/booking/ui/label";
import { Input } from "../../../staff/components/booking/ui/input";
import Checkbox from "../common/Checkbox";
import { Button } from "../../../staff/components/sample/ui/button";
import { CATEGORY_OPTIONS } from "../../utils/categoryMap";

interface ModalEditProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TestUpdateRequest) => Promise<void>;
  initialData?: TestResponse | null;
  collectionMethods?: string[];
}

const defaultCollectionMethods = ["Trực tiếp", "Khác"];

const defaultPrice: PriceServiceResponse = {
  id: "",
  serviceId: "",
  price: 0,
  collectionMethod: 0,
  currency: "",
  effectiveFrom: "",
  effectiveTo: "",
  isActive: true,
  createdAt: "",
  updatedAt: "",
  testServiceInfor: "",
};

const defaultForm: TestResponse = {
  id: "",
  name: "",
  description: "",
  category: "",
  isActive: true,
  priceServices: [defaultPrice],
  createdAt: "",
  updatedAt: "",
};

const ModalEdit: React.FC<ModalEditProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  collectionMethods = defaultCollectionMethods,
}) => {
  const [form, setForm] = useState<TestResponse>(defaultForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        priceServices:
          initialData.priceServices && initialData.priceServices.length > 0
            ? [{ ...initialData.priceServices[0] }]
            : [{ ...defaultPrice }],
      });
    } else {
      setForm(defaultForm);
    }
  }, [initialData, open]);

  // Xử lý thay đổi trường chung và trường giá
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // Nếu là trường của priceServices[0]
    if (
      [
        "price",
        "collectionMethod",
        "currency",
        "effectiveFrom",
        "effectiveTo",
        "isActive"
      ].includes(name)
    ) {
      setForm((prev) => ({
        ...prev,
        priceServices: prev.priceServices.map((ps, idx) =>
          idx === 0
            ? {
              ...ps,
              [name]: type === "number" ? Number(value) : type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
            }
            : ps
        ),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  const price = form.priceServices[0] || defaultPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const oldPriceServiceId = form.priceServices[0]?.id || "";

    const payload: TestUpdateRequest = {
      id: form.id,
      name: form.name,
      description: form.description,
      category: form.category,
      isActive: form.isActive,
      priceServices: [
        {
          id: oldPriceServiceId,
          price: price.price,
          collectionMethod: price.collectionMethod,
          effectiveFrom: price.effectiveFrom,
          effectiveTo: price.effectiveTo,
          isActive: price.isActive,
          currency: price.currency || "VND",
        },
      ],
    };

    await onSubmit(payload);
    onClose();
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full rounded-xl">
        <DialogHeader>
          <DialogTitle>Sửa dịch vụ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Tên dịch vụ</Label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="description">Mô tả</Label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-input rounded-md px-3 py-2 resize-y min-h-[100px]"
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Loại</Label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-input rounded-md px-3 py-2"
              required
            >
              {CATEGORY_OPTIONS.map(opt => (
                <option key={opt.api} value={opt.api}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Giá dịch vụ</Label>
            <Input
              type="number"
              name="price"
              value={price.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="collectionMethod">Phương thức thu</Label>
            <select
              id="collectionMethod"
              name="collectionMethod"
              value={price.collectionMethod}
              onChange={handleChange}
              className="w-full border border-input rounded-md px-3 py-2"
              required
            >
              {collectionMethods.map((method, idx) => (
                <option key={method} value={idx}>
                  {method}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Hiệu lực từ</Label>
              <Input
                type="date"
                name="effectiveFrom"
                value={price.effectiveFrom?.slice(0, 10) || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <Label>Hiệu lực đến</Label>
              <Input
                type="date"
                name="effectiveTo"
                value={price.effectiveTo?.slice(0, 10) || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={price.isActive}
              onChange={(checked: boolean) =>
                setForm((prev) => ({
                  ...prev,
                  priceServices: prev.priceServices.map((ps, idx) =>
                    idx === 0 ? { ...ps, isActive: checked } : ps
                  ),
                }))
              }
              label="Giá đang áp dụng"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
            <Button type="submit">Lưu</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEdit;

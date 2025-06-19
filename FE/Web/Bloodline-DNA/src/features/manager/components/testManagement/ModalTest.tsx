import React, { useState, useEffect } from "react";
import type { PriceServiceRequest } from "../../types/testService";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../staff/components/sample/ui/dialog";
import { Label } from "../../../staff/components/booking/ui/label";
import { Input } from "../../../staff/components/booking/ui/input";
import Checkbox from "../common/Checkbox";
import { Button } from "../../../staff/components/sample/ui/button";
import { CATEGORY_OPTIONS } from '../../utils/categoryMap';

interface ModalAddTestProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    category: string;
    isActive: boolean;
    priceService: PriceServiceRequest;
  }) => Promise<void>;
  collectionMethods?: string[];
  initialData?: {
    name: string;
    description: string;
    category: string;
    isActive: boolean;
    priceServices?: PriceServiceRequest[];
  };
}

const defaultTest = {
  name: "",
  description: "",
  category: "",
  isActive: true,
};

const defaultPrice: PriceServiceRequest = {
  price: 0,
  collectionMethod: 0,
  effectiveFrom: "",
  effectiveTo: "",
  isActive: true,
};

const ModalTest: React.FC<ModalAddTestProps> = ({
  open,
  onClose,
  onSubmit,
  collectionMethods = ["Trực tiếp", "Chuyển khoản"],
  initialData,
}) => {
  const [test, setTest] = useState(defaultTest);
  const [price, setPrice] = useState<PriceServiceRequest>(defaultPrice);

  useEffect(() => {
    if (open && initialData) {
      setTest({
        ...defaultTest,
        name: initialData.name,
        description: initialData.description,
        category: initialData.category,
        isActive: initialData.isActive,
      });

      if (initialData.priceServices && initialData.priceServices.length > 0) {
        const firstPrice = initialData.priceServices[0];
        setPrice({
          price: firstPrice.price,
          collectionMethod: firstPrice.collectionMethod,
          effectiveFrom: firstPrice.effectiveFrom?.slice(0, 10) || "",
          effectiveTo: firstPrice.effectiveTo?.slice(0, 10) || "",
          isActive: firstPrice.isActive,
        });
      } else {
        setPrice(defaultPrice);
      }
    } else if (open) {
      setTest(defaultTest);
      setPrice(defaultPrice);
    }
  }, [open, initialData]);

  const handleTestChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setTest((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value,
    }));
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setPrice((prev) => ({
      ...prev,
      [name]: name === "price"
        ? Number(value.replace(/[^0-9]/g, ""))
        : name === "collectionMethod"
        ? Number(value)
        : type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({
        name: test.name,
        description: test.description,
        category: test.category,
        isActive: test.isActive,
        priceService: price,
      });
      onClose();
    } catch (err) {
      alert("Có lỗi xảy ra khi thêm dịch vụ.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full rounded-xl">
        <DialogHeader>
          <DialogTitle>Thêm dịch vụ mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Tên dịch vụ</Label>
            <Input
              id="name"
              name="name"
              value={test.name}
              onChange={handleTestChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Mô tả</Label>
            <textarea
              id="description"
              name="description"
              value={test.description}
              onChange={handleTestChange}
              required
              rows={4}
              className="w-full border border-input rounded-md px-3 py-2 resize-y min-h-[100px]"
              placeholder="Nhập mô tả chi tiết dịch vụ"
            />
          </div>
          <div>
            <Label htmlFor="category">Danh mục</Label>
            <select
              id="category"
              name="category"
              value={test.category}
              onChange={handleTestChange}
              className="w-full border border-input rounded-md px-3 py-2"
              required
            >
              {CATEGORY_OPTIONS.map(opt => (
                <option key={opt.api} value={opt.label}>{opt.label}</option>
              ))}
            </select>
          </div>
          <hr />
          <div>
            <Label htmlFor="price">Giá</Label>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              id="price"
              name="price"
              value={price.price === 0 ? "" : price.price}
              onChange={handlePriceChange}
              required
              placeholder="Nhập giá dịch vụ"
              autoComplete="off"
            />
          </div>
          <div>
            <Label htmlFor="collectionMethod">Phương thức thu</Label>
            <select
              id="collectionMethod"
              name="collectionMethod"
              value={price.collectionMethod}
              onChange={handlePriceChange}
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
              <Label htmlFor="effectiveFrom">Hiệu lực từ</Label>
              <Input
                type="date"
                name="effectiveFrom"
                id="effectiveFrom"
                value={price.effectiveFrom}
                onChange={handlePriceChange}
                required
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="effectiveTo">Hiệu lực đến</Label>
              <Input
                type="date"
                name="effectiveTo"
                id="effectiveTo"
                value={price.effectiveTo}
                onChange={handlePriceChange}
                required
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={test.isActive}
              onChange={(checked) => {
                setTest((prev) => ({ ...prev, isActive: checked }));
                setPrice((prev) => ({ ...prev, isActive: checked }));
              }}
              label="Đang áp dụng"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-blue-700 hover:bg-blue-700 text-white"
            >
              <span className="text-white">Thêm</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalTest;

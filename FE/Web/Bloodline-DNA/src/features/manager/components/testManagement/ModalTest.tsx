import React, { useState, useEffect } from "react";
import type { PriceServiceRequest } from "../../types/testService";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../staff/components/sample/ui/dialog";
import { Label } from "../../../staff/components/booking/ui/label";
import { Input } from "../../../staff/components/booking/ui/input";
import Checkbox from "../common/Checkbox";
import { Button } from "../../../staff/components/sample/ui/button";
import { CATEGORY_OPTIONS, categoryToType } from '../../utils/categoryMap';


interface ModalAddTestProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    type: number;
    isActive: boolean;
    priceService: PriceServiceRequest;
  }) => Promise<void>;
  collectionMethods?: string[]; // Thêm prop này để truyền danh sách phương thức thu
  initialData?: {
    name: string;
    description: string;
    category: string;
    isActive: boolean;
  }; // Thêm prop này nếu cần sửa dịch vụ
}

const defaultTest = {
  name: "",
  description: "",
  type: 0,
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
  collectionMethods = ["Trực tiếp", "Chuyển khoản"], // default nếu không truyền vào
  initialData, // nếu có
}) => {
  const [test, setTest] = useState(defaultTest);
  const [price, setPrice] = useState<PriceServiceRequest>(defaultPrice);

  // Nếu sửa, lấy type từ category string
  useEffect(() => {
    if (open && initialData) {
      setTest({
        ...defaultTest,
        name: initialData.name,
        description: initialData.description,
        type: categoryToType(initialData.category),
        isActive: initialData.isActive,
      });
      // Nếu initialData có priceServices, lấy giá trị đầu tiên để set vào price
      if ((initialData as any).priceServices && (initialData as any).priceServices.length > 0) {
        const firstPrice = (initialData as any).priceServices[0];
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
        : name === "type"
        ? Number(value)
        : value,
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setPrice((prev) => ({
      ...prev,
      [name]: name === "price"
        ? Number(value.replace(/[^0-9]/g, "")) // chỉ lấy số
        : name === "collectionMethod"
        ? Number(value) // lưu index hoặc backend yêu cầu string thì sửa lại
        : type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...test,
      priceService: price,
    });
    onClose();
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
            <Label htmlFor="type">Loại</Label>
            <select
              id="type"
              name="type"
              value={test.type}
              onChange={handleTestChange}
              className="w-full border border-input rounded-md px-3 py-2"
              required
            >
              {CATEGORY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
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
          {/* Chỉ giữ 1 checkbox ở dưới cùng */}
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

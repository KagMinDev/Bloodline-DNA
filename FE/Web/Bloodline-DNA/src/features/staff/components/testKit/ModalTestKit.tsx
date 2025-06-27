import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from '../sample/ui/button';
import Input from 'antd/es/input/Input';
import { Textarea } from '../booking/ui/textarea';
import type { TestKitRequest } from '../../types/testKit';

interface ModalTestKitProps {
  open: boolean;
  onClose: () => void;
  form: TestKitRequest;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  isEditing?: boolean;
}

const ModalTestKit: React.FC<ModalTestKitProps> = ({
  open,
  onClose,
  form,
  onChange,
  onSubmit,
  isEditing = false,
}) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        {/* Overlay background mờ */}
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />

        {/* Popup content */}
        <DialogPrimitive.Content
          className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl w-full max-w-md space-y-4">
          <DialogPrimitive.Title className="text-xl font-semibold text-blue-700">
            {isEditing ? 'Chỉnh sửa TestKit' : 'Thêm TestKit'}
          </DialogPrimitive.Title>

          <div className="grid gap-4">
            <div className="grid gap-1">
              <label className="font-medium">Mã Đặt</label>
              <Input name="bookingId" value={form.bookingId} onChange={onChange} placeholder="Mã đặt" />
            </div>
            <div className="grid gap-1">
              <label className="font-medium">Ngày Gửi</label>
              <Input type="date" name="shippedAt" value={form.shippedAt} onChange={onChange} />
            </div>
            <div className="grid gap-1">
              <label className="font-medium">Ngày Nhận</label>
              <Input type="date" name="receivedAt" value={form.receivedAt} onChange={onChange} />
            </div>
            <div className="grid gap-1">
              <label className="font-medium">Gửi Lab</label>
              <Input type="date" name="sentToLabAt" value={form.sentToLabAt} onChange={onChange} />
            </div>
            <div className="grid gap-1">
              <label className="font-medium">Lab Nhận</label>
              <Input type="date" name="labReceivedAt" value={form.labReceivedAt} onChange={onChange} />
            </div>
            <div className="grid gap-1">
              <label className="font-medium">Số Mẫu</label>
              <Input
                type="sting"
                name="sampleCount"
                value={form.sampleCount}
                onChange={onChange}
                placeholder="Nhập số mẫu"
              />
            </div>
            <div className="grid gap-1">
              <label className="font-medium">Ghi chú</label>
              <Textarea name="note" value={form.note} onChange={onChange} placeholder="Nhập ghi chú nếu có" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onSubmit}>
              {isEditing ? 'Cập nhật' : 'Thêm'}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default ModalTestKit;

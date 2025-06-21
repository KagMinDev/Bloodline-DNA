// components/sample/ModalSample.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../sample/ui/dialog';
import { Button } from '../sample/ui/button';
import { Label } from '../booking/ui/label';
import { Input } from '../booking/ui/input';

interface ModalSampleProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SampleTestRequest) => void;
}

export interface SampleTestRequest {
  sampleType: number;
  instructionText: string;
  mediaUrl: string;
}

const ModalSample: React.FC<ModalSampleProps> = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState<SampleTestRequest>({
    sampleType: 1,
    instructionText: '',
    mediaUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'sampleType' ? parseInt(value) : value });
  };

  const handleSubmit = () => {
    onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm mẫu xét nghiệm</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="sampleType">Loại mẫu</Label>
            <select
              name="sampleType"
              value={form.sampleType}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            >
              <option value={1}>Máu</option>
              <option value={2}>Nước tiểu</option>
              <option value={3}>X-Quang</option>
              <option value={4}>DNA</option>
            </select>
          </div>

          <div>
            <Label htmlFor="instructionText">Hướng dẫn</Label>
            <Input
              name="instructionText"
              value={form.instructionText}
              onChange={handleChange}
              placeholder="Nhập hướng dẫn mẫu"
            />
          </div>

          <div>
            <Label htmlFor="mediaUrl">Link media (video/hình ảnh)</Label>
            <Input
              name="mediaUrl"
              value={form.mediaUrl}
              onChange={handleChange}
              placeholder="https://example.com/sample-image.jpg"
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={handleSubmit}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalSample;

import React from 'react';

interface ModalTestResultProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  form: {
    id: string;
    testBookingId: string;
    resultSummary: string;
    resultDate: string;
    resultFileUrl: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  editIndex: number | null;
}

const ModalTestResult: React.FC<ModalTestResultProps> = ({
  show,
  onClose,
  onSubmit,
  form,
  onChange,
  editIndex,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg border border-blue-200">
        <h2 className="text-xl font-bold text-blue-600 mb-4">
          {editIndex === null ? 'Tạo kết quả xét nghiệm' : 'Cập nhật kết quả xét nghiệm'}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1 text-blue-700">Mã kết quả</label>
            <input
              name="id"
              value={form.id}
              onChange={onChange}
              className="w-full px-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
              disabled={editIndex !== null}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-blue-700">Mã đặt xét nghiệm</label>
            <input
              name="testBookingId"
              value={form.testBookingId}
              onChange={onChange}
              className="w-full px-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-blue-700">Tóm tắt kết quả</label>
            <textarea
              name="resultSummary"
              value={form.resultSummary}
              onChange={onChange}
              className="w-full px-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-blue-700">Ngày trả kết quả</label>
            <input
              type="date"
              name="resultDate"
              value={form.resultDate}
              onChange={onChange}
              className="w-full px-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-blue-700">File kết quả (URL)</label>
            <input
              name="resultFileUrl"
              value={form.resultFileUrl}
              onChange={onChange}
              className="w-full px-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              {editIndex === null ? 'Tạo mới' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalTestResult;
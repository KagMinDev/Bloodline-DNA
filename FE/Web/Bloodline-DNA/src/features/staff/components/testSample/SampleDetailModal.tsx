import { format } from "date-fns";
import {
    getRelationshipLabelViByKey,
    getSampleTypeLabelViByKey,
    type SampleTestResponse,
} from "../../types/sampleTest";

interface TestSampleModalProps {
    open: boolean;
    onClose: () => void;
    item: SampleTestResponse | null;
}

export default function SampleDetailModal({ open, onClose, item }: TestSampleModalProps) {
    if (!open || !item) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black bg-opacity-30"
                onClick={onClose}
            />
            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="relative w-full max-w-md p-6 bg-white rounded shadow-lg">
                    <button
                        onClick={onClose}
                        className="absolute text-2xl font-bold text-gray-500 top-3 right-3 hover:text-gray-700"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                    <h2 className="mb-4 text-xl font-semibold text-blue-700">
                        Chi tiết mẫu xét nghiệm
                    </h2>

                    <div className="space-y-3 text-gray-800">
                        <div>
                            <strong>Mã Mẫu:</strong> {item.sampleCode}
                        </div>
                        <div>
                            <strong>Người Cho:</strong> {item.donorName}
                        </div>
                        <div>
                            <strong>Quan Hệ:</strong> {getRelationshipLabelViByKey(item.relationshipToSubject)}
                        </div>
                        <div>
                            <strong>Loại Mẫu:</strong> {getSampleTypeLabelViByKey(item.sampleType)}
                        </div>
                        <div>
                            <strong>Ngày Thu:</strong> {format(new Date(item.collectedAt), "dd/MM/yyyy")}
                        </div>
                        {/* Bạn có thể thêm các trường khác nếu cần */}
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

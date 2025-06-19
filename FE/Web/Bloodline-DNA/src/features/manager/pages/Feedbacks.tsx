import { useState, useEffect, useCallback } from 'react';
import type { FeedbackResponse } from '../types/feedback';
import { Loading } from '../../../components';
import FeedbackCard from '../components/feedback/FeedbackCard';

function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFakeFeedbacks = useCallback(async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Giả delay
    const fakeData: FeedbackResponse[] = [
      {
        id: 'fb001',
        userId: 'user001',
        testServiceId: 'test001',
        rating: 5,
        comment: 'Dịch vụ rất tốt!',
        createdAt: '2025-06-17T10:00:00Z',
        updatedAt: '2025-06-17T10:00:00Z',
      },
      {
        id: 'fb002',
        userId: 'user002',
        testServiceId: 'test002',
        rating: 3,
        comment: 'Khá ổn nhưng cần cải thiện thời gian chờ.',
        createdAt: '2025-06-16T14:20:00Z',
        updatedAt: '2025-06-16T14:20:00Z',
      },
      {
        id: 'fb003',
        userId: 'user003',
        testServiceId: 'test003',
        rating: 1,
        comment: 'Tôi không hài lòng với thái độ phục vụ.',
        createdAt: '2025-06-15T09:30:00Z',
        updatedAt: '2025-06-15T09:30:00Z',
      },
    ];
    setFeedbacks(fakeData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchFakeFeedbacks();
  }, [fetchFakeFeedbacks]);

  return (
    <>
      <div className="h-screen flex flex-col items-center bg-blue-50 p-6 relative overflow-auto">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-800">Quản lý phản hồi</h1>
          </div>

          {feedbacks.length > 0 ? (
            <div className="space-y-4">
              {feedbacks.map((fb) => (
                <FeedbackCard key={fb.id} feedback={fb} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Không có phản hồi nào để hiển thị.</p>
          )}

        </div>
      </div>

      {isLoading && <Loading message="Đang tải phản hồi..." fullScreen={true} />}
    </>
  );
}

export default Feedbacks;

import { useCallback, useEffect, useState } from 'react';
import { Loading } from '../../../components';
import { getFeedbacksApi } from '../api/feedbackApi'; // Thêm dòng này
import FeedbackCard from '../components/feedback/FeedbackCard';
import type { FeedbackResponse } from '../types/feedback';

function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Đổi sang gọi API thật
  const fetchFeedbacks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getFeedbacksApi();
      setFeedbacks(data);
    } catch {
      setFeedbacks([]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  return (
    <>
      <div className="relative flex flex-col items-center h-screen p-6 overflow-auto bg-blue-50">
        <div className="w-full mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-blue-800 md:text-3xl">Quản lý phản hồi</h1>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loading message="Đang tải phản hồi..." />
            </div>
          ) : feedbacks.length > 0 ? (
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
    </>
  );
}

export default Feedbacks;

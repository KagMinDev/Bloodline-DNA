import { useCallback, useEffect, useState } from 'react';
import { Loading } from '../../../components';
import { getFeedbacksApi } from '../api/feedbackApi'; // Thêm dòng này
import FeedbackCard from '../components/feedback/FeedbackCard';
import type { FeedbackResponse } from '../types/feedback';

function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token") || "";

  // Đổi sang gọi API thật
  const fetchFeedbacks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getFeedbacksApi(token);
      setFeedbacks(data);
    } catch {
      setFeedbacks([]);
    }
    setIsLoading(false);
  }, [token]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

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

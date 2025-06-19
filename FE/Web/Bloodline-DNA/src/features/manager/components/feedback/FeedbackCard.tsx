import { Star } from 'lucide-react';
import type { FeedbackResponse } from '../../types/feedback';
import { Card, CardContent } from '../../../staff/components/sample/ui/card';

type Props = {
  feedback: FeedbackResponse;
};

const FeedbackCard: React.FC<Props> = ({ feedback }) => {
  const formattedDate = new Date(feedback.createdAt).toLocaleString();

  return (
    <Card className="shadow-md rounded-xl overflow-hidden border border-gray-200 bg-white">
      <CardContent className="p-4 space-y-2">
        {/* Top Row: User & Service */}
        <div className="flex justify-between text-sm text-gray-700 font-semibold">
          <p>👤 Người dùng: {feedback.userId}</p>
          <p>🧪 Dịch vụ: {feedback.testServiceId}</p>
        </div>

        {/* Rating Row */}
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill={i < feedback.rating ? 'currentColor' : 'none'}
            />
          ))}
        </div>

        {/* Comment Row */}
        <p className="text-gray-800 text-base">{feedback.comment}</p>

        {/* Metadata Row */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>📅 Ngày gửi: {formattedDate}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'chờ xử lý':
      return 'bg-gray-500';
    case 'đã gửi kit':
      return 'bg-blue-400';
    case 'đã xác nhận':
      return 'bg-green-500';
    case 'đã hoàn tất':
      return 'bg-blue-600';
    case 'đã huỷ':
      return 'bg-red-500';
    case 'đã nhận mẫu':
      return 'bg-orange-500';
    case 'đang xét nghiệm':
      return 'bg-purple-500';
    default:
      return 'bg-gray-300';
  }
};

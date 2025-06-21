export const getStatusColor = (status: string | number): string => {
  const numericStatus = typeof status === 'number' ? status : parseInt(status, 10) || -1;
  switch (numericStatus) {
    case 0:
      return 'bg-red-300';
    case 1:
      return 'bg-blue-400';
    case 2:
      return 'bg-green-500';
    case 3:
      return 'bg-blue-600';
    case 4:
      return 'bg-red-500';
    case 5:
      return 'bg-orange-500';
    case 6:
      return 'bg-purple-500';
    default:
      return 'bg-gray-300';
  }
};

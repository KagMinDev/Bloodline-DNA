export const STATUS_MAPPING = [
  { value: "Pending", label: "Chờ xác nhận" },
  { value: "PreparingKit", label: "Đang chuẩn bị kit" },
  { value: "DeliveringKit", label: "Đang giao kit" },
  { value: "KitDelivered", label: "Đã giao kit" },
  { value: "WaitingForSample", label: "Chờ lấy mẫu" },
  { value: "ReturningSample", label: "Đang hoàn mẫu" },
  { value: "SampleReceived", label: "Đã nhận mẫu" },
  { value: "Testing", label: "Đang xét nghiệm" },
  { value: "Confirmed", label: "Đã xác nhận" },
  { value: "Sampled", label: "Đã lấy mẫu" },
  { value: "Completed", label: "Hoàn thành" },
  { value: "Cancelled", label: "Đã hủy" },
  { value: "StaffGettingSample", label: "Nhân viên đang lấy mẫu" },
  { value: "CheckIn", label: "Đã check-in" },
];

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Pending":
      return "#facc15"; // vàng
    case "PreparingKit":
      return "#93c5fd"; // xanh dương nhạt
    case "DeliveringKit":
      return "#3b82f6"; // xanh dương
    case "KitDelivered":
      return "#1e40af"; // xanh đậm
    case "WaitingForSample":
      return "#fdba74"; // cam nhạt
    case "ReturningSample":
      return "#fb923c"; // cam
    case "SampleReceived":
      return "#14b8a6"; // teal
    case "Testing":
      return "#a78bfa"; // tím
    case "Confirmed":
      return "#0ea5e9"; // cyan
    case "Sampled":
      return "#6366f1"; // tím xanh
    case "Completed":
      return "#10b981"; // xanh lá
    case "Cancelled":
      return "#ef4444"; // đỏ
    case "StaffGettingSample":
      return "#fbbf24"; // vàng đậm
    case "CheckIn":
      return "#1d4ed8"; // xanh dương đậm
    default:
      return "#d1d5db"; // xám
  }
};

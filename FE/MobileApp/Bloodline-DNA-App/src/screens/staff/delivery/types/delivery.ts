export const statusColorMap: Record<string, string> = {
  PreparingKit: "orange",
  DeliveringKit: "blue",
  KitDelivered: "green",
  WaitingForPickup: "white",
  ReturningSample: "gold",
  PickingUpSample: "purple",
  SampleReceived: "cyan",
  Testing: "cyan",
  Cancelled: "red",
};

export const statusTextMap: Record<string, string> = {
  PreparingKit: "Đang chuẩn bị bộ Kit",
  DeliveringKit: "Đang giao bộ Kit",
  KitDelivered: "Đã nhận Kit",
  WaitingForPickup: "Đợi đến lấy mẫu",
  ReturningSample: "Đợi đến lấy mẫu",
  PickingUpSample: "Đang lấy mẫu",
  SampleReceived: "Đã nhận mẫu",
  Testing: "Đang xét nghiệm",
  Cancelled: "Đã hủy",
};

export type DeliveryStatus =
  | "PreparingKit"
  | "DeliveringKit"
  | "KitDelivered"
  | "WaitingForPickup"
  | "PickingUpSample"
  | "SampleReceived"
  | "Cancelled";

export const statusMapNumberToKey: Record<number, DeliveryStatus> = {
  0: "PreparingKit",
  1: "DeliveringKit",
  2: "KitDelivered",
  3: "WaitingForPickup",
  4: "PickingUpSample",
  5: "SampleReceived",
  6: "Cancelled",
};
export interface DeliveryLogistic {
  id: string;
  staffId: string | null;
  name: string;
  staff: { fullName?: string } | null;
  address: string;
  phone: string;
  scheduledAt: string;
  completedAt: string | null;
  imageUrl: string;
  note: string;
  type: number;
  status: number;
}

export interface DeliveryOrder {
  id: string;
  name: string;
  staffId: string | null;
  staff: { fullName?: string } | null;
  address: string;
  phone: string;
  scheduledAt: string;
  completeAt: string | null;
  note: string;
  type: number;
  imageUrl: string;
  status: DeliveryStatus;
}

export interface TestBookingStatusRequest {
  bookingId: string;
  status: number;
}

export interface CalendarProps {
  bookingsByDate?: Record<string, number>;
  events: TestBookingResponse[];
  onUpdateStatus?: (updatedBooking: TestBookingResponse) => void;
}

export interface TestBookingResponse {
  id: string;
  testServiceId: string;
  clientId: string;
  clientName: string;
  email: string;
  appointmentDate: string;
  price: number;
  collectionMethod: string;
  status: string; // Sử dụng const enum
  note: string;
  createdAt: string;
  updatedAt: string;
}
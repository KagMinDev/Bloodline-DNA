export const statusColorMap: Record<string, string> = {
  PreparingKit: "orange",
  DeliveringKit: "blue",
  KitDelivered: "green",
  WaitingForPickup: "gold",
  PickingUpSample: "purple",
  SampleReceived: "cyan",
  Cancelled: "red",
};

export const statusTextMap: Record<string, string> = {
  PreparingKit: "Đang chuẩn bị bộ Kit",
  DeliveringKit: "Đang giao bộ Kit",
  KitDelivered: "Đã nhận Kit",
  WaitingForPickup: "Đợi đến lấy mẫu",
  PickingUpSample: "Đang lấy mẫu",
  SampleReceived: "Đã nhận mẫu",
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
  staff: { fullName?: string } | null;
  address: string;
  phone: string;
  scheduledAt: string;
  completedAt: string | null;
  note: string;
  type: number;
  status: number;
}

export interface DeliveryOrder {
  id: string;
  staffId: string | null;
  staff: { fullName?: string } | null;
  address: string;
  phone: string;
  scheduleAt: string;
  completeAt: string | null;
  note: string;
  type: number;
  status: DeliveryStatus;
}

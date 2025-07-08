export type DeliveryStatus =
  | "PreparingKit"
  | "DeliveringKit"
  | "KitDelivered"
  | "WaitingForPickup"
  | "PickingUpSample"
  | "SampleReceived"
  | "cancelled";

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
  staff: string;
  address: string;
  phone: string;
  scheduleAt: string;
  completeAt: string | null;
  note: string;
  status: DeliveryStatus;
}
export interface RawStaffResponse {
  id: string;
  fullName: string;
  email: string;
  role: string;
  address: string;
}
export interface ActiveStaff {
  id: string;
  fullName: string;
  email: string;
}

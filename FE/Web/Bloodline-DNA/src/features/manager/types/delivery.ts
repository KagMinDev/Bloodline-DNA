export type DeliveryStatus =
  | 'PreparingKit'
  | 'DeliveringKit'
  | 'KitDelivered'
  | 'WaitingForPickup'
  | 'PickingUpSample'
  | 'SampleReceived'
  | 'cancelled';

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

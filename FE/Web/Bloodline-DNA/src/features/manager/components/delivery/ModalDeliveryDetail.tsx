import { Badge, Descriptions, Modal } from "antd";
import type { DeliveryOrder, DeliveryStatus } from "../../types/delivery";

interface Props {
  visible: boolean;
  onClose: () => void;
  delivery: DeliveryOrder | null;
}

const statusMap: Record<DeliveryStatus, { text: string; color: string }> = {
  PreparingKit: { text: "Đang chuẩn bị bộ Kit", color: "orange" },
  DeliveringKit: { text: "Đang giao bộ Kit", color: "blue" },
  KitDelivered: { text: "Đã nhận Kit", color: "green" },
  WaitingForPickup: { text: "Đợi đến lấy mẫu", color: "gold" },
  PickingUpSample: { text: "Đang lấy mẫu", color: "purple" },
  SampleReceived: { text: "Đã nhận mẫu", color: "cyan" },
  cancelled: { text: "Huỷ giao hoặc lấy mẫu", color: "red" },
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const DeliveryDetailModal = ({ visible, onClose, delivery }: Props) => {
  if (!delivery) return null;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      title={`Chi tiết đơn hàng #${delivery.id}`}
      footer={null}
      width={650}
    >
      <Descriptions
        bordered
        column={1}
        labelStyle={{ fontWeight: 600, width: "200px" }}
        contentStyle={{ fontSize: 14 }}
      >
        <Descriptions.Item label="Nhân viên">
          {delivery.staff}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">
          {delivery.address}
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          {delivery.phone}
        </Descriptions.Item>
        <Descriptions.Item label="Thời gian tạo đơn">
          {formatDateTime(delivery.scheduleAt)}
        </Descriptions.Item>
        {delivery.completeAt && (
          <Descriptions.Item label="Thời gian hoàn thành">
            {formatDateTime(delivery.completeAt)}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Ghi chú">
          {delivery.note || "Không có"}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Badge
            status="processing"
            color={statusMap[delivery.status].color}
            text={statusMap[delivery.status].text}
          />
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default DeliveryDetailModal;

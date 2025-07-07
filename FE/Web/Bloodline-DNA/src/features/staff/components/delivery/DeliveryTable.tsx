import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { DeliveryOrder } from "../../types/delivery";

interface Props {
  data: DeliveryOrder[];
  loadingId?: string | null;
  onRowClick: (id: string) => void;
}

const statusColorMap: Record<string, string> = {
  PreparingKit: "orange",
  DeliveringKit: "blue",
  KitDelivered: "green",
  WaitingForPickup: "gold",
  PickingUpSample: "purple",
  SampleReceived: "cyan",
  cancelled: "red",
};

const statusTextMap: Record<string, string> = {
  PreparingKit: "Đang chuẩn bị bộ Kit",
  DeliveringKit: "Đang giao bộ Kit",
  KitDelivered: "Đã nhận Kit",
  WaitingForPickup: "Đợi đến lấy mẫu",
  PickingUpSample: "Đang lấy mẫu",
  SampleReceived: "Đã nhận mẫu",
  cancelled: "Đã hủy",
};

const DeliveryTable = ({ data, onRowClick }: Props) => {
  const columns: ColumnsType<DeliveryOrder> = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      render: (id: string) => `#${id}`,
    },
    {
      title: "Nhân viên",
      dataIndex: "staff",
      key: "staff",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Thời gian giao",
      dataIndex: "scheduleAt",
      key: "scheduleAt",
      render: (value: string) =>
        new Date(value).toLocaleString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={statusColorMap[status]}>{statusTextMap[status]}</Tag>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      dataSource={data}
      columns={columns}
      pagination={{ pageSize: 6 }}
      onRow={(record) => ({
        onClick: () => onRowClick(record.id),
        style: { cursor: "pointer" },
      })}
      locale={{
        emptyText: "Không có đơn nào được phân công.",
      }}
    />
  );
};

export default DeliveryTable;

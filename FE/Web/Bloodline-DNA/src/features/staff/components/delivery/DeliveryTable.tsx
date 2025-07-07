import { CheckOutlined } from "@ant-design/icons";
import { Button, Table, Tag } from 'antd';
import type { ColumnsType } from "antd/es/table";
import {
  statusColorMap,
  statusMapNumberToKey,
  statusTextMap,
  type DeliveryOrder,
} from "../../types/delivery";
interface Props {
  data: DeliveryOrder[];
  loadingId?: string | null;
  onRowClick: (id: string) => void;
  onComplete: (id: string) => void;
}

const DeliveryTable = ({ data, onRowClick, onComplete }: Props) => {
  const columns: ColumnsType<DeliveryOrder> = [
    {
      title: <span style={{ fontSize: "12px" }}>Mã đơn</span>,
      dataIndex: "id",
      key: "id",
      render: (id: string) => <span style={{ fontSize: "12px" }}>#{id}</span>,
    },
    {
      title: <span style={{ fontSize: "12px" }}>Địa chỉ</span>,
      dataIndex: "address",
      key: "address",
      render: (text: string) => (
        <span style={{ fontSize: "12px" }}>{text}</span>
      ),
    },
    {
      title: <span style={{ fontSize: "12px" }}>SĐT</span>,
      dataIndex: "phone",
      key: "phone",
      render: (text: string) => (
        <span style={{ fontSize: "12px" }}>{text}</span>
      ),
    },
    {
      title: <span style={{ fontSize: "12px" }}>Thời gian giao</span>,
      dataIndex: "scheduledAt",
      key: "scheduledAt",
      align: "center",
      render: (value: string) => (
        <span style={{ fontSize: "12px" }}>
          {new Date(value).toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      title: <span style={{ fontSize: "12px" }}>Ghi chú</span>,
      dataIndex: "note",
      key: "note",
      render: (text: string) => (
        <span style={{ fontSize: "12px" }}>{text}</span>
      ),
    },
    {
      title: <span style={{ fontSize: "12px" }}>Trạng thái</span>,
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (statusNumber: number) => {
        const statusKey = statusMapNumberToKey[statusNumber];
        return (
          <Tag
            color={statusColorMap[statusKey]}
            style={{ fontSize: "12px", padding: "2px 6px" }}
          >
            {statusTextMap[statusKey]}
          </Tag>
        );
      },
    },
    {
      title: <span style={{ fontSize: "12px" }}>Hành động</span>,
      key: "actions",
      align: "center",
      render: (_, record) => {
        const isCompleted =
          record.status === "SampleReceived" || record.status === "Cancelled";

        return (
          <Button
            icon={<CheckOutlined />}
            disabled={isCompleted}
            onClick={(e) => {
              e.stopPropagation();
              onComplete(record.id);
            }}
            className={`px-2 py-1 text-xs rounded cursor-pointer ${
              isCompleted
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            Hoàn thành
          </Button>
        );
      },
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
      size="small"
      locale={{
        emptyText: (
          <span style={{ fontSize: "12px" }}>
            Không có đơn nào được phân công.
          </span>
        ),
      }}
    />
  );
};

export default DeliveryTable;

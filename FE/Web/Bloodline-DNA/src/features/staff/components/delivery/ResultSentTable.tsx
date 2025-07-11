import { CheckOutlined } from "@ant-design/icons";
import { Button, Modal, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { statusColorMap, statusTextMap, type DeliveryOrder } from "../../types/delivery";

interface Props {
  data: DeliveryOrder[];
  onRowClick: (id: string) => void;
  onComplete: () => void;
}

const ResultSent = ({ data, onRowClick, onComplete }: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleClickSendResult = (id: string) => {
    setSelectedId(id);
    setOpenModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedId) return;
    setConfirmLoading(true);
    try {
      // Gọi API gửi kết quả (ví dụ: sendResult(selectedId))
      message.success("Đã gửi kết quả.");
      setOpenModal(false);
      setSelectedId(null);
      onComplete();
    } catch {
      message.error("Lỗi khi gửi kết quả.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const columns: ColumnsType<DeliveryOrder> = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      render: (id: string) => <span style={{ fontSize: 12 }}>#{id}</span>,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={statusColorMap[status]} style={{ fontSize: 12 }}>
          {statusTextMap[status] || status}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Button
          icon={<CheckOutlined />}
        //   disabled={record.status !== "KitReceived"}
          onClick={(e) => {
            e.stopPropagation();
            handleClickSendResult(record.id);
          }}
          className="px-2 py-1 text-xs text-white bg-purple-500 hover:bg-purple-600"
        >
          Gửi kết quả
        </Button>
      ),
    },
  ];

  return (
    <>
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
        locale={{ emptyText: "Không có đơn cần gửi kết quả." }}
      />

      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={handleConfirm}
        confirmLoading={confirmLoading}
        okText="Gửi"
        cancelText="Hủy"
        title="Xác nhận gửi kết quả"
      >
        <p>Bạn có chắc muốn gửi kết quả cho đơn #{selectedId}?</p>
      </Modal>
    </>
  );
};

export default ResultSent;

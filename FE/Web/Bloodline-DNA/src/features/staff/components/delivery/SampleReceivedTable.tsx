import { CheckOutlined } from "@ant-design/icons";
import { Button, Modal, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { updateTestBookingStatusStaff } from "../../api/deliveryApi";
import {
    statusColorMap,
    statusTextMap,
    type DeliveryOrder,
} from "../../types/delivery";

interface Props {
  data: DeliveryOrder[];
  onRowClick: (id: string) => void;
  onComplete: () => void;
}

const SampleReceived = ({ data, onRowClick, onComplete }: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleClickMarkReceived = (id: string) => {
    setSelectedId(id);
    setOpenModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedId) return;
    setConfirmLoading(true);

    // Lấy thông tin đơn hàng hiện tại từ props.data
    const currentOrder = data.find((item) => item.id === selectedId);
    const oldStatus = currentOrder?.status;

    try {
      const token = localStorage.getItem("token") || "";

      // Gọi API để cập nhật trạng thái
      await updateTestBookingStatusStaff(
        {
          bookingId: selectedId,
          status: "SampleReceived", // hoặc "SampleReceived"
        },
        token
      );

      console.log(
        `Đơn hàng ${selectedId}: Trạng thái thay đổi từ ${oldStatus} => SampleReceived`
      );

      message.success("Đã xác nhận nhận mẫu Kit.");
      setOpenModal(false);
      setSelectedId(null);
      onComplete();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      message.error("Lỗi khi xác nhận nhận mẫu Kit.");
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
      render: (text: string) => <span style={{ fontSize: 12 }}>{text}</span>,
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      render: (text: string) => <span style={{ fontSize: 12 }}>{text}</span>,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      render: (text: string) => <span style={{ fontSize: 12 }}>{text}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
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
          disabled={record.status !== "KitDelivered"}
          onClick={(e) => {
            e.stopPropagation();
            handleClickMarkReceived(record.id);
          }}
          className="px-2 py-1 text-xs text-white bg-blue-500 hover:bg-blue-600"
        >
          Đã nhận mẫu
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
        locale={{ emptyText: "Không có đơn nhận mẫu Kit nào." }}
      />
      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={handleConfirm}
        confirmLoading={confirmLoading}
        okText="Xác nhận"
        cancelText="Hủy"
        title="Xác nhận đã nhận mẫu Kit"
      >
        {selectedId && (
          <>
            <p>Bạn có chắc muốn xác nhận đã nhận mẫu từ đơn hàng sau?</p>
            <div className="p-3 mt-3 space-y-1 text-sm bg-gray-100 rounded">
              <div>
                <strong>Mã đơn:</strong> #{selectedId}
              </div>
              <div>
                <strong>Địa chỉ:</strong>{" "}
                {data.find((d) => d.id === selectedId)?.address || "N/A"}
              </div>
              <div>
                <strong>Số điện thoại:</strong>{" "}
                {data.find((d) => d.id === selectedId)?.phone || "N/A"}
              </div>
              <div>
                <strong>Ghi chú:</strong>{" "}
                {data.find((d) => d.id === selectedId)?.note || "Không có"}
              </div>
              <div>
                <strong>Trạng thái hiện tại:</strong>{" "}
                <Tag
                  color={
                    statusColorMap[
                      data.find((d) => d.id === selectedId)?.status || ""
                    ]
                  }
                >
                  {statusTextMap[
                    data.find((d) => d.id === selectedId)?.status || ""
                  ] || data.find((d) => d.id === selectedId)?.status}
                </Tag>
              </div>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default SampleReceived;

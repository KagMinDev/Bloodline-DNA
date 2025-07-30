import { CheckOutlined } from "@ant-design/icons";
import { Button, Modal, Select, Spin, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useState } from "react";
import { completeDelivery, getAssignedDeliveries } from "../../api/deliveryApi";
import {
  statusColorMap,
  statusTextMap,
  type DeliveryOrder,
} from "../../types/delivery";

const DeliveryTable = () => {
  const [data, setData] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const selectedOrder = data.find((item) => item.id === selectedId);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAssignedDeliveries();
      setData(result);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn giao Kit:", error);
      message.error("Không thể lấy danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleClickComplete = (id: string) => {
    setSelectedId(id);
  };

  const handleConfirmComplete = async () => {
    if (!selectedId) return;
    setConfirmLoading(true);
    try {
      await completeDelivery(selectedId);
      message.success(`Đã hoàn thành đơn hàng #${selectedId}`);
      setSelectedId(null);
      fetchData();
    } catch (error) {
      console.error("Lỗi hoàn thành đơn:", error);
      message.error("Không thể hoàn thành đơn hàng.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const filteredData =
    filterStatus === "All"
      ? data
      : data.filter((item) => item.status === filterStatus);

  const columns: ColumnsType<DeliveryOrder> = [
    {
      title: <span style={{ fontSize: "12px" }}>Mã đơn</span>,
      dataIndex: "id",
      key: "id",
      render: (id: string) => <span style={{ fontSize: "10px" }}>#{id}</span>,
    },
    {
      title: <span style={{ fontSize: "12px" }}>Địa chỉ</span>,
      dataIndex: "address",
      key: "address",
      render: (text: string) => (
        <span style={{ fontSize: "10px" }}>{text}</span>
      ),
    },
    {
      title: <span style={{ fontSize: "12px" }}>SĐT</span>,
      dataIndex: "phone",
      key: "phone",
      render: (text: string) => (
        <span style={{ fontSize: "10px" }}>{text}</span>
      ),
    },
    {
      title: <span style={{ fontSize: "10px" }}>Thời gian giao</span>,
      dataIndex: "scheduledAt",
      key: "scheduledAt",
      align: "center",
      render: (value: string) => (
        <span style={{ fontSize: "10px" }}>
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
      render: (text?: string) => {
        const cleaned = text?.trim().toLowerCase();
        return (
          <span style={{ fontSize: "10px" }}>
            {cleaned && cleaned !== "string" ? text : "Không có"}
          </span>
        );
      },
    },
    {
      title: <span style={{ fontSize: "12px" }}>Trạng thái</span>,
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: string) => (
        <Tag
          color={statusColorMap[status] || "default"}
          style={{ fontSize: "10px", padding: "2px 6px" }}
        >
          {statusTextMap[status] || status}
        </Tag>
      ),
    },
    {
      title: <span style={{ fontSize: "12px" }}>Hành động</span>,
      key: "actions",
      align: "center",
      render: (_, record) => {
        const canComplete = record.status === "DeliveringKit";

        return (
          <Button
            icon={<CheckOutlined />}
            size="small"
            disabled={!canComplete}
            onClick={(e) => {
              e.stopPropagation();
              handleClickComplete(record.id);
            }}
            className={`px-2 py-1 text-xs rounded ${
              canComplete
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            style={{ fontSize: 10 }}
          >
            Hoàn thành
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex flex-row items-center gap-3 mb-4">
        <div className="text-xs">Lọc trạng thái:</div>
        <Select
          value={filterStatus}
          onChange={setFilterStatus}
          style={{ width: 200, fontSize: 12 }}
          dropdownStyle={{ fontSize: 12 }}
          options={[
            {
              label: <span style={{ fontSize: 12 }}>Tất cả trạng thái</span>,
              value: "All",
            },
            {
              label: <span style={{ fontSize: 12 }}>Đang giao bộ Kit</span>,
              value: "DeliveringKit",
            },
            {
              label: <span style={{ fontSize: 12 }}>Đã nhận Kit</span>,
              value: "KitDelivered",
            },
          ]}
          size="small"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          rowKey="id"
          dataSource={filteredData.sort(
            (a, b) =>
              new Date(b.scheduledAt).getTime() -
              new Date(a.scheduledAt).getTime()
          )}
          columns={columns}
          pagination={{ pageSize: 6 }}
          onRow={(record) => ({
            onClick: () => console.log("Xem chi tiết:", record.id),
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
      )}

      <Modal
        open={!!selectedId}
        title="Xác nhận hoàn thành giao Kit"
        onOk={handleConfirmComplete}
        onCancel={() => setSelectedId(null)}
        confirmLoading={confirmLoading}
        okText="Hoàn thành"
        cancelText="Hủy"
      >
        {selectedOrder ? (
          <div className="space-y-2 text-sm">
            <p>
              Bạn có chắc chắn muốn đánh dấu đơn hàng{" "}
              <strong>#{selectedOrder.id}</strong> là đã giao Kit?
            </p>
            <div className="flex flex-col gap-5 p-3 mt-3 space-y-1 bg-gray-100 rounded">
              <div>
                <strong>Địa chỉ:</strong> {selectedOrder.address}
              </div>
              <div>
                <strong>Số điện thoại:</strong> {selectedOrder.phone}
              </div>
              <div>
                <strong>Ghi chú:</strong>{" "}
                {selectedOrder.note &&
                selectedOrder.note.trim().toLowerCase() !== "string"
                  ? selectedOrder.note
                  : "Không có"}
              </div>
              <div>
                <strong>Trạng thái:</strong>{" "}
                <Tag color={statusColorMap[selectedOrder.status]}>
                  {statusTextMap[selectedOrder.status] || selectedOrder.status}
                </Tag>
              </div>
            </div>
          </div>
        ) : (
          <p>Không tìm thấy thông tin đơn hàng.</p>
        )}
      </Modal>
    </>
  );
};

export default DeliveryTable;

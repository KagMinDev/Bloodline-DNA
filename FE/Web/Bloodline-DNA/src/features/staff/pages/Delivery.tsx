import { Select, Spin } from "antd";
import { useCallback, useEffect, useState } from "react";
import { getAssignedDeliveries } from "../api/deliveryApi";
import DeliveryTable from "../components/delivery/DeliveryTable";
import type { DeliveryOrder } from "../types/delivery";

const DeliveriesStaff = () => {
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const fetchDeliveries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAssignedDeliveries();
      setDeliveries(data);
    } catch (error) {
      console.error("Lỗi khi lấy đơn được phân công:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const handleRowClick = (id: string) => {
    setSelectedId(id);
    console.log("Click đơn:", id);
    setTimeout(() => setSelectedId(null), 500);
  };

  const filteredDeliveries =
    filterStatus === "All"
      ? deliveries
      : deliveries.filter((item) => item.status === filterStatus);

  return (
    <div className="min-h-screen p-6 bg-blue-50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-800">
          Danh sách đơn được phân công
        </h2>
        <div className="flex flex-row items-center self-center justify-center gap-3">
          <div className="text-sm">Tìm kiếm:</div>
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 200 }}
            options={[
              { label: "Tất cả trạng thái", value: "All" },
              { label: "Đang giao bộ Kit", value: "DeliveringKit" },
              { label: "Đã nhận Kit", value: "KitDelivered" },
            ]}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : (
        <DeliveryTable
          data={filteredDeliveries}
          onRowClick={handleRowClick}
          loadingId={selectedId}
          onComplete={fetchDeliveries}
        />
      )}
    </div>
  );
};

export default DeliveriesStaff;

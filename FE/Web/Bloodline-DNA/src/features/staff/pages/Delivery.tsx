import { Spin } from "antd";
import { useCallback, useEffect, useState } from "react";
import { getAssignedDeliveries } from "../api/deliveryApi";
import DeliveryTable from "../components/delivery/DeliveryTable";
import type { DeliveryOrder } from "../types/delivery";

const DeliveriesStaff = () => {
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
    setTimeout(() => setSelectedId(null), 500); // giả lập
  };

  return (
    <div className="min-h-screen p-6 bg-blue-50">
      <h2 className="mb-6 text-2xl font-bold text-blue-800">
        Danh sách đơn được phân công
      </h2>

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : (
        <DeliveryTable
          data={deliveries}
          onRowClick={handleRowClick}
          loadingId={selectedId}
        />
      )}
    </div>
  );
};

export default DeliveriesStaff;

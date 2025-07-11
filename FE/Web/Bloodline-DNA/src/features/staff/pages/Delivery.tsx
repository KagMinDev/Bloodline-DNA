import { Select, Spin, Tabs } from "antd";
import { useCallback, useEffect, useState } from "react";
import { getAssignedDeliveries } from "../api/deliveryApi";
import DeliveryTable from "../components/delivery/DeliveryTable";
import ResultSentTable from "../components/delivery/ResultSentTable";
import SampleReceivedTable from "../components/delivery/SampleReceivedTable";
import type { DeliveryOrder } from "../types/delivery";

const { TabPane } = Tabs;

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
    setTimeout(() => setSelectedId(null), 500);
  };

  const filteredDeliveries =
    filterStatus === "All"
      ? deliveries
      : deliveries.filter((item) => item.status === filterStatus);

  return (
    <div className="min-h-screen p-6 bg-blue-50">
      <h2 className="mb-6 text-2xl font-bold text-blue-800">
        Danh sách đơn được phân công
      </h2>

      <Tabs defaultActiveKey="1">
        {/* Tab 1: Giao Kit */}
        <TabPane tab="Giao Kit" key="1">
          <div className="flex flex-row items-center gap-3 mb-4">
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
        </TabPane>

        <TabPane tab="Nhận mẫu Kit" key="2">
          {loading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <Spin size="large" />
            </div>
          ) : (
            <SampleReceivedTable
              data={deliveries.filter((d) => d.status === "KitDelivered")}
              onRowClick={handleRowClick}
              onComplete={fetchDeliveries}
            />
          )}
        </TabPane>

        <TabPane tab="Gửi kết quả" key="3">
          {loading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <Spin size="large" />
            </div>
          ) : (
            <ResultSentTable
              data={deliveries.filter((d) => d.status === "KitReceived")}
              onRowClick={handleRowClick}
              onComplete={fetchDeliveries}
            />
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DeliveriesStaff;

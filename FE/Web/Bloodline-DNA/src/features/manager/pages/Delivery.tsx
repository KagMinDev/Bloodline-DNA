import { useCallback, useEffect, useState } from "react";
import { Loading } from "../../../components";
import type { DeliveryOrder, DeliveryStatus } from "../types/delivery";

// Mock data
const mockDeliveryOrders: DeliveryOrder[] = [
  {
    id: "1",
    staff: "Nguyễn Văn An",
    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    phone: "0901234567",
    scheduleAt: "2025-01-06T09:00:00Z",
    completeAt: null,
    note: "Chuẩn bị bộ Kit xét nghiệm cho khách hàng",
    status: "PreparingKit",
  },
  {
    id: "2",
    staff: "Trần Thị Bình",
    address: "456 Đường Nguyễn Trãi, Quận 5, TP.HCM",
    phone: "0912345678",
    scheduleAt: "2025-01-06T14:00:00Z",
    completeAt: null,
    note: "Đang giao bộ Kit đến địa chỉ khách hàng",
    status: "DeliveringKit",
  },
  {
    id: "3",
    staff: "Lê Minh Cường",
    address: "789 Đường Võ Văn Tần, Quận 3, TP.HCM",
    phone: "0923456789",
    scheduleAt: "2025-01-06T16:30:00Z",
    completeAt: "2025-01-06T16:15:00Z",
    note: "Khách hàng đã nhận bộ Kit thành công",
    status: "KitDelivered",
  },
  {
    id: "4",
    staff: "Phạm Thị Dung",
    address: "321 Đường Pasteur, Quận 1, TP.HCM",
    phone: "0934567890",
    scheduleAt: "2025-01-05T10:00:00Z",
    completeAt: null,
    note: "Đợi lịch hẹn đến lấy mẫu xét nghiệm",
    status: "WaitingForPickup",
  },
  {
    id: "5",
    staff: "Hoàng Văn Minh",
    address: "654 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM",
    phone: "0945678901",
    scheduleAt: "2025-01-07T11:00:00Z",
    completeAt: null,
    note: "Đang tiến hành lấy mẫu xét nghiệm",
    status: "PickingUpSample",
  },
  {
    id: "6",
    staff: "Nguyễn Thị Lan",
    address: "987 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
    phone: "0956789012",
    scheduleAt: "2025-01-05T15:00:00Z",
    completeAt: "2025-01-05T15:30:00Z",
    note: "Đã hoàn thành lấy mẫu, chuyển về phòng lab",
    status: "SampleReceived",
  },
  {
    id: "7",
    staff: "Võ Văn Tâm",
    address: "147 Đường Hai Bà Trưng, Quận 1, TP.HCM",
    phone: "0967890123",
    scheduleAt: "2025-01-04T08:00:00Z",
    completeAt: null,
    note: "Khách hàng hủy lịch hẹn, không thể liên lạc",
    status: "cancelled",
  },
];

// Component hiển thị từng đơn giao hàng
function DeliveryCard({ delivery }: { delivery: DeliveryOrder }) {
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: DeliveryStatus) => {
    switch (status) {
      case "PreparingKit":
        return "bg-orange-100 text-orange-800";
      case "DeliveringKit":
        return "bg-blue-100 text-blue-800";
      case "KitDelivered":
        return "bg-green-100 text-green-800";
      case "WaitingForPickup":
        return "bg-yellow-100 text-yellow-800";
      case "PickingUpSample":
        return "bg-purple-100 text-purple-800";
      case "SampleReceived":
        return "bg-emerald-100 text-emerald-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: DeliveryStatus) => {
    switch (status) {
      case "PreparingKit":
        return "Đang chuẩn bị bộ Kit";
      case "DeliveringKit":
        return "Đang giao bộ Kit";
      case "KitDelivered":
        return "Đã nhận Kit";
      case "WaitingForPickup":
        return "Đợi đến lấy mẫu";
      case "PickingUpSample":
        return "Đang lấy mẫu";
      case "SampleReceived":
        return "Đã nhận mẫu";
      case "cancelled":
        return "Huỷ giao hoặc lấy mẫu";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="p-6 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Đơn #{delivery.id}
          </h3>
          <p className="text-sm text-gray-600">Nhân viên: {delivery.staff}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            delivery.status
          )}`}
        >
          {getStatusText(delivery.status)}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
        <div>
          <h4 className="mb-2 font-medium text-gray-700">
            Thông tin giao hàng
          </h4>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-600">
                Địa chỉ:
              </span>
              <p className="text-sm text-gray-800">{delivery.address}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">
                Số điện thoại:
              </span>
              <p className="text-sm text-gray-800">{delivery.phone}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="mb-2 font-medium text-gray-700">Thời gian</h4>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-600">
                Thời gian giao:
              </span>
              <p className="text-sm text-gray-800">
                {formatDateTime(delivery.scheduleAt)}
              </p>
            </div>
            {delivery.completeAt && (
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Hoàn thành:
                </span>
                <p className="text-sm text-gray-800">
                  {formatDateTime(delivery.completeAt)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {delivery.note && (
        <div className="pt-4 border-t">
          <h4 className="mb-2 font-medium text-gray-700">Ghi chú</h4>
          <p className="p-3 text-sm text-gray-600 rounded-md bg-gray-50">
            {delivery.note}
          </p>
        </div>
      )}
    </div>
  );
}

// Component chính
function Delivery() {
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const token = localStorage.getItem("token") || "";

  const fetchDeliveries = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDeliveries(mockDeliveryOrders);
    } catch {
      setDeliveries([]);
    }
    setIsLoading(false);
  }, [token]);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const filteredDeliveries = deliveries.filter((delivery) => {
    if (filterStatus === "all") return true;
    return delivery.status === filterStatus;
  });

  const stats = {
    total: deliveries.length,
    preparingKit: deliveries.filter((d) => d.status === "PreparingKit").length,
    deliveringKit: deliveries.filter((d) => d.status === "DeliveringKit")
      .length,
    kitDelivered: deliveries.filter((d) => d.status === "KitDelivered").length,
    waitingForPickup: deliveries.filter((d) => d.status === "WaitingForPickup")
      .length,
    pickingUpSample: deliveries.filter((d) => d.status === "PickingUpSample")
      .length,
    sampleReceived: deliveries.filter((d) => d.status === "SampleReceived")
      .length,
    cancelled: deliveries.filter((d) => d.status === "cancelled").length,
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PreparingKit":
        return "Đang chuẩn bị bộ Kit";
      case "DeliveringKit":
        return "Đang giao bộ Kit";
      case "KitDelivered":
        return "Đã nhận Kit";
      case "WaitingForPickup":
        return "Đợi đến lấy mẫu";
      case "PickingUpSample":
        return "Đang lấy mẫu";
      case "SampleReceived":
        return "Đã nhận mẫu";
      case "cancelled":
        return "Huỷ giao hoặc lấy mẫu";
      default:
        return "Không xác định";
    }
  };

  return (
    <>
      <div className="relative flex flex-col items-center h-screen p-6 overflow-auto bg-blue-50">
        <div className="w-full mx-auto max-w-7xl">
          <h1 className="mb-6 text-2xl font-bold text-blue-800 md:text-3xl">
            Quản lý giao nhận đơn
          </h1>

          {/* Thống kê */}
          <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4 lg:grid-cols-8">
            <StatCard
              label="Tổng đơn"
              count={stats.total}
              color="text-blue-600"
            />
            <StatCard
              label="Chuẩn bị Kit"
              count={stats.preparingKit}
              color="text-orange-600"
            />
            <StatCard
              label="Giao Kit"
              count={stats.deliveringKit}
              color="text-blue-600"
            />
            <StatCard
              label="Đã nhận Kit"
              count={stats.kitDelivered}
              color="text-green-600"
            />
            <StatCard
              label="Đợi lấy mẫu"
              count={stats.waitingForPickup}
              color="text-yellow-600"
            />
            <StatCard
              label="Đang lấy mẫu"
              count={stats.pickingUpSample}
              color="text-purple-600"
            />
            <StatCard
              label="Đã nhận mẫu"
              count={stats.sampleReceived}
              color="text-emerald-600"
            />
            <StatCard
              label="Đã hủy"
              count={stats.cancelled}
              color="text-red-600"
            />
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { value: "all", label: "Tất cả" },
              { value: "PreparingKit", label: "Chuẩn bị Kit" },
              { value: "DeliveringKit", label: "Giao Kit" },
              { value: "KitDelivered", label: "Đã nhận Kit" },
              { value: "WaitingForPickup", label: "Đợi lấy mẫu" },
              { value: "PickingUpSample", label: "Đang lấy mẫu" },
              { value: "SampleReceived", label: "Đã nhận mẫu" },
              { value: "cancelled", label: "Đã hủy" },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilterStatus(value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === value
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Danh sách đơn */}
          {filteredDeliveries.length > 0 ? (
            <div className="space-y-4">
              {filteredDeliveries.map((delivery) => (
                <DeliveryCard key={delivery.id} delivery={delivery} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              {filterStatus === "all"
                ? "Không có đơn giao hàng nào để hiển thị."
                : `Không có đơn giao hàng nào với trạng thái "${getStatusText(
                    filterStatus
                  )}".`}
            </div>
          )}
        </div>
      </div>

      {isLoading && (
        <Loading message="Đang tải danh sách giao hàng..." fullScreen />
      )}
    </>
  );
}

// Thẻ thống kê nhỏ
function StatCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className={`text-2xl font-bold ${color}`}>{count}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

export default Delivery;

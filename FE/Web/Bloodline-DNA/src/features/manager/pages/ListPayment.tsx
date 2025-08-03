import React, { useEffect, useState } from "react";
import { Spin, message, Tag, Tooltip } from "antd";
import { getPaidPayments, type Payment,} from "../api/payment";
import {
  DollarOutlined,
  CalendarOutlined,
  MailOutlined,
  UserOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  InfoCircleOutlined,
} from "@ant-design/icons";

const PRIMARY_COLOR = "#1F2B6C";

const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleString("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    })
    : "Không rõ";

const formatCurrency = (amount?: number) =>
  amount?.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  }) ?? "0 ₫";

const getStatusTag = (status?: string) => {
  switch (status) {
    case "Paid":
      return (
        <Tag icon={<CheckCircleTwoTone twoToneColor="#52c41a" />} color="success">
          Đã thanh toán
        </Tag>
      );
    case "Failed":
      return (
        <Tag icon={<CloseCircleTwoTone twoToneColor="#ff4d4f" />} color="error">
          Thất bại
        </Tag>
      );
    case "Pending":
    default:
      return (
        <Tag color="warning">
          Chờ xử lý
        </Tag>
      );
  }
};

const getBookingStatusTag = (status?: string) => {
  if (!status) return null;
  const map: Record<string, string> = {
    DeliveringKit: "Đang giao bộ kit",
    SampleReceived: "Đã nhận mẫu",
    Testing: "Đang xét nghiệm",
    Completed: "Hoàn tất",
  };
  return <Tag color="processing">{map[status] ?? status}</Tag>;
};

const ListPayment: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getPaidPayments(token);
        setPayments(data);
      } catch (err: any) {
        console.error(err);
        message.error(err.message || "Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  return (
    <div className="min-h-screen p-8 bg-blue-50">
      <h1
        className="text-3xl font-extrabold mb-8 text-center tracking-tight drop-shadow-md"
        style={{ color: PRIMARY_COLOR }}
      >
        Danh Sách Giao Dịch Thanh Toán
      </h1>

      {loading ? (
        <div className="flex justify-center mt-20">
          <Spin size="large" />
        </div>
      ) : payments.length === 0 ? (
        <p className="text-center text-gray-500 mt-16 text-lg">
          Không có giao dịch nào.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-2xl border border-blue-200">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-[#dfe9f8] text-[#1F2B6C] text-xs font-semibold uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Mã đơn</th>
                <th className="px-4 py-3 text-left">Khách hàng</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Dịch vụ</th>
                <th className="px-4 py-3 text-left">Ngày hẹn</th>
                <th className="px-4 py-3 text-left">Tiền cọc</th>
                <th className="px-4 py-3 text-left">Còn lại</th>
                <th className="px-4 py-3 text-left">Tổng tiền</th>
                <th className="px-4 py-3 text-left">Lấy mẫu</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-left">Lịch hẹn</th>
                <th className="px-4 py-3 text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {payments.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-blue-100/40 transition duration-150 ease-in-out"
                >
                  <td className="px-4 py-3 font-medium text-[#1F2B6C]">
                    {p.orderCode}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <UserOutlined style={{ color: PRIMARY_COLOR }} />
                    {p.user?.fullName ?? "Không rõ"}
                  </td>
                  <td className="px-4 py-3">
                    <MailOutlined className="mr-1" style={{ color: PRIMARY_COLOR }} />
                    {p.user?.email ?? "Không rõ"}
                  </td>
                  <td className="px-4 py-3">
                   {p.booking?.testService?.name ?? "Không rõ"}
                  </td>
                  <td className="px-4 py-3">
                    <CalendarOutlined className="mr-1" style={{ color: PRIMARY_COLOR }} />
                    {formatDate(p.booking?.appointmentDate)}
                  </td>
                  <td className="px-4 py-3">{formatCurrency(p.depositAmount)}</td>
                  <td className="px-4 py-3">{formatCurrency(p.remainingAmount)}</td>
                  <td className="px-4 py-3 font-bold text-[#1F2B6C]">
                    <DollarOutlined className="mr-1" />
                    {formatCurrency(p.amount)}
                  </td>
                  <td className="px-4 py-3">
                    {p.booking?.collectionMethod === "SelfSample"
                      ? "Tại nhà"
                      : p.booking?.collectionMethod === "AtFacility"
                        ? "Tại phòng khám"
                        : "Không rõ"}
                  </td>

                  <td className="px-4 py-3">{getStatusTag(p.status)}</td>
                  <td className="px-4 py-3">{getBookingStatusTag(p.booking?.status)}</td>
                  <td className="px-4 py-3">
                    <Tooltip title={p.description || "Không có ghi chú"}>
                      <InfoCircleOutlined style={{ color: PRIMARY_COLOR }} />
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListPayment;

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Home } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Header, Footer } from "../../../components";
import { updateErrorStatusApi, updateSuccessStatusApi } from "../api/checkoutApi";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<{
    message: string;
    isSuccess: boolean;
    isLoading: boolean;
  }>({
    message: "",
    isSuccess: false,
    isLoading: true,
  });

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const queryOrderCode = query.get("orderCode");
    const queryAmount = query.get("amount");
    const queryBookingId = query.get("bookingId");

    setOrderCode(queryOrderCode);
    setAmount(queryAmount);
    setBookingId(queryBookingId);

    if (queryOrderCode && queryBookingId) {
      const updatePaymentStatus = async () => {
        try {
          // Kiểm tra nếu URL có thông báo lỗi
          if (query.get("status") === "error") {
            const errorResponse = await updateErrorStatusApi(
              queryOrderCode,
              "FAILED",
              queryBookingId
            );
            
            if (errorResponse.success) {
              setUpdateStatus({
                message: "Đã cập nhật trạng thái thanh toán thất bại",
                isSuccess: false,
                isLoading: false,
              });
            } else {
              throw new Error(errorResponse.error?.message || "Cập nhật trạng thái thất bại");
            }
          } else {
            // Xử lý thanh toán thành công
            const successResponse = await updateSuccessStatusApi(
              queryOrderCode,
              queryBookingId
            );

            if (successResponse.success) {
              setUpdateStatus({
                message: successResponse.message || "Cập nhật thanh toán thành công",
                isSuccess: true,
                isLoading: false,
              });
              
              // Xóa thông tin thanh toán tạm trong sessionStorage nếu có
              sessionStorage.removeItem("pendingPayment");
            } else {
              throw new Error(successResponse.error?.message || "Cập nhật trạng thái không thành công");
            }
          }
        } catch (error) {
          console.error("Error updating payment status:", error);
          setUpdateStatus({
            message: error instanceof Error ? error.message : "Lỗi hệ thống khi cập nhật thanh toán",
            isSuccess: false,
            isLoading: false,
          });
        }
      };

      updatePaymentStatus();
    } else {
      setUpdateStatus({
        message: "Thiếu thông tin đơn hàng hoặc booking",
        isSuccess: false,
        isLoading: false,
      });
    }
  }, [location.search]);

  const formatCurrency = (value: string | null) => {
    if (!value) return "N/A";
    const numberValue = parseInt(value, 10);
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numberValue);
  };

  // Hiển thị trạng thái loading khi đang xử lý
  if (updateStatus.isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-700">Đang xử lý thông tin thanh toán...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="w-full min-h-[60vh] py-10 px-4 flex items-center justify-center bg-blue-50">
          <div className="max-w-2xl mx-auto w-full">
            <div className="bg-white rounded-2xl shadow-2xl border-none">
              <div className="p-6 sm:p-8 text-center">
                {updateStatus.isSuccess ? (
                  <>
                    <div className="w-20 h-20 rounded-full bg-green-50 inline-flex items-center justify-center mb-4">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-teal-800 m-0">
                      Thanh toán thành công!
                    </h2>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-red-50 inline-flex items-center justify-center mb-4">
                      <CheckCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-red-800 m-0">
                      Thanh toán không thành công
                    </h2>
                  </>
                )}
              </div>

              <div className="px-6 sm:px-8 pb-8">
                <div
                  className={`p-4 sm:p-6 mb-6 rounded-xl space-y-4 ${
                    updateStatus.isSuccess ? "bg-green-50/50" : "bg-red-50/50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-slate-600">Mã đơn hàng:</p>
                    <p className="font-bold text-slate-800">{orderCode || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-slate-600">Trạng thái:</p>
                    <span
                      className={`${
                        updateStatus.isSuccess
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      } text-sm font-semibold px-3 py-1 rounded-full`}
                    >
                      {updateStatus.isSuccess ? "Đã thanh toán" : "Thanh toán thất bại"}
                    </span>
                  </div>
                  {amount && (
                    <div className="flex justify-between items-center">
                      <p className="text-slate-600">Số tiền:</p>
                      <p
                        className={`font-bold text-lg ${
                          updateStatus.isSuccess ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {formatCurrency(amount)}
                      </p>
                    </div>
                  )}
                  {bookingId && (
                    <div className="flex justify-between items-center">
                      <p className="text-slate-600">Mã booking:</p>
                      <p className="font-mono text-sm text-slate-700">{bookingId}</p>
                    </div>
                  )}
                </div>

                {updateStatus.message && (
                  <p
                    className={`text-center text-sm mb-6 ${
                      updateStatus.isSuccess ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {updateStatus.message}
                  </p>
                )}

                <div className="flex justify-center">
                  <Button
                    onClick={() => navigate("/Home")}
                    className={`h-11 px-6 text-base rounded-lg ${
                      updateStatus.isSuccess
                        ? "bg-teal-600 hover:bg-teal-700"
                        : "bg-red-600 hover:bg-red-700"
                    } text-white`}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Về trang chủ
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutSuccess;
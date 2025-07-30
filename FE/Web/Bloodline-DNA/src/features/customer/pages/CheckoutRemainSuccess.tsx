import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Home } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Header, Footer } from "../../../components";
import { callRemainingPaymentCallbackApi } from "../api/paymentApi";
import { getBookingByIdApi } from "../api/bookingListApi";

const CheckoutRemainSuccess = () => {
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

  // ✅ Hàm lấy bookingId từ localStorage
  const getBookingIdFromStorage = (): string | null => {
    const paymentDataStr = localStorage.getItem("paymentData");
    if (!paymentDataStr) return null;
    try {
      const paymentData = JSON.parse(paymentDataStr);
      return paymentData.bookingId || null;
    } catch (error) {
      console.error("Error parsing paymentData:", error);
      return null;
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const queryOrderCode = query.get("orderCode");
    const queryAmount = query.get("amount");
    const queryStatus = query.get("status")?.toUpperCase();

    setOrderCode(queryOrderCode);
    setAmount(queryAmount);

    const storedBookingId = getBookingIdFromStorage();
    if (storedBookingId) {
      setBookingId(storedBookingId);
    }

    const normalizedStatus = queryStatus === "PAID" ? "PAID" : "CANCELLED";

    console.log("CheckoutRemainSuccess mounted with:", {
      orderCode: queryOrderCode,
      amount: queryAmount,
      bookingId: storedBookingId,
      status: normalizedStatus,
      timestamp: new Date().toISOString(),
    });

    // 🔄 Luôn gọi hàm handleRemainingPaymentCallback, xử lý trường hợp thiếu data bên trong
    handleRemainingPaymentCallback(queryOrderCode, normalizedStatus, storedBookingId);
  }, [location.search]);

  const handleRemainingPaymentCallback = async (
    orderCode: string | null,
    status: string,
    bookingId: string | null
  ) => {
    try {
      // 🔍 Kiểm tra dữ liệu bắt buộc
      if (!orderCode || !bookingId) {
        setUpdateStatus({
          isLoading: false,
          isSuccess: false,
          message: "Thiếu thông tin thanh toán để xác nhận (orderCode hoặc bookingId).",
        });
        return;
      }

      // 🔄 Gọi callback API
      const callbackResult = await callRemainingPaymentCallbackApi({
        orderCode,
        status,
        bookingId,
      });

      console.log('📋 Callback result:', {
        success: callbackResult.success,
        status: callbackResult.status,
        error: callbackResult.error,
        timestamp: new Date().toISOString()
      });

      const normalizedStatus = status === "PAID" ? "PAID" : "CANCELLED";
      const isPaidStatus = normalizedStatus === "PAID";

      // 🎯 Kiểm tra kết quả callback trước
      if (callbackResult.success && isPaidStatus) {
        // 👉 Callback thành công và status là PAID, kiểm tra lại từ backend
        try {
          const bookingData = await getBookingByIdApi(bookingId);
          console.log('📦 Booking verification data:', bookingData);
          
          setUpdateStatus({
            isLoading: false,
            isSuccess: true,
            message: "Đã xác nhận thanh toán số tiền còn lại thành công.",
          });
        } catch (verifyError) {
          console.error('❌ Cannot verify booking status:', verifyError);
          // Dù không verify được, callback đã thành công nên vẫn coi là thành công
          setUpdateStatus({
            isLoading: false,
            isSuccess: true,
            message: "Thanh toán đã được xử lý thành công.",
          });
        }
      } else if (callbackResult.success && !isPaidStatus) {
        // Callback thành công nhưng status là CANCELLED
        setUpdateStatus({
          isLoading: false,
          isSuccess: false,
          message: "Thanh toán đã bị hủy.",
        });
      } else {
        // ❌ Callback thất bại
        setUpdateStatus({
          isLoading: false,
          isSuccess: false,
          message: callbackResult.error || "Lỗi khi xác nhận thanh toán còn lại.",
        });
      }

      // 🧹 Cleanup data sau khi xử lý
      localStorage.removeItem("paymentData");
    } catch (err) {
      console.error("❌ Remaining payment callback exception:", err);
      setUpdateStatus({
        isLoading: false,
        isSuccess: false,
        message: "Lỗi nghiêm trọng khi xác nhận thanh toán còn lại.",
      });
    }
  };

  const formatCurrency = (value: string | null) => {
    if (!value) return "N/A";
    const numberValue = parseInt(value, 10);
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numberValue);
  };

  if (updateStatus.isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-700">Đang xác nhận thanh toán còn lại...</p>
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
                      Thanh toán số tiền còn lại thành công!
                    </h2>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-red-50 inline-flex items-center justify-center mb-4">
                      <CheckCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-red-800 m-0">
                      Xác nhận thanh toán số tiền còn lại thất bại
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
                      {updateStatus.isSuccess ? "Đã thanh toán" : "Thất bại"}
                    </span>
                  </div>
                  {amount && (
                    <div className="flex justify-between items-center">
                      <p className="text-slate-600">Số tiền còn lại:</p>
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
                    onClick={() => navigate("/")}
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

export default CheckoutRemainSuccess; 
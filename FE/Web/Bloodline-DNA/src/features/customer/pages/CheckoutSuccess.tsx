import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Home } from "lucide-react";
import { Button } from "../components/ui/Button";
import { updateSuccessStatusApi } from "../api/checkoutApi";
import { Header, Footer } from "../../../components";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);
  const [updateMessage, setUpdateMessage] = useState<string>("");

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const queryOrderCode = query.get("orderCode");
    const queryAmount = query.get("amount");

    setOrderCode(queryOrderCode);
    setAmount(queryAmount);

    if (queryOrderCode) {
      const updatePaymentStatus = async () => {
        try {
          await updateSuccessStatusApi(queryOrderCode);
          setUpdateMessage("Cập nhật thanh toán thành công.");
        } catch (error) {
          console.error("Error updating payment status on success page:", error);
          setUpdateMessage("Lỗi khi cập nhật thanh toán.");
        }
      };

      updatePaymentStatus();
    }
  }, [location.search]);

  const formatCurrency = (value: string | null) => {
    if (!value) return "N/A";
    const numberValue = parseInt(value, 10);
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(numberValue);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div
          className="w-full min-h-[60vh] py-10 px-4 flex items-center justify-center bg-blue-50"
        >
          <div className="max-w-2xl mx-auto w-full">
            <div className="bg-white rounded-2xl shadow-2xl border-none">
              <div className="p-6 sm:p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-green-50 inline-flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-teal-800 m-0">Thanh toán thành công!</h2>
              </div>

              <div className="px-6 sm:px-8 pb-8">
                <div className="bg-green-50/50 p-4 sm:p-6 mb-6 rounded-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-slate-600">Mã đơn hàng:</p>
                    <p className="font-bold text-slate-800">{orderCode || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-slate-600">Trạng thái:</p>
                    <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                      Đã thanh toán
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-slate-600">Số tiền:</p>
                    <p className="font-bold text-green-600 text-lg">{formatCurrency(amount)}</p>
                  </div>
                </div>
                
                {updateMessage && <p className="text-center text-sm text-gray-600 mb-6">{updateMessage}</p>}

                <div className="flex justify-center">
                  <Button 
                    onClick={() => navigate("/Home")} 
                    className="h-11 px-6 text-base rounded-lg bg-teal-600 hover:bg-teal-700 text-white"
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
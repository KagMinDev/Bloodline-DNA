import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { XCircle, Home } from "lucide-react";
import { Button } from "../components/ui/Button";
import { updateErrorStatusApi } from "../api/checkoutApi";
import { Header, Footer } from "../../../components";

const CheckoutError = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [status, setStatus] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const queryStatus = query.get("status");
    const queryOrderCode = query.get("orderCode");
    const queryAmount = query.get("amount");

    setStatus(queryStatus);
    setOrderCode(queryOrderCode);
    setAmount(queryAmount);

    if (queryOrderCode && queryStatus) {
      const fetchCancel = async () => {
        try {
          await updateErrorStatusApi(queryOrderCode, queryStatus);
        } catch (error) {
          console.error("Error updating payment status on error page:", error);
        }
      };

      fetchCancel();
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
                <div className="w-20 h-20 rounded-full bg-red-50 inline-flex items-center justify-center mb-4">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-3xl font-bold text-red-800 m-0">Thanh toán thất bại!</h2>
              </div>

              <div className="px-6 sm:px-8 pb-8">
                <div className="bg-red-50/50 p-4 sm:p-6 mb-6 rounded-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-slate-600">Mã đơn hàng:</p>
                    <p className="font-bold text-slate-800">{orderCode || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-slate-600">Trạng thái:</p>
                    <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
                      Thất bại
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-slate-600">Số tiền:</p>
                    <p className="font-bold text-red-500 text-lg">{formatCurrency(amount)}</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button 
                    onClick={() => navigate("/Home")} 
                    className="h-11 px-6 text-base rounded-lg bg-red-500 hover:bg-red-600 text-white"
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

export default CheckoutError; 
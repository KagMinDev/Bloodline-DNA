import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { getBlogsApi } from "../api/blogsApi";
import { getFeedbacksApi } from "../api/feedbackApi";
import { getTestBookingApi } from "../../staff/api/testBookingApi";
import { getAuthToken } from "../../../apis/rootApi";
import type { BlogResponse } from "../types/blogs";
import type { FeedbackResponse } from "../types/feedback";

function Dashboard() {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
    filterType: "custom" as "custom" | "today" | "week" | "month" | "year"
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getAuthToken();
        if (!token) throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");

        const [blogsData, testsData, feedbacksData] = await Promise.all([
          getBlogsApi(),
          getTestBookingApi(),
          getFeedbacksApi(),
        ]);

        setBlogs(blogsData || []);
        setTests(testsData || []);
        setFeedbacks(feedbacksData || []);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDateRange = (type: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (type) {
      case "today": return { startDate: today.toISOString().split('T')[0], endDate: today.toISOString().split('T')[0] };
      case "week":
        const weekStart = new Date(today); weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6);
        return { startDate: weekStart.toISOString().split('T')[0], endDate: weekEnd.toISOString().split('T')[0] };
      case "month":
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { startDate: monthStart.toISOString().split('T')[0], endDate: monthEnd.toISOString().split('T')[0] };
      case "year":
        const yearStart = new Date(now.getFullYear(), 0, 1);
        const yearEnd = new Date(now.getFullYear(), 11, 31);
        return { startDate: yearStart.toISOString().split('T')[0], endDate: yearEnd.toISOString().split('T')[0] };
      default:
        return { startDate: "", endDate: "" };
    }
  };

  const handlePresetFilter = (type: string) => {
    const range = getDateRange(type);
    setDateFilter({ ...range, filterType: type as any });
  };

  const filterDataByDate = (data: any[], start: string, end: string) => {
    if (!start && !end) return data;
    return data.filter(item => {
      const date = new Date(item.createdAt || item.appointmentDate);
      const s = start ? new Date(start) : new Date("1900-01-01");
      const e = end ? new Date(end) : new Date("2100-12-31");
      return date >= s && date <= e;
    });
  };

  const formatChartData = () => {
    const blogsData = filterDataByDate(blogs, dateFilter.startDate, dateFilter.endDate);
    const testsData = filterDataByDate(tests, dateFilter.startDate, dateFilter.endDate);
    const feedbacksData = filterDataByDate(feedbacks, dateFilter.startDate, dateFilter.endDate);

    const countByDate = (data: any[], field = "createdAt") => {
      const result: Record<string, number> = {};
      data.forEach(item => {
        const date = new Date(item[field]).toLocaleDateString();
        result[date] = (result[date] || 0) + 1;
      });
      return result;
    };

    const blogMap = countByDate(blogsData);
    const testMap = countByDate(testsData);
    const feedbackMap = countByDate(feedbacksData);
    const allDates = Array.from(new Set([...Object.keys(blogMap), ...Object.keys(testMap), ...Object.keys(feedbackMap)])).sort();

    return allDates.map(date => ({
      date,
      "Bài viết": blogMap[date] || 0,
      "Lịch xét nghiệm": testMap[date] || 0,
      "Phản hồi": feedbackMap[date] || 0,
    }));
  };

  return (
    <div className="p-6 overflow-auto min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-800 mb-6"> Thống kê tổng quan</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        <CardStat title="Bài viết" count={filterDataByDate(blogs, dateFilter.startDate, dateFilter.endDate).length} color="blue" />
        <CardStat title="Lịch xét nghiệm" count={filterDataByDate(tests, dateFilter.startDate, dateFilter.endDate).length} color="green" />
        <CardStat title="Phản hồi" count={filterDataByDate(feedbacks, dateFilter.startDate, dateFilter.endDate).length} color="orange" />
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700"></h2>
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            {[
              { key: "today", label: "Hôm nay" },
              { key: "week", label: "Tuần này" },
              { key: "month", label: "Tháng này" },
              { key: "year", label: "Năm nay" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handlePresetFilter(key)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition duration-200 ${
                  dateFilter.filterType === key
                    ? "bg-blue-400 text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <h3 className="text-lg font-medium text-gray-800 mb-4">📈 Hoạt động theo thời gian</h3>
        <ResponsiveContainer width="100%" height={430}>
          <LineChart data={formatChartData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Bài viết" stroke="#2563eb" strokeWidth={2} />
            <Line type="monotone" dataKey="Lịch xét nghiệm" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="Phản hồi" stroke="#f97316" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CardStat({ title, count, color }: { title: string; count: number; color: string }) {
  const colorMap: Record<string, string> = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    orange: "text-orange-600 bg-orange-100"
  };
  return (
    <div className={`rounded-2xl shadow-md p-6 flex flex-col items-center justify-center ${colorMap[color]}`}>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-extrabold">{count}</p>
    </div>
  );
}

export default Dashboard;

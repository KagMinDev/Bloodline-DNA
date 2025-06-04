import { Route, Routes } from "react-router-dom";
import { NotFound } from "../components";
import { DashboardManager } from "../features";
import Sidebar from "../features/manager/components/Sidebar";

export default function ManagerRouter() {
    return (
        <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">
            <Routes>
            <Route path="/" element={<DashboardManager />} />
            <Route path="manager-dashboard" element={<DashboardManager />} />

            {/* Not found */}
            <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
        </div>
    );
}

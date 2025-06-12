import { Route, Routes } from "react-router-dom";
import { NotFound } from "../components";
import Sidebar from "../features/manager/components/Sidebar";
import { Service } from "../features";
import Blogs from "../features/manager/pages/Blogs";

export default function ManagerRouter() {
    return (
        <div className="flex min-h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
            <Routes>
            <Route path="/" element={<Service />} />
            <Route path="service" element={<Service />} />
            <Route path="blogs" element={<Blogs />} />

            {/* Not found */}
            <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
        </div>
    );
}

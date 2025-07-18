import { Route, Routes } from "react-router-dom";
import { NotFound } from "../components";
import Sidebar from "../features/manager/components/Sidebar";
import BlogsManager from "../features/manager/pages/Blogs";
import Dashboard from "../features/manager/pages/Dashboard";
import Delivery from "../features/manager/pages/Delivery";
import Feedbacks from "../features/manager/pages/Feedbacks";
import Tags from "../features/manager/pages/Tags";
import TestManagement from "../features/manager/pages/TestManagement";

export default function ManagerRouter() {
    return (
        <div className="flex min-h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-y-auto">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="blogs" element={<BlogsManager />} />
                    <Route path="tags" element={<Tags />} />
                    <Route path="test-management" element={<TestManagement />} />
                    <Route path="delivery" element={<Delivery />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="feedback" element={<Feedbacks />} />

                    {/* Not found */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
}

import { Route, Routes } from "react-router-dom";
import { NotFound } from "../components";
import Sidebar from "../features/manager/components/Sidebar";
import Blogs from "../features/manager/pages/Blogs";
import TestManagement from "../features/manager/pages/TestManagement";
import Dashboard from "../features/manager/pages/Dashboard";
import Feedbacks from "../features/manager/pages/Feedbacks";
import Tags from "../features/manager/pages/Tags";

export default function ManagerRouter() {
    return (
        <div className="flex min-h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-y-auto">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="blogs" element={<Blogs />} />
                    <Route path="tags" element={<Tags />} />
                    <Route path="test-management" element={<TestManagement />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="feedback" element={<Feedbacks />} />

                    {/* Not found */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
}

import { Route, Routes } from "react-router-dom";
import { NotFound } from "../components";
import Sidebar from "../features/manager/components/Sidebar";
import Blogs from "../features/manager/pages/Blogs";
import TestManagement from "../features/manager/pages/TestManagement";


export default function ManagerRouter() {
    return (
        <div className="flex min-h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
            <Routes>
            <Route path="/" element={<TestManagement />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="test-management" element={<TestManagement />} />


            {/* Not found */}
            <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
        </div>
    );
}

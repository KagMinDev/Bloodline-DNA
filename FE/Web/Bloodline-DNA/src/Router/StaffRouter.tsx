import { Route, Routes } from 'react-router-dom';
import Dashboard from '../features/staff/pages/Dashboard';
import Sidebar from '../features/staff/components/Sidebar';

export default function StaffRouter() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="*" element={<h1>404</h1>} />
                </Routes>
            </div>
        </div>
    );
}

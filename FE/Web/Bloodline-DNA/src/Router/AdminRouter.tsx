import { Route, Routes } from 'react-router-dom';
import { NotFound } from '../components';
import Sidebar from '../features/admin/components/Sidebar';
import UserMangement from '../features/admin/pages/UserMangement';
import Dashboard from '../features/admin/pages/Dashboard';

export default function AdminRouter() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1">
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/users" element={<UserMangement />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
}

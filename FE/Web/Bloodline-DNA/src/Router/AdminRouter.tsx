import { Route, Routes } from 'react-router-dom';
import { NotFound } from '../components';
import { DashboardAdmin, UserManager } from '../features';
import Sidebar from '../features/admin/components/Sidebar';

export default function AdminRouter() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1">
                <Routes>
                    <Route path="/" element={<DashboardAdmin />} />
                    <Route path="/users" element={<UserManager />} />

                    {/* Not found */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
}

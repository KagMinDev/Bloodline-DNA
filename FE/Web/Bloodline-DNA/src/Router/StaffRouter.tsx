import { Route, Routes } from 'react-router-dom';
import { NotFound } from '../components';
import Sidebar from '../features/staff/components/Sidebar';
import CollectTest from '../features/staff/pages/CollectTest';
import Ordertest from '../features/staff/pages/Ordertest';
import TestHistory from '../features/staff/pages/TestHistory';

export default function StaffRouter() {
    return (
        <div className="flex min-h-screen bg-[#FCFEFE]">
            <Sidebar />
            <div className="flex-1">
                <Routes>
                    <Route path="/" element={<Ordertest />} />
                    <Route path="ordertest" element={<Ordertest />} />
                    <Route path="collectTest" element={<CollectTest />} />
                    <Route path="testhistory" element={<TestHistory />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
}

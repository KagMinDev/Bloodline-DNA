import { Route, Routes } from 'react-router-dom';
import { NotFound } from '../components';
import Sidebar from '../features/staff/components/Sidebar';
import TestBookingManagement from '../features/staff/pages/TestBookingManagement';
import SampleManagement from '../features/staff/pages/SampleManagement';
import TestResult from '../features/staff/pages/TestResult';

export default function StaffRouter() {
    return (
        <div className="flex min-h-screen bg-[#FCFEFE] overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-y-auto">
                <Routes>
                    <Route path="/" element={<SampleManagement />} />
                    <Route path="samplemanagement" element={<SampleManagement />} />
                    <Route path="testbookingmanagement" element={<TestBookingManagement />} />
                    <Route path="testresult" element={<TestResult />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
}

import { Route, Routes } from 'react-router-dom';

import { NotFound } from '../components';
import AboutPage from '../features/about/pages/AboutPage';
import HomePage from '../features/home/pages/HomePage';
import { Blogs, BookingDetail, BookingList, Contacts, DetailServices, Doctors, EditBooking, EditProfile, Services, TestProgress } from '../features/customer';

export default function CustomerRouter() {
    return (


        <div className="flex-1">
            <Routes>
                <Route path="/" element={<HomePage />} /> {/* 👈 route homepage trong customer */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:id" element={<DetailServices />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/booking-detail" element={<BookingDetail />} />
                <Route path="/test-progress" element={<TestProgress />} />
                <Route path="/edit-booking" element={<EditBooking />} />
                <Route path="/booking-list" element={<BookingList />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                {/* Not found */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>

    );
}
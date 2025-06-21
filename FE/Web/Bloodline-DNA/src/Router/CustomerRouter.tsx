import { Route, Routes } from 'react-router-dom';

import { NotFound } from '../components';
import AboutPage from '../features/about/pages/AboutPage';
import HomePage from '../features/home/pages/HomePage';
import { Blogs } from '../features/customer/pages/Blogs';
import { BookingDetail } from '../features/customer/pages/BookingDetail';
import { BookingList } from '../features/customer/pages/BookingList';
import { Contacts } from '../features/customer/pages/Contacts';
import { DetailServices } from '../features/customer/pages/DetailServices';
import { Doctors } from '../features/customer/pages/Doctors';
import { EditBooking } from '../features/customer/pages/EditBooking';
import { EditProfile } from '../features/customer/pages/EditProfile';
import { Services } from '../features/customer/pages/Services';
import { TestProgress } from '../features/customer/pages/TestProgress';

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
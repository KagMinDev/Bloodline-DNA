import { Route, Routes } from 'react-router-dom';

import { NotFound } from '../components';
import AboutPage from '../features/about/pages/AboutPage';
import HomePage from '../features/home/pages/HomePage';
import { Blogs } from '../features/services/pages/Blogs';
import { BookingDetail } from '../features/services/pages/BookingDetail';
import { BookingList } from '../features/services/pages/BookingList';
import { Contacts } from '../features/services/pages/Contacts';
import { DetailServices } from '../features/services/pages/DetailServices';
import { Doctors } from '../features/services/pages/Doctors';
import { EditBooking } from '../features/services/pages/EditBooking';
import { EditProfile } from '../features/services/pages/EditProfile';
import { Services } from '../features/services/pages/Services';
import { TestProgress } from '../features/services/pages/TestProgress';

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
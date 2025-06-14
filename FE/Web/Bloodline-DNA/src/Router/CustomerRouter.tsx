import { Route, Routes } from 'react-router-dom';
import { NotFound } from '../components';

import { BookingDetail } from '../features/services/pages/BookingDetail';
import { EditProfile } from '../features/services/pages/EditProfile';
import { BookingList } from '../features/services/pages/BookingList';
import { BookingModal } from '../features/services/components/BookingModal';
import { TestProgress } from '../features/services/pages/TestProgress';
import { EditBooking } from '../features/services/pages/EditBooking';
import { Services } from '../features/services/pages/Services';
import { DetailServices } from '../features/services/pages/DetailServices';
import { Doctors } from '../features/services/pages/Doctors';
import { Contacts } from '../features/services/pages/Contacts';
import { Blogs } from '../features/services/pages/Blogs';

export default function CustomerRouter() {
    return (


        <div className="flex-1">
            <Routes>
                <Route path="/services" element={<Services />} />
                <Route path="/services/:id" element={<DetailServices />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/booking-modal" element={<BookingModal isOpen={true} onClose={() => { }} onSubmit={() => { }} />} />
                <Route path="/booking-detail" element={<BookingDetail />} />
                <Route path="/test-progress" element={<TestProgress />} />
                <Route path="/edit-booking" element={<EditBooking />} />
                <Route path="/booking-list" element={<BookingList />} />
                <Route path="/edit-profile" element={<EditProfile />} />
            </Routes>
        </div>

    );
}
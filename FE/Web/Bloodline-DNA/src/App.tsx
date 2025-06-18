import AppRouter from './Router/AppRouter';
import { BrowserRouter } from 'react-router-dom';
import { BookingModalProvider } from './features/services/components/BookingModalContext';
import { BookingModal } from './features/services/components/BookingModal';
import { useBookingModal } from './features/services/components/BookingModalContext';
import ChatbotAI from './features/chatbotAI/components/ChatbotAI';

function App() {
  return (
    <BrowserRouter>
      <BookingModalProvider>
        <MainContent />
      </BookingModalProvider>
    </BrowserRouter>
  );
}

function MainContent() {
  const { isBookingModalOpen, closeBookingModal } = useBookingModal();

  return (
    <>
      <AppRouter />
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={closeBookingModal}
        onSubmit={() => {
          // Handle submission logic here
          closeBookingModal();
        }}
      />
      <div className="fixed bottom-0 right-0 p-4 z-50">
        <ChatbotAI />
      </div>
    </>
  );
}

export default App;
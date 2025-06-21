import React, { createContext, useState, useContext, type ReactNode } from 'react';

interface BookingModalContextType {
  isBookingModalOpen: boolean;
  openBookingModal: () => void;
  closeBookingModal: () => void;
}

const BookingModalContext = createContext<BookingModalContextType | undefined>(undefined);

export const useBookingModal = () => {
  const context = useContext(BookingModalContext);
  if (!context) {
    throw new Error('useBookingModal must be used within a BookingModalProvider');
  }
  return context;
};

interface BookingModalProviderProps {
  children: ReactNode;
}

export const BookingModalProvider: React.FC<BookingModalProviderProps> = ({ children }) => {
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);

  const openBookingModal = () => setBookingModalOpen(true);
  const closeBookingModal = () => setBookingModalOpen(false);

  return (
    <BookingModalContext.Provider value={{ isBookingModalOpen, openBookingModal, closeBookingModal }}>
      {children}
    </BookingModalContext.Provider>
  );
}; 
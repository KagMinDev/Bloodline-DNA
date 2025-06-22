'use client';
import React, { useState, useEffect, useRef } from 'react';
import { formatDate, type DateSelectArg } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import viLocale from '@fullcalendar/core/locales/vi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateTestBookingStatusApi } from '../../api/testBookingApi';
import BookingListPanel from '../booking/common/BookingListPanel';
import BookingTable from '../booking/common/BookingTable';
import { STATUS_MAPPING, type StatusOption } from '../booking/constants/statusMapping';
import type { CalendarProps, TestBookingResponse, TestBookingStatusRequest } from '../../types/testBooking';
import { getValidDate, renderCollectionMethod } from '../booking/utils/statusUtils';

interface CalendarExtendedProps extends CalendarProps {
  token: string;
}

const Calendar: React.FC<CalendarExtendedProps> = ({ events, onUpdateStatus, bookingsByDate, token }) => {
  console.log('Initial props:', { events: events.map(e => ({ id: e.id, bookingDate: e.bookingDate })) });

  const today = formatDate(new Date(), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    locale: 'en-US',
  }).replace(/\//g, '-'); // Định dạng YYYY-MM-DD

  const [selectedDay, setSelectedDay] = useState<string>(today);
  const [localEvents, setLocalEvents] = useState<TestBookingResponse[]>([]);
  const [statusOptions] = useState<StatusOption[]>(STATUS_MAPPING);
  const [selectedStatuses, setSelectedStatuses] = useState<Record<string, string>>({});
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    console.log('Events from API:', events.map(e => ({ id: e.id, bookingDate: e.bookingDate })));
    setLocalEvents(events);
    setSelectedDay(today);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(new Date());
      calendarApi.select(new Date());
    }
  }, [events]);

  useEffect(() => {
    const checkDate = () => {
      const currentDate = formatDate(new Date(), {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        locale: 'en-US',
      }).replace(/\//g, '-');
      if (currentDate !== selectedDay) {
        setSelectedDay(currentDate);
        if (calendarRef.current) {
          const calendarApi = calendarRef.current.getApi();
          calendarApi.gotoDate(new Date());
          calendarApi.select(new Date());
        }
      }
    };
    const interval = setInterval(checkDate, 60000);
    return () => clearInterval(interval);
  }, [selectedDay]);

  const calendarEvents = localEvents.map((booking) => ({
    id: booking.id,
    start: getValidDate(booking.bookingDate),
    title: booking.email || 'Không có email',
    extendedProps: {
      status: booking.status,
      collectionMethod: booking.collectionMethod,
    },
  }));

  console.log('Current selectedDay:', selectedDay);
  const filteredBookings = localEvents.filter((booking) => {
    if (!selectedDay) return false;
    const bookingDate = getValidDate(booking.bookingDate);
    const formattedBookingDate = formatDate(bookingDate, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      locale: 'en-US',
    }).replace(/\//g, '-');
    console.log('Booking ID:', booking.id, 'Booking Date:', formattedBookingDate, 'Selected Day:', selectedDay);
    return formattedBookingDate === selectedDay;
  });

  console.log('Filtered bookings:', filteredBookings);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const selectedDate = formatDate(selectInfo.start, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      locale: 'en-US',
    }).replace(/\//g, '-');
    console.log('Selected date:', selectedDate);
    setSelectedDay(selectedDate);
  };

  const handleUpdateStatus = async (bookingId: string) => {
    const selectedStatusLabel = selectedStatuses[bookingId];
    const statusOption = STATUS_MAPPING.find((option) => option.label === selectedStatusLabel);

    if (!statusOption) {
      console.error(`Invalid status label: ${selectedStatusLabel}`);
      toast.error('Trạng thái không hợp lệ');
      return;
    }

    if (!token) {
      console.error('No authentication token provided');
      toast.error('Thiếu token xác thực');
      return;
    }

    const originalBooking = localEvents.find((booking) => booking.id === bookingId);
    if (!originalBooking) {
      console.error(`Booking not found: ${bookingId}`);
      toast.error('Không tìm thấy đặt lịch');
      return;
    }

    try {
      const request: TestBookingStatusRequest = {
        bookingId,
        status: statusOption.value,
      };

      setLocalEvents((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: statusOption.value.toString() } : booking
        )
      );

      const updatedBooking = await updateTestBookingStatusApi(request, token);
      console.log('API Response:', updatedBooking);

      setLocalEvents((prev) =>
        prev.map((booking) => (booking.id === bookingId ? updatedBooking : booking))
      );

      setSelectedStatuses((prev) => {
        const newStatuses = { ...prev };
        delete newStatuses[bookingId];
        return newStatuses;
      });

      if (onUpdateStatus) {
        onUpdateStatus(updatedBooking);
      }

      toast.success(`Đã cập nhật trạng thái thành ${selectedStatusLabel}`);
    } catch (error) {
      console.error('Error updating status:', error);
      setLocalEvents((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: originalBooking.status } : booking
        )
      );
      toast.error('Cập nhật trạng thái thất bại');
    }
  };

  return (
    <div className="relative flex h-full w-full items-start justify-start px-10 py-10 bg-blue-50">
      <ToastContainer />
      <div className="mr-2 h-full w-2/3 flex flex-col rounded-lg bg-white p-5 shadow-lg">
        <div className="mb-6">
          <FullCalendar
            ref={calendarRef}
            height={400}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
            }}
            initialDate={new Date()}
            editable={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateSelect}
            events={calendarEvents}
            locale={viLocale}
            eventContent={(eventInfo) => (
              <div className="custom-event h-fit w-fit">
                <div className="event-title font-semibold text-blue-600 truncate">
                  {eventInfo.event.title}
                </div>
                <div className="event-time text-xs">
                  {renderCollectionMethod(eventInfo.event.extendedProps.collectionMethod)}
                </div>
              </div>
            )}
            dayCellContent={(dayInfo) => {
              const formattedDate = formatDate(dayInfo.date, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                locale: 'en-US',
              }).replace(/\//g, '-');
              const bookingCount = bookingsByDate ? bookingsByDate[formattedDate] || 0 : 0;
              return (
                <div className="relative">
                  <div>{dayInfo.dayNumberText}</div>
                  {bookingCount > 0 && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {bookingCount}
                    </div>
                  )}
                </div>
              );
            }}
            dayCellClassNames={({ date }) => {
              const formattedDate = formatDate(date, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                locale: 'en-US',
              }).replace(/\//g, '-');

              if (formattedDate === today) {
                return 'bg-blue-200';
              }
              if (formattedDate === selectedDay) {
                return 'bg-orange-200 text-orange-400';
              }
              return localEvents.some((booking) => {
                const bookingDate = getValidDate(booking.bookingDate);
                return formatDate(bookingDate, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  locale: 'en-US',
                }).replace(/\//g, '-') === formattedDate;
              })
                ? 'bg-blue-50 text-blue-700'
                : '';
            }}
          />
        </div>
        <BookingTable
          selectedDay={selectedDay}
          filteredBookings={filteredBookings}
          selectedStatuses={selectedStatuses}
          statusOptions={statusOptions}
          setSelectedStatuses={setSelectedStatuses}
          handleUpdateStatus={handleUpdateStatus}
        />
      </div>
      <div className="ml-8 flex h-full w-1/3 flex-col rounded-lg bg-white shadow-lg">
        <BookingListPanel
          selectedDay={selectedDay}
          bookings={filteredBookings}
          selectedStatuses={selectedStatuses}
          statusOptions={statusOptions.map((option) => option.label)}
          setSelectedStatus={(bookingId: string, value: string) =>
            setSelectedStatuses((prev) => ({
              ...prev,
              [bookingId]: value,
            }))
          }
          handleUpdateStatus={handleUpdateStatus}
        />
      </div>
    </div>
  );
};

export default Calendar;
import React, { useState, useEffect } from 'react';
import { formatDate, type DateSelectArg } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import viLocale from '@fullcalendar/core/locales/vi';
import { BsCalendarXFill } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import type { TestBookingResponse, TestBookingStatusRequest } from '../../types/testBooking';
import { updateTestBookingStatusApi } from '../../api/testBookingApi';
import 'react-toastify/dist/ReactToastify.css';
import StatusSelect from '../booking/common/StatusSelect';
import BookingListPanel from '../booking/common/BookingListPanel';
import { FaCheck } from 'react-icons/fa';
import { STATUS_MAPPING } from '../booking/utils/statusmapping';

interface StatusOption {
  label: string;
  value: number;
}

interface CalendarProps {
  bookingsByDate?: Record<string, number>;
  events: TestBookingResponse[];
  onUpdateStatus?: (updatedBooking: TestBookingResponse) => void;
}

const Calendar: React.FC<CalendarProps> = ({ events, onUpdateStatus, bookingsByDate }) => {
  console.log('Initial props:', { events, bookingsByDate });

  const today = formatDate(new Date(), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const [selectedDay, setSelectedDay] = useState<string>(today);
  const [localEvents, setLocalEvents] = useState<TestBookingResponse[]>([]);
  const [statusOptions] = useState<StatusOption[]>(STATUS_MAPPING);
  const [selectedStatuses, setSelectedStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    console.log('Events from API:', events); // Debug API data
    setLocalEvents(events);
    setSelectedDay(today);
  }, [events]);

  const getValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear() <= 1 ? new Date() : date;
  };

  const calendarEvents = localEvents.map((booking) => ({
    id: booking.id,
    start: getValidDate(booking.bookingDate),
    title: booking.email || 'Không có email',
    extendedProps: {
      status: booking.status,
      collectionMethod: booking.collectionMethod,
    },
  }));

  const filteredBookings = localEvents.filter((booking) => {
    if (!selectedDay) return false;

    const bookingDate = getValidDate(booking.bookingDate);
    const formattedBookingDate = formatDate(bookingDate, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    return formattedBookingDate === selectedDay;
  });

  console.log('Filtered bookings:', filteredBookings);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const selectedDate = formatDate(selectInfo.start, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    console.log('Selected date:', selectedDate);
    setSelectedDay(selectedDate);
  };

  const handleUpdateStatus = async (bookingId: string) => {
    const selectedStatusLabel = selectedStatuses[bookingId];
    if (!selectedStatusLabel) {
      toast.error('Vui lòng chọn trạng thái');
      return;
    }

    const token = localStorage.getItem('token') || '';
    if (!token) {
      toast.error('Không tìm thấy token, vui lòng đăng nhập lại');
      return;
    }

    const selectedStatusOption = statusOptions.find(
      (option) => option.label === selectedStatusLabel
    );
    if (!selectedStatusOption) {
      toast.error('Trạng thái không hợp lệ');
      return;
    }

    const request: TestBookingStatusRequest = {
      bookingId,
      status: selectedStatusOption.value,
    };

    try {
      const updatedBooking = await updateTestBookingStatusApi(request, token);
      console.log('API Response:', updatedBooking); // Debug API response
      setLocalEvents((prevEvents) =>
        prevEvents.map((event) => (event.id === bookingId ? updatedBooking : event))
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
      toast.error('Cập nhật trạng thái thất bại');
    }
  };

  const statusToNumber = (status: string | number): number => {
    if (typeof status === 'number') {
      return status; // Return as-is if already a number
    }
    // Map API string statuses to numeric values
    const statusMap: Record<string, number> = {
      Pending: 0, // Chờ xử lý
      SentKit: 1, // Đã gửi kit
      Confirmed: 2, // Đã xác nhận
      Completed: 3, // Đã hoàn tất
      Cancelled: 4, // Đã huỷ
      SampleReceived: 5, // Đã nhận mẫu
      Testing: 6, // Đang xét nghiệm
    };
    return statusMap[status] !== undefined ? statusMap[status] : -1; // Fallback to -1 for unknown statuses
  };

  const getStatusLabel = (statusValue: string | number) => {
    const numericValue = typeof statusValue === 'number' ? statusValue : statusToNumber(statusValue);
    const status = STATUS_MAPPING.find((item: any) => item.value === numericValue);
    return status ? status.label : 'Không xác định';
  };

  const renderCollectionMethod = (method: string) => {
    if (!method) return 'Chưa xác định';
    if (['Tự lấy mẫu', 'Tại Cơ sở'].includes(method)) {
      return method;
    }
    switch (method) {
      case 'SelfSample':
        return 'Tự lấy mẫu';
      case 'AtFacility':
        return 'Tại Cơ sở';
      default:
        return method;
    }
  };

  return (
    <div className="relative flex h-full w-full items-start justify-start px-10 py-10 bg-blue-50">
      <ToastContainer />
      <div className="mr-2 h-full w-2/3 flex flex-col rounded-lg bg-white p-5 shadow-lg">
        <div className="mb-6">
          <FullCalendar
            height={400}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
            }}
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
              });
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
              });

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
                }) === formattedDate;
              })
                ? 'bg-blue-50 text-blue-700'
                : '';
            }}
          />
        </div>
        <div className="flex-1 overflow-auto">
          <div className="mb-2 border-b-2 border-blue-600 pb-1 text-base font-semibold text-blue-600">
            Lịch hẹn trong ngày {selectedDay}
          </div>
          {filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center text-center italic py-8">
              <BsCalendarXFill className="text-6xl text-gray-200 mb-4" />
              <div className="mt-2 text-gray-400">Không có lịch hẹn</div>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50 text-blue-700">
                  <th className="py-2 px-2 text-left">Khách hàng</th>
                  <th className="py-2 px-2 text-left">Giờ</th>
                  <th className="py-2 px-2 text-left">Phương thức</th>
                  <th className="py-2 px-2 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => {
                  const currentStatusLabel = getStatusLabel(booking.status);
                  return (
                    <tr key={booking.id} className="border-b">
                      <td className="py-1 px-2">{booking.email || 'Không có email'}</td>
                      <td className="py-1 px-2">
                        {new Date(getValidDate(booking.bookingDate)).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-1 px-2">{renderCollectionMethod(booking.collectionMethod)}</td>
                      <td className="py-1 px-2 flex items-center gap-2">
                        <StatusSelect
                          value={selectedStatuses[booking.id] || currentStatusLabel}
                          options={statusOptions.map((option) => option.label)}
                          onChange={(value) =>
                            setSelectedStatuses((prev) => ({
                              ...prev,
                              [booking.id]: value,
                            }))
                          }
                        />
                        <button
                          onClick={() => handleUpdateStatus(booking.id)}
                          disabled={
                            !selectedStatuses[booking.id] ||
                            selectedStatuses[booking.id] === currentStatusLabel
                          }
                          className={`flex items-center justify-center rounded-full p-2 transition-all duration-200 shadow-md
                            ${
                              !selectedStatuses[booking.id] ||
                              selectedStatuses[booking.id] === currentStatusLabel
                                ? 'bg-gray-400 text-gray-500 cursor-not-allowed'
                                : 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700'
                            }`}
                          title="Cập nhật trạng thái"
                        >
                          <FaCheck className="h-4 w-4 text-white" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="ml-8 flex h-full w-1/3 flex-col rounded-lg bg-white shadow-lg">
        <BookingListPanel
          selectedDay={selectedDay}
          bookings={filteredBookings}
          selectedStatus={selectedStatuses}
          statusOptions={statusOptions.map((option) => option.label)}
          setSelectedStatus={(bookingId: string, value: string) =>
            setSelectedStatuses((prev) => ({
              ...prev,
              [bookingId]: value,
            }))
          }
        />
      </div>
    </div>
  );
};

export default Calendar;
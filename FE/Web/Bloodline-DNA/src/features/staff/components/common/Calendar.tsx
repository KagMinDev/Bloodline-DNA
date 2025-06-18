'use client'
import React, { useState, useEffect } from 'react'
import { formatDate, type DateSelectArg } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import viLocale from '@fullcalendar/core/locales/vi'
import { BsCalendarXFill } from 'react-icons/bs'
import { ToastContainer } from 'react-toastify'


interface Booking {
  id: string
  testServiceId: string
  clientId: string
  email: string
  bookingDate: string
  price: number
  collectionMethod: string
  status: string
  note: string
  createdAt: string
  updatedAt: string
}

const Calendar: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('')
  const [today, setToday] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'BK001',
      testServiceId: 'TS001',
      clientId: 'CL001',
      email: 'khachhang1@gmail.com',
      bookingDate: '2025-06-12T08:00:00.000Z',
      price: 500000,
      collectionMethod: 'Tại nhà',
      status: 'Đã xác nhận',
      note: 'Lấy mẫu buổi sáng',
      createdAt: '2025-06-10T10:00:00.000Z',
      updatedAt: '2025-06-11T12:00:00.000Z'
    },
    {
      id: 'BK002',
      testServiceId: 'TS002',
      clientId: 'CL002',
      email: 'khachhang2@gmail.com',
      bookingDate: '2025-06-13T14:30:00.000Z',
      price: 700000,
      collectionMethod: 'Tại trung tâm',
      status: 'Chờ xác nhận',
      note: '',
      createdAt: '2025-06-11T09:00:00.000Z',
      updatedAt: '2025-06-11T09:00:00.000Z'
    }
  ])

  useEffect(() => {
    setToday(
      formatDate(new Date(), {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    )
    setSelectedDay(
      formatDate(new Date(), {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    )
  }, [])

  const handleDateSelect = (selected: DateSelectArg) => {
    setSelectedDay(
      formatDate(selected.start, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    )
  }

  const filteredBookings = bookings.filter(
    (booking) =>
      selectedDay &&
      formatDate(new Date(booking.bookingDate), {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }) === selectedDay
  )

  return (
    <div className='relative flex h-full w-full items-start justify-start px-10 py-10 bg[#FCFEFE]'>
      <ToastContainer />

      {/* Cột lịch và bảng tóm tắt lịch hẹn */}
      <div className='mr-2 h-full w-2/3 flex flex-col rounded-lg bg-white p-5 shadow-lg'>
        {/* Lịch */}
        <div className='mb-6'>
          <FullCalendar
            height={400}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}
            editable={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateSelect}
            events={bookings.map((booking) => ({
              id: booking.id,
              start: booking.bookingDate,
              title: booking.email,
              extendedProps: {
                status: booking.status,
                collectionMethod: booking.collectionMethod
              }
            }))}
            locale={viLocale}
            eventContent={eventInfo => (
              <div className='custom-event h-fit w-fit'>
                <div className='event-title font-semibold text-blue-600'>
                  {eventInfo.event.title}
                </div>
                <div className='event-time text-xs'>
                  {eventInfo.event.extendedProps.collectionMethod}
                </div>
              </div>
            )}
            dayCellClassNames={({ date }) => {
              const formattedDate = formatDate(date, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              })

              if (formattedDate === today) {
                return 'bg-blue-200'
              }
              if (formattedDate === selectedDay) {
                return 'bg-orange-200 text-orange-400 selected-day'
              }
              return bookings.some(
                (booking) =>
                  formatDate(new Date(booking.bookingDate), {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  }) === formattedDate
              )
                ? 'bg-blue-50 text-blue-700'
                : ''
            }}
          />
        </div>
        {/* Bảng tóm tắt lịch hẹn trong ngày */}
        <div className='flex-1 overflow-auto'>
          <div className='mb-2 border-b-2 border-blue-600 pb-1 text-base font-semibold text-blue-600'>
            Lịch hẹn trong ngày {selectedDay}
          </div>
          {filteredBookings.length === 0 ? (
            <div className='flex flex-col items-center text-center italic py-8'>
              <div className='text-6xl text-gray-200'>
                <BsCalendarXFill />
              </div>
              <div className='mt-2 text-gray-400'>Không có lịch hẹn</div>
            </div>
          ) : (
            <table className='w-full text-sm'>
              <thead>
                <tr className='bg-blue-50 text-blue-700'>
                  <th className='py-2 px-2 text-left'>Khách hàng</th>
                  <th className='py-2 px-2 text-left'>Giờ</th>
                  <th className='py-2 px-2 text-left'>Phương thức</th>
                  <th className='py-2 px-2 text-left'>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className='border-b'>
                    <td className='py-1 px-2'>{booking.email}</td>
                    <td className='py-1 px-2'>
                      {new Date(booking.bookingDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className='py-1 px-2'>{booking.collectionMethod}</td>
                    <td className='py-1 px-2'>{booking.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Cột danh sách đặt lịch chi tiết */}
      <div className='ml-8 flex h-full w-1/3 flex-col rounded-lg bg-white shadow-lg'>
        <div className='mx-auto mb-2 w-fit border-b-2 border-blue-600 px-2 pb-1 pt-6 text-center text-base font-semibold text-blue-600'>
          Danh sách đặt lịch ngày {selectedDay}
        </div>
        <ul className='h-full flex-1 space-y-4 overflow-auto px-4 py-2'>
          {filteredBookings.length === 0 ? (
            <div className='flex h-full flex-col items-center text-center italic'>
              <div className='mt-24 text-8xl text-gray-200'>
                <BsCalendarXFill />
              </div>
              <div className='mt-5 text-gray-400'>Không có đặt lịch nào</div>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <li
                className='relative flex overflow-hidden rounded-md border bg-white p-2 shadow'
                key={booking.id}
              >
                <div className='flex-1 pl-3'>
                  <div className='font-medium text-blue-700'>
                    {booking.email}
                  </div>
                  <div className='text-sm text-gray-600'>
                    Phương thức: {booking.collectionMethod}
                  </div>
                  <div className='text-sm text-gray-600'>
                    Trạng thái: <span className='font-semibold'>{booking.status}</span>
                  </div>
                  <div className='text-sm text-gray-600'>
                    Ghi chú: {booking.note || 'Không có'}
                  </div>
                  <div className='text-sm text-gray-600'>
                    Giá: {booking.price.toLocaleString()} VNĐ
                  </div>
                  <div className='text-xs text-gray-400 mt-1'>
                    Đặt lúc: {new Date(booking.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}

export default Calendar

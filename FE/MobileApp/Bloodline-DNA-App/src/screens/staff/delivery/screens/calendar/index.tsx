import { STATUS_MAPPING, StatusOption } from '@/screens/staff/constants/statusMapping';
import { getValidDate } from '@/screens/staff/utils/status';
import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import BookingListPanel from '../../components/booking/list/bookingList';
import BookingTable from '../../components/booking/table/bookingTable';
import type { CalendarProps, TestBookingResponse } from '../../types/testBooking';
import styles from './styles';

interface CalendarExtendedProps extends CalendarProps {
  token: string;
  refetchBookings: () => Promise<void>;
}

function formatToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const CalendarScreen: React.FC<CalendarExtendedProps> = ({
  events,
  bookingsByDate,
  token,
  refetchBookings,
}) => {
  const today = formatToYYYYMMDD(new Date());
  const [selectedDay, setSelectedDay] = useState<string>(today);
  const [localEvents, setLocalEvents] = useState<TestBookingResponse[]>([]);
  const [statusOptions] = useState<StatusOption[]>(STATUS_MAPPING);
  const [selectedStatuses, setSelectedStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    setLocalEvents(events);
    setSelectedDay(today);
  }, [events]);

  const filteredBookings = useMemo(() => {
    return localEvents.filter((booking) => {
      const appointmentDate = getValidDate(booking.appointmentDate);
      return formatToYYYYMMDD(appointmentDate) === selectedDay;
    });
  }, [localEvents, selectedDay]);

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    localEvents.forEach((booking) => {
      const date = formatToYYYYMMDD(getValidDate(booking.appointmentDate));
      marks[date] = {
        marked: true,
        dotColor: '#2563EB',
      };
    });
    marks[selectedDay] = {
      ...(marks[selectedDay] || {}),
      selected: true,
      selectedColor: '#FBBF24',
    };
    return marks;
  }, [localEvents, selectedDay]);

  const handleDateSelect = (day: { dateString: string }) => {
    setSelectedDay(day.dateString);
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarSection}>
        <CalendarList
          current={today}
          pastScrollRange={12}
          futureScrollRange={12}
          markingType={'dot'}
          markedDates={markedDates}
          onDayPress={handleDateSelect}
          theme={{
            selectedDayBackgroundColor: '#FBBF24',
            todayTextColor: '#2563EB',
          }}
        />
        <BookingTable
          selectedDay={selectedDay}
          filteredBookings={filteredBookings}
          selectedStatuses={selectedStatuses}
          statusOptions={statusOptions}
          setSelectedStatuses={setSelectedStatuses}
          setFilteredBookings={setLocalEvents}
          token={token}
          refetchBookings={refetchBookings}
        />
      </View>
      <View style={styles.panelSection}>
        <BookingListPanel
          selectedDay={selectedDay}
          bookings={filteredBookings}
          statusOptions={statusOptions.map((option) => option.label)}
        />
      </View>
    </View>
  );
};

export default CalendarScreen;

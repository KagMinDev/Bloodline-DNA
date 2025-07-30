import { StatusOption } from '@/screens/staff/constants/statusMapping';
import { getStatusLabel, renderCollectionMethod } from '@/screens/staff/utils/status';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { toast } from 'react-toastify';
import { updateTestBookingStatusApi } from '../../../api/testBookingApi';
import { TestBookingResponse } from '../../../types/testBooking';
import StatusSelect from '../status-select';
import { styles } from './styles';

interface BookingTableProps {
  selectedDay: string;
  filteredBookings: TestBookingResponse[];
  selectedStatuses: Record<string, string>;
  statusOptions: StatusOption[];
  setSelectedStatuses: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setFilteredBookings: React.Dispatch<React.SetStateAction<TestBookingResponse[]>>;
  token: string;
  refetchBookings: () => Promise<void>;
}

const BookingTable: React.FC<BookingTableProps> = ({
  selectedDay,
  filteredBookings,
  selectedStatuses,
  statusOptions,
  setSelectedStatuses,
  token,
  refetchBookings,
}) => {
  const [loadingBookings, setLoadingBookings] = useState<Set<string>>(new Set());

  const handleClickUpdate = async (bookingId: string) => {
    const newStatusLabel = selectedStatuses[bookingId];
    const statusOption = statusOptions.find((s) => s.label === newStatusLabel);
    if (!statusOption) {
      toast.error('Trạng thái không hợp lệ');
      return;
    }

    setLoadingBookings((prev) => new Set(prev).add(bookingId));
    try {
      await updateTestBookingStatusApi({ bookingId, status: statusOption.value }, token);
      await refetchBookings();

      setSelectedStatuses((prev) => {
        const next = { ...prev };
        delete next[bookingId];
        return next;
      });

      toast.success(`Đã cập nhật trạng thái thành: ${newStatusLabel}`);
    } catch (err) {
      toast.error('Cập nhật trạng thái thất bại');
    } finally {
      setLoadingBookings((prev) => {
        const next = new Set(prev);
        next.delete(bookingId);
        return next;
      });
    }
  };

  const getAvailableStatusOptions = (
    collectionMethod: string,
    currentStatus: string
  ): string[] => {
    const facilityStatusLabels = [
      'Chờ xử lý',
      'Đã nhận mẫu',
      'Nhân viên đang lấy mẫu',
      'Đang xét nghiệm',
      'Hoàn tất',
      'Đã huỷ',
    ];

    const fullLabels = statusOptions.map((s) => s.label);
    const statusList = collectionMethod === 'AtFacility' ? facilityStatusLabels : fullLabels;

    const currentIndex = statusList.indexOf(currentStatus);
    return currentIndex >= 0 ? statusList.slice(currentIndex) : statusList;
  };

  const sortedBookings = [...filteredBookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Lịch hẹn trong ngày {selectedDay}</Text>
      {sortedBookings.length === 0 ? (
        <Text style={styles.emptyText}>Không có lịch hẹn</Text>
      ) : (
        sortedBookings.map((booking) => {
          const currentStatusLabel = getStatusLabel(booking.status);
          const isLoading = loadingBookings.has(booking.id);
          const collectionMethod = booking.collectionMethod;
          const options = getAvailableStatusOptions(collectionMethod, currentStatusLabel);

          if (!selectedStatuses[booking.id]) {
            setSelectedStatuses((prev) => ({
              ...prev,
              [booking.id]: currentStatusLabel,
            }));
          }

          return (
            <View key={booking.id} style={styles.card}>
              <Text style={styles.clientName}>{booking.clientName || 'Không có tên'}</Text>
              <Text style={styles.text}>{new Date(booking.appointmentDate).toLocaleString('vi-VN')}</Text>
              <Text style={styles.text}>{renderCollectionMethod(collectionMethod)}</Text>
              <View style={styles.row}>
                <StatusSelect
                  value={selectedStatuses[booking.id] || currentStatusLabel}
                  options={options}
                  onChange={(value) =>
                    setSelectedStatuses((prev) => ({
                      ...prev,
                      [booking.id]: value,
                    }))
                  }
                  disabled={isLoading}
                />
                <TouchableOpacity
                  style={[styles.button, (isLoading || selectedStatuses[booking.id] === currentStatusLabel) && styles.disabledButton]}
                  disabled={isLoading || !selectedStatuses[booking.id] || selectedStatuses[booking.id] === currentStatusLabel}
                  onPress={() => handleClickUpdate(booking.id)}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text style={styles.buttonText}>✔</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

export default BookingTable;

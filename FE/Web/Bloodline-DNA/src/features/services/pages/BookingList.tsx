import React, { useState, useEffect } from "react";
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon,
  SearchIcon,
  FilterIcon,
  EyeIcon,
  EditIcon,
  PhoneIcon,
  HomeIcon,
  BuildingIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  XCircleIcon
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../components/ui/Breadcrumb";
import { Header } from "../../../components";
import { Footer } from "../../../components";
import { useBookingModal } from "../components/BookingModalContext";

interface Booking {
  id: string;
  testType: string;
  serviceType: 'home' | 'clinic';
  name: string;
  phone: string;
  email: string;
  address?: string;
  preferredDate: string;
  preferredTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  bookingDate: string;
  price: string;
}

const statusConfig = {
  pending: {
    label: 'Chờ xác nhận',
    color: 'bg-yellow-100 text-yellow-800',
    icon: AlertCircleIcon
  },
  confirmed: {
    label: 'Đã xác nhận',
    color: 'bg-blue-100 text-blue-800', 
    icon: CheckCircleIcon
  },
  completed: {
    label: 'Hoàn thành',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircleIcon
  },
  cancelled: {
    label: 'Đã hủy',
    color: 'bg-red-100 text-red-800',
    icon: XCircleIcon
  }
};

export const BookingList = (): React.JSX.Element => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const { openBookingModal } = useBookingModal();

  // Sample data
  const sampleBookings: Booking[] = [
    {
      id: "BL001234",
      testType: "Xét nghiệm tổng quát",
      serviceType: "home",
      name: "Nguyễn Văn An",
      phone: "0123456789",
      email: "nguyenvanan@gmail.com",
      address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
      preferredDate: "2024-02-15",
      preferredTime: "09:00",
      status: "confirmed",
      notes: "Vui lòng gọi trước khi đến",
      bookingDate: "2024-02-10",
      price: "550.000đ"
    },
    {
      id: "BL001235",
      testType: "Test COVID-19",
      serviceType: "clinic",
      name: "Trần Thị Bình",
      phone: "0987654321",
      email: "tranthib@gmail.com",
      preferredDate: "2024-02-16",
      preferredTime: "14:30",
      status: "pending",
      bookingDate: "2024-02-11",
      price: "300.000đ"
    },
    {
      id: "BL001236",
      testType: "Xét nghiệm máu",
      serviceType: "home",
      name: "Lê Minh Đức",
      phone: "0912345678",
      email: "leminhduc@gmail.com",
      address: "456 Đường DEF, Phường UVW, Quận 3, TP.HCM",
      preferredDate: "2024-02-12",
      preferredTime: "08:00",
      status: "completed",
      bookingDate: "2024-02-08",
      price: "450.000đ"
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchBookings = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBookings(sampleBookings);
      setFilteredBookings(sampleBookings);
      setIsLoading(false);
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    let filtered = bookings;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
      <div className="w-full max-w-none relative">
        {/* Header */}
        <div className="relative z-50">
          <Header />
        </div>

        {/* Hero Section */}
        <section className="relative w-full py-16 md:py-20 bg-blue-50 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="medical-cross-booking" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="8" y="4" width="4" height="12" fill="#1e40af"/>
                  <rect x="4" y="8" width="12" height="4" fill="#1e40af"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#medical-cross-booking)" />
            </svg>
          </div>

          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
              <div className="mb-6">
                <Breadcrumb>
                  <BreadcrumbList className="text-blue-600">
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/" className="transition-colors duration-200 text-blue-600 hover:text-blue-800">
                        Trang Chủ
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-blue-400" />
                    <BreadcrumbItem>
                      <span className="text-blue-900 font-semibold">Danh Sách Đặt Lịch</span>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-blue-900 leading-tight mb-4">
                Danh Sách Đặt Lịch
                <span className="block text-blue-700 text-xl md:text-2xl font-medium mt-1">
                  Quản lý lịch hẹn xét nghiệm
                </span>
              </h1>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo mã, loại xét nghiệm, tên..."
                  className="pl-10 pr-4 py-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <FilterIcon className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">Tất cả</option>
                  <option value="pending">Chờ xác nhận</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Bookings List */}
        <section className="py-16 md:py-20 bg-blue-50">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <div className="mb-8">
              <p className="text-lg text-slate-600">
                Tìm thấy <span className="font-semibold text-blue-900">{filteredBookings.length}</span> lịch hẹn
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600">Đang tải danh sách...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-16">
                <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">Không có lịch hẹn nào</h3>
                <Button onClick={openBookingModal} className="bg-blue-900 hover:bg-blue-800 text-white">
                  Đặt Lịch Mới
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredBookings.map((booking) => {
                  const StatusIcon = statusConfig[booking.status].icon;
                  const ServiceIcon = booking.serviceType === 'home' ? HomeIcon : BuildingIcon;
                  
                  return (
                    <Card key={booking.id} className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-xl font-bold text-blue-900">#{booking.id}</h3>
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusConfig[booking.status].color}`}>
                                    <StatusIcon className="w-4 h-4" />
                                    {statusConfig[booking.status].label}
                                  </span>
                                </div>
                                <p className="text-lg font-semibold text-slate-700 mb-1">{booking.testType}</p>
                                <p className="text-blue-600 font-medium">{booking.name}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-blue-900">{booking.price}</p>
                                <p className="text-sm text-slate-500">Tổng chi phí</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center text-slate-600">
                                <ServiceIcon className="w-4 h-4 mr-2 text-blue-500" />
                                {booking.serviceType === 'home' ? 'Tự thu mẫu tại nhà' : 'Thu mẫu tại cơ sở'}
                              </div>
                              <div className="flex items-center text-slate-600">
                                <CalendarIcon className="w-4 h-4 mr-2 text-blue-500" />
                                {formatDate(booking.preferredDate)}
                              </div>
                              <div className="flex items-center text-slate-600">
                                <ClockIcon className="w-4 h-4 mr-2 text-blue-500" />
                                {booking.preferredTime}
                              </div>
                              <div className="flex items-center text-slate-600">
                                <PhoneIcon className="w-4 h-4 mr-2 text-blue-500" />
                                {booking.phone}
                              </div>
                              {booking.address && (
                                <div className="flex items-center text-slate-600 md:col-span-2">
                                  <MapPinIcon className="w-4 h-4 mr-2 text-blue-500" />
                                  {booking.address}
                                </div>
                              )}
                            </div>

                            {booking.notes && (
                              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                  <strong>Lưu ý:</strong> {booking.notes}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 lg:min-w-[200px]">
                            <Button
                              variant="outline"
                              className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white w-full"
                            >
                              <EyeIcon className="w-4 h-4 mr-2" />
                              Xem Chi Tiết
                            </Button>
                            {(booking.status === 'pending' || booking.status === 'confirmed') && (
                              <Button
                                variant="outline"
                                className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full"
                              >
                                <EditIcon className="w-4 h-4 mr-2" />
                                Cập Nhật
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <div className="relative">
          <Footer />
        </div>
      </div>
    </div>
  );
}; 
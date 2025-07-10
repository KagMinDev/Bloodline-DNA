using ADNTester.BO.DTOs;
using ADNTester.BO.DTOs.TestBooking;
using ADNTester.BO.DTOs.TestKit;
using ADNTester.BO.Entities;
using ADNTester.BO.Enums;
using ADNTester.Repository.Interfaces;
using ADNTester.Service.Interfaces;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADNTester.Service.Implementations
{
    public class TestBookingService : ITestBookingService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ITestServiceService _testServiceService;
        private readonly ITestKitService _testKitService;
        private readonly IEmailService _emailService;

        public TestBookingService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ITestServiceService testServiceService,
            ITestKitService testKitService,
            IEmailService emailService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _testServiceService = testServiceService;
            _testKitService = testKitService;
            _emailService = emailService;
        }

        public async Task<IEnumerable<TestBookingDto>> GetAllAsync()
        {
            var bookings = await _unitOfWork.TestBookingRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<TestBookingDto>>(bookings);
        }
        public async Task<IEnumerable<TestBookingDetailDto>> GetBookingByUserId(string userId)
        {
            var bookings = await _unitOfWork.TestBookingRepository.GetAllAsync();
            var userBookings = bookings.Where(b => b.ClientId == userId).ToList();
            
            foreach (var booking in userBookings)
            {
                booking.Client = await _unitOfWork.UserRepository.GetByIdAsync(booking.ClientId);
                booking.TestService = await _unitOfWork.TestServiceRepository.GetByIdAsync(booking.TestServiceId);
            }
            
            return _mapper.Map<IEnumerable<TestBookingDetailDto>>(userBookings);
        }

        public async Task<TestBookingDetailDto> GetByIdAsync(string id)
        {
            var booking = await _unitOfWork.TestBookingRepository.GetByIdAsync(id);
            if (booking == null)
                return null;

            
            booking.Client = await _unitOfWork.UserRepository.GetByIdAsync(booking.ClientId);
            return _mapper.Map<TestBookingDetailDto>(booking);
        }

        public async Task<TestBookingDetailDto> GetBookingDetailByIdAsync(string id)
        {
            var booking = await _unitOfWork.TestBookingRepository.GetByIdAsync(id);
            if (booking == null)
                return null;

           
            booking.Client = await _unitOfWork.UserRepository.GetByIdAsync(booking.ClientId);
            return _mapper.Map<TestBookingDetailDto>(booking);
        }

        public async Task<string> CreateAsync(CreateTestBookingDto dto)
        {
            // Lấy thông tin TestService bao gồm cả PriceServices
            var testService = await _testServiceService.GetByIdAsync(dto.TestServiceId);
            if (testService == null)
                throw new Exception("TestService not found");

            if (testService.PriceServices == null || !testService.PriceServices.Any())
                throw new Exception("TestService has no pricing information");

            // Lấy PriceService theo PriceServiceId truyền lên
            var priceService = testService.PriceServices.FirstOrDefault(ps => ps.Id == dto.PriceServiceId);
            if (priceService == null)
                throw new Exception("PriceService not found for this TestService");

            var booking = _mapper.Map<TestBooking>(dto);
            booking.Price = priceService.Price;
            booking.CollectionMethod = priceService.CollectionMethod;
            await _unitOfWork.TestBookingRepository.AddAsync(booking);
            await _unitOfWork.SaveChangesAsync();
            return booking.Id;
        }

        public async Task<string> CreateWithTestKitAsync(CreateTestBookingDto dto)
        {
            // Lấy thông tin TestService bao gồm cả PriceServices
            var testService = await _testServiceService.GetByIdAsync(dto.TestServiceId);
            if (testService == null)
                throw new Exception("TestService not found");

            if (testService.PriceServices == null || !testService.PriceServices.Any())
                throw new Exception("TestService has no pricing information");

            // Lấy PriceService theo PriceServiceId truyền lên
            var priceService = testService.PriceServices.FirstOrDefault(ps => ps.Id == dto.PriceServiceId);
            if (priceService == null)
                throw new Exception("PriceService not found for this TestService");

            // Tạo TestBooking với giá từ PriceService
            var booking = _mapper.Map<TestBooking>(dto);
            booking.Price = priceService.Price;
            booking.CollectionMethod = priceService.CollectionMethod;
            await _unitOfWork.TestBookingRepository.AddAsync(booking);
            await _unitOfWork.SaveChangesAsync();

            // Không tạo TestKit ở đây nữa, chỉ tạo sau khi xác nhận (Confirm)
            return booking.Id;
        }

        public async Task<bool> UpdateAsync(UpdateTestBookingDto dto)
        {
            var booking = await _unitOfWork.TestBookingRepository.GetByIdAsync(dto.Id);
            if (booking == null)
                return false;

            _mapper.Map(dto, booking);
            _unitOfWork.TestBookingRepository.Update(booking);
            return await _unitOfWork.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var booking = await _unitOfWork.TestBookingRepository.GetByIdAsync(id);
            if (booking == null)
                return false;

            _unitOfWork.TestBookingRepository.Remove(booking);
            return await _unitOfWork.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<TestBookingDto>> GetCompletedBookingsAsync()
        {
            var bookings = await _unitOfWork.TestBookingRepository.GetAllAsync();
            var completedBookings = bookings.Where(b => b.Status == BookingStatus.Completed);
            return _mapper.Map<IEnumerable<TestBookingDto>>(completedBookings);
        }

        public async Task<bool> UpdateBookingStatusAsync(string bookingId, BookingStatus newStatus)
        {
            var booking = await _unitOfWork.TestBookingRepository.GetByIdAsync(bookingId);
            if (booking == null)
                throw new Exception("Booking not found");

            // Nếu chuyển sang Confirm và là AtFacility, tạo TestKit nếu chưa có
            if (newStatus == BookingStatus.CheckIn && booking.CollectionMethod == SampleCollectionMethod.AtFacility)
            {
                // Kiểm tra đã có kit cho booking này chưa
                var existingKits = await _unitOfWork.TestKitRepository.GetAllAsync();
                bool hasKit = existingKits.Any(k => k.BookingId == booking.Id);
                if (!hasKit)
                {
                    var testService = await _testServiceService.GetByIdAsync(booking.TestServiceId);
                    var testKit = new CreateTestKitDto
                    {
                        BookingId = booking.Id,
                        SentToLabAt = DateTime.UtcNow,
                        LabReceivedAt = null,
                        SampleCount = testService?.SampleCount ?? 1,
                        CollectionMethod = SampleCollectionMethod.AtFacility,
                    };
                    await _testKitService.CreateAsync(testKit);
                }
            }

            // Cập nhật trạng thái
            booking.Status = newStatus;
            booking.UpdatedAt = DateTime.UtcNow;
            _unitOfWork.TestBookingRepository.Update(booking);

            // Lấy thông tin client để gửi email
            var client = await _unitOfWork.UserRepository.GetByIdAsync(booking.ClientId);
            if (client == null)
                throw new Exception("Client not found");

            // Chuẩn bị nội dung email dựa trên trạng thái mới
            string emailSubject = "Booking Status Update";
            string emailBody = GetEmailBodyForStatus(booking, newStatus);

            // Gửi email thông báo
            await _emailService.SendEmailAsync(client.Email, emailSubject, emailBody);

            return await _unitOfWork.SaveChangesAsync() > 0;
        }

        private string GetEmailBodyForStatus(TestBooking booking, BookingStatus status)
        {
            var testService = _testServiceService.GetByIdAsync(booking.TestServiceId).Result;
            string serviceName = testService?.Name ?? "Unknown Service";

            string emailTemplate = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }}
        .header {{
            text-align: center;
            padding: 20px 0;
            background-color: #f8f9fa;
            border-radius: 5px;
            margin-bottom: 20px;
        }}
        .logo {{
            max-width: 150px;
            height: auto;
        }}
        .content {{
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .status {{
            color: #007bff;
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 15px;
        }}
        .details {{
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }}
        .footer {{
            text-align: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 12px;
        }}
        .button {{
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
        }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <img src='https://res.cloudinary.com/dcufypcwk/image/upload/v1748507247/Image/Thumbnail/t%E1%BA%A3i_xu%E1%BB%91ng.png' alt='ADN Tester Logo' class='logo'>
        </div>
        <div class='content'>
            <h2>Booking Status Update</h2>
            <div class='status'>Status: {GetStatusText(status)}</div>
            <p>Dear {booking.ClientId},</p>
            <p>{GetStatusMessage(status, serviceName)}</p>
            <div class='details'>
                <p><strong>Booking ID:</strong> {booking.Id}</p>
                <p><strong>Service:</strong> {serviceName}</p>
                <p><strong>Collection Method:</strong> {booking.CollectionMethod}</p>
                <p><strong>Date:</strong> {DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm")}</p>
            </div>
            {GetAdditionalInfo(status)}
        </div>
        <div class='footer'>
            <p>This is an automated message, please do not reply directly to this email.</p>
            <p>© 2024 ADN Tester. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";

            return emailTemplate;
        }
        public async Task<IEnumerable<TestBookingDto>> GetFilteredBookingsAsync(SampleCollectionMethod? method, DateTime? appointDate)
        {
            var bookings = await _unitOfWork.TestBookingRepository.GetFilteredBookingsAsync(method, appointDate);

            return _mapper.Map<IEnumerable<TestBookingDto>>(bookings);
        }
        public async Task<bool> CheckInAsync(string bookingId)
        {
            var booking = await _unitOfWork.TestBookingRepository.GetByIdAsync(bookingId);
            if (booking == null || booking.CollectionMethod != SampleCollectionMethod.AtFacility)
                return false;

            if (booking.Status != BookingStatus.Pending)
                return false;

            // Delegate to shared status update logic
            return await UpdateBookingStatusAsync(bookingId, BookingStatus.CheckIn);
        }

        public async Task<bool> ConfirmKitReceivedAsync(string bookingId)
        {
            // Step 1: Get the booking
            var booking = await _unitOfWork.TestBookingRepository.GetByIdAsync(bookingId);
            if (booking == null)
                throw new Exception("Không tìm thấy đặt lịch.");

            // Step 2: Get the TestKit with DeliveryInfo
            var testKit = await _unitOfWork.TestKitRepository.GetWithDeliveryInfoByBookingIdAsync(bookingId);

            if (testKit == null)
                throw new Exception("Không tìm thấy bộ kit xét nghiệm cho đặt lịch này.");

            if (testKit.CollectionMethod != SampleCollectionMethod.SelfSample)
                throw new InvalidOperationException("Phương thức lấy mẫu không phải là lấy mẫu tại nhà.");

            if (testKit.DeliveryInfo == null)
                throw new InvalidOperationException("Không có thông tin giao hàng.");

            if (testKit.DeliveryInfo.Status != LogisticStatus.KitDelivered)
                throw new InvalidOperationException("Nhân viên chưa xác nhận đã giao kit.");

            // Step 3: Allow client to confirm → update only the booking status
            booking.Status = BookingStatus.KitDelivered;

            await _unitOfWork.SaveChangesAsync();
            return true;
        }
        public async Task<bool> CreatePickupAfterSampleCollectedAsync(string bookingId, string? note)
        {
            var booking = await _unitOfWork.TestBookingRepository.GetByIdAsync(bookingId);
            if (booking == null)
                throw new Exception("Booking not found");

            // Only allow pickup creation for HomeCollection bookings
            if (booking.CollectionMethod != SampleCollectionMethod.SelfSample)
                throw new Exception("Chỉ hỗ trợ tạo yêu cầu lấy mẫu tại nhà cho phương thức SelfSample");

            // Check if booking already has a test kit
            var testKit = await _unitOfWork.TestKitRepository
                .GetWithPickupInfoByBookingIdAsync(bookingId);

            if (testKit == null)
                throw new Exception("Chưa có kit được tạo cho booking này");

            if (testKit.PickupInfoId != null)
                throw new Exception("Đã có nhiệm vụ lấy mẫu được tạo cho booking này");

            // Create LogisticsInfo for Pickup
            var pickupLogistics = new LogisticsInfo
            {
                Name = string.IsNullOrWhiteSpace(booking.ClientName) ? "Chưa rõ tên" : booking.ClientName.Trim(),
                Address = string.IsNullOrWhiteSpace(booking.Address) ? "Không rõ địa chỉ" : booking.Address.Trim(),
                Phone = string.IsNullOrWhiteSpace(booking.Phone) ? "Không rõ số điện thoại" : booking.Phone.Trim(),
                Note = string.IsNullOrWhiteSpace(note)? $"Lấy mẫu từ client cho booking {booking.Id}" : note.Trim(),
                Type = LogisticsType.Pickup,
                Status = LogisticStatus.WaitingForPickup,
                ScheduledAt = DateTime.UtcNow
            };


            await _unitOfWork.LogisticInfoRepository.AddAsync(pickupLogistics);
            await _unitOfWork.SaveChangesAsync();

            // Link logistics to test kit
            testKit.PickupInfoId = pickupLogistics.Id;

            // Update booking status
            booking.Status = BookingStatus.ReturningSample;
            booking.UpdatedAt = DateTime.UtcNow;

            
            return await _unitOfWork.SaveChangesAsync() > 0;
        }

        #region Helper methods
        private string GetStatusText(BookingStatus status)
        {
            return status switch
            {
                BookingStatus.Pending => "Pending",
                BookingStatus.PreparingKit => "Preparing Test Kit",
                BookingStatus.DeliveringKit => "Delivering Test Kit",
                BookingStatus.KitDelivered => "Kit Delivered",
                BookingStatus.WaitingForSample => "Waiting for Sample",
                BookingStatus.ReturningSample => "Returning Sample",
                BookingStatus.SampleReceived => "Sample Received",
                BookingStatus.Testing => "Testing in Progress",
                BookingStatus.Completed => "Test Completed",
                BookingStatus.Cancelled => "Booking Cancelled",
                _ => status.ToString()
            };
        }

        private string GetStatusMessage(BookingStatus status, string serviceName)
        {
            return status switch
            {
                BookingStatus.Pending => $"Your booking for {serviceName} is pending. We will begin processing it shortly.",
                BookingStatus.PreparingKit => $"We are preparing your test kit for {serviceName}. It will be delivered soon.",
                BookingStatus.DeliveringKit => $"Your test kit for {serviceName} is on the way. Please be available to receive it.",
                BookingStatus.KitDelivered => $"You have received the test kit for {serviceName}. Please collect your sample as instructed.",
                BookingStatus.WaitingForSample => $"We are waiting for your sample for {serviceName}. Please return it as soon as possible.",
                BookingStatus.ReturningSample => $"Your sample for {serviceName} is being returned to our lab by our staff.",
                BookingStatus.SampleReceived => $"We have received your sample for {serviceName}. Testing will begin shortly.",
                BookingStatus.Testing => $"Testing is currently in progress for your {serviceName} sample.",
                BookingStatus.Completed => $"Your {serviceName} test is completed. Results are available in your account.",
                BookingStatus.Cancelled => $"Your booking for {serviceName} has been cancelled.",
                _ => $"Your booking status for {serviceName} has been updated."
            };
        }

        private string GetAdditionalInfo(BookingStatus status)
        {
            return status switch
            {
                BookingStatus.PreparingKit => @"
            <p>We're preparing your DNA test kit:</p>
            <ul>
                <li>Expect delivery within 1–2 days</li>
                <li>Check your contact info is correct</li>
            </ul>",

                BookingStatus.DeliveringKit => @"
            <p>Kit is being delivered:</p>
            <ul>
                <li>Keep your phone available for delivery updates</li>
                <li>Contact staff if you're not home</li>
            </ul>",

                BookingStatus.KitDelivered => @"
            <p>Kit delivered:</p>
            <ul>
                <li>Open the kit and follow the instructions carefully</li>
                <li>Collect your sample as soon as possible</li>
            </ul>",

                BookingStatus.WaitingForSample => @"
            <p>Waiting for your sample:</p>
            <ul>
                <li>Make sure your sample is packaged correctly</li>
                <li>Use the provided return bag</li>
            </ul>",

                BookingStatus.ReturningSample => @"
            <p>Your sample is on its way back to us:</p>
            <ul>
                <li>It is being handled by a staff member</li>
                <li>We'll notify you once received</li>
            </ul>",

                BookingStatus.SampleReceived => @"
            <p>Sample received at the lab:</p>
            <ul>
                <li>Verification: 1–2 business days</li>
                <li>Testing starts soon</li>
            </ul>",

                BookingStatus.Testing => @"
            <p>Testing underway:</p>
            <ul>
                <li>Sample analysis in progress</li>
                <li>Results available in 3–5 business days</li>
            </ul>",

                BookingStatus.Completed => @"
            <p>Your test is completed:</p>
            <a href='https://yourdomain.com/results' class='button'>View Results</a>",

                _ => ""
            };
        }
#endregion

    }
} 
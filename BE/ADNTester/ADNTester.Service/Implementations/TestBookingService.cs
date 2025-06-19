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
            var booking = _mapper.Map<TestBooking>(dto);
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

            // Lấy PriceService đầu tiên để lấy CollectionMethod và giá
            var priceService = testService.PriceServices.First();

            // Tạo TestBooking với giá từ PriceService
            var booking = _mapper.Map<TestBooking>(dto);
            booking.Price = priceService.Price;
            booking.CollectionMethod = priceService.CollectionMethod;
            await _unitOfWork.TestBookingRepository.AddAsync(booking);
            await _unitOfWork.SaveChangesAsync();

            // Kiểm tra phương thức lấy mẫu
            if (priceService.CollectionMethod == SampleCollectionMethod.SelfSample)
            {
                // Nếu là lấy mẫu tại nhà, không tạo kit ngay
                // Kit sẽ được tạo sau khi thanh toán cọc
                return booking.Id;
            }
            else if (priceService.CollectionMethod == SampleCollectionMethod.AtFacility)
            {
                // Nếu là lấy mẫu tại cơ sở, tạo kit ngay
                var testKit = new CreateTestKitDto
                {
                    BookingId = booking.Id,
                    SentToLabAt = DateTime.UtcNow,
                    LabReceivedAt = null
                };

                await _testKitService.CreateAsync(testKit);
            }

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

        private string GetStatusText(BookingStatus status)
        {
            return status switch
            {
                BookingStatus.KitSend => "Kit Sent",
                BookingStatus.Confirmed => "Booking Confirmed",
                BookingStatus.Completed => "Test Completed",
                BookingStatus.Cancelled => "Booking Cancelled",
                BookingStatus.SampleRecived => "Sample Received",
                BookingStatus.Testing => "Testing in Progress",
                _ => status.ToString()
            };
        }

        private string GetStatusMessage(BookingStatus status, string serviceName)
        {
            return status switch
            {
                BookingStatus.KitSend => $"Your test kit for {serviceName} has been sent. Please expect the kit to arrive soon.",
                BookingStatus.Confirmed => $"Your booking for {serviceName} has been confirmed. We will process your request shortly.",
                BookingStatus.Completed => $"Your test for {serviceName} has been completed. You can view your results in your account.",
                BookingStatus.Cancelled => $"Your booking for {serviceName} has been cancelled. If you have any questions, please contact our support team.",
                BookingStatus.SampleRecived => $"We have received your sample for {serviceName}. We will begin processing your sample shortly.",
                BookingStatus.Testing => $"Your sample for {serviceName} is currently being tested. We will notify you once the results are ready.",
                _ => $"Your booking status for {serviceName} has been updated."
            };
        }

        private string GetAdditionalInfo(BookingStatus status)
        {
            return status switch
            {
                BookingStatus.KitSend => @"
            <p>What to expect next:</p>
            <ul>
                <li>You will receive the test kit within 2-3 business days</li>
                <li>Follow the instructions provided in the kit</li>
                <li>Return the sample using the prepaid shipping label</li>
            </ul>",
                BookingStatus.Confirmed => @"
            <p>Next steps:</p>
            <ul>
                <li>Prepare for your appointment</li>
                <li>Bring a valid ID</li>
                <li>Arrive 10 minutes before your scheduled time</li>
            </ul>",
                BookingStatus.Completed => @"
            <p>Your results are now available:</p>
            <a href='https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3Ddna%2Blogo&psig=AOvVaw3SjIGcROq-REudWAWyUwTr&ust=1748592724549000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCNCr0tWdyI0DFQAAAAAdAAAAABAE' class='button'>View Results</a>",
                BookingStatus.SampleRecived => @"
            <p>Sample processing timeline:</p>
            <ul>
                <li>Sample verification: 1-2 business days</li>
                <li>Testing process: 3-5 business days</li>
                <li>Results review: 1-2 business days</li>
            </ul>",
                BookingStatus.Testing => @"
            <p>Current testing phase:</p>
            <ul>
                <li>Sample analysis in progress</li>
                <li>Quality control checks</li>
                <li>Results compilation</li>
            </ul>",
                _ => ""
            };
        }

    }
} 
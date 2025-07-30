using ADNTester.BO.DTOs;
using ADNTester.BO.DTOs.TestBooking;
using ADNTester.BO.DTOs.TestResult;
using ADNTester.BO.Entities;
using ADNTester.BO.Enums;
using ADNTester.Repository.Interfaces;
using ADNTester.Service.Interfaces;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Linq;
using ADNTester.BO.DTOs.User;

namespace ADNTester.Service.Implementations
{
    public class TestResultService : ITestResultService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ITestBookingService _testBookingService;
        private readonly IEmailService _emailService;
        private readonly ICloudinaryService _cloudinaryService;
        private static readonly Regex EmailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");

        public TestResultService(
            IUnitOfWork unitOfWork, 
            IMapper mapper,
            ITestBookingService testBookingService,
            IEmailService emailService,
            ICloudinaryService cloudinaryService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _testBookingService = testBookingService;
            _emailService = emailService;
            _cloudinaryService = cloudinaryService;
        }

        public async Task<IEnumerable<TestResultDetailDto>> GetAllAsync()
        {
            var testResults = await _unitOfWork.TestResultRepository.GetAllAsync();
            var bookings = await _unitOfWork.TestBookingRepository.GetAllAsync();
            var users = await _unitOfWork.UserRepository.GetAllAsync();
            // Ensure navigation properties are set
            foreach (var result in testResults)
            {
                result.TestBooking = bookings.FirstOrDefault(b => b.Id == result.TestBookingId);
                if (result.TestBooking != null)
                {
                    result.TestBooking.Client = users.FirstOrDefault(u => u.Id == result.TestBooking.ClientId);
                }
            }
            return _mapper.Map<IEnumerable<TestResultDetailDto>>(testResults);
        }

        public async Task<TestResultDetailDto> GetByIdAsync(string id)
        {
            var testResult = await _unitOfWork.TestResultRepository.GetByIdAsync(id);
            if (testResult == null)
                return null;
            var booking = await _unitOfWork.TestBookingRepository.GetByIdAsync(testResult.TestBookingId);
            if (booking != null)
            {
                booking.Client = await _unitOfWork.UserRepository.GetByIdAsync(booking.ClientId);
                testResult.TestBooking = booking;
            }
            return _mapper.Map<TestResultDetailDto>(testResult);
        }

        public async Task<string> CreateAsync(CreateTestResultDto dto)
        {
            try
            {
                // Get booking information
                var booking = await _testBookingService.GetByIdAsync(dto.TestBookingId);
                if (booking == null)
                    throw new Exception("Booking not found");

                if (booking.Client == null)
                    throw new Exception("Client information not found");

                if (string.IsNullOrEmpty(booking.Client.Email))
                    throw new Exception("Client email address is missing");

                if (!IsValidEmail(booking.Client.Email))
                    throw new Exception($"Invalid email address format: {booking.Client.Email}");

                var testResult = _mapper.Map<TestResult>(dto);
                await _unitOfWork.TestResultRepository.AddAsync(testResult);

                await _testBookingService.UpdateBookingStatusAsync(dto.TestBookingId, BookingStatus.Completed);

                await _unitOfWork.SaveChangesAsync();

                try
                {
                    var emailSubject = "Test Results Available";
                    var emailBody = GenerateResultEmailBody(booking, testResult);
                    await _emailService.SendEmailAsync(booking.Client.Email, emailSubject, emailBody);
                }
                catch (Exception emailEx)
                {
                    
                    Console.WriteLine($"Failed to send email: {emailEx.Message}");
                   
                }

                return testResult.Id;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error creating test result: {ex.Message}");
            }
        }

        public async Task<string> CreateWithFileAsync(CreateTestResultWithFileDto dto)
        {
            try
            {
                
                var booking = await _testBookingService.GetByIdAsync(dto.TestBookingId);
                if (booking == null)
                    throw new Exception("Booking not found");

                if (booking.Client == null)
                    throw new Exception("Client information not found");

                if (string.IsNullOrEmpty(booking.Client.Email))
                    throw new Exception("Client email address is missing");

                if (!IsValidEmail(booking.Client.Email))
                    throw new Exception($"Invalid email address format: {booking.Client.Email}");

                string resultFileUrl = null;
                if (dto.ResultFile != null)
                {
                    resultFileUrl = await _cloudinaryService.UploadImageAsync(dto.ResultFile, "TestResults");
                }

                var testResult = new TestResult
                {
                    TestBookingId = dto.TestBookingId,
                    ResultSummary = dto.ResultSummary,
                    ResultDate = dto.ResultDate,
                    ResultFileUrl = resultFileUrl
                };
                await _unitOfWork.TestResultRepository.AddAsync(testResult);

                await _testBookingService.UpdateBookingStatusAsync(dto.TestBookingId, BookingStatus.Completed);

                await _unitOfWork.SaveChangesAsync();

                try
                {
                    var emailSubject = "Test Results Available";
                    var emailBody = GenerateResultEmailBody(booking, testResult);
                    await _emailService.SendEmailAsync(booking.Client.Email, emailSubject, emailBody);
                }
                catch (Exception emailEx)
                {
                    
                    Console.WriteLine($"Failed to send email: {emailEx.Message}");
                   
                }

                return testResult.Id;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error creating test result: {ex.Message}");
            }
        }

        private bool IsValidEmail(string email)
        {
            if (string.IsNullOrEmpty(email))
                return false;

            return EmailRegex.IsMatch(email);
        }

        private string GenerateResultEmailBody(TestBookingDetailDto booking, TestResult result)
        {
            return $@"
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
            max-width: 200px;
            height: auto;
            margin-bottom: 15px;
        }}
        .content {{
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .result-summary {{
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
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
        .footer {{
            text-align: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
        }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <img src='https://res.cloudinary.com/dcufypcwk/image/upload/v1748507247/Image/Thumbnail/t%E1%BA%A3i_xu%E1%BB%91ng.png' alt='Bloodline DNA Logo' class='logo'>
            <h2>Test Results Available</h2>
        </div>
        <div class='content'>
            <p>Dear {booking.Client.FullName},</p>
            <p>Your test results are now available. Here's a summary of your results:</p>
            <div class='result-summary'>
                <p><strong>Test Date:</strong> {result.ResultDate.ToString("dd/MM/yyyy")}</p>
                <p><strong>Result Summary:</strong> {result.ResultSummary}</p>
            </div>
            <p>You can view your detailed results by clicking the button below:</p>
            <a href='{result.ResultFileUrl}' class='button'>View Full Results</a>
            <p>If you have any questions about your results, please don't hesitate to contact our support team.</p>
        </div>
        <div class='footer'>
            <p>© {DateTime.Now.Year} Bloodline DNA. All rights reserved.</p>
            <p>This is an automated message, please do not reply directly to this email.</p>
        </div>
    </div>
</body>
</html>";
        }

        public async Task<bool> UpdateAsync(UpdateTestResultDto dto)
        {
            var testResult = await _unitOfWork.TestResultRepository.GetByIdAsync(dto.Id);
            if (testResult == null)
                return false;

            _mapper.Map(dto, testResult);
            _unitOfWork.TestResultRepository.Update(testResult);
            return await _unitOfWork.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateWithFileAsync(UpdateTestResultWithFileDto dto)
        {
            var testResult = await _unitOfWork.TestResultRepository.GetByIdAsync(dto.Id);
            if (testResult == null)
                return false;

            // Upload new file to Cloudinary if provided
            if (dto.ResultFile != null)
            {
                var fileUrl = await _cloudinaryService.UploadImageAsync(dto.ResultFile, "TestResults");
                testResult.ResultFileUrl = fileUrl;
            }

            // Update other properties
            testResult.TestBookingId = dto.TestBookingId;
            testResult.ResultSummary = dto.ResultSummary;
            testResult.ResultDate = dto.ResultDate;

            _unitOfWork.TestResultRepository.Update(testResult);
            return await _unitOfWork.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var testResult = await _unitOfWork.TestResultRepository.GetByIdAsync(id);
            if (testResult == null)
                return false;

            _unitOfWork.TestResultRepository.Remove(testResult);
            return await _unitOfWork.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<TestResultDetailDto>> GetTestResultsByUserIdAsync(string userId)
        {
            var testResults = await _unitOfWork.TestResultRepository.GetAllAsync();
            var bookings = await _unitOfWork.TestBookingRepository.GetAllAsync();
            
            // Get user's bookings
            var userBookings = bookings.Where(b => b.ClientId == userId).ToList();
            
            // Get test results for user's bookings
            var userTestResults = testResults
                .Where(tr => userBookings.Any(b => b.Id == tr.TestBookingId))
                .ToList();

            // Load booking and user data for each test result
            foreach (var result in userTestResults)
            {
                result.TestBooking = userBookings.FirstOrDefault(b => b.Id == result.TestBookingId);
                if (result.TestBooking != null)
                {
                    result.TestBooking.Client = await _unitOfWork.UserRepository.GetByIdAsync(userId);
                }
            }
            
            return _mapper.Map<IEnumerable<TestResultDetailDto>>(userTestResults);
        }
    }
} 
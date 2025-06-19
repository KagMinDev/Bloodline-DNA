using ADNTester.BO.DTOs.Payment;
using ADNTester.BO.DTOs.TestKit;
using ADNTester.BO.Entities;
using ADNTester.BO.Enums;
using ADNTester.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Net.payOS;
using Net.payOS.Types;
using System;
using System.Threading.Tasks;

namespace ADNTester.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly ITestBookingService _bookingService;
        private readonly IConfiguration _configuration;
        private readonly ITestKitService _testKitService;
        private readonly ITestServiceService _testServiceService;

        public PaymentController(
            IPaymentService paymentService,
            ITestBookingService bookingService,
            IConfiguration configuration,
            ITestKitService testKitService,
            ITestServiceService testServiceService)
        {
            _paymentService = paymentService;
            _bookingService = bookingService;
            _configuration = configuration;
            _testKitService = testKitService;
            _testServiceService = testServiceService;
        }

        [HttpPost("{bookingId}/checkout")]
        public async Task<IActionResult> Create(string bookingId)
        {
            try
            {
                // Lấy thông tin booking theo ID
                var booking = await _bookingService.GetByIdAsync(bookingId);

                if (booking == null)
                {
                    Console.WriteLine($"Không tìm thấy đơn đặt lịch với ID: {bookingId}");
                    return NotFound(new { error = "Không tìm thấy đơn đặt lịch." });
                }

                if (booking.Status != "Pending")
                {
                    Console.WriteLine($"Trạng thái booking không hợp lệ: {booking.Status}");
                    return BadRequest(new { error = "Chỉ có thể thanh toán cho đơn đặt lịch ở trạng thái Pending." });
                }

                // Kiểm tra thông tin số tiền
                if (booking.Price <= 0 || booking.Price > int.MaxValue)
                {
                    Console.WriteLine($"Amount không hợp lệ: {booking.Price}");
                    return BadRequest(new { error = "Số tiền thanh toán không hợp lệ." });
                }

                int amountToPay = (int)Math.Round(booking.Price);
                decimal depositAmount = amountToPay * 0.2m;
                decimal remainingAmount = amountToPay - depositAmount;

                // Lấy thông tin cấu hình PayOS
                var clientId = _configuration["PayOS:ClientId"];
                var apiKey = _configuration["PayOS:ApiKey"];
                var checksumKey = _configuration["PayOS:ChecksumKey"];

                if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(checksumKey))
                {
                    return BadRequest(new { error = "Thông tin cấu hình PayOS bị thiếu hoặc không hợp lệ." });
                }

                // Khởi tạo PayOS với thông tin cấu hình
                var payOS = new PayOS(clientId, apiKey, checksumKey);
                var domain = "https://colordanhub.site";

                // Chuyển đổi `orderCode` sang một giá trị hợp lệ
                var orderCode = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

                var description = $"Đặt cọc dịch vụ xét nghiệm {bookingId}";
                if (description.Length > 25)
                {
                    description = description.Substring(0, 25); // Giới hạn 25 ký tự theo yêu cầu của PayOS
                }

                // Cấu hình dữ liệu thanh toán
                var paymentLinkRequest = new PaymentData(
                    orderCode: orderCode,
                    amount: (int)Math.Round(depositAmount),
                    description: description,
                    items: [new("Đặt cọc dịch vụ xét nghiệm", 1, (int)Math.Round(depositAmount))],
                    returnUrl: $"{domain}/checkout-success",
                    
                    cancelUrl: $"{domain}/checkcancel"

                );

                // Gọi API để tạo liên kết thanh toán
                var response = await payOS.createPaymentLink(paymentLinkRequest);

                if (!string.IsNullOrEmpty(response.checkoutUrl))
                {
                    // Chỉ trả về thông tin thanh toán, không lưu vào database
                    return Ok(new { 
                        checkoutUrl = response.checkoutUrl,
                        qrCode = response.qrCode,
                        orderCode = orderCode,
                        amount = depositAmount,
                        bookingId = bookingId
                    });
                }

                return StatusCode(500, new { error = "Không thể tạo liên kết thanh toán. Vui lòng thử lại." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi tạo liên kết thanh toán: {ex.Message}");
                return StatusCode(500, new { error = "Đã xảy ra lỗi trong quá trình xử lý thanh toán." });
            }
        }

        [HttpPost("{bookingId}/remaining-payment")]
        public async Task<IActionResult> CreateRemainingPayment(string bookingId)
        {
            try
            {
                // Lấy thông tin booking theo ID
                var booking = await _bookingService.GetByIdAsync(bookingId);

                if (booking == null)
                {
                    Console.WriteLine($"Không tìm thấy đơn đặt lịch với ID: {bookingId}");
                    return NotFound(new { error = "Không tìm thấy đơn đặt lịch." });
                }

                // Kiểm tra trạng thái booking
                if (booking.Status == "Confirmed")
                {
                    Console.WriteLine($"Đơn đặt lịch đã được xác nhận: {bookingId}");
                    return BadRequest(new { error = "Đơn đặt lịch đã được xác nhận, không thể thanh toán thêm." });
                }

                if (booking.Status != "KitSend")
                {
                    Console.WriteLine($"Trạng thái booking không hợp lệ: {booking.Status}");
                    return BadRequest(new { error = "Chỉ có thể thanh toán số tiền còn lại khi đã nhận mẫu xét nghiệm." });
                }

                // Lấy thông tin payment hiện tại
                var currentPayment = await _paymentService.GetByBookingIdAsync(bookingId);
                if (currentPayment == null || currentPayment.Status != PaymentStatus.Deposited)
                {
                    return BadRequest(new { error = "Chưa tìm thấy thông tin đặt cọc hoặc trạng thái không hợp lệ." });
                }

                if (currentPayment.Status == PaymentStatus.Paid)
                {
                    Console.WriteLine($"Đơn đặt lịch đã được thanh toán đầy đủ: {bookingId}");
                    return BadRequest(new { error = "Đơn đặt lịch đã được thanh toán đầy đủ, không thể thanh toán thêm." });
                }

                // Kiểm tra số tiền còn lại
                if (currentPayment.RemainingAmount <= 0)
                {
                    return BadRequest(new { error = "Không có số tiền còn lại cần thanh toán." });
                }

                // Lấy thông tin cấu hình PayOS
                var clientId = _configuration["PayOS:ClientId"];
                var apiKey = _configuration["PayOS:ApiKey"];
                var checksumKey = _configuration["PayOS:ChecksumKey"];

                if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(checksumKey))
                {
                    return BadRequest(new { error = "Thông tin cấu hình PayOS bị thiếu hoặc không hợp lệ." });
                }

                // Khởi tạo PayOS
                var payOS = new PayOS(clientId, apiKey, checksumKey);
                var domain = "https://colordanhub.site";

                // Tạo orderCode mới
                var orderCode = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

                var description = $"Thanh toán số tiền còn lại - Đơn xét nghiệm {bookingId}";
                if (description.Length > 25)
                {
                    description = description.Substring(0, 25);
                }

                // Cấu hình dữ liệu thanh toán
                var paymentLinkRequest = new PaymentData(
     orderCode: orderCode,
     amount: (int)Math.Round(currentPayment.RemainingAmount ?? 0), // Handle null case
     description: description,
     items: [new("Thanh toán số tiền còn lại", 1, (int)Math.Round(currentPayment.RemainingAmount ?? 0))], // Handle null case
     returnUrl: $"{domain}/checkout-success",
                    
                    cancelUrl: $"{domain}/checkcancel"
 );

                // Gọi API để tạo liên kết thanh toán
                var response = await payOS.createPaymentLink(paymentLinkRequest);

                if (!string.IsNullOrEmpty(response.checkoutUrl))
                {
                    return Ok(new { 
                        checkoutUrl = response.checkoutUrl,
                        qrCode = response.qrCode,
                        orderCode = orderCode,
                        amount = currentPayment.RemainingAmount,
                        bookingId = bookingId
                    });
                }

                return StatusCode(500, new { error = "Không thể tạo liên kết thanh toán. Vui lòng thử lại." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi tạo liên kết thanh toán số tiền còn lại: {ex.Message}");
                return StatusCode(500, new { error = "Đã xảy ra lỗi trong quá trình xử lý thanh toán." });
            }
        }

        [HttpPost("callback")]
        public async Task<IActionResult> PaymentCallback([FromBody] PaymentCallbackDto callback)
        {
            try
            {
                if (callback == null)
                {
                    return BadRequest(new { error = "Dữ liệu callback không hợp lệ." });
                }

                // Xác thực callback từ PayOS
                var clientId = _configuration["PayOS:ClientId"];
                var apiKey = _configuration["PayOS:ApiKey"];
                var checksumKey = _configuration["PayOS:ChecksumKey"];
                var payOS = new PayOS(clientId, apiKey, checksumKey);

                // Kiểm tra trạng thái thanh toán
                if (callback.status == "PAID")
                {
                    // Lấy thông tin booking từ orderCode
                    var booking = await _bookingService.GetByIdAsync(callback.bookingId);
                    if (booking == null)
                    {
                        return NotFound(new { error = "Không tìm thấy đơn đặt lịch." });
                    }

                    decimal amountToPay = booking.Price;
                    decimal depositAmount = amountToPay * 0.2m;
                    decimal remainingAmount = amountToPay - depositAmount;

                    // Tạo payment record
                    var paymentDto = new CreatePaymentDto
                    {
                        BookingId = callback.bookingId,
                        OrderCode = Convert.ToInt64(callback.orderCode),
                        Amount = amountToPay,
                        DepositAmount = depositAmount,
                        RemainingAmount = remainingAmount,
                        Description = $"Đặt cọc dịch vụ xét nghiệm {callback.bookingId}",
                        Status = PaymentStatus.Deposited
                    };

                    await _paymentService.CreateAsync(paymentDto);


                    // Cập nhật trạng thái booking thành PreparingKit
                    await _bookingService.UpdateBookingStatusAsync(callback.bookingId, BookingStatus.PreparingKit);

                    // Nếu là lấy mẫu tại nhà, tạo TestKit sau khi thanh toán cọc
                    if (booking.CollectionMethod == SampleCollectionMethod.SelfSample.ToString())
                    {
                        // Lấy thông tin TestService để lấy SampleCount
                        var testService = await _testServiceService.GetByIdAsync(booking.TestServiceId);
                        if (testService == null)
                        {
                            return BadRequest(new { error = "Không tìm thấy thông tin dịch vụ xét nghiệm." });
                        }

                        var testKit = new CreateTestKitDto
                        {
                            BookingId = booking.Id,
                            ShippedAt = DateTime.UtcNow,
                            ReceivedAt = null,
                            SampleCount = testService.SampleCount // Thêm SampleCount từ TestService
                        };

                        await _testKitService.CreateAsync(testKit);
                    }

                  

                    return Ok(new { message = "Xử lý thanh toán thành công." });
                }

                return Ok(new { message = "Đã nhận callback." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi xử lý callback: {ex.Message}");
                return StatusCode(500, new { error = "Đã xảy ra lỗi trong quá trình xử lý callback." });
            }
        }

        [HttpPost("remaining-callback")]
        public async Task<IActionResult> RemainingPaymentCallback([FromBody] PaymentCallbackDto callback)
        {
            try
            {
                if (callback == null)
                {
                    return BadRequest(new { error = "Dữ liệu callback không hợp lệ." });
                }

                // Xác thực callback từ PayOS
                var clientId = _configuration["PayOS:ClientId"];
                var apiKey = _configuration["PayOS:ApiKey"];
                var checksumKey = _configuration["PayOS:ChecksumKey"];
                var payOS = new PayOS(clientId, apiKey, checksumKey);

                // Kiểm tra trạng thái thanh toán
                if (callback.status == "PAID")
                {
                    // Lấy thông tin booking từ orderCode
                    var booking = await _bookingService.GetByIdAsync(callback.bookingId);
                    if (booking == null)
                    {
                        return NotFound(new { error = "Không tìm thấy đơn đặt lịch." });
                    }

                    // Lấy thông tin payment hiện tại
                    var currentPayment = await _paymentService.GetByBookingIdAsync(callback.bookingId);
                    if (currentPayment == null || currentPayment.Status != PaymentStatus.Deposited)
                    {
                        return BadRequest(new { error = "Không tìm thấy thông tin đặt cọc hoặc trạng thái không hợp lệ." });
                    }

                    // Cập nhật trạng thái payment thành Paid
                    await _paymentService.UpdatePaymentStatusAsync(callback.bookingId, PaymentStatus.Paid);
                    
                    // Cập nhật trạng thái booking thành Confirmed
                    await _bookingService.UpdateBookingStatusAsync(callback.bookingId, BookingStatus.Confirmed);

                    return Ok(new { message = "Xử lý thanh toán số tiền còn lại thành công." });
                }

                return Ok(new { message = "Đã nhận callback." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi xử lý callback thanh toán số tiền còn lại: {ex.Message}");
                return StatusCode(500, new { error = "Đã xảy ra lỗi trong quá trình xử lý callback." });
            }
        }
    }

    public class PaymentCallbackDto
    {
        public string orderCode { get; set; }
        public string status { get; set; }
        public string bookingId { get; set; }
    }
} 
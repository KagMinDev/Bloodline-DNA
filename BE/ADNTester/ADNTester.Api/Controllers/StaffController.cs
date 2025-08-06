using ADNTester.BO.DTOs.Common;
using ADNTester.BO.DTOs.Logistic;
using ADNTester.BO.Enums;
using ADNTester.Service.Implementations;
using ADNTester.Service.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ADNTester.Api.Controllers
{
    [ApiController]
    [Route("api/staff")]
    [Authorize(Roles = "Staff")] // Ensure only staff can access
    public class StaffController : ControllerBase
    {
        private readonly ILogisticService _logisticsService;
        private readonly ITestBookingService _testBookingService;
        private readonly ICloudinaryService _cloudinaryService;
        private readonly IMapper _mapper;

        public StaffController(ILogisticService logisticsService, 
            ITestBookingService testBookingService,
            ICloudinaryService cloudinaryService,
            IMapper mapper)
        {
            _logisticsService = logisticsService;
            _testBookingService = testBookingService;
            _cloudinaryService = cloudinaryService;
            _mapper = mapper;

        }
        #region Logistic
        /// <summary>
        /// Lấy danh sách nhiệm vụ logistics đã được giao cho nhân viên đang đăng nhập.
        /// </summary>
        /// <param name="type">Loại nhiệm vụ: Delivery hoặc Pickup (tùy chọn)</param>
        /// <param name="status">Trạng thái nhiệm vụ (tùy chọn)</param>
        /// <returns>Danh sách nhiệm vụ logistics đã được giao</returns>
        [HttpGet("/logistics/assigned")]
        public async Task<IActionResult> GetAssignedTasks([FromQuery] LogisticsType? type,
                                                            [FromQuery] LogisticStatus? status)
        {
            var staffId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(staffId))
                return Unauthorized("Staff ID not found");

            var tasks = await _logisticsService.GetAssignedLogisticsAsync(staffId, type);
            var mapped = _mapper.Map<List<LogisticsInfoDto>>(tasks);
            return Ok(new ApiResponse<List<LogisticsInfoDto>>(mapped, "Lấy danh sách nhiệm vụ thành công"));
        }

        /// <summary>
        /// Đánh dấu nhiệm vụ logistics là đã hoàn thành.
        /// </summary>
        /// <param name="id">ID nhiệm vụ logistics</param>
        /// <param name="evidence">Ảnh minh chứng</param>
        /// <returns></returns>
        [HttpPut("/logistics/{id}/complete")]
        public async Task<IActionResult> CompleteLogisticsTask(
            string id,
            IFormFile evidence)
        {
            var staffId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(staffId))
                return Unauthorized("Staff ID not found");

            if (evidence == null || evidence.Length == 0)
                return BadRequest("Vui lòng tải lên ảnh minh chứng.");

            // 📷 Upload image
            var imageUrl = await _cloudinaryService.UploadImageAsync(evidence, "logistics");

            // ✅ Mark complete with image URL
            await _logisticsService.CompleteLogisticsTaskAsync(id, staffId, imageUrl);

            return NoContent();
        }
        /// <summary>
        /// Lấy KitId tương ứng với nhiệm vụ logistics (pickup hoặc delivery).
        /// </summary>
        /// <param name="id">ID của nhiệm vụ logistics</param>
        /// <returns>KitId nếu tồn tại</returns>
        [HttpGet("/logistics/{id}/kit-id")]
        public async Task<IActionResult> GetKitIdByLogisticsId([FromRoute] string id)
        {
            // 🧪 Gọi service để lấy KitId
            var kitId = await _logisticsService.GetKitIdByLogisticsIdAsync(id);

            if (string.IsNullOrEmpty(kitId))
                return NotFound($"Không tìm thấy Kit nào tương ứng với logistics ID: {id}");

            return Ok(new { KitId = kitId });
        }


        #endregion

        #region Booking
        /// <summary>
        /// Lọc danh sách đặt lịch theo phương thức lấy mẫu và ngày hẹn.
        /// </summary>
        /// <param name="method">Phương thức lấy mẫu: SelfSample hoặc AtFacility</param>
        /// <param name="appointDate">Ngày hẹn (yyyy-MM-dd)</param>
        /// <returns>Danh sách đặt lịch phù hợp</returns>
        [HttpGet("/bookings/filter")]
        public async Task<IActionResult> GetFilteredBookings(
            [FromQuery] SampleCollectionMethod? method,
            [FromQuery] DateTime? appointDate)
        {
            var bookings = await _testBookingService.GetFilteredBookingsAsync(method, appointDate);
            return Ok(bookings);
        }
        /// <summary>
        /// Check-in xác nhận người dùng đã đến phòng khám.
        /// </summary>
        /// <param name="bookingId">ID của lượt đặt lịch</param>
        /// <returns>Kết quả check-in</returns>
        [HttpPut("/bookings/{bookingId}/check-in")]
        public async Task<IActionResult> CheckIn(string bookingId)
        {
            var success = await _testBookingService.CheckInAsync(bookingId);
            if (!success)
            {
                return BadRequest(new ApiResponse<string>(null,"Không thể check-in. Vui lòng kiểm tra trạng thái hoặc phương thức lấy mẫu.", HttpCodes.BadRequest));
            }

            return Ok(new ApiResponse<string>(bookingId, "Check-in thành công.", HttpCodes.Ok));
        }
        #endregion
    }
}

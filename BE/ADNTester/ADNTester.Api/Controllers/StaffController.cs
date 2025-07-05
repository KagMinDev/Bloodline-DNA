using ADNTester.BO.Enums;
using ADNTester.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ADNTester.Api.Controllers
{
    [ApiController]
    [Route("api/staff/logistics")]
    [Authorize(Roles = "Staff")] // Ensure only staff can access
    public class StaffController : ControllerBase
    {
        private readonly ILogisticService _logisticsService;
        private readonly ITestBookingService _testBookingService;

        public StaffController(ILogisticService logisticsService, 
            ITestBookingService testBookingService)
        {
            _logisticsService = logisticsService;
            _testBookingService = testBookingService;
        }

        /// <summary>
        /// Lấy danh sách nhiệm vụ logistics đã được giao cho nhân viên đang đăng nhập.
        /// </summary>
        /// <param name="type">Loại nhiệm vụ: Delivery hoặc Pickup (tùy chọn)</param>
        /// <returns>Danh sách nhiệm vụ logistics đã được giao</returns>
        [HttpGet("assigned")]
        public async Task<IActionResult> GetAssignedTasks([FromQuery] LogisticsType? type)
        {
            var staffId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(staffId))
                return Unauthorized("Staff ID not found");

            var tasks = await _logisticsService.GetAssignedLogisticsAsync(staffId, type);
            return Ok(tasks);
        }

        /// <summary>
        /// Đánh dấu nhiệm vụ logistics là đã hoàn thành.
        /// </summary>
        /// <param name="id">ID nhiệm vụ logistics</param>
        /// <returns>Trạng thái hoàn thành</returns>
        [HttpPut("{id}/complete")]
        public async Task<IActionResult> CompleteLogisticsTask(string id)
        {
            var staffId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(staffId))
                return Unauthorized("Staff ID not found");

            await _logisticsService.CompleteLogisticsTaskAsync(id, staffId);
            return NoContent();
        }
        /// <summary>
        /// Lọc danh sách đặt lịch theo phương thức lấy mẫu và ngày hẹn.
        /// </summary>
        /// <param name="method">Phương thức lấy mẫu: SelfSample hoặc AtFacility</param>
        /// <param name="appointDate">Ngày hẹn (yyyy-MM-dd)</param>
        /// <returns>Danh sách đặt lịch phù hợp</returns>
        [HttpGet("bookings/filter")]
        public async Task<IActionResult> GetFilteredBookings(
            [FromQuery] SampleCollectionMethod? method,
            [FromQuery] DateTime? appointDate)
        {
            var bookings = await _testBookingService.GetFilteredBookingsAsync(method, appointDate);
            return Ok(bookings);
        }
    }
}

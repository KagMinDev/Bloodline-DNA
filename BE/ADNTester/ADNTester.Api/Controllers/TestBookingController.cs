using ADNTester.BO.DTOs;
using ADNTester.BO.DTOs.Common;
using ADNTester.BO.DTOs.TestBooking;
using ADNTester.BO.DTOs.TestKit;
using ADNTester.BO.Enums;
using ADNTester.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADNTester.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TestBookingController : ControllerBase
    {
        private readonly ITestBookingService _testBookingService;
        private readonly ITestKitService _testKitService;
        private readonly ITestServiceService _testServiceService;

        public TestBookingController(
            ITestBookingService testBookingService, 
            ITestKitService testKitService,
            ITestServiceService testServiceService)
        {
            _testBookingService = testBookingService;
            _testKitService = testKitService;
            _testServiceService = testServiceService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TestBookingDto>>> GetAll()
        {
            var bookings = await _testBookingService.GetAllAsync();
            return Ok(new ApiResponse<IEnumerable<TestBookingDto>>(bookings, "Lấy danh sách đặt lịch thành công"));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TestBookingDetailDto>> GetById(string id)
        {
            var booking = await _testBookingService.GetByIdAsync(id);
            if (booking == null)
                return NotFound(new ApiResponse<string>("Không tìm thấy booking trên", 404));

            return Ok(new ApiResponse<TestBookingDetailDto>(booking, "Thông tin booking"));
        }

        [HttpGet("completed")]
        public async Task<ActionResult<IEnumerable<TestBookingDto>>> GetBookingComplete()
        {
            var bookings = await _testBookingService.GetCompletedBookingsAsync();
            if (bookings == null || !bookings.Any())
                return NotFound(new ApiResponse<string>("Không tìm thấy Booking đã hoàn thành", 404));

            return Ok(new ApiResponse<IEnumerable<TestBookingDto>>(bookings, "Thông tin Booking"));
        }

        [HttpPost]
        public async Task<ActionResult<string>> Create(CreateTestBookingDto dto)
        {
            try
            {
                var bookingId = await _testBookingService.CreateWithTestKitAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = bookingId }, new ApiResponse<string>(bookingId, "Tạo Booking thành công", 200));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<string>(ex.Message, 400));
            }
        }

        [HttpPut]
        public async Task<IActionResult> Update(UpdateTestBookingDto dto)
        {
            var result = await _testBookingService.UpdateAsync(dto);
            if (!result)
                return NotFound(new ApiResponse<string>("Không tìm thấy đặt lịch để cập nhật", 404));

            return Ok(new ApiResponse<string>(dto.Id, "Cập nhật đặt lịch thành công"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _testBookingService.DeleteAsync(id);
            if (!result)
                return NotFound(new ApiResponse<string>("Không tìm thấy đặt lịch để xóa", 404));

            return Ok(new ApiResponse<string>(id, "Xóa đặt lịch thành công"));
        }

        [HttpPut("{bookingId}/status")]
        public async Task<IActionResult> UpdateStatus(string bookingId, BookingStatus newStatus)
        {
            var result = await _testBookingService.UpdateBookingStatusAsync(bookingId, newStatus);
            if (!result)
                return NotFound(new ApiResponse<string>("Không tìm thấy đặt lịch để cập nhật", 404));

            return Ok(new ApiResponse<string>(bookingId, "Cập nhật đặt lịch thành công"));
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<TestBookingDetailDto>>> GetBookingByUserId(string userId)
        {
            var bookings = await _testBookingService.GetBookingByUserId(userId);
            if (bookings == null || !bookings.Any())
            {
                return NotFound("No bookings found for this user");
            }
            return Ok(bookings);
        }
        /// <summary>
        /// [VI] Xác nhận rằng client đã nhận được kit xét nghiệm.
        /// </summary>
        /// <param name="bookingId">ID của đặt lịch</param>
        /// <returns>Thông báo kết quả xác nhận</returns>
        [HttpPut("{bookingId}/confirm-delivery")]
        public async Task<IActionResult> ConfirmKitReceived(string bookingId)
        {
            try
            {
                var result = await _testBookingService.ConfirmKitReceivedAsync(bookingId);

                if (!result)
                    return BadRequest(new ApiResponse<string>("Không thể xác nhận. Vui lòng thử lại hoặc kiểm tra trạng thái giao hàng."));

                return Ok(new ApiResponse<string>(bookingId, "Xác nhận nhận kit thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<string>(ex.Message));
            }
        }

    }
} 
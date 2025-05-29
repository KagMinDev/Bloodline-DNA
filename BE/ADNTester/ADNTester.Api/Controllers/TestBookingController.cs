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
            return Ok(new ApiResponse<IEnumerable<TestBookingDto>>(bookings, "L?y danh sách ??t l?ch thành công"));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TestBookingDto>> GetById(string id)
        {
            var booking = await _testBookingService.GetByIdAsync(id);
            if (booking == null)
                return NotFound(new ApiResponse<string>("Không tìm th?y ??t l?ch", 404));

            return Ok(new ApiResponse<TestBookingDto>(booking, "Thông tin ??t l?ch"));
        }

        [HttpPost]
        public async Task<ActionResult<string>> Create(CreateTestBookingDto dto)
        {
            try
            {
                var bookingId = await _testBookingService.CreateWithTestKitAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = bookingId }, new ApiResponse<string>(bookingId, "T?o ??t l?ch thành công", 201));
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
                return NotFound(new ApiResponse<string>("Không tìm th?y ??t l?ch ?? c?p nh?t", 404));

            return Ok(new ApiResponse<string>(dto.Id, "C?p nh?t ??t l?ch thành công"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _testBookingService.DeleteAsync(id);
            if (!result)
                return NotFound(new ApiResponse<string>("Không tìm th?y ??t l?ch ?? xóa", 404));

            return Ok(new ApiResponse<string>(id, "Xóa ??t l?ch thành công"));
        }
        [HttpPut("{bookingId}")]
        public async Task<IActionResult> UpdateStatus(string bookingId, BookingStatus newStatus)
        {
            var result = await _testBookingService.UpdateBookingStatusAsync(bookingId,newStatus);
            if (!result)
                return NotFound(new ApiResponse<string>("Không tìm th?y ??t l?ch ?? c?p nh?t", 404));

            return Ok(new ApiResponse<string>(bookingId, "C?p nh?t ??t l?ch thành công"));
        }
    }
} 
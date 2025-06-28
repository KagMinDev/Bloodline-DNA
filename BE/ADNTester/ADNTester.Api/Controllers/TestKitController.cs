using ADNTester.BO.DTOs;
using ADNTester.BO.DTOs.Common;
using ADNTester.BO.DTOs.TestKit;
using ADNTester.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADNTester.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TestKitController : ControllerBase
    {
        private readonly ITestKitService _testKitService;

        public TestKitController(ITestKitService testKitService)
        {
            _testKitService = testKitService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TestKitDto>>> GetAll()
        {
            var testKits = await _testKitService.GetAllAsync();
            return Ok(new ApiResponse<IEnumerable<TestKitDto>>(testKits, "Lấy danh sách kit xét nghiệm thành công"));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TestKitDto>> GetById(string id)
        {
            var testKit = await _testKitService.GetByIdAsync(id);
            if (testKit == null)
                return NotFound(new ApiResponse<string>("Không tìm thấy kit xét nghiệm", 404));

            return Ok(new ApiResponse<TestKitDto>(testKit, "Thông tin kit xét nghiệm"));
        }

        [HttpGet("booking/{bookingId}")]
        public async Task<ActionResult<TestKitDto>> GetByBookingId(string bookingId)
        {
            var testKit = await _testKitService.GetByBookingIdAsync(bookingId);
            if (testKit == null)
                return NotFound(new ApiResponse<string>("Không tìm thấy kit xét nghiệm cho booking này", 404));

            return Ok(new ApiResponse<TestKitDto>(testKit, "Thông tin kit xét nghiệm theo booking"));
        }

        [HttpPost]
        public async Task<ActionResult<string>> Create(CreateTestKitDto dto)
        {
            var id = await _testKitService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, new ApiResponse<string>(id, "Tạo kit xét nghiệm thành công", 201));
        }

        [HttpPut]
        public async Task<IActionResult> Update(UpdateTestKitDto dto)
        {
            var result = await _testKitService.UpdateAsync(dto);
            if (!result)
                return NotFound(new ApiResponse<string>("Không tìm thấy kit xét nghiệm để cập nhật", 404));

            return Ok(new ApiResponse<string>(dto.Id, "Cập nhật kit xét nghiệm thành công"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _testKitService.DeleteAsync(id);
            if (!result)
                return NotFound(new ApiResponse<string>("Không tìm thấy kit xét nghiệm để xóa", 404));

            return Ok(new ApiResponse<string>(id, "Xóa kit xét nghiệm thành công"));
        }
    }
} 
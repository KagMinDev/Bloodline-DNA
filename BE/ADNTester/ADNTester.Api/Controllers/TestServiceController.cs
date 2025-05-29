using ADNTester.BO.DTOs;
using ADNTester.BO.DTOs.Common;
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
    public class TestServiceController : ControllerBase
    {
        private readonly ITestServiceService _testServiceService;

        public TestServiceController(ITestServiceService testServiceService)
        {
            _testServiceService = testServiceService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TestServiceDto>>> GetAll()
        {
            var testServices = await _testServiceService.GetAllAsync();
            return Ok(new ApiResponse<IEnumerable<TestServiceDto>>(testServices, "Lấy danh sách dịch vụ xét nghiệm thành công"));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TestServiceDto>> GetById(string id)
        {
            var testService = await _testServiceService.GetByIdAsync(id);
            if (testService == null)
                return NotFound(new ApiResponse<string>("Không tìm thấy dịch vụ xét nghiệm", 404));

            return Ok(new ApiResponse<TestServiceDto>(testService, "Thông tin dịch vụ xét nghiệm"));
        }

        [HttpPost]
        public async Task<ActionResult<string>> Create(CreateTestServiceDto dto)
        {
            var id = await _testServiceService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, new ApiResponse<string>(id, "Tạo dịch vụ xét nghiệm thành công", 201));
        }

        [HttpPut]
        public async Task<IActionResult> Update(UpdateTestServiceDto dto)
        {
            var result = await _testServiceService.UpdateAsync(dto);
            if (!result)
                return NotFound(new ApiResponse<string>("Không tìm thấy dịch vụ xét nghiệm để cập nhật", 404));

            return Ok(new ApiResponse<string>(dto.Id, "Cập nhật dịch vụ xét nghiệm thành công"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _testServiceService.DeleteAsync(id);
            if (!result)
                return NotFound(new ApiResponse<string>("Không tìm thấy dịch vụ xét nghiệm để xóa", 404));

            return Ok(new ApiResponse<string>(id, "Xóa dịch vụ xét nghiệm thành công"));
        }
    }
} 
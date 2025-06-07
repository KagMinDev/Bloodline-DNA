using ADNTester.BO.DTOs.Common;
using ADNTester.BO.DTOs.TestSample;
using ADNTester.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace ADNTester.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TestSampleController : ControllerBase
    {
        private readonly ITestSampleService _testSampleService;

        public TestSampleController(ITestSampleService testSampleService)
        {
            _testSampleService = testSampleService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TestSampleDto>>> GetAll()
        {
            var testSamples = await _testSampleService.GetAllAsync();
            return Ok(new ApiResponse<IEnumerable<TestSampleDto>>(testSamples, "Lấy danh sách mẫu xét nghiệm thành công"));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TestSampleDto>> GetById(string id)
        {
            var testSample = await _testSampleService.GetByIdAsync(id);
            if (testSample == null)
                return NotFound(new ApiResponse<string>("Không tìm thấy mẫu xét nghiệm", 404));

            return Ok(new ApiResponse<TestSampleDto>(testSample, "Thông tin mẫu xét nghiệm"));
        }

        [HttpPost]
        public async Task<ActionResult<string>> Create(CreateTestSampleDto dto)
        {
            var id = await _testSampleService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, new ApiResponse<string>(id, "Tạo mẫu xét nghiệm thành công", 201));
        }

        [HttpPut]
        public async Task<IActionResult> Update(UpdateTestSampleDto dto)
        {
            var result = await _testSampleService.UpdateAsync(dto);
            if (!result)
                return NotFound(new ApiResponse<string>("Không tìm thấy mẫu xét nghiệm để cập nhật", 404));

            return Ok(new ApiResponse<string>(dto.Id, "Cập nhật mẫu xét nghiệm thành công"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _testSampleService.DeleteAsync(id);
            if (!result)
                return NotFound(new ApiResponse<string>("Không tìm thấy mẫu xét nghiệm để xóa", 404));

            return Ok(new ApiResponse<string>(id, "Xóa mẫu xét nghiệm thành công"));
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<TestSampleDetailDto>>> GetTestSampleByUserId(string userId)
        {
            var samples = await _testSampleService.GetTestSampleByUserId(userId);
            if (samples == null || !samples.Any())
            {
                return NotFound("No test samples found for this user");
            }
            return Ok(samples);
        }

        [HttpGet("kit/{kitId}")]
        public async Task<ActionResult<TestSampleDto>> GetTestSampleByKitId(string kitId)
        {
            var sample = await _testSampleService.GetTestSampleByKitId(kitId);
            if (sample == null)
            {
                return NotFound("Test sample not found");
            }
            return Ok(sample);
        }
    }
} 
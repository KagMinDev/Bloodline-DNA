using ADNTester.BO.DTOs;
using ADNTester.BO.DTOs.TestResult;
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
    public class TestResultController : ControllerBase
    {
        private readonly ITestResultService _testResultService;

        public TestResultController(ITestResultService testResultService)
        {
            _testResultService = testResultService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TestResultDetailDto>>> GetAll()
        {
            var testResults = await _testResultService.GetAllAsync();
            return Ok(testResults);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TestResultDetailDto>> GetById(string id)
        {
            var testResult = await _testResultService.GetByIdAsync(id);
            if (testResult == null)
                return NotFound();

            return Ok(testResult);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<TestResultDetailDto>>> GetByUserId(string userId)
        {
            var testResults = await _testResultService.GetTestResultsByUserIdAsync(userId);
            return Ok(testResults);
        }

        [HttpPost]
        public async Task<ActionResult<string>> Create(CreateTestResultDto dto)
        {
            var id = await _testResultService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        [HttpPost("with-file")]
        public async Task<ActionResult<string>> CreateWithFile([FromForm] CreateTestResultWithFileDto dto)
        {
            var id = await _testResultService.CreateWithFileAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        [HttpPut]
        public async Task<IActionResult> Update(UpdateTestResultDto dto)
        {
            var result = await _testResultService.UpdateAsync(dto);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpPut("with-file")]
        public async Task<IActionResult> UpdateWithFile([FromForm] UpdateTestResultWithFileDto dto)
        {
            var result = await _testResultService.UpdateWithFileAsync(dto);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _testResultService.DeleteAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
} 
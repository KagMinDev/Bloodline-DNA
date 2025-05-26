using ADNTester.BO.DTOs.TestSample;
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
            return Ok(testSamples);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TestSampleDto>> GetById(string id)
        {
            var testSample = await _testSampleService.GetByIdAsync(id);
            if (testSample == null)
                return NotFound();

            return Ok(testSample);
        }

        [HttpPost]
        public async Task<ActionResult<string>> Create(CreateTestSampleDto dto)
        {
            var id = await _testSampleService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        [HttpPut]
        public async Task<IActionResult> Update(UpdateTestSampleDto dto)
        {
            var result = await _testSampleService.UpdateAsync(dto);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _testSampleService.DeleteAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
} 
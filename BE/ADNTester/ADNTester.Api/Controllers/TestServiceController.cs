using ADNTester.BO.DTOs;
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
            return Ok(testServices);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TestServiceDto>> GetById(string id)
        {
            var testService = await _testServiceService.GetByIdAsync(id);
            if (testService == null)
                return NotFound();

            return Ok(testService);
        }

        [HttpPost]
        public async Task<ActionResult<string>> Create(CreateTestServiceDto dto)
        {
            var id = await _testServiceService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        [HttpPut]
        public async Task<IActionResult> Update(UpdateTestServiceDto dto)
        {
            var result = await _testServiceService.UpdateAsync(dto);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _testServiceService.DeleteAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
} 
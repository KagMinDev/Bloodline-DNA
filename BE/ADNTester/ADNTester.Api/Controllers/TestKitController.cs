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
            return Ok(testKits);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TestKitDto>> GetById(string id)
        {
            var testKit = await _testKitService.GetByIdAsync(id);
            if (testKit == null)
                return NotFound();

            return Ok(testKit);
        }

        [HttpPost]
        public async Task<ActionResult<string>> Create(CreateTestKitDto dto)
        {
            var id = await _testKitService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        [HttpPut]
        public async Task<IActionResult> Update(UpdateTestKitDto dto)
        {
            var result = await _testKitService.UpdateAsync(dto);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _testKitService.DeleteAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
} 
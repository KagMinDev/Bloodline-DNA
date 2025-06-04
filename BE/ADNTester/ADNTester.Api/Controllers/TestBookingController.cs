using ADNTester.BO.DTOs.TestBooking;
using ADNTester.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

        public TestBookingController(ITestBookingService testBookingService)
        {
            _testBookingService = testBookingService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TestBookingDto>>> GetAll()
        {
            var bookings = await _testBookingService.GetAllAsync();
            return Ok(bookings);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TestBookingDto>> GetById(string id)
        {
            var booking = await _testBookingService.GetByIdAsync(id);
            if (booking == null)
                return NotFound();

            return Ok(booking);
        }

        [HttpPost]
        public async Task<ActionResult<string>> Create(CreateTestBookingDto dto)
        {
            try
            {
                var bookingId = await _testBookingService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = bookingId }, bookingId);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> Update(UpdateTestBookingDto dto)
        {
            var result = await _testBookingService.UpdateAsync(dto);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _testBookingService.DeleteAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
} 
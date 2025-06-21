using ADNTester.BO.Enums;
using ADNTester.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ADNTester.Api.Controllers
{
    [ApiController]
    [Route("api/staff/logistics")]
    [Authorize(Roles = "Staff")] // Ensure only staff can access
    public class StaffController : ControllerBase
    {
        private readonly ILogisticService _logisticsService;

        public StaffController(ILogisticService logisticsService)
        {
            _logisticsService = logisticsService;
        }

        // GET: api/staff/logistics/assigned?type=Delivery
        [HttpGet("assigned")]
        public async Task<IActionResult> GetAssignedTasks([FromQuery] LogisticsType? type)
        {
            var staffId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(staffId))
                return Unauthorized("Staff ID not found");

            var tasks = await _logisticsService.GetAssignedLogisticsAsync(staffId, type);
            return Ok(tasks);
        }

        // PUT: api/staff/logistics/{id}/complete
        [HttpPut("{id}/complete")]
        public async Task<IActionResult> CompleteLogisticsTask(string id)
        {
            var staffId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(staffId))
                return Unauthorized("Staff ID not found");

            await _logisticsService.CompleteLogisticsTaskAsync(id, staffId);
            return NoContent();
        }
    }
}

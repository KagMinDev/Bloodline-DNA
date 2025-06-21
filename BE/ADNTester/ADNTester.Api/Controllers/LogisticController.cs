using ADNTester.BO.Enums;
using ADNTester.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ADNTester.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Manager")]
    public class LogisticController : ControllerBase
    {
        private readonly ILogisticService _logisticService;

        public LogisticController(ILogisticService logisticService)
        {
            _logisticService = logisticService;
        }

        // GET: api/Logistic?type=Delivery
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] LogisticsType? type = null)
        {
            var all = await _logisticService.GetAllAsync(type);
            return Ok(all);
        }

        // GET: api/Logistic/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var info = await _logisticService.GetByIdAsync(id);
            if (info == null) return NotFound();
            return Ok(info);
        }

        // PUT: api/Logistic/assign/{logisticsInfoId}?staffId=abc123
        [HttpPut("assign/{logisticsInfoId}")]
        public async Task<IActionResult> AssignStaff(string logisticsInfoId, [FromQuery] string staffId)
        {
            await _logisticService.AssignStaffAsync(logisticsInfoId, staffId);
            return NoContent();
        }
    }
}

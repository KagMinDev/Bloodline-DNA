using ADNTester.BO.DTOs.Common;
using ADNTester.BO.Entities;
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

        /// <summary>
        /// Lấy tất cả nhiệm vụ logistics (giao hoặc nhận mẫu)
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] LogisticsType? type = null, [FromQuery] LogisticStatus? status = null)
        {
            var result = await _logisticService.GetAllAsync(type, status);
            return Ok(new ApiResponse<List<LogisticsInfo>>(result, "Lấy danh sách logistics thành công", HttpCodes.Ok));
        }

        /// <summary>
        /// Lấy thông tin logistics theo ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var info = await _logisticService.GetByIdAsync(id);
            if (info == null)
                return NotFound(new ApiResponse<object>(null, "Không tìm thấy thông tin logistics", HttpCodes.NotFound));

            return Ok(new ApiResponse<LogisticsInfo>(info, "Lấy thông tin logistics thành công", HttpCodes.Ok));
        }

        /// <summary>
        /// Giao nhiệm vụ logistics cho nhân viên
        /// </summary>
        [HttpPut("assign/{logisticsInfoId}")]
        public async Task<IActionResult> AssignStaff(string logisticsInfoId, [FromQuery] string staffId)
        {
            await _logisticService.AssignStaffAsync(logisticsInfoId, staffId);
            return Ok(new ApiResponse<object>(null, "Giao nhiệm vụ thành công", HttpCodes.Ok));
        }

        /// <summary>
        /// Đánh dấu nhiệm vụ logistics đã hoàn thành
        /// </summary>
        [HttpPut("complete/{logisticsInfoId}")]
        public async Task<IActionResult> CompleteTask(string logisticsInfoId, [FromQuery] string staffId)
        {
            await _logisticService.CompleteLogisticsTaskAsync(logisticsInfoId, staffId);
            return Ok(new ApiResponse<object>(null, "Hoàn thành nhiệm vụ thành công", HttpCodes.Ok));
        }

        /// <summary>
        /// Tạo nhiệm vụ logistics mới (giao hoặc nhận)
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LogisticsInfo dto)
        {
            var created = await _logisticService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id },
                new ApiResponse<LogisticsInfo>(created, "Tạo nhiệm vụ logistics thành công", HttpCodes.Created));
        }
    }
}


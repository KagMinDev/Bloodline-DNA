using ADNTester.BO.DTOs.Common;
using ADNTester.BO.DTOs.SampleInstruction;
using ADNTester.BO.Enums;
using ADNTester.Service.Implementations;
using ADNTester.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace ADNTester.Api.Controllers
{
    [Route("api/sample-instruction")]
    [ApiController]
    public class SampleInstructionController : ControllerBase
    {
        private readonly ISampleInstructionService _service;
        private readonly ILogger<SampleInstructionController> _logger;

        public SampleInstructionController(ISampleInstructionService service, ILogger<SampleInstructionController> logger)
        {
            _service = service;
            _logger = logger;
        }

        /// <summary>
        /// Lấy danh sách tất cả hướng dẫn lấy mẫu.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(new ApiResponse<IEnumerable<SampleInstructionDto>>(result, "", HttpCodes.Ok));
        }

        /// <summary>
        /// Lấy hướng dẫn lấy mẫu theo ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(string id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null)
                return NotFound(new ApiResponse<object>("Không tìm thấy hướng dẫn", HttpCodes.NotFound));

            return Ok(new ApiResponse<SampleInstructionDto>(result, "", HttpCodes.Ok));
        }

        /// <summary>
        /// Lấy hướng dẫn lấy mẫu theo loại mẫu(sample type).
        /// </summary>
        [HttpGet("latest/{type}")]
        public async Task<IActionResult> GetLatestBySampleType(SampleType type)
        {
            var instruction = await _service.GetLatestBySampleTypeAsync(type);
            if (instruction == null)
                return NotFound(new ApiResponse<object>("Không tìm thấy hướng dẫn", HttpCodes.NotFound));

            return Ok(new ApiResponse<SampleInstructionDto>(instruction, "", HttpCodes.Ok));
        }
        /// <summary>
        /// Tạo mới hướng dẫn lấy mẫu.
        /// </summary>
        //[HttpPost]
        //public async Task<ActionResult> Create([FromBody] CreateSampleInstructionDto dto)
        //{
        //    var created = await _service.CreateAsync(dto);
        //    return CreatedAtAction(nameof(GetById), new { id = created.Id },
        //        new ApiResponse<SampleInstructionDto>(created, "Tạo hướng dẫn thành công", HttpCodes.Created));
        //}

        /// <summary>
        /// Cập nhật hướng dẫn lấy mẫu.
        /// </summary>
        [HttpPut]
        public async Task<ActionResult> Update([FromBody] UpdateSampleInstructionDto dto)
        {
            var success = await _service.UpdateAsync(dto);
            if (!success)
                return NotFound(new ApiResponse<object>("Không tìm thấy hướng dẫn", HttpCodes.NotFound));

            return Ok(new ApiResponse<object>(null, "Cập nhật thành công", HttpCodes.Ok));
        }
        [HttpPost("seed")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> SeedDefaultInstructions()
        {
            var seeded = await _service.SeedDefaultInstructionsAsync();
            return seeded ? Ok(new ApiResponse<object>(null, "thêm đata mẫu thành công", HttpCodes.Ok)) : Conflict(new ApiResponse<object>(null, "Lỗi khi thêm data", HttpCodes.BadRequest));
        }

    }
}

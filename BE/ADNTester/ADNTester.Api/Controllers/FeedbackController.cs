using ADNTester.BO.DTOs;
using ADNTester.BO.DTOs.Common;
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
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;

        public FeedbackController(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FeedbackDto>>> GetAll()
        {
            var feedbacks = await _feedbackService.GetAllAsync();
            return Ok(new ApiResponse<IEnumerable<FeedbackDto>>(feedbacks, "Lấy danh sách feedback thành công"));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FeedbackDto>> GetById(string id)
        {
            var feedback = await _feedbackService.GetByIdAsync(id);
            if (feedback == null)
                return NotFound(new ApiResponse<string>("Không tìm thấy feedback", 404));

            return Ok(new ApiResponse<FeedbackDto>(feedback, "Thông tin feedback"));
        }

        [HttpPost]
        public async Task<ActionResult<string>> Create(CreateFeedbackDto dto)
        {
            var id = await _feedbackService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, new ApiResponse<string>(id, "Tạo feedback thành công", 201));
        }

        [HttpPut]
        public async Task<IActionResult> Update(UpdateFeedbackDto dto)
        {
            var result = await _feedbackService.UpdateAsync(dto);
            if (!result)
                return NotFound(new ApiResponse<string>("Không tìm thấy feedback để cập nhật", 404));

            return Ok(new ApiResponse<string>(dto.Id, "Cập nhật feedback thành công"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _feedbackService.DeleteAsync(id);
            if (!result)
                return NotFound(new ApiResponse<string>("Không tìm thấy feedback để xóa", 404));

            return Ok(new ApiResponse<string>(id, "Xóa feedback thành công"));
        }
    }
} 
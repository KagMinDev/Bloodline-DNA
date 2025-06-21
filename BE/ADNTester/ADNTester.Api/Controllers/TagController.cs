using ADNTester.BO.DTOs.Tag;
using ADNTester.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace ADNTester.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagController : ControllerBase
    {
        private readonly ITagService _tagService;
        private readonly ILogger<TagController> _logger;

        public TagController(ITagService tagService, ILogger<TagController> logger)
        {
            _tagService = tagService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var tags = await _tagService.GetAllAsync();
                return Ok(tags);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all tags");
                return StatusCode(500, new { error = "Đã xảy ra lỗi khi lấy danh sách tags" });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var tag = await _tagService.GetByIdAsync(id);
                if (tag == null)
                {
                    return NotFound(new { error = "Không tìm thấy tag" });
                }
                return Ok(tag);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting tag by id: {Id}", id);
                return StatusCode(500, new { error = "Đã xảy ra lỗi khi lấy thông tin tag" });
            }
        }

        [HttpGet("name/{name}")]
        public async Task<IActionResult> GetByName(string name)
        {
            try
            {
                var tag = await _tagService.GetByNameAsync(name);
                if (tag == null)
                {
                    return NotFound(new { error = "Không tìm thấy tag" });
                }
                return Ok(tag);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting tag by name: {Name}", name);
                return StatusCode(500, new { error = "Đã xảy ra lỗi khi lấy thông tin tag" });
            }
        }

        [HttpGet("blog/{blogId}")]
        public async Task<IActionResult> GetTagsByBlogId(string blogId)
        {
            try
            {
                var tags = await _tagService.GetTagsByBlogIdAsync(blogId);
                return Ok(tags);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting tags by blog id: {BlogId}", blogId);
                return StatusCode(500, new { error = "Đã xảy ra lỗi khi lấy tags của blog" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTagDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var tag = await _tagService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = tag.Id }, tag);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating tag");
                return StatusCode(500, new { error = "Đã xảy ra lỗi khi tạo tag" });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateTagDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (id != dto.Id)
                {
                    return BadRequest(new { error = "ID không khớp" });
                }

                var result = await _tagService.UpdateAsync(dto);
                if (!result)
                {
                    return NotFound(new { error = "Không tìm thấy tag để cập nhật" });
                }

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating tag: {Id}", id);
                return StatusCode(500, new { error = "Đã xảy ra lỗi khi cập nhật tag" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var result = await _tagService.DeleteAsync(id);
                if (!result)
                {
                    return NotFound(new { error = "Không tìm thấy tag để xóa" });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting tag: {Id}", id);
                return StatusCode(500, new { error = "Đã xảy ra lỗi khi xóa tag" });
            }
        }
    }
} 
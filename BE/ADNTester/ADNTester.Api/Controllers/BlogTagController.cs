using ADNTester.BO.DTOs.BlogTag;
using ADNTester.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADNTester.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogTagController : ControllerBase
    {
        private readonly IBlogTagService _blogTagService;
        private readonly ILogger<BlogTagController> _logger;

        public BlogTagController(IBlogTagService blogTagService, ILogger<BlogTagController> logger)
        {
            _blogTagService = blogTagService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var blogTags = await _blogTagService.GetAllAsync();
                return Ok(blogTags);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all blog tags");
                return StatusCode(500, new { error = "Đã xảy ra lỗi khi lấy danh sách blog tags" });
            }
        }

        [HttpGet("blog/{blogId}")]
        public async Task<IActionResult> GetByBlogId(string blogId)
        {
            try
            {
                var blogTags = await _blogTagService.GetByBlogIdAsync(blogId);
                return Ok(blogTags);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting blog tags by blog id: {BlogId}", blogId);
                return StatusCode(500, new { error = "Đã xảy ra lỗi khi lấy blog tags" });
            }
        }

        [HttpGet("tag/{tagId}")]
        public async Task<IActionResult> GetByTagId(string tagId)
        {
            try
            {
                var blogTags = await _blogTagService.GetByTagIdAsync(tagId);
                return Ok(blogTags);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting blog tags by tag id: {TagId}", tagId);
                return StatusCode(500, new { error = "Đã xảy ra lỗi khi lấy blog tags" });
            }
        }

        [HttpGet("{blogId}/{tagId}")]
        public async Task<IActionResult> GetById(string blogId, string tagId)
        {
            try
            {
                var blogTag = await _blogTagService.GetByIdAsync(blogId, tagId);
                if (blogTag == null)
                {
                    return NotFound(new { error = "Không tìm thấy blog tag" });
                }
                return Ok(blogTag);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting blog tag by id: BlogId={BlogId}, TagId={TagId}", blogId, tagId);
                return StatusCode(500, new { error = "Đã xảy ra lỗi khi lấy thông tin blog tag" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBlogTagDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var blogTag = await _blogTagService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { blogId = blogTag.BlogId, tagId = blogTag.TagId }, blogTag);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating blog tag");
                return StatusCode(500, new { error = "Đã xảy ra lỗi khi tạo blog tag" });
            }
        }

        [HttpPost("blog/{blogId}/tags")]
        public async Task<IActionResult> AddTagsToBlog(string blogId, [FromBody] List<string> tagIds)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _blogTagService.AddTagsToBlogAsync(blogId, tagIds);
                if (!result)
                {
                    return NotFound(new { error = "Không tìm thấy blog" });
                }

                return Ok(new { message = "Đã thêm tags vào blog thành công" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding tags to blog: {BlogId}", blogId);
                return StatusCode(500, new { error = "Đã xảy ra lỗi khi thêm tags vào blog" });
            }
        }

        [HttpDelete("blog/{blogId}/tags")]
        public async Task<IActionResult> RemoveTagsFromBlog(string blogId, [FromBody] List<string> tagIds)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _blogTagService.RemoveTagsFromBlogAsync(blogId, tagIds);
                if (!result)
                {
                    return NotFound(new { error = "Không tìm thấy blog" });
                }

                return Ok(new { message = "Đã xóa tags khỏi blog thành công" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing tags from blog: {BlogId}", blogId);
                return StatusCode(500, new { error = "Đã xảy ra lỗi khi xóa tags khỏi blog" });
            }
        }

        [HttpDelete("{blogId}/{tagId}")]
        public async Task<IActionResult> Delete(string blogId, string tagId)
        {
            try
            {
                var result = await _blogTagService.DeleteAsync(blogId, tagId);
                if (!result)
                {
                    return NotFound(new { error = "Không tìm thấy blog tag để xóa" });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting blog tag: BlogId={BlogId}, TagId={TagId}", blogId, tagId);
                return StatusCode(500, new { error = "Đã xảy ra lỗi khi xóa blog tag" });
            }
        }
    }
} 
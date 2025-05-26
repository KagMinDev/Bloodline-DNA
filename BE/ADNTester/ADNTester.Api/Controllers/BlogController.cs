using ADNTester.BO.DTOs;
using ADNTester.Service.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADNTester.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly IBlogService _blogService;
        private readonly ICloudinaryService _cloudinaryService;

        public BlogController(IBlogService blogService, ICloudinaryService cloudinaryService)
        {
            _blogService = blogService;
            _cloudinaryService = cloudinaryService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlogDto>>> GetAll()
        {
            var blogs = await _blogService.GetAllAsync();
            return Ok(blogs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BlogDto>> GetById(string id)
        {
            var blog = await _blogService.GetByIdAsync(id);
            if (blog == null)
                return NotFound();
            return Ok(blog);
        }

        [HttpPost]
        public async Task<ActionResult<string>> Create([FromForm] CreateBlogDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var blogWithUrl = new CreateBlogWithUrlDto
                {
                    Title = dto.Title,
                    Content = dto.Content,
                    Status = dto.Status,
                    AuthorId = dto.AuthorId,
                   
                };

                if (dto.ThumbnailURL != null)
                {
                    var thumbnailUrl = await _cloudinaryService.UploadImageAsync(dto.ThumbnailURL, "Image/Thumbnail");
                    if (!string.IsNullOrEmpty(thumbnailUrl))
                    {
                        blogWithUrl.ThumbnailURL = thumbnailUrl;
                    }
                }

                var id = await _blogService.CreateAsync(blogWithUrl);

                return CreatedAtAction(nameof(GetById), new { id }, id);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateBlogDto dto)
        {
            if (id != dto.Id)
                return BadRequest();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var success = await _blogService.UpdateAsync(dto);
                if (!success)
                    return NotFound();
                return NoContent();
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var success = await _blogService.DeleteAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
} 
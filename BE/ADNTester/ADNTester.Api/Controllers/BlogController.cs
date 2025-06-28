using ADNTester.BO.DTOs;
using ADNTester.BO.DTOs.Common;
using ADNTester.BO.DTOs.User;
using ADNTester.Service.Interfaces;
using AutoMapper;
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
            return Ok(new ApiResponse<IEnumerable<BlogDto>>(blogs, "Lấy danh sách blog thành công"));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BlogDto>> GetById(string id)
        {
            var blog = await _blogService.GetByIdAsync(id);
            if (blog == null)
                return NotFound(new ApiResponse<string>("Không tìm thấy blog", 404));
            return Ok(new ApiResponse<BlogDto>(blog, "Thông tin Blog"));
        }

        [HttpPost]
        public async Task<ActionResult<string>> Create([FromForm] CreateBlogDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new ApiResponse<string>("Dữ liệu không hợp lệ", 400));

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

                return CreatedAtAction(nameof(GetById), new { id }, new ApiResponse<string>(id, "Tạo blog thành công", 201));
            }
            catch (System.Exception ex)
            {
                return BadRequest(new ApiResponse<string>(ex.Message, 400));
            }
        }

        [HttpPost("with-tags")]
        public async Task<ActionResult<string>> CreateWithTags([FromForm] CreateBlogDto dto, [FromForm] List<string> tagIds)
        {
            if (!ModelState.IsValid)
                return BadRequest(new ApiResponse<string>("Dữ liệu không hợp lệ", 400));

            try
            {
                var blogWithTags = new CreateBlogWithTagsDto
                {
                    Title = dto.Title,
                    Content = dto.Content,
                    Status = dto.Status,
                    AuthorId = dto.AuthorId,
                    TagIds = tagIds ?? new List<string>()
                };

                if (dto.ThumbnailURL != null)
                {
                    var thumbnailUrl = await _cloudinaryService.UploadImageAsync(dto.ThumbnailURL, "Image/Thumbnail");
                    if (!string.IsNullOrEmpty(thumbnailUrl))
                    {
                        blogWithTags.ThumbnailURL = thumbnailUrl;
                    }
                }

                var id = await _blogService.CreateWithTagsAsync(blogWithTags);

                return CreatedAtAction(nameof(GetById), new { id }, new ApiResponse<string>(id, "Tạo blog với tags thành công", 201));
            }
            catch (System.Exception ex)
            {
                return BadRequest(new ApiResponse<string>(ex.Message, 400));
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateBlogDto dto)
        {
            if (id != dto.Id)
                return BadRequest(new ApiResponse<string>("Id không khớp", 400));

            if (!ModelState.IsValid)
                return BadRequest(new ApiResponse<string>("Dữ liệu không hợp lệ", 400));

            try
            {
                var success = await _blogService.UpdateAsync(dto);
                if (!success)
                    return NotFound(new ApiResponse<string>("Không tìm thấy blog để cập nhật", 404));
                return Ok(new ApiResponse<string>(dto.Id, "Cập nhật blog thành công"));
            }
            catch (System.Exception ex)
            {
                return BadRequest(new ApiResponse<string>(ex.Message, 400));
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var success = await _blogService.DeleteAsync(id);
            if (!success)
                return NotFound(new ApiResponse<string>("Không tìm thấy blog để xóa", 404));

            return Ok(new ApiResponse<string>(id, "Xóa blog thành công"));
        }
    }
} 
using ADNTester.BO.DTOs.Common;
using ADNTester.BO.DTOs.User;
using ADNTester.Service.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace ADNTester.Api.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UserController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        // GET: api/User
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        /// <summary>
        /// Lấy thông tin người dùng hiện tại.
        /// </summary>
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userService.GetByIdAsync(userId!);
            if (user == null)
                return NotFound(new ApiResponse<string>($"Không tìm thấy người dùng có id: {userId}", HttpCodes.NotFound));

            var profile = _mapper.Map<UserProfileDto>(user);
            return Ok(new ApiResponse<UserProfileDto>(profile, "Thông tin người dùng truy vấn thành công"));
        }
        /// <summary>
        /// Cập nhật thông tin người dùng hiện tại.
        /// </summary>
        [HttpPut("me")]
        [Authorize]
        public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateProfileDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userService.GetByIdAsync(userId!);
            if (user == null)
            {
                return NotFound(new ApiResponse<string>($"Không tìm thấy người dùng có id: {userId}", HttpCodes.NotFound));
            }    
            var result = await _userService.UpdateProfileAsync( userId, dto);
            if (result)
            {
                return Ok(new ApiResponse<string>("Cập nhật thông tin thành công"));
            }

            return BadRequest(new ApiResponse<string>("Cập nhật thông tin thất bại"));
            
        }
    }
}

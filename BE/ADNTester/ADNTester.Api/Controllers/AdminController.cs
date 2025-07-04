using ADNTester.BO.DTOs.Auth;
using ADNTester.BO.DTOs.Common;
using ADNTester.BO.DTOs.User;
using ADNTester.BO.Enums;
using ADNTester.Service.Implementations;
using ADNTester.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ADNTester.Api.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;

        public AdminController(IAuthService authService, IUserService userService)
        {
            _authService = authService;
            _userService = userService;
        }
        /// <summary>
        /// Tạo tài khoản nhân viên mới (chỉ dành cho Admin)
        /// </summary>
        [Authorize(Roles = nameof(UserRole.Admin))]
        [HttpPost("create-staff")]
        public async Task<IActionResult> CreateStaff([FromBody] CreateStaffRequestDto dto)
        {
            var result = await _authService.CreateStaffAccountAsync(dto);
            return result
                ? Ok(new ApiResponse<string>("Tạo tài khoản thành công"))
                : BadRequest(new ApiResponse<string>("Email đã tồn tại"));
        }
        /// <summary>
        /// Bật / tắt trạng thái hoạt động của người dùng (chỉ dành cho Admin)
        /// </summary>
        [Authorize(Roles = nameof(UserRole.Admin))]
        [HttpPost("toggle-active/{userId}")]
        public async Task<IActionResult> ToggleUserActive(string userId)
        {
            var result = await _userService.ToggleUserActiveStatusAsync(userId);

            if (result == null)
                return NotFound(new ApiResponse<string>("Không tìm thấy người dùng"));

            var message = result.Value
                ? "Tài khoản đã được mở khóa"
                : "Tài khoản đã bị khóa";

            return Ok(new ApiResponse<string>(message));
        }
        /// <summary>
        /// Lấy danh sách nhân viên đang hoạt động (chỉ dành cho Admin)
        /// </summary>
        /// <returns>Danh sách nhân viên đang hoạt động</returns>
        [Authorize(Roles = nameof(UserRole.Admin))]
        [HttpGet("active-staff")]
        public async Task<IActionResult> GetActiveStaff()
        {
            var staffList = await _userService.GetActiveStaffAsync();
            return Ok(new ApiResponse<IEnumerable<UserDto>>(staffList, "Lấy danh sách nhân viên đang hoạt động thành công"));
        }
    }
}

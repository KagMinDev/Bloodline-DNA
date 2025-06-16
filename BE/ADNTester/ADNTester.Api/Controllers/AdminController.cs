using ADNTester.BO.DTOs.Auth;
using ADNTester.BO.DTOs.Common;
using ADNTester.BO.Enums;
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

        public AdminController(IAuthService authService)
        {
            _authService = authService;
        }
        
        [Authorize(Roles = nameof(UserRole.Admin))]
        [HttpPost("create-staff")]
        public async Task<IActionResult> CreateStaff([FromBody] CreateStaffRequestDto dto)
        {
            var result = await _authService.CreateStaffAccountAsync(dto);
            return result
                ? Ok(new ApiResponse<string>("Tạo tài khoản thành công"))
                : BadRequest(new ApiResponse<string>("Email đã tồn tại"));
        }
    }
}

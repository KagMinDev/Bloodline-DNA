using ADNTester.BO.DTOs.Auth;
using ADNTester.BO.DTOs.Common;
using ADNTester.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ADNTester.Api.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Đăng ký tài khoản người dùng mới.
        /// </summary>
        /// <param name="dto">Thông tin người dùng cần đăng ký.</param>
        /// <returns>Trạng thái thành công hoặc lỗi.</returns>
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto)
        {
            var result = await _authService.RegisterAsync(dto);
            if (!result)
            {
                return BadRequest(new ApiResponse<object>("Email đã tồn tại", HttpCodes.BadRequest));
            }

            return Ok(new ApiResponse<object>(null, "Đăng ký thành công", HttpCodes.Ok));
        }

        /// <summary>
        /// Đăng nhập vào hệ thống với email và mật khẩu.
        /// </summary>
        /// <param name="dto">Thông tin đăng nhập (email và mật khẩu).</param>
        /// <returns>JWT token nếu đăng nhập thành công, lỗi nếu thất bại.</returns>
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
        {
            var loginResponse = await _authService.LoginAsync(dto);
            if (loginResponse == null)
            {
                return Unauthorized(new ApiResponse<object>("Email hoặc mật khẩu không đúng", HttpCodes.Unauthorized));
            }

            return Ok(new ApiResponse<LoginResponseDto>(loginResponse, statusCode:HttpCodes.Ok));
        }
    }
}

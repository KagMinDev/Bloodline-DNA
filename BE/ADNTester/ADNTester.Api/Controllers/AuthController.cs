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
        private readonly IOtpService _otpService;

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

        /// <summary>
        /// tạo request gửi Otp reset password qua email
        /// </summary>
        /// <param name="dto">email đăng ký tài khoản.</param>
        /// <returns>kết quả việc gửi email Otp.</returns>
        [AllowAnonymous]
        [HttpPost("request-reset")]
        public async Task<IActionResult> RequestResetPassword([FromBody] ResetPasswordRequestDto dto)
        {
            var result = await _authService.RequestResetPasswordOtpAsync(dto.Email);

            return result switch
            {
                RequestResetOtpResult.NotFound => NotFound(new ApiResponse<string>("Không tìm thấy tài khoản")),
                RequestResetOtpResult.FailedToSend => StatusCode(500, new ApiResponse<string>("Gửi OTP thất bại")),
                RequestResetOtpResult.Success => Ok(new ApiResponse<string>("OTP đã được gửi đến email của bạn")),
                _ => StatusCode(500, new ApiResponse<string>("Lỗi không xác định"))
            };
        }

        /// <summary>
        /// tạo request gửi Otp reset password qua email
        /// </summary>
        /// <param name="dto">email, mã Otp và mật khẩu mới .</param>
        /// <returns>kết quả việc đặt lại mật khẩu.</returns>
        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ConfirmResetPassword([FromBody] ConfirmResetPasswordDto dto)
        {
            var result = await _authService.ResetPasswordWithOtpAsync(dto);

            return result switch
            {
                ResetPasswordResult.UserNotFound => NotFound(new ApiResponse<string>("Không tìm thấy tài khoản")),
                ResetPasswordResult.InvalidOtp => BadRequest(new ApiResponse<string>("OTP không hợp lệ hoặc đã hết hạn")),
                ResetPasswordResult.Success => Ok(new ApiResponse<string>("Đặt lại mật khẩu thành công")),
                _ => StatusCode(500, new ApiResponse<string>("Lỗi không xác định"))
            };
        }


    }
}

using ADNTester.BO.DTOs.Auth;
using ADNTester.BO.DTOs.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Service.Interfaces
{
    public interface IAuthService
    {
        Task<bool> RegisterAsync(RegisterRequestDto dto);
        Task<LoginResponseDto> LoginAsync(LoginRequestDto dto);
        Task<RequestResetOtpResult> RequestResetPasswordOtpAsync(string email);
        Task<ResetPasswordResult> ResetPasswordWithOtpAsync(ConfirmResetPasswordDto dto);
        Task<bool> CreateStaffAccountAsync(CreateStaffRequestDto dto);
    }
}

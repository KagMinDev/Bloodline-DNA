using ADNTester.BO.DTOs.Auth;
using ADNTester.BO.DTOs.Common;
using ADNTester.BO.Entities;
using ADNTester.BO.Enums;
using ADNTester.Repository.Interfaces;
using ADNTester.Service.Helper;
using ADNTester.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Service.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IOtpService _otpService;

        public AuthService(IUnitOfWork unitOfWork, IJwtTokenService jwtTokenService)
        {
            _unitOfWork = unitOfWork;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<bool> RegisterAsync(RegisterRequestDto dto)
        {
            var existingUser = await _unitOfWork.UserRepository.FindOneAsync(u => u.Email == dto.Email);
            if (existingUser != null)
                return false; // hoặc throw exception

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                Address = dto.Address,
                Role = UserRole.Client,
                PasswordHash = HashHelper.HashPassword(dto.Password)
            };

            await _unitOfWork.UserRepository.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto dto)
        {
            var user = await _unitOfWork.UserRepository.FindOneAsync(u => u.Email == dto.Email);
            if (user == null)
                return null;

            bool verified = HashHelper.VerifyPassword(dto.Password, user.PasswordHash);
            if (!verified)
                return null;

            // Tạo token JWT
            var token = _jwtTokenService.GenerateToken(user);

            return new LoginResponseDto
            {
                Token = token,
                UserName = user.FullName,
                Role = user.Role.ToString()
            };
        }
        public async Task<RequestResetOtpResult> RequestResetPasswordOtpAsync(string email)
        {
            var user = await _unitOfWork.UserRepository.FindOneAsync(u => u.Email == email);
            if (user == null)
                return RequestResetOtpResult.NotFound;

            var success = await _otpService.GenerateAndSendOtpAsync(
                user.Id,
                user.Email,
                OtpDeliveryMethod.Email,
                OtpPurpose.ResetPassword, default, default
            );

            return success ? RequestResetOtpResult.Success : RequestResetOtpResult.FailedToSend;
        }

        public async Task<ResetPasswordResult> ResetPasswordWithOtpAsync(ConfirmResetPasswordDto dto)
        {
            var user = await _unitOfWork.UserRepository.FindOneAsync(u => u.Email == dto.Email);
            if (user == null)
                return ResetPasswordResult.UserNotFound;

            var verified = await _otpService.VerifyOtpAsync(
                user.Id,
                dto.OtpCode,
                OtpPurpose.ResetPassword);

            if (!verified)
                return ResetPasswordResult.InvalidOtp;

            user.PasswordHash = HashHelper.HashPassword(dto.NewPassword);
            await _unitOfWork.SaveChangesAsync();

            return ResetPasswordResult.Success;
        }

        public async Task<bool> CreateStaffAccountAsync(CreateStaffRequestDto dto)
        {
            if (dto.Role != UserRole.Staff && dto.Role != UserRole.Manager)
                return false;

            var existing = await _unitOfWork.UserRepository.FindOneAsync(u => u.Email == dto.Email);
            if (existing != null) return false;

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                Address = dto.Address,
                Role = dto.Role,
                PasswordHash = HashHelper.HashPassword(dto.Password)
            };

            await _unitOfWork.UserRepository.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

    }
}

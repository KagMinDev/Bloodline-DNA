using ADNTester.BO.DTOs.Auth;
using ADNTester.BO.DTOs.Common;
using ADNTester.BO.Entities;
using ADNTester.Repository.Interfaces;
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
                Role = dto.Role,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
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

            bool verified = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
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

    }
}

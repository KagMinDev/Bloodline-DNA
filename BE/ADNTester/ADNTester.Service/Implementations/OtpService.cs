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
    public class OtpService : IOtpService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmailService _emailService;

        public OtpService(IUnitOfWork unitOfWork, IEmailService emailService)
        {
            _unitOfWork = unitOfWork;
            _emailService = emailService;
        }

        public async Task<bool> GenerateAndSendOtpAsync(
            string userId,
            string contact,
            OtpDeliveryMethod method,
            OtpPurpose purpose,
            int validForMinutes = 5,
            int cooldownSeconds = 60)
        {
            // 🧠 Check for recent OTP
            var recentOtp = await _unitOfWork.OtpRepository
                .FindOneAsync(o =>
                    o.UserId == userId &&
                    o.Purpose == purpose &&
                    o.DeliveryMethod == method &&
                    !o.IsUsed &&
                    o.CreatedAt > DateTime.UtcNow.AddSeconds(-cooldownSeconds));

            if (recentOtp != null)
                return false; // 🛑 Block due to cooldown

            var code = GenerateRandomCode(6);
            var hashed = HashHelper.HashOtp(code);

            var otp = new OtpCode
            {
                UserId = userId,
                HashedCode = hashed,
                DeliveryMethod = method,
                Purpose = purpose,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddMinutes(validForMinutes),
                SentTo = contact
            };

            await _unitOfWork.OtpRepository.AddAsync(otp);
            await _unitOfWork.SaveChangesAsync();

            var message = $"Mã OTP của bạn là: {code}. Có hiệu lực trong {validForMinutes} phút.";

            if (method == OtpDeliveryMethod.Email)
                await _emailService.SendEmailAsync(contact, "Mã OTP của bạn", message);
            else return false;

            return true;
        }

        public async Task<bool> VerifyOtpAsync(string userId, string inputCode, OtpPurpose purpose)
        {
            var otp = await _unitOfWork.OtpRepository.FindOneAsync(o =>
                o.UserId == userId &&
                o.Purpose == purpose &&
                !o.IsUsed &&
                o.ExpiresAt >= DateTime.UtcNow);

            if (otp == null || !HashHelper.VerifyOtp(inputCode, otp.HashedCode))
                return false;

            otp.IsUsed = true;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<int> CleanupExpiredOtpsAsync()
        {
            var now = DateTime.UtcNow;

            var expiredOtps = await _unitOfWork.OtpRepository.FindAsync(
                o => o.ExpiresAt <= now || o.IsUsed
            );

            if (!expiredOtps.Any())
                return 0;

            _unitOfWork.OtpRepository.RemoveRange(expiredOtps);
            await _unitOfWork.SaveChangesAsync();

            return expiredOtps.Count();
        }

        #region Helper method
        private string GenerateRandomCode(int length)
        {
            var random = new Random();
            var otp = new StringBuilder();

            for (int i = 0; i < length; i++)
            {
                otp.Append(random.Next(0, 10)); // 0–9
            }

            return otp.ToString();
        }
        #endregion
    }
}

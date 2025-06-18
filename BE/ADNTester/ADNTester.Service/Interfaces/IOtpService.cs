using ADNTester.BO.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Service.Interfaces
{
    public interface IOtpService
    {
        Task<bool> GenerateAndSendOtpAsync(string userId, string contact, 
            OtpDeliveryMethod method, OtpPurpose purpose, 
            int validTime = 5, int cooldown = 60);       
        Task<bool> VerifyOtpAsync(string userId, string inputCode, OtpPurpose purpose);
        Task<int> CleanupExpiredOtpsAsync();
    }
}

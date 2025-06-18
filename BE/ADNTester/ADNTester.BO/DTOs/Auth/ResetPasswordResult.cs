using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.DTOs.Auth
{
    public enum ResetPasswordResult
    {
        Success,
        UserNotFound,
        InvalidOtp
    }
}

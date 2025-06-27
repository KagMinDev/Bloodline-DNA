using ADNTester.BO.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.DTOs.Auth
{
    public class RegisterRequestDto
    {
        [Required(ErrorMessage = "Tên không được rỗng")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Email không được rỗng.")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Số điện thoại không được rỗng.")]
        [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$", ErrorMessage = "Số điện thoại không hợp lệ")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "Địa chỉ không được rỗng.")]
        public string Address { get; set; }

        [Required(ErrorMessage = "Password không được rỗng")]
        [MinLength(6, ErrorMessage = "Password cần ít nhất 6 ký tự.")]
        public string Password { get; set; }
        //public UserRole Role { get; set; }
    }
}

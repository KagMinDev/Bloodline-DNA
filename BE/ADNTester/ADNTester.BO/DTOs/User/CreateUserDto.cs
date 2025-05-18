using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.DTOs.User
{
    public class CreateUserDto
    {
        public string FullName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string PasswordHash { get; set; } = default!;
        public string Phone { get; set; } = default!;
        public string Role { get; set; } = default!;
        public string Address { get; set; } = default!; 
    }
}

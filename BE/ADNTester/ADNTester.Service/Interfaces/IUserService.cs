using ADNTester.BO.DTOs.User;
using ADNTester.BO.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Service.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllAsync();
        Task<User> GetByIdAsync(string id);

        Task<bool> UpdateProfileAsync(string id, UpdateProfileDto dto);
    }
}

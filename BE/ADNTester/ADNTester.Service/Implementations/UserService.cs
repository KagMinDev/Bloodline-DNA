using ADNTester.BO.DTOs.User;
using ADNTester.BO.Entities;
using ADNTester.Repository.Interfaces;
using ADNTester.Service.Interfaces;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Service.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public UserService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync()
        {
            var users = await _unitOfWork.UserRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<User> GetByIdAsync(string id)
        {
            var user = await _unitOfWork.UserRepository.GetByIdAsync(id);
            return user;
        }

        public async Task<bool> UpdateProfileAsync(string id, UpdateProfileDto dto)
        {
            await _unitOfWork.BeginTransactionAsync(); //  Bắt đầu transaction

            try
            {
                var user = await _unitOfWork.UserRepository.GetByIdAsync(id);
                if (user == null)
                {
                    await _unitOfWork.RollbackAsync(); //  Rollback nếu không tìm thấy user
                    return false;
                }

                user.Phone = dto.Phone;
                user.FullName = dto.FullName;
                user.Address = dto.Address;

                _unitOfWork.UserRepository.Update(user);
                await _unitOfWork.SaveChangesAsync();

                await _unitOfWork.CommitAsync(); // Commit nếu thành công

                return true;
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackAsync(); //  Rollback nếu có exception
                throw;
            }
        }
    }
}

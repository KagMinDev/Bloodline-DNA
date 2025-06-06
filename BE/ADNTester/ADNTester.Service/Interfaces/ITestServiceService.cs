using ADNTester.BO.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADNTester.Service.Interfaces
{
    public interface ITestServiceService
    {
        Task<IEnumerable<TestServiceDto>> GetAllAsync();
        Task<TestServiceDto> GetByIdAsync(string id);
        Task<string> CreateAsync(CreateTestServiceDto dto);
        Task<bool> UpdateAsync(UpdateTestServiceDto dto);
        Task<bool> DeleteAsync(string id);
       
    }
} 
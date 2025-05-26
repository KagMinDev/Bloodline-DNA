using ADNTester.BO.DTOs;
using ADNTester.BO.DTOs.TestResult;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADNTester.Service.Interfaces
{
    public interface ITestResultService
    {
        Task<IEnumerable<TestResultDto>> GetAllAsync();
        Task<TestResultDto> GetByIdAsync(string id);
        Task<string> CreateAsync(CreateTestResultDto dto);
        Task<bool> UpdateAsync(UpdateTestResultDto dto);
        Task<bool> DeleteAsync(string id);
    }
} 
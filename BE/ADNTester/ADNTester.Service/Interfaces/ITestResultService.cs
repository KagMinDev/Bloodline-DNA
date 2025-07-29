using ADNTester.BO.DTOs;
using ADNTester.BO.DTOs.TestResult;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADNTester.Service.Interfaces
{
    public interface ITestResultService
    {
        Task<IEnumerable<TestResultDetailDto>> GetAllAsync();
        Task<TestResultDetailDto> GetByIdAsync(string id);
        Task<string> CreateAsync(CreateTestResultDto dto);
        Task<string> CreateWithFileAsync(CreateTestResultWithFileDto dto);
        Task<bool> UpdateAsync(UpdateTestResultDto dto);
        Task<bool> UpdateWithFileAsync(UpdateTestResultWithFileDto dto);
        Task<bool> DeleteAsync(string id);
        Task<IEnumerable<TestResultDetailDto>> GetTestResultsByUserIdAsync(string userId);
    }
} 
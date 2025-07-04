using ADNTester.BO.DTOs;
using ADNTester.BO.DTOs.TestSample;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADNTester.Service.Interfaces
{
    public interface ITestSampleService
    {
        Task<IEnumerable<TestSampleDto>> GetAllAsync();
        Task<TestSampleDto> GetByIdAsync(string id);
        Task<string> CreateAsync(CreateTestSampleDto dto);
        Task<bool> UpdateAsync(UpdateTestSampleDto dto);
        Task<bool> DeleteAsync(string id);
        Task<IEnumerable<TestSampleDetailDto>> GetTestSampleByUserId(string userId);
        Task<TestSampleDetailDto> GetTestSampleByKitId(string kitId);
        Task<string> CreateSampleFromClientAsync(CreateTestSampleFromClientDto dto);
    }
} 
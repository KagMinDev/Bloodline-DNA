using ADNTester.BO.DTOs;
using ADNTester.BO.DTOs.TestKit;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADNTester.Service.Interfaces
{
    public interface ITestKitService
    {
        Task<IEnumerable<TestKitDto>> GetAllAsync();
        Task<TestKitDto> GetByIdAsync(string id);
        Task<TestKitDto> GetByBookingIdAsync(string bookingId);
        Task<string> CreateAsync(CreateTestKitDto dto);
        Task<bool> UpdateAsync(UpdateTestKitDto dto);
        Task<bool> DeleteAsync(string id);
        Task<IEnumerable<TestKitDto>> GetAllByPreparingKitAndSelfSampleAsync();
    }
} 
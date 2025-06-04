using ADNTester.BO.DTOs.TestBooking;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADNTester.Service.Interfaces
{
    public interface ITestBookingService
    {
        Task<IEnumerable<TestBookingDto>> GetAllAsync();
        Task<TestBookingDto> GetByIdAsync(string id);
        Task<string> CreateAsync(CreateTestBookingDto dto);
        Task<bool> UpdateAsync(UpdateTestBookingDto dto);
        Task<bool> DeleteAsync(string id);
    }
} 
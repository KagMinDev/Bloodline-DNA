using ADNTester.BO.DTOs.TestBooking;
using ADNTester.BO.Enums;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADNTester.Service.Interfaces
{
    public interface ITestBookingService
    {
        Task<IEnumerable<TestBookingDto>> GetAllAsync();
        Task<TestBookingDto> GetByIdAsync(string id);
        Task<string> CreateAsync(CreateTestBookingDto dto);
        Task<string> CreateWithTestKitAsync(CreateTestBookingDto dto);
        Task<bool> UpdateAsync(UpdateTestBookingDto dto);
        Task<bool> DeleteAsync(string id);
        Task<bool> UpdateBookingStatusAsync(string bookingId, BookingStatus newStatus);
    }
} 
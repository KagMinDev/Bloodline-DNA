using ADNTester.BO.DTOs.TestBooking;
using ADNTester.BO.Enums;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADNTester.Service.Interfaces
{
    public interface ITestBookingService
    {
        Task<IEnumerable<TestBookingDto>> GetAllAsync();
        Task<TestBookingDetailDto> GetByIdAsync(string id);
        Task<TestBookingDetailDto> GetBookingDetailByIdAsync(string id);
        Task<string> CreateAsync(CreateTestBookingDto dto);
        Task<string> CreateWithTestKitAsync(CreateTestBookingDto dto);
        Task<bool> UpdateAsync(UpdateTestBookingDto dto);
        Task<bool> DeleteAsync(string id);
        Task<bool> UpdateBookingStatusAsync(string bookingId, BookingStatus newStatus);
        Task<IEnumerable<TestBookingDto>> GetCompletedBookingsAsync();
        Task<IEnumerable<TestBookingDetailDto>> GetBookingByUserId(string userId);
        Task<IEnumerable<TestBookingDto>> GetFilteredBookingsAsync(SampleCollectionMethod? method, DateTime? appointDate);
        Task<bool> CheckInAsync(string bookingId);
        Task<bool> ConfirmKitReceivedAsync(string bookingId);
        Task<bool> CreatePickupAfterSampleCollectedAsync(string bookingId, string? note);
    }
} 
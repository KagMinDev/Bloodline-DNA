using ADNTester.BO.DTOs;
using ADNTester.BO.DTOs.Feedback;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADNTester.Service.Interfaces
{
    public interface IFeedbackService
    {
        Task<IEnumerable<FeedbackDto>> GetAllAsync();
        Task<FeedbackDto> GetByIdAsync(string id);
        Task<string> CreateAsync(CreateFeedbackDto dto);
        Task<bool> UpdateAsync(UpdateFeedbackDto dto);
        Task<bool> DeleteAsync(string id);
        Task<IEnumerable<FeedbackDetailDto>> GetFeedbacksByUserIdAsync(string userId);
        Task<IEnumerable<FeedbackDetailDto>> GetFeedbacksByServiceIdAsync(string serviceId);
    }
} 
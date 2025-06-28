using ADNTester.BO.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADNTester.Service.Interfaces
{
    public interface IBlogService
    {
        Task<IEnumerable<BlogDto>> GetAllAsync();
        Task<BlogDto> GetByIdAsync(string id);
        Task<IEnumerable<BlogDto>> GetByTagIdAsync(string tagId);
        Task<string> CreateAsync(CreateBlogWithUrlDto dto);
        Task<string> CreateWithTagsAsync(CreateBlogWithTagsDto dto);
        Task<bool> UpdateAsync(UpdateBlogDto dto);
        Task<bool> DeleteAsync(string id);
    }
} 
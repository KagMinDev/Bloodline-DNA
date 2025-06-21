using ADNTester.BO.DTOs.BlogTag;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Service.Interfaces
{
    public interface IBlogTagService
    {
        Task<IEnumerable<BlogTagDto>> GetAllAsync();
        Task<BlogTagDto?> GetByIdAsync(string blogId, string tagId);
        Task<BlogTagDto> CreateAsync(CreateBlogTagDto dto);
        Task<bool> DeleteAsync(string blogId, string tagId);
        Task<IEnumerable<BlogTagDto>> GetByBlogIdAsync(string blogId);
        Task<IEnumerable<BlogTagDto>> GetByTagIdAsync(string tagId);
        Task<bool> AddTagsToBlogAsync(string blogId, List<string> tagIds);
        Task<bool> RemoveTagsFromBlogAsync(string blogId, List<string> tagIds);
    }
} 
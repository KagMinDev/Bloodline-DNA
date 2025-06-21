using ADNTester.BO.DTOs.Tag;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Service.Interfaces
{
    public interface ITagService
    {
        Task<IEnumerable<TagDto>> GetAllAsync();
        Task<TagDto?> GetByIdAsync(string id);
        Task<TagDto> CreateAsync(CreateTagDto dto);
        Task<bool> UpdateAsync(UpdateTagDto dto);
        Task<bool> DeleteAsync(string id);
        Task<TagDto?> GetByNameAsync(string name);
        Task<IEnumerable<TagDto>> GetTagsByBlogIdAsync(string blogId);
    }
} 
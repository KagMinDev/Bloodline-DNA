using ADNTester.BO.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Repository.Interfaces
{
    public interface IBlogTagRepository : IGenericRepository<BlogTag>
    {
        Task<IEnumerable<BlogTag>> GetByBlogIdAsync(string blogId);
        Task<IEnumerable<BlogTag>> GetByTagIdAsync(string tagId);
        Task<BlogTag?> GetByBlogAndTagAsync(string blogId, string tagId);
        Task RemoveByBlogIdAsync(string blogId);
        Task RemoveByTagIdAsync(string tagId);
    }
}

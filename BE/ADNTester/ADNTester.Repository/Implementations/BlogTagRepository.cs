using ADNTester.BO.Entities;
using ADNTester.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Repository.Implementations
{
    public class BlogTagRepository : GenericRepository<BlogTag>, IBlogTagRepository
    {
        public BlogTagRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<BlogTag>> GetByBlogIdAsync(string blogId)
        {
            return await _dbSet
                .Include(bt => bt.Blog)
                .Include(bt => bt.Tag)
                .Where(bt => bt.BlogId == blogId)
                .ToListAsync();
        }

        public async Task<IEnumerable<BlogTag>> GetByTagIdAsync(string tagId)
        {
            return await _dbSet
                .Include(bt => bt.Blog)
                .Include(bt => bt.Tag)
                .Where(bt => bt.TagId == tagId)
                .ToListAsync();
        }

        public async Task<BlogTag?> GetByBlogAndTagAsync(string blogId, string tagId)
        {
            return await _dbSet
                .Include(bt => bt.Blog)
                .Include(bt => bt.Tag)
                .FirstOrDefaultAsync(bt => bt.BlogId == blogId && bt.TagId == tagId);
        }

        public async Task RemoveByBlogIdAsync(string blogId)
        {
            var blogTags = await _dbSet.Where(bt => bt.BlogId == blogId).ToListAsync();
            _dbSet.RemoveRange(blogTags);
        }

        public async Task RemoveByTagIdAsync(string tagId)
        {
            var blogTags = await _dbSet.Where(bt => bt.TagId == tagId).ToListAsync();
            _dbSet.RemoveRange(blogTags);
        }
    }
} 
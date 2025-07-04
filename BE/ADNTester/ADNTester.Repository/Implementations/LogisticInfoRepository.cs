using ADNTester.BO.Entities;
using ADNTester.BO.Enums;
using ADNTester.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Repository.Implementations
{
    public class LogisticInfoRepository : ILogisticInfoRepository
    {
        private readonly ApplicationDbContext _context;

        public LogisticInfoRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<LogisticsInfo?> GetByIdAsync(string id)
        {
            return await _context.LogisticsInfos
             .Include(x => x.Staff) // 👈 Optional include
             .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<LogisticsInfo>> GetAllAsync()
        {
            return await _context.LogisticsInfos.ToListAsync();
        }
        public async Task<List<LogisticsInfo>> FindAsync(Expression<Func<LogisticsInfo, bool>> predicate)
        {
            return await _context.LogisticsInfos.Where(predicate).ToListAsync();
        }
        public async Task<List<LogisticsInfo>> GetAssignedLogisticsAsync(string staffId, LogisticsType? type = null)
        {
            var query = _context.LogisticsInfos
                .Where(l => l.StaffId == staffId);

            if (type.HasValue)
            {
                query = query.Where(l => l.Type == type.Value);
            }

            return await query.ToListAsync();
        }

        public async Task AddAsync(LogisticsInfo info)
        {
            _context.LogisticsInfos.Add(info);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(LogisticsInfo info)
        {
            _context.LogisticsInfos.Update(info);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(string id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.LogisticsInfos.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<List<LogisticsInfo>> GetAllAsync(LogisticsType? type = null, LogisticStatus? status = null)
        {
            var query = _context.LogisticsInfos
                .Include(x => x.Staff)
                .AsQueryable();

            if (type.HasValue)
                query = query.Where(x => x.Type == type.Value);

            if (status.HasValue)
                query = query.Where(x => x.Status == status.Value);

            return await query.ToListAsync();
        }

        public async Task<List<LogisticsInfo>> GetAssignedLogisticsAsync(string staffId, LogisticsType? type = null, LogisticStatus? status = null)
        {
            var query = _context.LogisticsInfos
                .Where(x => x.StaffId == staffId);

            if (type.HasValue)
                query = query.Where(x => x.Type == type.Value);

            if (status.HasValue)
                query = query.Where(x => x.Status == status.Value);

            return await query.ToListAsync();
        }
    }
}

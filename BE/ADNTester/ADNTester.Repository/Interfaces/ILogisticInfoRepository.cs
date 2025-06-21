using ADNTester.BO.Entities;
using ADNTester.BO.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Repository.Interfaces
{
    public interface ILogisticInfoRepository
    {
        Task<LogisticsInfo?> GetByIdAsync(string id);
        Task<List<LogisticsInfo>> GetAllAsync();
        Task<List<LogisticsInfo>> FindAsync(Expression<Func<LogisticsInfo, bool>> predicate);
        Task<List<LogisticsInfo>> GetAssignedLogisticsAsync(string staffId, LogisticsType? type = null);
        Task AddAsync(LogisticsInfo info);
        Task UpdateAsync(LogisticsInfo info);
        Task DeleteAsync(string id);
    }
}

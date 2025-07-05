using ADNTester.BO.Entities;
using ADNTester.BO.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Service.Interfaces
{
    public interface ILogisticService
    {
        Task<LogisticsInfo> CreateAsync(LogisticsInfo info);
        Task<List<LogisticsInfo>> GetAllAsync(LogisticsType? type = null, LogisticStatus? status = null);
        Task<List<LogisticsInfo>> GetAssignedLogisticsAsync(string staffId, LogisticsType? type = null, LogisticStatus? status = null);
        Task<LogisticsInfo?> GetByIdAsync(string id);
        Task AssignStaffAsync(string logisticsInfoId, string staffId);
        Task CompleteLogisticsTaskAsync(string logisticsInfoId, string staffId);
    }
}

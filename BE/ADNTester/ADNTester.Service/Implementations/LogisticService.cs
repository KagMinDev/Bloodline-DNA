using ADNTester.BO.Entities;
using ADNTester.BO.Enums;
using ADNTester.Repository.Interfaces;
using ADNTester.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Service.Implementations
{
    public class LogisticService : ILogisticService
    {
        private readonly IUnitOfWork _unitOfWork;
        public LogisticService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task AssignStaffAsync(string logisticsInfoId, string staffId)
        {
            var logistic = await _unitOfWork.LogisticInfoRepository.GetByIdAsync(logisticsInfoId);
            if (logistic == null)
                throw new Exception("Logistics info not found.");

            if (logistic.CompletedAt != null)
                throw new Exception("Cannot assign staff to a completed task.");

            logistic.StaffId = staffId;
            logistic.ScheduledAt ??= DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task CompleteLogisticsTaskAsync(string logisticsInfoId, string staffId)
        {
            var logistics = await _unitOfWork.LogisticInfoRepository.GetByIdAsync(logisticsInfoId);
            if (logistics == null)
                throw new Exception("Logistics info not found.");
            if (logistics.StaffId != staffId)
                throw new Exception("You are not assigned to this task.");

            logistics.CompletedAt = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<List<LogisticsInfo>> GetAllAsync(LogisticsType? type = null)
        {
            var all = await _unitOfWork.LogisticInfoRepository.GetAllAsync();

            if (type.HasValue)
            {
                return all.Where(x => x.Type == type.Value).ToList();
            }

            return all;
        }
        public async Task<List<LogisticsInfo>> GetAssignedLogisticsAsync(string staffId, LogisticsType? type = null)
        {
            return await _unitOfWork.LogisticInfoRepository.GetAssignedLogisticsAsync(staffId, type);
        }

        public async Task<LogisticsInfo?> GetByIdAsync(string id)
        {
            return await _unitOfWork.LogisticInfoRepository.GetByIdAsync(id);
        }

        public async Task<LogisticsInfo> CreateAsync(LogisticsInfo info)
        {
            await _unitOfWork.LogisticInfoRepository.AddAsync(info);
            await _unitOfWork.SaveChangesAsync();
            return info;
        }
    }
}

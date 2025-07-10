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

        public async Task<LogisticsInfo> CreateAsync(LogisticsInfo info)
        {
            info.Status = GetInitialStatus(info.Type);
            await _unitOfWork.LogisticInfoRepository.AddAsync(info);
            await _unitOfWork.SaveChangesAsync();
            return info;
        }

        public async Task<List<LogisticsInfo>> GetAllAsync(LogisticsType? type = null, LogisticStatus? status = null)
        {
            return await _unitOfWork.LogisticInfoRepository.GetAllAsync(type, status);
        }

        public async Task<List<LogisticsInfo>> GetAssignedLogisticsAsync(string staffId, LogisticsType? type = null, LogisticStatus? status = null)
        {
            return await _unitOfWork.LogisticInfoRepository.GetAssignedLogisticsAsync(staffId, type, status);
        }

        public async Task<LogisticsInfo?> GetByIdAsync(string id)
        {
            return await _unitOfWork.LogisticInfoRepository.GetByIdAsync(id);
        }

        public async Task AssignStaffAsync(string logisticsInfoId, string staffId)
        {
            var logistics = await GetLogisticsOrThrowAsync(logisticsInfoId);

            if (logistics.CompletedAt != null)
                throw new InvalidOperationException("Không thể giao nhiệm vụ đã hoàn thành.");

            if (!string.IsNullOrEmpty(logistics.StaffId))
                throw new InvalidOperationException("Nhiệm vụ này đã được giao.");

            logistics.StaffId = staffId;
            logistics.ScheduledAt ??= DateTime.UtcNow;
            logistics.Status = GetAssignedStatus(logistics.Type);

            // Update related booking status if applicable
            var testKit = await _unitOfWork.TestKitRepository
                .FindOneAsync(x =>
                    x.DeliveryInfoId == logisticsInfoId || x.PickupInfoId == logisticsInfoId);

            if (testKit != null)
            {
                var booking = await _unitOfWork.TestBookingRepository.GetByIdAsync(testKit.BookingId);
                if (booking != null)
                {
                    booking.Status = logistics.Type switch
                    {
                        LogisticsType.Delivery => BookingStatus.DeliveringKit,
                        LogisticsType.Pickup => BookingStatus.ReturningSample,
                        _ => booking.Status
                    };
                }
            }


            await _unitOfWork.SaveChangesAsync();
        }

        public async Task CompleteLogisticsTaskAsync(string logisticsInfoId, string staffId)
        {
            var logistics = await GetLogisticsOrThrowAsync(logisticsInfoId);

            if (logistics.StaffId != staffId)
                throw new UnauthorizedAccessException("Bạn không phải là người được giao nhiệm vụ này.");

            if (logistics.CompletedAt != null)
                throw new InvalidOperationException("Nhiệm vụ đã hoàn thành trước đó.");

            logistics.CompletedAt = DateTime.UtcNow;
            logistics.Status = GetCompletionStatus(logistics.Type);
            //update related booking when staff complete pick up task
            if (logistics.Type == LogisticsType.Pickup)
            {
                var testKit = await _unitOfWork.TestKitRepository
                    .FindOneAsync(k => k.PickupInfoId == logistics.Id);

                if (testKit != null)
                {
                    var booking = await _unitOfWork.TestBookingRepository.GetByIdAsync(testKit.BookingId);
                    if (booking != null)
                    {
                        booking.Status = BookingStatus.SampleReceived;
                        booking.UpdatedAt = DateTime.UtcNow;
                        
                        _unitOfWork.TestBookingRepository.Update(booking);
                    }
                }
            }

            await _unitOfWork.SaveChangesAsync();
        }

        #region Helper methods

        private static LogisticStatus GetInitialStatus(LogisticsType type)
        {
            return type switch
            {
                LogisticsType.Delivery => LogisticStatus.PreparingKit,
                LogisticsType.Pickup => LogisticStatus.WaitingForPickup,
                _ => throw new ArgumentOutOfRangeException(nameof(type), $"Unsupported logistics type: {type}")
            };
        }

        private static LogisticStatus GetAssignedStatus(LogisticsType type)
        {
            return type switch
            {
                LogisticsType.Delivery => LogisticStatus.DeliveringKit,
                LogisticsType.Pickup => LogisticStatus.PickingUpSample,
                _ => throw new ArgumentOutOfRangeException(nameof(type), $"Unsupported logistics type: {type}")
            };
        }

        private static LogisticStatus GetCompletionStatus(LogisticsType type)
        {
            return type switch
            {
                LogisticsType.Delivery => LogisticStatus.KitDelivered,
                LogisticsType.Pickup => LogisticStatus.SampleReceived,
                _ => LogisticStatus.Cancelled
            };
        }

        private async Task<LogisticsInfo> GetLogisticsOrThrowAsync(string id)
        {
            var logistics = await _unitOfWork.LogisticInfoRepository.GetByIdAsync(id);
            if (logistics == null)
                throw new KeyNotFoundException("Logistics info not found.");
            return logistics;
        }
        #endregion
    }
}
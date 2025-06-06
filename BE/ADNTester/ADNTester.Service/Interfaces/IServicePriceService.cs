using ADNTester.BO.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADNTester.Service.Interfaces
{
    public interface IServicePriceService
    {
        Task<IEnumerable<PriceServiceDto>> GetAllAsync();
        Task<IEnumerable<PriceServiceDto>> GetByServiceIdAsync(string serviceId);
        Task<PriceServiceDto> GetByIdAsync(string id);
        Task<string> CreateAsync(CreatePriceServiceDto dto);
        Task<bool> UpdateAsync(UpdatePriceServiceDto dto);
        Task<bool> DeleteAsync(string id);
        Task<IEnumerable<PriceServiceDto>> GetLatestEffectivePricesAsync();
    }
} 
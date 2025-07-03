using ADNTester.BO.DTOs;
using ADNTester.BO.Entities;
using ADNTester.Repository.Interfaces;
using ADNTester.Service.Interfaces;
using AutoMapper;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADNTester.Service.Implementations
{
    public class ServicePriceService : IServicePriceService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ServicePriceService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PriceServiceDto>> GetAllAsync()
        {
            var prices = await _unitOfWork.ServicePriceRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<PriceServiceDto>>(prices);
        }

        public async Task<IEnumerable<PriceServiceDto>> GetByServiceIdAsync(string serviceId)
        {
            var prices = await _unitOfWork.ServicePriceRepository.GetAllAsync();
            var filteredPrices = prices.Where(p => p.ServiceId == serviceId);
            return _mapper.Map<IEnumerable<PriceServiceDto>>(filteredPrices);
        }

        public async Task<PriceServiceDto> GetByIdAsync(string id)
        {
            var price = await _unitOfWork.ServicePriceRepository.GetByIdAsync(id);
            return price == null ? null : _mapper.Map<PriceServiceDto>(price);
        }

        public async Task<string> CreateAsync(CreatePriceServiceDto dto)
        {
            var price = _mapper.Map<ServicePrice>(dto);
            await _unitOfWork.ServicePriceRepository.AddAsync(price);
            await _unitOfWork.SaveChangesAsync();
            return price.Id;
        }

        public async Task<bool> UpdateAsync(UpdatePriceServiceDto dto)
        {
            var price = await _unitOfWork.ServicePriceRepository.GetByIdAsync(dto.Id);
            if (price == null)
                return false;

            _mapper.Map(dto, price);
            _unitOfWork.ServicePriceRepository.Update(price);
            return await _unitOfWork.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var price = await _unitOfWork.ServicePriceRepository.GetByIdAsync(id);
            if (price == null)
                return false;

            _unitOfWork.ServicePriceRepository.Remove(price);
            return await _unitOfWork.SaveChangesAsync() > 0;
        }
        public async Task<IEnumerable<PriceServiceDto>> GetLatestEffectivePricesAsync()
        {
            var prices = await _unitOfWork.ServicePriceRepository.GetAllAsync();

            // Group by ServiceId and CollectionMethod, then get the latest price for each group
            var latestPrices = prices
                .GroupBy(p => new { p.ServiceId, p.CollectionMethod })
                .Select(g => g.OrderByDescending(p => p.EffectiveFrom).First())
                .Where(p => !p.EffectiveTo.HasValue || p.EffectiveTo > DateTime.Now); // Only not expired

            // Lấy thông tin TestService cho mỗi price, chỉ lấy service IsActive = true
            var pricesWithService = new List<ServicePrice>();
            foreach (var price in latestPrices)
            {
                var service = await _unitOfWork.TestServiceRepository.GetByIdAsync(price.ServiceId);
                if (service != null && service.IsActive)
                {
                    price.Service = service;
                    pricesWithService.Add(price);
                }
            }

            return _mapper.Map<IEnumerable<PriceServiceDto>>(pricesWithService);
        }
    }
} 
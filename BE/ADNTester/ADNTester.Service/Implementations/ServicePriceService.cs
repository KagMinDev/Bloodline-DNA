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

            // Nhóm các giá theo ServiceId và lấy giá có EffectiveFrom gần nhất cho mỗi service
            var latestPrices = prices
                .GroupBy(p => p.ServiceId)
                .Select(g => g.OrderByDescending(p => p.EffectiveFrom).First())
                .Where(p => p.EffectiveTo == null || p.EffectiveTo > p.EffectiveFrom);

            // Lấy thông tin TestService cho mỗi price
            var pricesWithService = new List<ServicePrice>();
            foreach (var price in latestPrices)
            {
                var service = await _unitOfWork.TestServiceRepository.GetByIdAsync(price.ServiceId);
                if (service != null)
                {
                    price.Service = service;
                    pricesWithService.Add(price);
                }
            }

            return _mapper.Map<IEnumerable<PriceServiceDto>>(pricesWithService);
        }
    }
} 
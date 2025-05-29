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
    public class TestServiceService : ITestServiceService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IServicePriceService _servicePriceService;

        public TestServiceService(
            IUnitOfWork unitOfWork, 
            IMapper mapper,
            IServicePriceService servicePriceService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _servicePriceService = servicePriceService;
        }

        public async Task<IEnumerable<TestServiceDto>> GetAllAsync()
        {
            var services = await _unitOfWork.TestServiceRepository.GetAllAsync();
            var serviceDtos = _mapper.Map<IEnumerable<TestServiceDto>>(services);

            // Lấy thông tin giá cho từng dịch vụ
            foreach (var serviceDto in serviceDtos)
            {
                var prices = await _servicePriceService.GetByServiceIdAsync(serviceDto.Id);
                serviceDto.PriceServices = prices.ToList();
            }

            return serviceDtos;
        }

        public async Task<TestServiceDto> GetByIdAsync(string id)
        {
            var service = await _unitOfWork.TestServiceRepository.GetByIdAsync(id);
            if (service == null)
                return null;

            var serviceDto = _mapper.Map<TestServiceDto>(service);

            
            var prices = await _servicePriceService.GetByServiceIdAsync(id);
            serviceDto.PriceServices = prices.ToList();

            return serviceDto;
        }

        public async Task<string> CreateAsync(CreateTestServiceDto dto)
        {
            // Create TestService
            var service = _mapper.Map<TestService>(dto);
            await _unitOfWork.TestServiceRepository.AddAsync(service);
            await _unitOfWork.SaveChangesAsync();

            // Create PriceServices if provided
            if (dto.PriceServices != null && dto.PriceServices.Count > 0)
            {
                foreach (var priceDto in dto.PriceServices)
                {
                    var price = _mapper.Map<ServicePrice>(priceDto);
                    price.ServiceId = service.Id; 
                    await _unitOfWork.ServicePriceRepository.AddAsync(price);
                }
                await _unitOfWork.SaveChangesAsync();
            }

            return service.Id;
        }

        public async Task<bool> UpdateAsync(UpdateTestServiceDto dto)
        {
            var service = await _unitOfWork.TestServiceRepository.GetByIdAsync(dto.Id);
            if (service == null)
                return false;

            _mapper.Map(dto, service);
            _unitOfWork.TestServiceRepository.Update(service);

            // Update PriceServices if provided
            if (dto.PriceServices != null && dto.PriceServices.Count > 0)
            {
                foreach (var priceDto in dto.PriceServices)
                {
                    var price = await _unitOfWork.ServicePriceRepository.GetByIdAsync(priceDto.Id);
                    if (price != null)
                    {
                        _mapper.Map(priceDto, price);
                        _unitOfWork.ServicePriceRepository.Update(price);
                    }
                }
            }

            return await _unitOfWork.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var service = await _unitOfWork.TestServiceRepository.GetByIdAsync(id);
            if (service == null)
                return false;

            // Delete associated PriceServices first
            var prices = await _unitOfWork.ServicePriceRepository.GetAllAsync();
            var servicePrices = prices.Where(p => p.ServiceId == id);
            foreach (var price in servicePrices)
            {
                _unitOfWork.ServicePriceRepository.Remove(price);
            }

            _unitOfWork.TestServiceRepository.Remove(service);
            return await _unitOfWork.SaveChangesAsync() > 0;
        }
    }
} 
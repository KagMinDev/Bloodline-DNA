using ADNTester.BO.DTOs.TestBooking;
using ADNTester.BO.Entities;
using ADNTester.BO.Enums;
using ADNTester.Repository.Interfaces;
using ADNTester.Service.Interfaces;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADNTester.Service.Implementations
{
    public class TestBookingService : ITestBookingService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IServicePriceService _servicePriceService;

        public TestBookingService(
            IUnitOfWork unitOfWork, 
            IMapper mapper,
            IServicePriceService servicePriceService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _servicePriceService = servicePriceService;
        }

        public async Task<IEnumerable<TestBookingDto>> GetAllAsync()
        {
            var bookings = await _unitOfWork.TestBookingRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<TestBookingDto>>(bookings);
        }

        public async Task<TestBookingDto> GetByIdAsync(string id)
        {
            var booking = await _unitOfWork.TestBookingRepository.GetByIdAsync(id);
            return booking == null ? null : _mapper.Map<TestBookingDto>(booking);
        }

        public async Task<string> CreateAsync(CreateTestBookingDto dto)
        {
            try
            {
                // Validate TestService exists
                var testService = await _unitOfWork.TestServiceRepository.GetByIdAsync(dto.TestServiceId);
                if (testService == null)
                    throw new Exception("Test service not found");

                // Get price service using IServicePriceService
                var priceServices = await _servicePriceService.GetByServiceIdAsync(dto.TestServiceId);
                var priceService = priceServices.FirstOrDefault();
                if (priceService == null)
                    throw new Exception("No price found for this test service");

                var booking = _mapper.Map<TestBooking>(dto);
                booking.Id = Guid.NewGuid().ToString();
                booking.Price = priceService.Price;
                booking.CollectionMethod = (SampleCollectionMethod)priceService.CollectionMethod;
                booking.Status = BookingStatus.Pending;
                booking.CreatedAt = DateTime.UtcNow;
                booking.UpdatedAt = DateTime.UtcNow;

                await _unitOfWork.TestBookingRepository.AddAsync(booking);
                var result = await _unitOfWork.SaveChangesAsync();

                if (result <= 0)
                    throw new Exception("Failed to save booking");

                return booking.Id;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error creating booking: {ex.Message}", ex);
            }
        }

        public async Task<bool> UpdateAsync(UpdateTestBookingDto dto)
        {
            try
            {
                var booking = await _unitOfWork.TestBookingRepository.GetByIdAsync(dto.Id);
                if (booking == null)
                    return false;

                _mapper.Map(dto, booking);
                booking.UpdatedAt = DateTime.UtcNow;

                _unitOfWork.TestBookingRepository.Update(booking);
                var result = await _unitOfWork.SaveChangesAsync();

                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating booking: {ex.Message}", ex);
            }
        }

        public async Task<bool> DeleteAsync(string id)
        {
            try
            {
                var booking = await _unitOfWork.TestBookingRepository.GetByIdAsync(id);
                if (booking == null)
                    return false;

                _unitOfWork.TestBookingRepository.Remove(booking);
                var result = await _unitOfWork.SaveChangesAsync();

                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting booking: {ex.Message}", ex);
            }
        }
    }
} 
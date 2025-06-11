using ADNTester.BO.DTOs;
using ADNTester.BO.DTOs.TestSample;
using ADNTester.BO.Entities;
using ADNTester.Repository.Interfaces;
using ADNTester.Service.Interfaces;
using AutoMapper;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace ADNTester.Service.Implementations
{
    public class TestSampleService : ITestSampleService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public TestSampleService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<TestSampleDto>> GetAllAsync()
        {
            var testSamples = await _unitOfWork.TestSampleRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<TestSampleDto>>(testSamples);
        }

        public async Task<TestSampleDto> GetByIdAsync(string id)
        {
            var testSample = await _unitOfWork.TestSampleRepository.GetByIdAsync(id);
            return testSample == null ? null : _mapper.Map<TestSampleDto>(testSample);
        }

        public async Task<string> CreateAsync(CreateTestSampleDto dto)
        {
            var testSample = _mapper.Map<TestSample>(dto);
            await _unitOfWork.TestSampleRepository.AddAsync(testSample);
            await _unitOfWork.SaveChangesAsync();
            return testSample.Id;
        }

        public async Task<bool> UpdateAsync(UpdateTestSampleDto dto)
        {
            var testSample = await _unitOfWork.TestSampleRepository.GetByIdAsync(dto.Id);
            if (testSample == null)
                return false;

            _mapper.Map(dto, testSample);
            _unitOfWork.TestSampleRepository.Update(testSample);
            return await _unitOfWork.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var testSample = await _unitOfWork.TestSampleRepository.GetByIdAsync(id);
            if (testSample == null)
                return false;

            _unitOfWork.TestSampleRepository.Remove(testSample);
            return await _unitOfWork.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<TestSampleDetailDto>> GetTestSampleByUserId(string userId)
        {
            // Lấy tất cả kit
            var kits = await _unitOfWork.TestKitRepository.GetAllAsync();
            
            // Lấy tất cả booking của user
            var bookings = await _unitOfWork.TestBookingRepository.GetAllAsync();
            var userBookings = bookings.Where(b => b.ClientId == userId).ToList();
            var userBookingIds = userBookings.Select(b => b.Id).ToList();
            
            // Lọc các kit thuộc booking của user
            var userKits = kits.Where(k => userBookingIds.Contains(k.BookingId)).ToList();
            var userKitIds = userKits.Select(k => k.Id).ToList();
            
            // Lấy tất cả sample
            var samples = await _unitOfWork.TestSampleRepository.GetAllAsync();
            
            // Lọc các sample thuộc kit của user
            var userSamples = samples.Where(s => userKitIds.Contains(s.KitId)).ToList();
            
            foreach (var sample in userSamples)
            {
                // Lấy thông tin kit
                var kit = userKits.FirstOrDefault(k => k.Id == sample.KitId);
                if (kit != null)
                {
                    // Lấy thông tin booking từ kit
                    var booking = userBookings.FirstOrDefault(b => b.Id == kit.BookingId);
                    if (booking != null)
                    {
                        // Lấy thông tin user từ booking
                        booking.Client = await _unitOfWork.UserRepository.GetByIdAsync(booking.ClientId);
                        // Lấy thông tin test service
                        booking.TestService = await _unitOfWork.TestServiceRepository.GetByIdAsync(booking.TestServiceId);
                        // Gán thông tin booking vào kit
                        kit.Booking = booking;
                    }
                    // Gán thông tin kit vào sample
                    sample.Kit = kit;
                }
            }
            
            return _mapper.Map<IEnumerable<TestSampleDetailDto>>(userSamples);
        }

        public async Task<TestSampleDetailDto> GetTestSampleByKitId(string kitId)
        {
            // Lấy thông tin kit trước
            var kit = await _unitOfWork.TestKitRepository.GetByIdAsync(kitId);
            if (kit == null)
                return null;

            var sample = await _unitOfWork.TestSampleRepository.GetAllAsync();
            var targetSample = sample.FirstOrDefault(s => s.KitId == kitId);
            
            if (targetSample == null)
                return null;

            // Lấy thông tin booking từ kit
            var booking = await _unitOfWork.TestBookingRepository.GetByIdAsync(kit.BookingId);
            if (booking != null)
            {
                // Lấy thông tin user từ booking
                booking.Client = await _unitOfWork.UserRepository.GetByIdAsync(booking.ClientId);
                // Lấy thông tin test service
                booking.TestService = await _unitOfWork.TestServiceRepository.GetByIdAsync(booking.TestServiceId);
                // Gán thông tin booking vào kit
                kit.Booking = booking;
            }
            
            // Gán thông tin kit vào sample
            targetSample.Kit = kit;
            
            return _mapper.Map<TestSampleDetailDto>(targetSample);
        }
    }
} 
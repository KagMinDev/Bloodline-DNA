using ADNTester.BO.DTOs;
using ADNTester.BO.DTOs.TestKit;
using ADNTester.BO.Entities;
using ADNTester.Repository.Interfaces;
using ADNTester.Service.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace ADNTester.Service.Implementations
{
    public class TestKitService : ITestKitService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public TestKitService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<TestKitDto>> GetAllAsync()
        {
            var testKits = await _unitOfWork.TestKitRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<TestKitDto>>(testKits);
        }

        public async Task<TestKitDto> GetByIdAsync(string id)
        {
            var testKit = await _unitOfWork.TestKitRepository.GetByIdAsync(id);
            return testKit == null ? null : _mapper.Map<TestKitDto>(testKit);
        }

        public async Task<TestKitDto> GetByBookingIdAsync(string bookingId)
        {
            var testKit = await _unitOfWork.TestKitRepository.GetAllAsync();
            var result = testKit.FirstOrDefault(tk => tk.BookingId == bookingId);
            return result == null ? null : _mapper.Map<TestKitDto>(result);
        }

        public async Task<string> CreateAsync(CreateTestKitDto dto)
        {
            var testKit = _mapper.Map<TestKit>(dto);
            await _unitOfWork.TestKitRepository.AddAsync(testKit);
            await _unitOfWork.SaveChangesAsync();
            return testKit.Id;
        }

        public async Task<bool> UpdateAsync(UpdateTestKitDto dto)
        {
            var testKit = await _unitOfWork.TestKitRepository.GetByIdAsync(dto.Id);
            if (testKit == null)
                return false;

            _mapper.Map(dto, testKit);
            _unitOfWork.TestKitRepository.Update(testKit);
            return await _unitOfWork.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var testKit = await _unitOfWork.TestKitRepository.GetByIdAsync(id);
            if (testKit == null)
                return false;

            _unitOfWork.TestKitRepository.Remove(testKit);
            return await _unitOfWork.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<TestKitDto>> GetAllByPreparingKitAndSelfSampleAsync()
        {
            var testKits = await _unitOfWork.TestKitRepository.GetAllAsync();
            var filtered = testKits.Where(tk => tk.CollectionMethod == BO.Enums.SampleCollectionMethod.SelfSample &&
                tk.Booking != null && tk.Booking.Status == BO.Enums.BookingStatus.PreparingKit);
            return _mapper.Map<IEnumerable<TestKitDto>>(filtered);
        }
    }
} 
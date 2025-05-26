using ADNTester.BO.DTOs;
using ADNTester.BO.DTOs.TestSample;
using ADNTester.BO.Entities;
using ADNTester.Repository.Interfaces;
using ADNTester.Service.Interfaces;
using AutoMapper;
using System.Collections.Generic;
using System.Threading.Tasks;

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
    }
} 
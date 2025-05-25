using ADNTester.BO.DTOs;
using ADNTester.BO.Entities;
using ADNTester.Repository.Interfaces;
using ADNTester.Service.Interfaces;
using AutoMapper;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADNTester.Service.Implementations
{
    public class TestResultService : ITestResultService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public TestResultService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<TestResultDto>> GetAllAsync()
        {
            var testResults = await _unitOfWork.TestResultRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<TestResultDto>>(testResults);
        }

        public async Task<TestResultDto> GetByIdAsync(string id)
        {
            var testResult = await _unitOfWork.TestResultRepository.GetByIdAsync(id);
            return testResult == null ? null : _mapper.Map<TestResultDto>(testResult);
        }

        public async Task<string> CreateAsync(CreateTestResultDto dto)
        {
            var testResult = _mapper.Map<TestResult>(dto);
            await _unitOfWork.TestResultRepository.AddAsync(testResult);
            await _unitOfWork.SaveChangesAsync();
            return testResult.Id;
        }

        public async Task<bool> UpdateAsync(UpdateTestResultDto dto)
        {
            var testResult = await _unitOfWork.TestResultRepository.GetByIdAsync(dto.Id);
            if (testResult == null)
                return false;

            _mapper.Map(dto, testResult);
            _unitOfWork.TestResultRepository.Update(testResult);
            return await _unitOfWork.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var testResult = await _unitOfWork.TestResultRepository.GetByIdAsync(id);
            if (testResult == null)
                return false;

            _unitOfWork.TestResultRepository.Remove(testResult);
            return await _unitOfWork.SaveChangesAsync() > 0;
        }
    }
} 
using ADNTester.BO.DTOs.SampleInstruction;
using ADNTester.BO.Entities;
using ADNTester.Repository.Interfaces;
using ADNTester.Service.Interfaces;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Service.Implementations
{
    public class SampleInstructionService : ISampleInstructionService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public SampleInstructionService( IUnitOfWork unitOfWork, IMapper mapper)
        {
             _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<IEnumerable<SampleInstructionDto>> GetAllAsync()
        {
            var entities = await _unitOfWork.SampleInstructionRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<SampleInstructionDto>>(entities);
        }

        public async Task<SampleInstructionDto?> GetByIdAsync(string id)
        {
            var entity = await _unitOfWork.SampleInstructionRepository.GetByIdAsync(id);
            return _mapper.Map<SampleInstructionDto?>(entity);
        }

        public async Task<SampleInstructionDto> CreateAsync(CreateSampleInstructionDto dto)
        {
            var entity = _mapper.Map<SampleTypeInstruction>(dto);
            await _unitOfWork.SampleInstructionRepository.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<SampleInstructionDto>(entity);
        }

        public async Task<bool> UpdateAsync(UpdateSampleInstructionDto dto)
        {
            var entity = _mapper.Map<SampleTypeInstruction>(dto);
            _unitOfWork.SampleInstructionRepository.Update(entity);
            await _unitOfWork.SaveChangesAsync();
            return await _unitOfWork.SaveChangesAsync() > 0;
        }
    }
}

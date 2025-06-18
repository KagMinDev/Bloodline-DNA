using ADNTester.BO.DTOs.SampleInstruction;
using ADNTester.BO.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Service.Interfaces
{
    public interface ISampleInstructionService
    {
        Task<IEnumerable<SampleInstructionDto>> GetAllAsync();
        Task<SampleInstructionDto?> GetByIdAsync(string id);
        Task<SampleInstructionDto> CreateAsync(CreateSampleInstructionDto dto);
        Task<bool> UpdateAsync(UpdateSampleInstructionDto dto);
    }
}

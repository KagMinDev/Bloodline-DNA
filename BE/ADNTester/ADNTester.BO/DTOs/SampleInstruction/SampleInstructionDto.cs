using ADNTester.BO.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.DTOs.SampleInstruction
{
    public class SampleInstructionDto
    {
        public string Id { get; set; }

        public SampleType SampleType { get; set; }

        public string InstructionText { get; set; }

        public string? MediaUrl { get; set; }
    }
}

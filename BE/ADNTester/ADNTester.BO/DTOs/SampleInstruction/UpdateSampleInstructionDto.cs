using ADNTester.BO.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.DTOs.SampleInstruction
{
    public class UpdateSampleInstructionDto
    {
        [Required]
        public string Id { get; set; }

        [Required]
        public SampleType SampleType { get; set; }

        [Required]
        [StringLength(1000, MinimumLength = 10)]
        public string InstructionText { get; set; }

        public string? MediaUrl { get; set; }
    }
}

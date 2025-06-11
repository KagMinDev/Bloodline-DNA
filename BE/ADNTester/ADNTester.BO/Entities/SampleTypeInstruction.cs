using ADNTester.BO.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.Entities
{
    public class SampleTypeInstruction : BaseEntity
    {
        [Required]
        public SampleType SampleType { get; set; }

        [Required]
        public string InstructionText { get; set; }

        public string? MediaUrl { get; set; }
    }
}

using ADNTester.BO.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.DTOs.TestSample
{
    public class CreateTestSampleFromClientDto
    {
        public string KitId { get; set; }
        public string DonorName { get; set; }
        public RelationshipToSubject RelationshipToSubject { get; set; }
        public SampleType SampleType { get; set; }
    }
}

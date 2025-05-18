using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ADNTester.BO.Enums;

namespace ADNTester.BO.Entities
{
    public class TestSample : BaseEntity
    {
        public string KitId { get; set; }
        public TestKit Kit { get; set; }
        public string SampleCode { get; set; }
        public string DonorName { get; set; }
        public RelationshipToSubject RelationshipToSubject { get; set; }
        public SampleType SampleType { get; set; }
        public string? CollectedById { get; set; }
        public User? Collector { get; set; }
        public DateTime? CollectedAt { get; set; }
        public DateTime? LabReceivedAt { get; set; }
    }
}

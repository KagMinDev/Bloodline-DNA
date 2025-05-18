using ADNTester.BO.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.Entities
{
    public class ServicePrice : BaseEntity
    {
        public string ServiceId { get; set; }

        public TestService Service { get; set; }

        public decimal Price { get; set; }

        public SampleCollectionMethod CollectionMethod { get; set; } // Enum: SelfCollect, AtClinic, HomeVisit

        public DateTime EffectiveFrom { get; set; } = DateTime.UtcNow;

        public DateTime? EffectiveTo { get; set; }
    }

}

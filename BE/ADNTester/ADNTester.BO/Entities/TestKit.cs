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
    public class TestKit : BaseEntity
    {
        public string BookingId { get; set; }
        public TestBooking Booking { get; set; }

        public SampleCollectionMethod CollectionMethod { get; set; }

        public string? DeliveryInfoId { get; set; }
        public LogisticsInfo? DeliveryInfo { get; set; }

        public string? PickupInfoId { get; set; }
        public LogisticsInfo? PickupInfo { get; set; }

        public DateTime? SentToLabAt { get; set; }
        public DateTime? LabReceivedAt { get; set; }

        public int SampleCount { get; set; }

        public string? Note { get; set; }

        public ICollection<TestSample> Samples { get; set; } = new List<TestSample>();
    }
}

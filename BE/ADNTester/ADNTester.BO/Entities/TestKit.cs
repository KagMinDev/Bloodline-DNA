using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.Entities
{
    public class TestKit : BaseEntity
    {
        public string BookingId { get; set; }
        public TestBooking Booking { get; set; }
        public DateTime? ShippedAt { get; set; }
        public DateTime? ReceivedAt { get; set; }
        public DateTime? SentToLabAt { get; set; }
        public DateTime? LabReceivedAt { get; set; }

        public string? ShippingOrderCode { get; set; }
        public string? ReturnOrderCode { get; set; }

        public int SampleCount { get; set; }

        public string? Note { get; set; }

        public ICollection<TestSample> Samples { get; set; } = new List<TestSample>();
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.Entities
{
    public class TestResult : BaseEntity
    {
        public string TestBookingId { get; set; }
        public TestBooking TestBooking { get; set; }

        public string ResultSummary { get; set; }
        public DateTime ResultDate { get; set; }
        public string ResultFileUrl { get; set; }
    }
}

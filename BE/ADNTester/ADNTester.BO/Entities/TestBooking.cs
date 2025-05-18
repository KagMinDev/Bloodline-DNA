using ADNTester.BO.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.Entities
{
    public class TestBooking : BaseEntity
    {
        public string ClientId { get; set; }
        public User Client { get; set; }

        public string TestServiceId { get; set; }
        public TestService TestService { get; set; }
        public TestKit Kit { get; set; }
        public decimal Price { get; set; }

        public SampleCollectionMethod CollectionMethod { get; set; }
        public BookingStatus Status { get; set; }

        public DateTime AppointmentDate { get; set; }
        public string Note { get; set; }

        public TestResult TestResult { get; set; }
    }
}

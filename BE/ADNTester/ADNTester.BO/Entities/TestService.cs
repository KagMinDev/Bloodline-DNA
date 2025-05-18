using ADNTester.BO.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.Entities
{
    public class TestService : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public List<ServicePrice> Prices { get; set; }
        public TestServiceType Type { get; set; }

        public ICollection<TestBooking> Bookings { get; set; }
    }
}

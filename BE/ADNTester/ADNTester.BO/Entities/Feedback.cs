using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.Entities
{
    public class Feedback : BaseEntity
    {
        public string UserId { get; set; }
        public User User { get; set; }

        public string TestServiceId { get; set; }
        public TestService TestService { get; set; }

        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }
}

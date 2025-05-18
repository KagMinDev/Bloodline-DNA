using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO
{
    public class BaseEntity
    {
        public string Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public BaseEntity()
        {
            Id = GenerateUniqueId(); 
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }
        private string GenerateUniqueId()
        {
            var ticks = new DateTime(2025, 4, 30).Ticks;
            var ans = DateTime.Now.Ticks - ticks;
            var randomPart = new Random().Next(1000, 9999);
            return (ans.ToString("x") + randomPart.ToString()).ToUpper();
        }
    }
}

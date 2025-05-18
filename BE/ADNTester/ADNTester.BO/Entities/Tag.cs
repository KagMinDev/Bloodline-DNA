using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.Entities
{
    public class Tag : BaseEntity
    {
        public string Name {  get; set; }
        public ICollection<BlogTag> BlogTags { get; set; } = new List<BlogTag>();
    }
}

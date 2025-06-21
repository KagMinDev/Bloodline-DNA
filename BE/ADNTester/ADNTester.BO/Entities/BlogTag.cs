using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.Entities
{
    public class BlogTag : BaseEntity
    {
        public string BlogId {  get; set; }
        public Blog Blog { get; set; }
        public string TagId {  get; set; }
        public Tag Tag { get; set; }
    }
}

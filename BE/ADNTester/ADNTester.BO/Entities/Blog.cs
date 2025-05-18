using ADNTester.BO.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.Entities
{
    public class Blog : BaseEntity
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string ThumbnailURL { get; set; }
        public BlogStatus Status { get; set; }
        public ICollection<BlogTag> Tags { get; set; }
        public string AuthorId {  get; set; }
        public User Author { get; set; }
    }
}

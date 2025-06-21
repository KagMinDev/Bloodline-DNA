using System.ComponentModel.DataAnnotations;

namespace ADNTester.BO.DTOs.BlogTag
{
    public class CreateBlogTagDto
    {
        [Required]
        public string BlogId { get; set; }
        
        [Required]
        public string TagId { get; set; }
    }
} 
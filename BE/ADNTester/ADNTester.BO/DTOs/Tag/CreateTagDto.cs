using System.ComponentModel.DataAnnotations;

namespace ADNTester.BO.DTOs.Tag
{
    public class CreateTagDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
    }
} 
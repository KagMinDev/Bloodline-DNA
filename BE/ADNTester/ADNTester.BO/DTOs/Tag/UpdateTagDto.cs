using System.ComponentModel.DataAnnotations;

namespace ADNTester.BO.DTOs.Tag
{
    public class UpdateTagDto
    {
        [Required]
        public string Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
    }
} 
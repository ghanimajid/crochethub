using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CrochetHub.Models
{
    public class CourseReview
    {
        [Key]
        public int ReviewID { get; set; }

        [Required]
        public int StudentID { get; set; }

        [Required]
        public int CourseID { get; set; }

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        public string? Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("StudentID")]
        public Student? Student { get; set; }

        [ForeignKey("CourseID")]
        public Course? Course { get; set; }
    }
}

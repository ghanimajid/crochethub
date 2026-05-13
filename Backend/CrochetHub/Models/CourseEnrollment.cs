using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CrochetHub.Models
{
    public class CourseEnrollment
    {
        [Key]
        public int EnrollmentID { get; set; }

        [Required]
        public int StudentID { get; set; }

        [Required]
        public int CourseID { get; set; }

        public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;

        public decimal CompletionPercentage { get; set; } = 0;

        [ForeignKey("StudentID")]
        public Student? Student { get; set; }

        [ForeignKey("CourseID")]
        public Course? Course { get; set; }
    }
}

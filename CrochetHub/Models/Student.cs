using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CrochetHub.Models
{
    public class Student
    {
        [Key]
        public int StudentID { get; set; }

        public DateTime? EnrollmentDate { get; set; }

        [ForeignKey("StudentID")]
        public User? User { get; set; }

        public ICollection<CourseEnrollment> CourseEnrollments { get; set; } = new List<CourseEnrollment>();
        public ICollection<StudentProgress> StudentProgresses { get; set; } = new List<StudentProgress>();
        public ICollection<CourseReview> CourseReviews { get; set; } = new List<CourseReview>();
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CrochetHub.Models
{
    public class Course
    {
        [Key]
        public int CourseID { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public int? DifficultyID { get; set; }

        [Required]
        public int InstructorID { get; set; }

        public string? ThumbnailURL { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("DifficultyID")]
        public Lookup? Difficulty { get; set; }

        [ForeignKey("InstructorID")]
        public Instructor? Instructor { get; set; }

        public ICollection<CoursePrerequisite> Prerequisites { get; set; } = new List<CoursePrerequisite>();
        public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
        public ICollection<CourseEnrollment> Enrollments { get; set; } = new List<CourseEnrollment>();
        public ICollection<CourseReview> Reviews { get; set; } = new List<CourseReview>();
        public ICollection<CourseTag> CourseTags { get; set; } = new List<CourseTag>();
        public ICollection<Pattern> Patterns { get; set; } = new List<Pattern>();
    }
}

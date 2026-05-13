using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CrochetHub.Models
{
    public class Lesson
    {
        [Key]
        public int LessonID { get; set; }

        [Required]
        public int CourseID { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? VideoURL { get; set; }

        public string? Content { get; set; }

        [Required]
        public int SequenceOrder { get; set; }

        [ForeignKey("CourseID")]
        public Course? Course { get; set; }

        public ICollection<StudentProgress> StudentProgresses { get; set; } = new List<StudentProgress>();
    }
}

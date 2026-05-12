using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CrochetHub.Models
{
    public class StudentProgress
    {
        [Key]
        public int ProgressID { get; set; }

        [Required]
        public int StudentID { get; set; }

        [Required]
        public int LessonID { get; set; }

        public bool Completed { get; set; } = false;

        public int TimeSpent { get; set; } = 0;

        public DateTime? StartedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        [ForeignKey("StudentID")]
        public Student? Student { get; set; }

        [ForeignKey("LessonID")]
        public Lesson? Lesson { get; set; }

    }
}

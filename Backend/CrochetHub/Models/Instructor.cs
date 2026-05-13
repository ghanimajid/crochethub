using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CrochetHub.Models
{
    public class Instructor
    {
        [Key]
        public int InstructorID { get; set; }

        public string? Bio { get; set; }

        public int? ExperienceYears { get; set; }

        [ForeignKey("InstructorID")]
        public User? User { get; set; }

        public ICollection<Course> Courses { get; set; } = new List<Course>();
    }
}

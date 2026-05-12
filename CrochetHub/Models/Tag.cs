using System.ComponentModel.DataAnnotations;

namespace CrochetHub.Models
{
    public class Tag
    {
        [Key]
        public int TagID { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;

        public ICollection<CourseTag> CourseTags { get; set; } = new List<CourseTag>();
        public ICollection<PatternTag> PatternTags { get; set; } = new List<PatternTag>();
    }
}

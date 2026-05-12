using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CrochetHub.Models
{
    public class Pattern
    {
        [Key]
        public int PatternID { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public int? DifficultyID { get; set; }

        public string? Description { get; set; }

        public int? CourseID { get; set; }

        [Required]
        public int CreatedBy { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("DifficultyID")]
        public Lookup? Difficulty { get; set; }

        [ForeignKey("CourseID")]
        public Course? Course { get; set; }

        [ForeignKey("CreatedBy")]
        public User? Creator { get; set; }

        public ICollection<PatternMaterial> Materials { get; set; } = new List<PatternMaterial>();
        public ICollection<PatternReview> Reviews { get; set; } = new List<PatternReview>();
        public ICollection<PatternTag> PatternTags { get; set; } = new List<PatternTag>();
    }
}

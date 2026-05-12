using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CrochetHub.Models
{
    public class PatternReview
    {
        [Key]
        public int ReviewID { get; set; }

        [Required]
        public int UserID { get; set; }

        [Required]
        public int PatternID { get; set; }

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        public string? Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("UserID")]
        public User? User { get; set; }

        [ForeignKey("PatternID")]
        public Pattern? Pattern { get; set; }
    }
}

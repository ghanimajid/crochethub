using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CrochetHub.Models
{
    public class UserFavoritePattern
    {
        [Required]
        public int UserID { get; set; }

        [Required]
        public int PatternID { get; set; }

        public DateTime SavedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("UserID")]
        public User? User { get; set; }

        [ForeignKey("PatternID")]
        public Pattern? Pattern { get; set; }
    }
}

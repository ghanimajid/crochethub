using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CrochetHub.Models
{
    public class PatternMaterial
    {
        [Key]
        public int MaterialID { get; set; }

        [Required]
        public int PatternID { get; set; }

        [Required]
        [StringLength(100)]
        public string MaterialName { get; set; } = string.Empty;

        public string? Quantity { get; set; }

        [ForeignKey("PatternID")]
        public Pattern? Pattern { get; set; }
    }
}

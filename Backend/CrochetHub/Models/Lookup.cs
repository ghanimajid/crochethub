using System.ComponentModel.DataAnnotations;

namespace CrochetHub.Models
{
    public class Lookup
    {
        [Key]
        public int LookupID { get; set; }

        [Required]
        [StringLength(100)]
        public string Value { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Category { get; set; } = string.Empty;
    }
}

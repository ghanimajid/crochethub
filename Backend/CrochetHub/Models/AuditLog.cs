using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CrochetHub.Models
{
    public class AuditLog
    {
        [Key]
        public int LogID { get; set; }

        [Required]
        public int UserID { get; set; }

        public int? ActionID { get; set; }

        [Required]
        [StringLength(50)]
        public string EntityType { get; set; } = string.Empty;

        public int? EntityID { get; set; }

        public string? OldValue { get; set; }

        public string? NewValue { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [ForeignKey("UserID")]
        public User? User { get; set; }

        [ForeignKey("ActionID")]
        public Lookup? Action { get; set; }
    }
}

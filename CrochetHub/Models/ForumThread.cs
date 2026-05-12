using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CrochetHub.Models
{
    public class ForumThread
    {
        [Key]
        public int ThreadID { get; set; }

        [Required]
        public int UserID { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Content { get; set; }

        public int? CategoryID { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("UserID")]
        public User? User { get; set; }

        [ForeignKey("CategoryID")]
        public Lookup? Category { get; set; }

        public ICollection<ForumReply> Replies { get; set; } = new List<ForumReply>();
    }
}

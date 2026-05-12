using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CrochetHub.Models
{
    public class ForumReply
    {
        [Key]
        public int ReplyID { get; set; }

        [Required]
        public int ThreadID { get; set; }

        [Required]
        public int UserID { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        public int Upvotes { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("ThreadID")]
        public ForumThread? Thread { get; set; }

        [ForeignKey("UserID")]
        public User? User { get; set; }
    }
}

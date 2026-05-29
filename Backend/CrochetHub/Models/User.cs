using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CrochetHub.Models
{
    public class User
    {
        [Key]
        public int UserID { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public string? ProfilePicture { get; set; }

        public string? Bio { get; set; }

        [Required]
        public int RoleID { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("UserID")]
        public Person? Person { get; set; }

        [ForeignKey("RoleID")]
        public Lookup? Role { get; set; }

        public Student? Student { get; set; }
        public Instructor? Instructor { get; set; }

        public ICollection<ForumThread> ForumThreads { get; set; } = new List<ForumThread>();
        public ICollection<ForumReply> ForumReplies { get; set; } = new List<ForumReply>();
        public ICollection<PatternReview> PatternReviews { get; set; } = new List<PatternReview>();
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
        public ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
        public ICollection<Pattern> Patterns { get; set; } = new List<Pattern>();
        public ICollection<UserFavoritePattern> FavoritePatterns { get; set; } = new List<UserFavoritePattern>();
    }
}

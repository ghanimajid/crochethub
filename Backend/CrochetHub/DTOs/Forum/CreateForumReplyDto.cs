using System.ComponentModel.DataAnnotations;

namespace CrochetHub.DTOs.Forum
{
    public class CreateForumReplyDto
    {
        [Required(ErrorMessage = "Content is required.")]
        [StringLength(3000, MinimumLength = 1, ErrorMessage = "Reply content must be between 1 and 3000 characters.")]
        public string Content { get; set; } = string.Empty;
    }
}

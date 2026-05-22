using System.ComponentModel.DataAnnotations;

namespace CrochetHub.DTOs.Forum
{
    public class CreateForumThreadDto
    {
        [Required(ErrorMessage = "Title is required.")]
        [StringLength(200, MinimumLength = 5, ErrorMessage = "Title must be between 5 and 200 characters.")]
        public string Title { get; set; } = string.Empty;

        [StringLength(5000, ErrorMessage = "Content cannot exceed 5000 characters.")]
        public string? Content { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Invalid category ID.")]
        public int? CategoryID { get; set; }
    }
}

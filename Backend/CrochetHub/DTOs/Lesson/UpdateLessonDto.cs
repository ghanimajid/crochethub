using System.ComponentModel.DataAnnotations;

namespace CrochetHub.DTOs.Lesson
{
    public class UpdateLessonDto
    {
        [StringLength(200, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 200 characters.")]
        public string? Title { get; set; }

        [Url(ErrorMessage = "Video URL must be a valid URL.")]
        public string? VideoURL { get; set; }

        public string? Content { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Sequence order must be greater than 0.")]
        public int? SequenceOrder { get; set; }
    }
}

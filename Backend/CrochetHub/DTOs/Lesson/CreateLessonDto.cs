using System.ComponentModel.DataAnnotations;

namespace CrochetHub.DTOs.Lesson
{
    public class CreateLessonDto
    {
        [Required(ErrorMessage = "Course ID is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Invalid course ID.")]
        public int CourseID { get; set; }

        [Required(ErrorMessage = "Title is required.")]
        [StringLength(200, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 200 characters.")]
        public string Title { get; set; } = string.Empty;

        [Url(ErrorMessage = "Video URL must be a valid URL.")]
        public string? VideoURL { get; set; }

        public string? Content { get; set; }

        [Required(ErrorMessage = "Sequence order is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Sequence order must be greater than 0.")]
        public int SequenceOrder { get; set; }
    }
}

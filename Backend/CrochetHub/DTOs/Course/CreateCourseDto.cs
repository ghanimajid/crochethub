using System.ComponentModel.DataAnnotations;

namespace CrochetHub.DTOs.Course
{
    public class CreateCourseDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        [StringLength(2000)]
        public string? Description { get; set; }

        public int? DifficultyID { get; set; }
        [Url]
        public string? ThumbnailURL { get; set; }

        public List<int> TagIDs { get; set; } = new();

        public List<int> PrerequisiteIDs { get; set; } = new();
    }
}

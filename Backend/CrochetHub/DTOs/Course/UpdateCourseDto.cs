using System.ComponentModel.DataAnnotations;

namespace CrochetHub.DTOs.Course
{
    public class UpdateCourseDto
    {
        [StringLength(200)]
        public string? Title { get; set; }

        public string? Description { get; set; }

        public int? DifficultyID { get; set; }

        public string? ThumbnailURL { get; set; }

        public List<int>? TagIDs { get; set; }

        public List<int>? PrerequisiteIDs { get; set; }
    }
}

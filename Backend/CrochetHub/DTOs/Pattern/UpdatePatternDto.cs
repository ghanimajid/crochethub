using System.ComponentModel.DataAnnotations;

namespace CrochetHub.DTOs.Pattern
{
    public class UpdatePatternDto
    {
        [StringLength(200, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 200 characters.")]
        public string? Title { get; set; }

        [StringLength(5000, MinimumLength = 10, ErrorMessage = "Description must be between 10 and 5000 characters.")]
        public string? Description { get; set; }

        public string? ThumbnailURL { get; set; }

        public int? DifficultyID { get; set; }

        public int? CourseID { get; set; }

        public List<int>? TagIDs { get; set; }

        public List<CreatePatternMaterialDto>? Materials { get; set; }
    }
}

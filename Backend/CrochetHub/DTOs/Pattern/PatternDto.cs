namespace CrochetHub.DTOs.Pattern
{
    public class PatternDto
    {
        public int PatternID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ThumbnailURL { get; set; }
        public string? Difficulty { get; set; }
        public int? CourseID { get; set; }
        public string? CourseTitle { get; set; }
        public int CreatedBy { get; set; }
        public string CreatorName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<string> Tags { get; set; } = new();
        public List<PatternMaterialDto> Materials { get; set; } = new();
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
    }
}

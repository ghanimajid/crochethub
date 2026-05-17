namespace CrochetHub.DTOs.Course
{
    public class CourseDto
    {
        public int CourseID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Difficulty { get; set; }
        public int InstructorID { get; set; }
        public string InstructorName { get; set; } = string.Empty;
        public string? ThumbnailURL { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<string> Tags { get; set; } = new();
        public List<PrerequisiteDto> Prerequisites { get; set; } = new();
        public int TotalLessons { get; set; }
        public double AverageRating { get; set; }
        public int TotalEnrollments { get; set; }
    }
    public class PrerequisiteDto
    {
        public int CourseID { get; set; }
        public string Title { get; set; } = string.Empty;
    }
}

namespace CrochetHub.DTOs.CourseReview
{
    public class CourseReviewDto
    {
        public int ReviewID { get; set; }
        public int StudentID { get; set; }
        public string ReviewerName { get; set; } = string.Empty;
        public int CourseID { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

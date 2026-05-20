namespace CrochetHub.DTOs.Pattern
{
    public class PatternReviewDto
    {
        public int ReviewID { get; set; }
        public int UserID { get; set; }
        public string ReviewerName { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

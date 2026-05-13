using Microsoft.EntityFrameworkCore;

namespace CrochetHub.Models.Views
{
    [Keyless]
    public class InstructorStatsView
    {
        public int InstructorID { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public int CourseID { get; set; }
        public string Title { get; set; } = string.Empty;
        public int TotalEnrolled { get; set; }
        public decimal AvgCompletion { get; set; }
        public decimal AvgRating { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

using Microsoft.EntityFrameworkCore;

namespace CrochetHub.Models.Views
{
    [Keyless]
    public class StudentProgressView
    {
        public int StudentID { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public int CourseID { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public decimal CompletionPercentage { get; set; }
        public int? TotalLessons { get; set; }
        public int? CompletedLessons { get; set; }
        public DateTime EnrolledAt { get; set; }
    }
}

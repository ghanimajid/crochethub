using Microsoft.EntityFrameworkCore;

namespace CrochetHub.Models.Views
{
    [Keyless]
    public class StudentNextCoursesView
    {
        public int StudentID { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public int CourseID { get; set; }
        public string NextCourse { get; set; } = string.Empty;
        public string? Difficulty { get; set; }
        public int PrerequisitesRequired { get; set; }
    }
}
}

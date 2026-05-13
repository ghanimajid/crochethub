using Microsoft.EntityFrameworkCore;

namespace CrochetHub.Models.Views
{
    [Keyless]
    public class CoursePrerequisitesView
    {
        public int CourseID { get; set; }
        public string CourseTitle { get; set; } = string.Empty;
        public string? Difficulty { get; set; }
        public string? PrerequisiteChain { get; set; }
    }
}

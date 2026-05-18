using System.ComponentModel.DataAnnotations;

namespace CrochetHub.DTOs.Lesson
{
    public class MarkLessonCompleteDto
    {
        [Range(0, int.MaxValue, ErrorMessage = "Time spent cannot be negative.")]
        public int TimeSpent { get; set; } = 0;
    }
}

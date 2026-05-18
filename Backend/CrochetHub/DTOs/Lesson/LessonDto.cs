namespace CrochetHub.DTOs.Lesson
{
    public class LessonDto
    {
        public int LessonID { get; set; }
        public int CourseID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? VideoURL { get; set; }
        public string? Content { get; set; }
        public int SequenceOrder { get; set; }
        public bool IsCompleted { get; set; }
        public int TimeSpent { get; set; }
    }
}

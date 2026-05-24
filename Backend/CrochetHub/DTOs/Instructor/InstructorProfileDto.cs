namespace CrochetHub.DTOs.Instructor
{
    public class InstructorProfileDto
    {
        public int InstructorID { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Bio { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? ProfilePicture { get; set; }
        public int? ExperienceYears { get; set; }
        public int TotalCourses { get; set; }
        public int TotalStudents { get; set; }
        public double OverallRating { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

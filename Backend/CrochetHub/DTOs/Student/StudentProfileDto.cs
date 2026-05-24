namespace CrochetHub.DTOs.Student
{
    public class StudentProfileDto
    {
        public int StudentID { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? ProfilePicture { get; set; }
        public string? Bio { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public DateTime? EnrollmentDate { get; set; }
        public int TotalEnrolled { get; set; }
        public int CompletedCourses { get; set; }
        public double AverageCompletion { get; set; }
    }
}

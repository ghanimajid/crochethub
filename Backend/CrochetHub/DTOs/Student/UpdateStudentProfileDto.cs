using System.ComponentModel.DataAnnotations;

namespace CrochetHub.DTOs.Student
{
    public class UpdateStudentProfileDto
    {
        [StringLength(100, MinimumLength = 1, ErrorMessage = "First name must be between 1 and 100 characters.")]
        public string? FirstName { get; set; }

        [StringLength(100, MinimumLength = 1, ErrorMessage = "Last name must be between 1 and 100 characters.")]
        public string? LastName { get; set; }

        [StringLength(500, ErrorMessage = "Bio cannot exceed 500 characters.")]
        public string? Bio { get; set; }

        [Url(ErrorMessage = "Profile picture must be a valid URL.")]
        public string? ProfilePicture { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public int? GenderID { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace CrochetHub.DTOs.Instructor
{
    public class UpdateInstructorProfileDto
    {
        [StringLength(1000, ErrorMessage = "Bio cannot exceed 1000 characters.")]
        public string? Bio { get; set; }

        [Range(0, 50, ErrorMessage = "Experience years must be between 0 and 50.")]
        public int? ExperienceYears { get; set; }

        [Url(ErrorMessage = "Profile picture must be a valid URL.")]
        public string? ProfilePicture { get; set; }

        [StringLength(100, MinimumLength = 1, ErrorMessage = "First name must be between 1 and 100 characters.")]
        public string? FirstName { get; set; }

        [StringLength(100, MinimumLength = 1, ErrorMessage = "Last name must be between 1 and 100 characters.")]
        public string? LastName { get; set; }
    }
}

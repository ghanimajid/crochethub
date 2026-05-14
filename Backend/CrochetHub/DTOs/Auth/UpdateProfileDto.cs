using System.ComponentModel.DataAnnotations;

namespace CrochetHub.DTOs.Auth
{
    public class UpdateProfileDto
    {
        [StringLength(100)]
        public string? FirstName { get; set; }

        [StringLength(100)]
        public string? LastName { get; set; }

        public string? Bio { get; set; }

        public string? ProfilePicture { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public int? GenderID { get; set; }
    }
}

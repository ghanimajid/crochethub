using System.ComponentModel.DataAnnotations;

namespace CrochetHub.DTOs.Notification
{
    public class CreateNotificationDto
    {

        [Required(ErrorMessage = "User ID is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Invalid user ID.")]
        public int UserID { get; set; }

        [Required(ErrorMessage = "Message is required.")]
        [StringLength(500, MinimumLength = 1, ErrorMessage = "Message must be between 1 and 500 characters.")]
        public string Message { get; set; } = string.Empty;

        [Range(1, int.MaxValue, ErrorMessage = "Invalid type ID.")]
        public int? TypeID { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace CrochetHub.DTOs.Pattern
{
    public class CreatePatternMaterialDto
    {
        [Required(ErrorMessage = "Material name is required.")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Material name must be between 1 and 100 characters.")]
        public string MaterialName { get; set; } = string.Empty;

        [StringLength(50, ErrorMessage = "Quantity cannot exceed 50 characters.")]
        public string? Quantity { get; set; }
    }
}

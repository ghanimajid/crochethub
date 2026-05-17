using System.ComponentModel.DataAnnotations;

namespace CrochetHub.DTOs.Admin
{
    public class ChangeUserRoleDto
    {
        [Required(ErrorMessage = "Role ID is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Invalid role ID.")]
        public int RoleID { get; set; }
    }
}

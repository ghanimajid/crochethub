using CrochetHub.DTOs.Auth;
using CrochetHub.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CrochetHub.Controllers
{
    public class AuthController : BaseApiController
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.RegisterAsync(dto);
            if (result == null)
                return BadRequest(new { message = "Email already exists or invalid role." });

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.LoginAsync(dto);
            if (result == null)
                return Unauthorized(new { message = "Invalid email or password." });

            return Ok(result);
        }

        [HttpPut("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var userID = GetUserID();
            if (userID == null) return Unauthorized();
            var result = await _authService.ChangePasswordAsync(userID.Value, dto);
            if (!result)
                return BadRequest(new { message = "Current password is incorrect." });

            return Ok(new { message = "Password changed successfully." });
        }

        [HttpPut("update-profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (dto.FirstName == null && dto.LastName == null && dto.Bio == null &&
                dto.ProfilePicture == null && dto.DateOfBirth == null && dto.GenderID == null)
                return BadRequest(new { message = "No fields provided to update." });

            if (dto.FirstName != null && dto.FirstName.Trim().Length == 0)
                return BadRequest(new { message = "First name cannot be empty." });
            if (dto.LastName != null && dto.LastName.Trim().Length == 0)
                return BadRequest(new { message = "Last name cannot be empty." });
            if (dto.DateOfBirth.HasValue && dto.DateOfBirth.Value.Date >= DateTime.UtcNow.Date)
                return BadRequest(new { message = "Date of birth cannot be today or in the future." });

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var result = await _authService.UpdateProfileAsync(userID.Value, dto);
            if (!result) return BadRequest(new { message = "Failed to update profile. Check gender ID or provided values." });

            return Ok(new { message = "Profile updated successfully." });
        }
    }
}

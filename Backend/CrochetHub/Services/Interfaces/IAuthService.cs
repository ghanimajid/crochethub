using CrochetHub.DTOs.Auth;

namespace CrochetHub.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto?> LoginAsync(LoginDto dto);
        Task<bool> ChangePasswordAsync(int userID, ChangePasswordDto dto);
        Task<bool> UpdateProfileAsync(int userID, UpdateProfileDto dto);
    }
}

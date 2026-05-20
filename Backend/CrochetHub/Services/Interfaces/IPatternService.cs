using CrochetHub.DTOs.Pattern;

namespace CrochetHub.Services.Interfaces
{
    public interface IPatternService
    {
        Task<List<PatternDto>> GetAllAsync(string? difficulty, string? tag, string? search);
        Task<PatternDto?> GetByIDAsync(int patternID);
        Task<(PatternDto? Pattern, string? Error)> CreateAsync(int userID, CreatePatternDto dto);
        Task<(PatternDto? Pattern, string? Error)> UpdateAsync(int patternID, int userID, string role, UpdatePatternDto dto);
        Task<(bool Success, string Message)> DeleteAsync(int patternID, int userID, string role);
        Task<(PatternReviewDto? Review, string? Error)> AddReviewAsync(int patternID, int userID, CreatePatternReviewDto dto);
        Task<(bool Success, string Message)> DeleteReviewAsync(int reviewID, int userID, string role);
        Task<List<PatternReviewDto>> GetReviewsAsync(int patternID);
    }
}

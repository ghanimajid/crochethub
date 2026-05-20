using CrochetHub.Models;

namespace CrochetHub.Repositories.Interfaces
{
    public interface IPatternRepository
    {
        Task<List<Pattern>> GetAllAsync(string? difficulty, string? tag, string? search);
        Task<Pattern?> GetByIDAsync(int patternID);
        Task<Pattern> CreateAsync(Pattern pattern, List<int>? tagIDs, List<Models.PatternMaterial>? materials);
        Task<Pattern?> UpdateAsync(int patternID, List<int>? tagIDs, List<Models.PatternMaterial>? materials, Action<Pattern> updateAction);
        Task<bool> DeleteAsync(int patternID);
        Task<bool> ExistsAsync(int patternID);
        Task<PatternReview?> GetReviewAsync(int userID, int patternID);
        Task<PatternReview> CreateReviewAsync(PatternReview review);
        Task<bool> DeleteReviewAsync(int reviewID);
        Task<List<PatternReview>> GetReviewsByPatternAsync(int patternID);
    }
}

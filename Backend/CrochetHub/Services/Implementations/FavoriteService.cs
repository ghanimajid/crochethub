using CrochetHub.Data;
using CrochetHub.Repositories.Interfaces;
using CrochetHub.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using static CrochetHub.DTOs.Favorite.FavouritePatternDto;

namespace CrochetHub.Services.Implementations
{
    public class FavoriteService : IFavoriteService
    {
        private readonly IFavoriteRepository _favoriteRepo;
        private readonly AppDbContext _context;

        public FavoriteService(IFavoriteRepository favoriteRepo, AppDbContext context)
        {
            _favoriteRepo = favoriteRepo;
            _context = context;
        }

        public async Task<List<FavoritePatternDto>> GetMyFavoritesAsync(int userID)
        {
            var favorites = await _favoriteRepo.GetByUserIDAsync(userID);

            return favorites.Select(uf => new FavoritePatternDto
            {
                PatternID = uf.PatternID,
                Title = uf.Pattern?.Title ?? string.Empty,
                Description = uf.Pattern?.Description,
                Difficulty = uf.Pattern?.Difficulty?.Value,
                CreatorName = uf.Pattern?.Creator?.Person != null
                    ? $"{uf.Pattern.Creator.Person.FirstName} {uf.Pattern.Creator.Person.LastName}"
                    : "Unknown",
                AverageRating = uf.Pattern?.Reviews != null && uf.Pattern.Reviews.Any()
                    ? Math.Round(uf.Pattern.Reviews.Average(r => r.Rating), 2)
                    : 0,
                TotalReviews = uf.Pattern?.Reviews?.Count ?? 0,
                SavedAt = uf.SavedAt
            }).ToList();
        }

        public async Task<(bool Success, string Message)> AddFavoriteAsync(int userID, int patternID)
        {
            var patternExists = await _context.Patterns.AnyAsync(p => p.PatternID == patternID);
            if (!patternExists)
                return (false, "Pattern not found.");

            if (await _favoriteRepo.IsFavoriteAsync(userID, patternID))
                return (false, "Pattern is already in your favorites.");

            var success = await _favoriteRepo.AddAsync(userID, patternID);
            if (!success)
                return (false, "Failed to add pattern to favorites.");

            return (true, "Pattern added to favorites.");
        }

        public async Task<(bool Success, string Message)> RemoveFavoriteAsync(int userID, int patternID)
        {
            if (!await _favoriteRepo.IsFavoriteAsync(userID, patternID))
                return (false, "Pattern is not in your favorites.");

            var success = await _favoriteRepo.RemoveAsync(userID, patternID);
            if (!success)
                return (false, "Failed to remove pattern from favorites.");

            return (true, "Pattern removed from favorites.");
        }

        public async Task<bool> IsFavoriteAsync(int userID, int patternID)
        {
            return await _favoriteRepo.IsFavoriteAsync(userID, patternID);
        }
    }
}

using static CrochetHub.DTOs.Favorite.FavouritePatternDto;

namespace CrochetHub.Services.Interfaces
{
    public interface IFavoriteService
    {
        Task<List<FavoritePatternDto>> GetMyFavoritesAsync(int userID);
        Task<(bool Success, string Message)> AddFavoriteAsync(int userID, int patternID);
        Task<(bool Success, string Message)> RemoveFavoriteAsync(int userID, int patternID);
        Task<bool> IsFavoriteAsync(int userID, int patternID);
    }
}

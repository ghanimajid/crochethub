using CrochetHub.Models;

namespace CrochetHub.Repositories.Interfaces
{
    public interface IFavoriteRepository
    {
        Task<List<UserFavoritePattern>> GetByUserIDAsync(int userID);
        Task<bool> IsFavoriteAsync(int userID, int patternID);
        Task<bool> AddAsync(int userID, int patternID);
        Task<bool> RemoveAsync(int userID, int patternID);
    }
}

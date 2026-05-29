using CrochetHub.Data;
using CrochetHub.Models;
using CrochetHub.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CrochetHub.Repositories
{
    public class FavoriteRepository : IFavoriteRepository
    {
        private readonly AppDbContext _context;

        public FavoriteRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserFavoritePattern>> GetByUserIDAsync(int userID)
        {
            return await _context.UserFavoritePatterns
                .Include(uf => uf.Pattern)
                    .ThenInclude(p => p!.Difficulty)
                .Include(uf => uf.Pattern)
                    .ThenInclude(p => p!.Creator)
                        .ThenInclude(u => u!.Person)
                .Include(uf => uf.Pattern)
                    .ThenInclude(p => p!.Reviews)
                .Where(uf => uf.UserID == userID)
                .OrderByDescending(uf => uf.SavedAt)
                .ToListAsync();
        }

        public async Task<bool> IsFavoriteAsync(int userID, int patternID)
        {
            return await _context.UserFavoritePatterns
                .AnyAsync(uf => uf.UserID == userID && uf.PatternID == patternID);
        }

        public async Task<bool> AddAsync(int userID, int patternID)
        {
            var alreadyFavorited = await IsFavoriteAsync(userID, patternID);
            if (alreadyFavorited) return false;

            _context.UserFavoritePatterns.Add(new UserFavoritePattern
            {
                UserID = userID,
                PatternID = patternID,
                SavedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveAsync(int userID, int patternID)
        {
            var favorite = await _context.UserFavoritePatterns
                .FirstOrDefaultAsync(uf => uf.UserID == userID && uf.PatternID == patternID);

            if (favorite == null) return false;

            _context.UserFavoritePatterns.Remove(favorite);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

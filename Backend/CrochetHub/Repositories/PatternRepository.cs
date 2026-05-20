using CrochetHub.Data;
using CrochetHub.Models;
using CrochetHub.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CrochetHub.Repositories
{
    public class PatternRepository : IPatternRepository
    {
        private readonly AppDbContext _context;

        public PatternRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<Pattern>> GetAllAsync(string? difficulty, string? tag, string? search)
        {
            var query = _context.Patterns
                .Include(p => p.Difficulty)
                .Include(p => p.Course)
                .Include(p => p.Creator)
                    .ThenInclude(u => u!.Person)
                .Include(p => p.Materials)
                .Include(p => p.PatternTags)
                    .ThenInclude(pt => pt.Tag)
                .Include(p => p.Reviews)
                .AsQueryable();

            if (!string.IsNullOrEmpty(difficulty))
                query = query.Where(p => p.Difficulty != null && p.Difficulty.Value == difficulty);

            if (!string.IsNullOrEmpty(tag))
                query = query.Where(p => p.PatternTags.Any(pt => pt.Tag != null && pt.Tag.Name == tag));

            if (!string.IsNullOrEmpty(search))
                query = query.Where(p => p.Title.Contains(search) ||
                    (p.Description != null && p.Description.Contains(search)));

            return await query.ToListAsync();
        }

        public async Task<Pattern?> GetByIDAsync(int patternID)
        {
            return await _context.Patterns
                .Include(p => p.Difficulty)
                .Include(p => p.Course)
                .Include(p => p.Creator)
                    .ThenInclude(u => u!.Person)
                .Include(p => p.Materials)
                .Include(p => p.PatternTags)
                    .ThenInclude(pt => pt.Tag)
                .Include(p => p.Reviews)
                    .ThenInclude(r => r.User)
                        .ThenInclude(u => u!.Person)
                .FirstOrDefaultAsync(p => p.PatternID == patternID);
        }

        public async Task<Pattern> CreateAsync(Pattern pattern, List<int>? tagIDs, List<PatternMaterial>? materials)
        {
            _context.Patterns.Add(pattern);
            await _context.SaveChangesAsync();

            // Add tags 
            if (tagIDs != null)
            {
                foreach (var tagID in tagIDs.Distinct())
                {
                    _context.PatternTags.Add(new PatternTag
                    {
                        PatternID = pattern.PatternID,
                        TagID = tagID
                    });
                }
            }

            // Add materials
            if (materials != null)
            {
                foreach (var material in materials)
                {
                    material.PatternID = pattern.PatternID;
                    _context.PatternMaterials.Add(material);
                }
            }

            await _context.SaveChangesAsync();
            return pattern;
        }

        public async Task<Pattern?> UpdateAsync(int patternID, List<int>? tagIDs,
            List<PatternMaterial>? materials, Action<Pattern> updateAction)
        {
            var pattern = await _context.Patterns
                .Include(p => p.PatternTags)
                .Include(p => p.Materials)
                .FirstOrDefaultAsync(p => p.PatternID == patternID);

            if (pattern == null) return null;

            updateAction(pattern);

            if (tagIDs != null)
            {
                _context.PatternTags.RemoveRange(pattern.PatternTags);
                foreach (var tagID in tagIDs.Distinct())
                {
                    _context.PatternTags.Add(new PatternTag
                    {
                        PatternID = pattern.PatternID,
                        TagID = tagID
                    });
                }
            }

            if (materials != null)
            {
                _context.PatternMaterials.RemoveRange(pattern.Materials);
                foreach (var material in materials)
                {
                    material.PatternID = pattern.PatternID;
                    _context.PatternMaterials.Add(material);
                }
            }

            await _context.SaveChangesAsync();
            return pattern;
        }

        public async Task<bool> DeleteAsync(int patternID)
        {
            var pattern = await _context.Patterns.FindAsync(patternID);
            if (pattern == null) return false;

            _context.Patterns.Remove(pattern);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int patternID) =>
            await _context.Patterns.AnyAsync(p => p.PatternID == patternID);

        public async Task<PatternReview?> GetReviewAsync(int userID, int patternID) =>
            await _context.PatternReviews
                .FirstOrDefaultAsync(r => r.UserID == userID && r.PatternID == patternID);

        public async Task<PatternReview> CreateReviewAsync(PatternReview review)
        {
            _context.PatternReviews.Add(review);
            await _context.SaveChangesAsync();
            return review;
        }

        public async Task<bool> DeleteReviewAsync(int reviewID)
        {
            var review = await _context.PatternReviews.FindAsync(reviewID);
            if (review == null) return false;

            _context.PatternReviews.Remove(review);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<PatternReview>> GetReviewsByPatternAsync(int patternID) =>
            await _context.PatternReviews
                .Include(r => r.User)
                    .ThenInclude(u => u!.Person)
                .Where(r => r.PatternID == patternID)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

    }
}

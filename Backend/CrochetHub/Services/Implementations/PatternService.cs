using CrochetHub.Data;
using CrochetHub.DTOs.Pattern;
using CrochetHub.Models;
using CrochetHub.Repositories.Interfaces;
using CrochetHub.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CrochetHub.Services.Implementations
{
    public class PatternService : IPatternService
    {
        private readonly IPatternRepository _patternRepo;
        private readonly AppDbContext _context;
        private readonly IAuditService _auditService;

        public PatternService(IPatternRepository patternRepo, AppDbContext context, IAuditService auditService)
        {
            _patternRepo = patternRepo;
            _context = context;
            _auditService = auditService;
        }

        public async Task<List<PatternDto>> GetAllAsync(string? difficulty, string? tag, string? search)
        {
            var patterns = await _patternRepo.GetAllAsync(difficulty, tag, search);
            return patterns.Select(MapToDto).ToList();
        }

        public async Task<PatternDto?> GetByIDAsync(int patternID)
        {
            var pattern = await _patternRepo.GetByIDAsync(patternID);
            return pattern == null ? null : MapToDto(pattern);
        }

        public async Task<(PatternDto? Pattern, string? Error)> CreateAsync(int userID, CreatePatternDto dto)
        {
            if (dto.DifficultyID.HasValue)
            {
                var difficulty = await _context.Lookups.FindAsync(dto.DifficultyID.Value);
                if (difficulty == null || difficulty.Category != "DIFFICULTY")
                    return (null, "Invalid difficulty ID.");
            }

            if (dto.CourseID.HasValue)
            {
                var course = await _context.Courses.FindAsync(dto.CourseID.Value);
                if (course == null)
                    return (null, "Course not found.");
            }

            if (dto.TagIDs.Any())
            {
                var distinctTagIDs = dto.TagIDs.Distinct().ToList();
                var tagCount = await _context.Tags
                    .Where(t => distinctTagIDs.Contains(t.TagID))
                    .CountAsync();
                if (tagCount != distinctTagIDs.Count)
                    return (null, "One or more tag IDs are invalid.");
            }

            if (dto.Materials.Any())
            {
                if (dto.Materials.Any(m => string.IsNullOrWhiteSpace(m.MaterialName)))
                    return (null, "All materials must have a name.");

                var materialNames = dto.Materials.Select(m => m.MaterialName.ToLower().Trim()).ToList();
                if (materialNames.Count != materialNames.Distinct().Count())
                    return (null, "Duplicate material names are not allowed.");
            }

            var pattern = new Pattern
            {
                Title = dto.Title.Trim(),
                Description = dto.Description.Trim(),
                ThumbnailURL = dto.ThumbnailURL?.Trim(),
                DifficultyID = dto.DifficultyID,
                CourseID = dto.CourseID,
                CreatedBy = userID,
                CreatedAt = DateTime.UtcNow
            };

            var materials = dto.Materials.Select(m => new PatternMaterial
            {
                MaterialName = m.MaterialName.Trim(),
                Quantity = m.Quantity?.Trim()
            }).ToList();

            var created = await _patternRepo.CreateAsync(pattern, dto.TagIDs, materials);

            await _auditService.LogAsync(
                userID, "INSERT", "Pattern", created.PatternID,
                null, $"Pattern '{created.Title}' created");

            return (await GetByIDAsync(created.PatternID), null);
        }

        public async Task<(PatternDto? Pattern, string? Error)> UpdateAsync(int patternID, int userID, string role, UpdatePatternDto dto)
        {
            var pattern = await _patternRepo.GetByIDAsync(patternID);
            if (pattern == null)
                return (null, "Pattern not found.");

            if (role != "Admin" && pattern.CreatedBy != userID)
                return (null, "You are not authorized to update this pattern.");

            if (dto.Title == null && dto.Description == null && dto.ThumbnailURL == null && dto.DifficultyID == null
                && dto.CourseID == null && dto.TagIDs == null && dto.Materials == null)
                return (null, "No fields provided to update.");

            if (dto.Title != null && dto.Title.Trim().Length == 0)
                return (null, "Title cannot be empty.");

            if (dto.Description != null && dto.Description.Trim().Length == 0)
                return (null, "Description cannot be empty.");

            if (dto.DifficultyID.HasValue)
            {
                var difficulty = await _context.Lookups.FindAsync(dto.DifficultyID.Value);
                if (difficulty == null || difficulty.Category != "DIFFICULTY")
                    return (null, "Invalid difficulty ID.");
            }

            if (dto.CourseID.HasValue)
            {
                var course = await _context.Courses.FindAsync(dto.CourseID.Value);
                if (course == null)
                    return (null, "Course not found.");
            }

            if (dto.TagIDs != null && dto.TagIDs.Any())
            {
                var distinctTagIDs = dto.TagIDs.Distinct().ToList();
                var tagCount = await _context.Tags
                    .Where(t => distinctTagIDs.Contains(t.TagID))
                    .CountAsync();
                if (tagCount != distinctTagIDs.Count)
                    return (null, "One or more tag IDs are invalid.");
            }

            if (dto.Materials != null && dto.Materials.Any())
            {
                if (dto.Materials.Any(m => string.IsNullOrWhiteSpace(m.MaterialName)))
                    return (null, "All materials must have a name.");

                var materialNames = dto.Materials.Select(m => m.MaterialName.ToLower().Trim()).ToList();
                if (materialNames.Count != materialNames.Distinct().Count())
                    return (null, "Duplicate material names are not allowed.");
            }

            var oldTitle = pattern.Title;
            var materials = dto.Materials?.Select(m => new PatternMaterial
            {
                MaterialName = m.MaterialName.Trim(),
                Quantity = m.Quantity?.Trim()
            }).ToList();

            var updated = await _patternRepo.UpdateAsync(patternID, dto.TagIDs, materials, p =>
            {
                if (dto.Title != null) p.Title = dto.Title.Trim();
                if (dto.Description != null) p.Description = dto.Description.Trim();
                if (dto.ThumbnailURL != null) p.ThumbnailURL = dto.ThumbnailURL.Trim();
                if (dto.DifficultyID != null) p.DifficultyID = dto.DifficultyID;
                if (dto.CourseID != null) p.CourseID = dto.CourseID;
            });

            if (updated == null)
                return (null, "Failed to update pattern.");

            await _auditService.LogAsync(
                userID, "UPDATE", "Pattern", patternID,
                $"Title: {oldTitle}",
                $"Title: {updated.Title}");

            return (await GetByIDAsync(patternID), null);
        }

        public async Task<(bool Success, string Message)> DeleteAsync(int patternID, int userID, string role)
        {
            var pattern = await _patternRepo.GetByIDAsync(patternID);
            if (pattern == null)
                return (false, "Pattern not found.");

            if (role != "Admin" && pattern.CreatedBy != userID)
                return (false, "You are not authorized to delete this pattern.");

            if (pattern.Reviews.Any())
                return (false, $"Cannot delete pattern '{pattern.Title}' because it has {pattern.Reviews.Count} review(s).");

            var title = pattern.Title;

            await _auditService.LogAsync(
                userID, "DELETE", "Pattern", patternID,
                $"Pattern '{title}' deleted", null);

            var deleted = await _patternRepo.DeleteAsync(patternID);
            if (!deleted)
                return (false, "Failed to delete pattern.");

            return (true, $"Pattern '{title}' deleted successfully.");
        }

        public async Task<(PatternReviewDto? Review, string? Error)> AddReviewAsync(int patternID, int userID, CreatePatternReviewDto dto)
        {
            if (!await _patternRepo.ExistsAsync(patternID))
                return (null, "Pattern not found.");

            var pattern = await _patternRepo.GetByIDAsync(patternID);
            if (pattern!.CreatedBy == userID)
                return (null, "You cannot review your own pattern.");

            var existing = await _patternRepo.GetReviewAsync(userID, patternID);
            if (existing != null)
                return (null, "You have already reviewed this pattern.");

            var review = new PatternReview
            {
                UserID = userID,
                PatternID = patternID,
                Rating = dto.Rating,
                Comment = dto.Comment?.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            var created = await _patternRepo.CreateReviewAsync(review);

            await _auditService.LogAsync(
                userID, "INSERT", "PatternReview", created.ReviewID,
                null, $"Review added for Pattern {patternID} with Rating {dto.Rating}");

            var user = await _context.Users
                .Include(u => u.Person)
                .FirstOrDefaultAsync(u => u.UserID == userID);

            return (new PatternReviewDto
            {
                ReviewID = created.ReviewID,
                UserID = created.UserID,
                ReviewerName = user?.Person != null
                    ? $"{user.Person.FirstName} {user.Person.LastName}"
                    : "Unknown",
                Rating = created.Rating,
                Comment = created.Comment,
                CreatedAt = created.CreatedAt
            }, null);
        }

        public async Task<(bool Success, string Message)> DeleteReviewAsync(int reviewID, int userID, string role)
        {
            var review = await _context.PatternReviews.FindAsync(reviewID);
            if (review == null)
                return (false, "Review not found.");

            if (role != "Admin" && review.UserID != userID)
                return (false, "You are not authorized to delete this review.");

            await _auditService.LogAsync(
                userID, "DELETE", "PatternReview", reviewID,
                $"Review deleted for Pattern {review.PatternID}", null);

            var deleted = await _patternRepo.DeleteReviewAsync(reviewID);
            if (!deleted)
                return (false, "Failed to delete review.");

            return (true, "Review deleted successfully.");
        }

        public async Task<List<PatternReviewDto>> GetReviewsAsync(int patternID)
        {
            var reviews = await _patternRepo.GetReviewsByPatternAsync(patternID);
            return reviews.Select(r => new PatternReviewDto
            {
                ReviewID = r.ReviewID,
                UserID = r.UserID,
                ReviewerName = r.User?.Person != null
                    ? $"{r.User.Person.FirstName} {r.User.Person.LastName}"
                    : "Unknown",
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            }).ToList();
        }

        private PatternDto MapToDto(Pattern p) => new PatternDto
        {
            PatternID = p.PatternID,
            Title = p.Title,
            Description = p.Description,
            Difficulty = p.Difficulty?.Value,
            ThumbnailURL = p.ThumbnailURL,
            CourseID = p.CourseID,
            CourseTitle = p.Course?.Title,
            CreatedBy = p.CreatedBy,
            CreatorName = p.Creator?.Person != null
                ? $"{p.Creator.Person.FirstName} {p.Creator.Person.LastName}"
                : "Unknown",
            CreatedAt = p.CreatedAt,
            Tags = p.PatternTags
                .Where(pt => pt.Tag != null)
                .Select(pt => pt.Tag!.Name)
                .ToList(),
            Materials = p.Materials.Select(m => new PatternMaterialDto
            {
                MaterialID = m.MaterialID,
                MaterialName = m.MaterialName,
                Quantity = m.Quantity
            }).ToList(),
            AverageRating = p.Reviews.Any()
                ? Math.Round(p.Reviews.Average(r => r.Rating), 2)
                : 0,
            TotalReviews = p.Reviews.Count
        };
    }
}

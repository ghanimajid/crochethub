using CrochetHub.Data;
using CrochetHub.Models;
using CrochetHub.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CrochetHub.Repositories
{
    public class CourseReviewRepository : ICourseReviewRepository
    {
        private readonly AppDbContext _context;

        public CourseReviewRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<CourseReview>> GetByCourseIDAsync(int courseID)
        {
            return await _context.CourseReviews
                .Include(r => r.Student)
                    .ThenInclude(s => s!.User)
                        .ThenInclude(u => u!.Person)
                .Where(r => r.CourseID == courseID)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<CourseReview?> GetByIDAsync(int reviewID)
        {
            return await _context.CourseReviews
                .Include(r => r.Student)
                    .ThenInclude(s => s!.User)
                        .ThenInclude(u => u!.Person)
                .Include(r => r.Course)
                .FirstOrDefaultAsync(r => r.ReviewID == reviewID);
        }

        public async Task<CourseReview?> GetByStudentAndCourseAsync(int studentID, int courseID)
        {
            return await _context.CourseReviews
                .FirstOrDefaultAsync(r => r.StudentID == studentID && r.CourseID == courseID);
        }

        public async Task<CourseReview> CreateAsync(CourseReview review)
        {
            _context.CourseReviews.Add(review);
            await _context.SaveChangesAsync();
            return review;
        }

        public async Task<bool> DeleteAsync(int reviewID)
        {
            var review = await _context.CourseReviews.FindAsync(reviewID);
            if (review == null) return false;

            _context.CourseReviews.Remove(review);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int reviewID) =>
            await _context.CourseReviews.AnyAsync(r => r.ReviewID == reviewID);
    }
}

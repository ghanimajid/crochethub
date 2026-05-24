using CrochetHub.Data;
using CrochetHub.DTOs.CourseReview;
using CrochetHub.Models;
using CrochetHub.Repositories.Interfaces;
using CrochetHub.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CrochetHub.Services.Implementations
{
    public class CourseReviewService : ICourseReviewService
    {
        private readonly ICourseReviewRepository _reviewRepo;
        private readonly AppDbContext _context;
        private readonly IAuditService _auditService;

        public CourseReviewService(
            ICourseReviewRepository reviewRepo,
            AppDbContext context,
            IAuditService auditService)
        {
            _reviewRepo = reviewRepo;
            _context = context;
            _auditService = auditService;
        }

        public async Task<List<CourseReviewDto>> GetByCourseIDAsync(int courseID)
        {
            var courseExists = await _context.Courses.AnyAsync(c => c.CourseID == courseID);
            if (!courseExists) return new List<CourseReviewDto>();

            var reviews = await _reviewRepo.GetByCourseIDAsync(courseID);
            return reviews.Select(MapToDto).ToList();
        }

        public async Task<(CourseReviewDto? Review, string? Error)> CreateAsync(
            int courseID, int studentID, CreateCourseReviewDto dto)
        {
            var course = await _context.Courses.FindAsync(courseID);
            if (course == null)
                return (null, "Course not found.");

            var student = await _context.Students.FindAsync(studentID);
            if (student == null)
                return (null, "Student account not found.");

            var isEnrolled = await _context.CourseEnrollments
                .AnyAsync(ce => ce.StudentID == studentID && ce.CourseID == courseID);
            if (!isEnrolled)
                return (null, "You must be enrolled in this course to leave a review.");

            if (course.InstructorID == studentID)
                return (null, "You cannot review your own course.");

            var existing = await _reviewRepo.GetByStudentAndCourseAsync(studentID, courseID);
            if (existing != null)
                return (null, "You have already reviewed this course.");

            if (dto.Comment != null && dto.Comment.Trim().Length == 0)
                return (null, "Comment cannot be empty. Either provide a comment or leave it blank.");

            var review = new CourseReview
            {
                StudentID = studentID,
                CourseID = courseID,
                Rating = dto.Rating,
                Comment = dto.Comment?.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            var created = await _reviewRepo.CreateAsync(review);

            await _auditService.LogAsync(
                studentID, "INSERT", "CourseReview", created.ReviewID,
                null, $"Review added for Course {courseID} with Rating {dto.Rating}");

            var full = await _reviewRepo.GetByIDAsync(created.ReviewID);
            return (MapToDto(full!), null);
        }

        public async Task<(bool Success, string Message)> DeleteAsync(
            int reviewID, int userID, string role)
        {
            var review = await _reviewRepo.GetByIDAsync(reviewID);
            if (review == null)
                return (false, "Review not found.");

            if (role != "Admin" && review.StudentID != userID)
                return (false, "You are not authorized to delete this review.");

            await _auditService.LogAsync(
                userID, "DELETE", "CourseReview", reviewID,
                $"Review for Course {review.CourseID} with Rating {review.Rating} deleted",
                null);

            var deleted = await _reviewRepo.DeleteAsync(reviewID);
            if (!deleted)
                return (false, "Failed to delete review.");

            return (true, "Review deleted successfully.");
        }

        private CourseReviewDto MapToDto(CourseReview r) => new CourseReviewDto
        {
            ReviewID = r.ReviewID,
            StudentID = r.StudentID,
            ReviewerName = r.Student?.User?.Person != null
                ? $"{r.Student.User.Person.FirstName} {r.Student.User.Person.LastName}"
                : "Unknown",
            CourseID = r.CourseID,
            Rating = r.Rating,
            Comment = r.Comment,
            CreatedAt = r.CreatedAt
        };
    }
}

using CrochetHub.DTOs.CourseReview;

namespace CrochetHub.Services.Interfaces
{
    public interface ICourseReviewService
    {
        Task<List<CourseReviewDto>> GetByCourseIDAsync(int courseID);
        Task<(CourseReviewDto? Review, string? Error)> CreateAsync(int courseID, int studentID, CreateCourseReviewDto dto);
        Task<(bool Success, string Message)> DeleteAsync(int reviewID, int userID, string role);
    }
}

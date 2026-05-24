using CrochetHub.Models;

namespace CrochetHub.Repositories.Interfaces
{
    public interface ICourseReviewRepository
    {
        Task<List<CourseReview>> GetByCourseIDAsync(int courseID);
        Task<CourseReview?> GetByIDAsync(int reviewID);
        Task<CourseReview?> GetByStudentAndCourseAsync(int studentID, int courseID);
        Task<CourseReview> CreateAsync(CourseReview review);
        Task<bool> DeleteAsync(int reviewID);
        Task<bool> ExistsAsync(int reviewID);
    }
}

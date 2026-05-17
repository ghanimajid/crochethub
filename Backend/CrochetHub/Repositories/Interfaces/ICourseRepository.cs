using CrochetHub.Models;

namespace CrochetHub.Repositories.Interfaces
{
    public interface ICourseRepository
    {
        Task<List<Course>> GetAllAsync(string? difficulty, string? tag, string? search);
        Task<Course?> GetByIDAsync(int courseID);
        Task<Course> CreateAsync(Course course, List<int>? tagIDs, List<int>? prerequisiteIDs);
        Task<Course?> UpdateAsync(int courseID, List<int>? tagIDs, List<int>? prerequisiteIDs, Action<Course> updateAction);
        Task<bool> DeleteAsync(int courseID);
        Task<bool> EnrollStudentAsync(int studentID, int courseID);
        Task<bool> IsEnrolledAsync(int studentID, int courseID);
        Task<bool> ExistsAsync(int courseID);
    }
}

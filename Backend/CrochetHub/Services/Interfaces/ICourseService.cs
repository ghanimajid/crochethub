using CrochetHub.DTOs.Course;
using CrochetHub.Models.Views;

namespace CrochetHub.Services.Interfaces
{
    public interface ICourseService
    {
        Task<List<CourseDto>> GetAllCoursesAsync(string? difficulty, string? tag, string? search);
        Task<CourseDto?> GetCourseByIDAsync(int courseID);
        Task<CourseDto?> CreateCourseAsync(int instructorID, CreateCourseDto dto);
        Task<CourseDto?> UpdateCourseAsync(int courseID, int userID, string role, UpdateCourseDto dto);
        Task<(bool Success, string Message)> DeleteCourseAsync(int courseID, int userID, string role);
        Task<(bool Success, string Message)> EnrollStudentAsync(int studentID, int courseID);
        Task<StudentProgressView?> GetStudentProgressAsync(int studentID, int courseID);
    }
}

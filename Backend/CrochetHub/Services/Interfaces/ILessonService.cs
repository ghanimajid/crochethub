using CrochetHub.DTOs.Lesson;

namespace CrochetHub.Services.Interfaces
{
    public interface ILessonService
    {
        Task<List<LessonDto>> GetByCourseIDAsync(int courseID, int? studentID);
        Task<LessonDto?> GetByIDAsync(int lessonID, int? studentID);
        Task<(LessonDto? Lesson, string? Error)> CreateAsync(int instructorID, CreateLessonDto dto);
        Task<(LessonDto? Lesson, string? Error)> UpdateAsync(int lessonID, int instructorID, string role, UpdateLessonDto dto);
        Task<(bool Success, string Message)> DeleteAsync(int lessonID, int userID, string role);
        Task<(bool Success, string Message)> MarkCompleteAsync(int lessonID, int studentID, int timeSpent);
    }
}

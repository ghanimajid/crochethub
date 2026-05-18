using CrochetHub.Models;

namespace CrochetHub.Repositories.Interfaces
{
    public interface ILessonRepository
    {
        Task<List<Lesson>> GetByCourseIDAsync(int courseID);
        Task<Lesson?> GetByIDAsync(int lessonID);
        Task<Lesson> CreateAsync(Lesson lesson);
        Task<Lesson?> UpdateAsync(int lessonID, Action<Lesson> updateAction);
        Task<bool> DeleteAsync(int lessonID);
        Task<bool> ExistsAsync(int lessonID);
        Task<bool> SequenceOrderExistsAsync(int courseID, int sequenceOrder, int? excludeLessonID = null);
        Task<StudentProgress?> GetProgressAsync(int studentID, int lessonID);
        Task UpsertProgressAsync(int studentID, int lessonID, bool completed, int timeSpent);
    }
}

using CrochetHub.Data;
using CrochetHub.Models;
using CrochetHub.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CrochetHub.Repositories
{
    public class LessonRepository : ILessonRepository
    {
        private readonly AppDbContext _context;
        public LessonRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Lesson>> GetByCourseIDAsync(int courseID)
        {
            return await _context.Lessons
                .Where(l => l.CourseID == courseID)
                .OrderBy(l => l.SequenceOrder)
                .ToListAsync();
        }

        public async Task<Lesson?> GetByIDAsync(int lessonID)
        {
            return await _context.Lessons
                .Include(l => l.Course)
                .FirstOrDefaultAsync(l => l.LessonID == lessonID);
        }

        public async Task<Lesson> CreateAsync(Lesson lesson)
        {
            _context.Lessons.Add(lesson);
            await _context.SaveChangesAsync();
            return lesson;
        }

        public async Task<Lesson?> UpdateAsync(int lessonID, Action<Lesson> updateAction)
        {
            var lesson = await _context.Lessons.FindAsync(lessonID);
            if (lesson == null) return null;

            updateAction(lesson);
            await _context.SaveChangesAsync();
            return lesson;
        }

        public async Task<bool> DeleteAsync(int lessonID)
        {
            var lesson = await _context.Lessons.FindAsync(lessonID);
            if (lesson == null) return false;

            _context.Lessons.Remove(lesson);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int lessonID) =>
            await _context.Lessons.AnyAsync(l => l.LessonID == lessonID);

        // Check if sequence order already taken in course (optionally excluding a lesson for updates)
        public async Task<bool> SequenceOrderExistsAsync(int courseID, int sequenceOrder, int? excludeLessonID = null)
        {
            return await _context.Lessons.AnyAsync(l =>
                l.CourseID == courseID &&
                l.SequenceOrder == sequenceOrder &&
                (excludeLessonID == null || l.LessonID != excludeLessonID));
        }

        public async Task<StudentProgress?> GetProgressAsync(int studentID, int lessonID)
        {
            return await _context.StudentProgresses
                .FirstOrDefaultAsync(sp => sp.StudentID == studentID && sp.LessonID == lessonID);
        }

        public async Task UpsertProgressAsync(int studentID, int lessonID, bool completed, int timeSpent)
        {
            var progress = await _context.StudentProgresses
                .FirstOrDefaultAsync(sp => sp.StudentID == studentID && sp.LessonID == lessonID);

            if (progress == null)
            {
                _context.StudentProgresses.Add(new StudentProgress
                {
                    StudentID = studentID,
                    LessonID = lessonID,
                    Completed = completed,
                    TimeSpent = timeSpent,
                    StartedAt = DateTime.UtcNow,
                    CompletedAt = completed ? DateTime.UtcNow : null
                });
            }
            else
            {
                // Only allow marking complete, not incomplete
                if (completed && !progress.Completed)
                {
                    progress.Completed = true;
                    progress.CompletedAt = DateTime.UtcNow;
                }
                // updating time spent (accumulate)
                progress.TimeSpent += timeSpent;
            }

            await _context.SaveChangesAsync();
        }
    }
}

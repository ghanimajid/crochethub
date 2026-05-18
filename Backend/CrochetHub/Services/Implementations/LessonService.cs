using CrochetHub.Data;
using CrochetHub.DTOs.Lesson;
using CrochetHub.Repositories.Interfaces;
using CrochetHub.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CrochetHub.Services.Implementations
{
    public class LessonService : ILessonService
    {
        private readonly ILessonRepository _lessonRepo;
        private readonly AppDbContext _context;
        private readonly IAuditService _auditService;

        public LessonService(ILessonRepository lessonRepo, AppDbContext context, IAuditService auditService)
        {
            _lessonRepo = lessonRepo;
            _context = context;
            _auditService = auditService;
        }

        public async Task<List<LessonDto>> GetByCourseIDAsync(int courseID, int? studentID)
        {
            var lessons = await _lessonRepo.GetByCourseIDAsync(courseID);

            return lessons.Select(l => MapToDto(l, studentID)).ToList();
        }

        public async Task<LessonDto?> GetByIDAsync(int lessonID, int? studentID)
        {
            var lesson = await _lessonRepo.GetByIDAsync(lessonID);
            if (lesson == null) return null;

            return MapToDto(lesson, studentID);
        }

        public async Task<(LessonDto? Lesson, string? Error)> CreateAsync(int instructorID, CreateLessonDto dto)
        {
            // Validate course exists and belongs to instructor
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.CourseID == dto.CourseID);
            if (course == null)
                return (null, "Course not found.");

            if (course.InstructorID != instructorID)
                return (null, "You are not the instructor of this course.");

            // Validate at least VideoURL or Content is provided
            if (string.IsNullOrWhiteSpace(dto.VideoURL) && string.IsNullOrWhiteSpace(dto.Content))
                return (null, "A lesson must have either a video URL or content.");

            // Validate sequence order not already taken
            if (await _lessonRepo.SequenceOrderExistsAsync(dto.CourseID, dto.SequenceOrder))
                return (null, $"Sequence order {dto.SequenceOrder} is already taken in this course.");

            var lesson = new Models.Lesson
            {
                CourseID = dto.CourseID,
                Title = dto.Title.Trim(),
                VideoURL = dto.VideoURL?.Trim(),
                Content = dto.Content?.Trim(),
                SequenceOrder = dto.SequenceOrder
            };

            var created = await _lessonRepo.CreateAsync(lesson);

            await _auditService.LogAsync(
                instructorID, "INSERT", "Lesson", created.LessonID,
                null, $"Lesson '{created.Title}' created in Course {dto.CourseID}");

            return (MapToDto(created, null), null);
        }
        public async Task<(LessonDto? Lesson, string? Error)> UpdateAsync(int lessonID, int userID, string role, UpdateLessonDto dto)
        {
            var lesson = await _lessonRepo.GetByIDAsync(lessonID);
            if (lesson == null)
                return (null, "Lesson not found.");

            // Only the course instructor or admin can update
            if (role != "Admin")
            {
                var course = await _context.Courses.FindAsync(lesson.CourseID);
                if (course == null || course.InstructorID != userID)
                    return (null, "You are not authorized to update this lesson.");
            }

            // Validate no fields are empty strings after trim
            if (dto.Title != null && dto.Title.Trim().Length == 0)
                return (null, "Title cannot be empty.");

            if (dto.VideoURL != null && dto.VideoURL.Trim().Length == 0)
                dto.VideoURL = null;

            if (dto.Content != null && dto.Content.Trim().Length == 0)
                dto.Content = null;

            // Validate at least one field is being updated
            if (dto.Title == null && dto.VideoURL == null && dto.Content == null && dto.SequenceOrder == null)
                return (null, "No fields provided to update.");

            // Validate sequence order not taken by another lesson
            if (dto.SequenceOrder.HasValue)
            {
                if (await _lessonRepo.SequenceOrderExistsAsync(lesson.CourseID, dto.SequenceOrder.Value, lessonID))
                    return (null, $"Sequence order {dto.SequenceOrder.Value} is already taken in this course.");
            }

            var oldTitle = lesson.Title;
            var updated = await _lessonRepo.UpdateAsync(lessonID, l =>
            {
                if (dto.Title != null) l.Title = dto.Title.Trim();
                if (dto.VideoURL != null) l.VideoURL = dto.VideoURL.Trim();
                if (dto.Content != null) l.Content = dto.Content.Trim();
                if (dto.SequenceOrder.HasValue) l.SequenceOrder = dto.SequenceOrder.Value;
            });

            if (updated == null)
                return (null, "Failed to update lesson.");

            await _auditService.LogAsync(
                userID, "UPDATE", "Lesson", lessonID,
                $"Title: {oldTitle}",
                $"Title: {updated.Title}");

            return (MapToDto(updated, null), null);
        }
        public async Task<(bool Success, string Message)> DeleteAsync(int lessonID, int userID, string role)
        {
            var lesson = await _lessonRepo.GetByIDAsync(lessonID);
            if (lesson == null)
                return (false, "Lesson not found.");

            // Only course instructor or admin can delete
            if (role != "Admin")
            {
                var course = await _context.Courses.FindAsync(lesson.CourseID);
                if (course == null || course.InstructorID != userID)
                    return (false, "You are not authorized to delete this lesson.");
            }

            // Block deletion if any student has started this lesson
            var hasProgress = await _context.StudentProgresses
                .AnyAsync(sp => sp.LessonID == lessonID);
            if (hasProgress)
                return (false, "Cannot delete a lesson that students have already started. Consider updating it instead.");

            var title = lesson.Title;
            var courseID = lesson.CourseID;

            await _auditService.LogAsync(
                userID, "DELETE", "Lesson", lessonID,
                $"Lesson '{title}' deleted from Course {courseID}",
                null);

            var deleted = await _lessonRepo.DeleteAsync(lessonID);
            if (!deleted)
                return (false, "Failed to delete lesson.");

            return (true, $"Lesson '{title}' deleted successfully.");
        }
        public async Task<(bool Success, string Message)> MarkCompleteAsync(int lessonID, int studentID, int timeSpent)
        {
            // Validate lesson exists
            var lesson = await _lessonRepo.GetByIDAsync(lessonID);
            if (lesson == null)
                return (false, "Lesson not found.");

            // Validate student is enrolled in the course
            var isEnrolled = await _context.CourseEnrollments
                .AnyAsync(ce => ce.StudentID == studentID && ce.CourseID == lesson.CourseID);
            if (!isEnrolled)
                return (false, "You are not enrolled in the course this lesson belongs to.");

            // Validate student exists
            var student = await _context.Students.FindAsync(studentID);
            if (student == null)
                return (false, "Student not found.");

            // Check if already completed
            var existing = await _lessonRepo.GetProgressAsync(studentID, lessonID);
            if (existing != null && existing.Completed)
                return (false, "You have already completed this lesson.");

            await _lessonRepo.UpsertProgressAsync(studentID, lessonID, true, timeSpent);

            return (true, "Lesson marked as complete.");
        }

        private LessonDto MapToDto(Models.Lesson lesson, int? studentID)
        {
            var dto = new LessonDto
            {
                LessonID = lesson.LessonID,
                CourseID = lesson.CourseID,
                Title = lesson.Title,
                VideoURL = lesson.VideoURL,
                Content = lesson.Content,
                SequenceOrder = lesson.SequenceOrder,
                IsCompleted = false,
                TimeSpent = 0
            };

            if (studentID.HasValue)
            {
                var progress = lesson.StudentProgresses?
                    .FirstOrDefault(sp => sp.StudentID == studentID.Value);
                if (progress != null)
                {
                    dto.IsCompleted = progress.Completed;
                    dto.TimeSpent = progress.TimeSpent;
                }
            }

            return dto;
        }
    }
}

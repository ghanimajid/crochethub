using AutoMapper;
using CrochetHub.Data;
using CrochetHub.DTOs.Course;
using CrochetHub.Models;
using CrochetHub.Models.Views;
using CrochetHub.Repositories.Interfaces;
using CrochetHub.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CrochetHub.Services.Implementations
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepository _courseRepo;
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuditService _auditService;

        public CourseService(ICourseRepository courseRepo, AppDbContext context, IMapper mapper, IAuditService auditService)
        {
            _courseRepo = courseRepo;
            _context = context;
            _mapper = mapper;
            _auditService = auditService;
        }
        public async Task<List<CourseDto>> GetAllCoursesAsync(string? difficulty, string? tag, string? search)
        {
            var courses = await _courseRepo.GetAllAsync(difficulty, tag, search);
            if (courses == null) return new List<CourseDto>();
            return _mapper.Map<List<CourseDto>>(courses);
        }

        public async Task<CourseDto?> GetCourseByIDAsync(int courseID)
        {
            var course = await _courseRepo.GetByIDAsync(courseID);
            if (course == null) return null;
            return _mapper.Map<CourseDto>(course);
        }

        public async Task<CourseDto?> CreateCourseAsync(int instructorID, CreateCourseDto dto)
        {
            // Validate instructor exists
            var instructor = await _context.Instructors.FindAsync(instructorID);
            if (instructor == null) return null;

            if (dto.TagIDs != null && dto.TagIDs.Any())
            {
                var distinctTagIDs = dto.TagIDs.Distinct().ToList();
                var tagCount = await _context.Tags
                    .Where(t => distinctTagIDs.Contains(t.TagID))
                    .CountAsync();
                if (tagCount != distinctTagIDs.Count)
                    return null;
            }

            // Validate difficulty if provided
            if (dto.DifficultyID.HasValue)
            {
                var difficulty = await _context.Lookups.FindAsync(dto.DifficultyID.Value);
                if (difficulty == null || difficulty.Category != "DIFFICULTY")
                    return null; // Invalid difficulty
            }

            // Validate prerequisites exist
            if (dto.PrerequisiteIDs != null && dto.PrerequisiteIDs.Any())
            {
                var distinctPrereqIDs = dto.PrerequisiteIDs
                    .Distinct()
                    .ToList();

                var prereqCount = await _context.Courses
                    .Where(c => distinctPrereqIDs.Contains(c.CourseID))
                    .CountAsync();
                if (prereqCount != distinctPrereqIDs.Count)
                    return null;
            }

            var course = _mapper.Map<Course>(dto);
            course.InstructorID = instructorID;
            course.CreatedAt = DateTime.UtcNow;

            var created = await _courseRepo.CreateAsync(course, dto.TagIDs, dto.PrerequisiteIDs);

            await _auditService.LogAsync(instructorID, "INSERT", "Course", created.CourseID, null, $"Course '{created.Title}' created");

            return await GetCourseByIDAsync(created.CourseID);
        }

        public async Task<CourseDto?> UpdateCourseAsync(int courseID, int userID, string role, UpdateCourseDto dto)
        {
            var course = await _context.Courses.FindAsync(courseID);
            if (course == null) return null;

            if (role != "Admin" && course.InstructorID != userID) return null;

            // Validate tags
            if (dto.TagIDs != null && dto.TagIDs.Any())
            {
                var distinctTagIDs = dto.TagIDs.Distinct().ToList();
                var tagCount = await _context.Tags
                    .Where(t => distinctTagIDs.Contains(t.TagID))
                    .CountAsync();
                if (tagCount != distinctTagIDs.Count) return null;
            }

            // Validate difficulty 
            if (dto.DifficultyID.HasValue)
            {
                var difficulty = await _context.Lookups.FindAsync(dto.DifficultyID.Value);
                if (difficulty == null || difficulty.Category != "DIFFICULTY")
                    return null;
            }

            // Validate prerequisites 
            if (dto.PrerequisiteIDs != null && dto.PrerequisiteIDs.Any())
            {
                var distinctPrereqIDs = dto.PrerequisiteIDs.Distinct().ToList();

                if (distinctPrereqIDs.Contains(courseID))
                    return null;

                foreach (var prereqID in distinctPrereqIDs)
                {
                    if (await HasCircularDependencyAsync(courseID, prereqID))
                        return null;
                }

                var prereqCount = await _context.Courses
                    .Where(c => distinctPrereqIDs.Contains(c.CourseID))
                    .CountAsync();
                if (prereqCount != distinctPrereqIDs.Count) return null;
            }

            var oldTitle = course.Title;
            var updated = await _courseRepo.UpdateAsync(courseID, dto.TagIDs, dto.PrerequisiteIDs, c =>
            {
                if (dto.Title != null) c.Title = dto.Title;
                if (dto.Description != null) c.Description = dto.Description;
                if (dto.DifficultyID != null) c.DifficultyID = dto.DifficultyID;
                if (dto.ThumbnailURL != null) c.ThumbnailURL = dto.ThumbnailURL;
            });

            if (updated == null) return null;

            await _auditService.LogAsync(userID, "UPDATE", "Course", courseID,
                $"Title: {oldTitle}", $"Title: {updated.Title}");

            return await GetCourseByIDAsync(updated.CourseID);
        }
        public async Task<(bool Success, string Message)> DeleteCourseAsync(int courseID, int userID, string role)
        {
            var course = await _context.Courses
         .Include(c => c.Enrollments)
         .FirstOrDefaultAsync(c => c.CourseID == courseID);

            if (course == null) return (false, "Course not found.");

            if (role != "Admin" && course.InstructorID != userID)
                return (false, "Unauthorized to delete this course.");

            // Block deletion if students are enrolled
            if (course.Enrollments.Any())
                return (false, "Cannot delete a course with enrolled students.");

            var title = course.Title;
            var deleted = await _courseRepo.DeleteAsync(courseID);
            if (!deleted) return (false, "Failed to delete course.");

            await _auditService.LogAsync(userID, "DELETE", "Course", courseID,
              $"Course '{title}' deleted", null);

            return (true, "Course deleted successfully.");
        }

        public async Task<(bool Success, string Message)> EnrollStudentAsync(int studentID, int courseID)
        {
            if (!await _courseRepo.ExistsAsync(courseID))
                return (false, "Course not found.");

            var student = await _context.Students.FindAsync(studentID);
            if (student == null)
                return (false, "Student not found.");

            // Already enrolled check
            if (await _courseRepo.IsEnrolledAsync(studentID, courseID))
                return (false, "Already enrolled in this course.");

            // fetch all completed course IDs in one query
            var completedCourseIDs = await _context.CourseEnrollments
                .Where(ce => ce.StudentID == studentID && ce.CompletionPercentage == 100)
                .Select(ce => ce.CourseID)
                .ToListAsync();

            var prerequisites = await _context.CoursePrerequisites
                .Where(cp => cp.CourseID == courseID)
                .Select(cp => cp.PrerequisiteID)
                .ToListAsync();

            // Check all prerequisites are completed
            var unmetPrereqs = prerequisites.Except(completedCourseIDs).ToList();
            if (unmetPrereqs.Any())
                return (false, "Prerequisites not completed.");

            var enrolled = await _courseRepo.EnrollStudentAsync(studentID, courseID);
            if (!enrolled) return (false, "Enrollment failed.");

            await _auditService.LogAsync(studentID, "INSERT", "CourseEnrollment", courseID,
                null, $"Student {studentID} enrolled in Course {courseID}");

            return (true, "Enrolled successfully.");
        }

        public async Task<StudentProgressView?> GetStudentProgressAsync(int studentID, int courseID)
        {
            return await _context.StudentProgressViews
                .FirstOrDefaultAsync(v => v.StudentID == studentID && v.CourseID == courseID);
        }
        private async Task<bool> HasCircularDependencyAsync(int courseID, int proposedPrereqID)
        {
            // check courseID is reachable from proposedPrereqID
            var visited = new HashSet<int>();
            var queue = new Queue<int>();
            queue.Enqueue(proposedPrereqID);

            while (queue.Count > 0)
            {
                var current = queue.Dequeue();
                if (current == courseID) return true;
                if (visited.Contains(current)) continue;
                visited.Add(current);

                var prereqs = await _context.CoursePrerequisites
                    .Where(cp => cp.CourseID == current)
                    .Select(cp => cp.PrerequisiteID)
                    .ToListAsync();

                foreach (var p in prereqs)
                    queue.Enqueue(p);
            }
            return false;
        }
    }
}

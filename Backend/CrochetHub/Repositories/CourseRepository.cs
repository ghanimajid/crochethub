using CrochetHub.Data;
using CrochetHub.Models;
using CrochetHub.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CrochetHub.Repositories
{
    public class CourseRepository : ICourseRepository
    {
        private readonly AppDbContext _context;
        public CourseRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<Course>> GetAllAsync(string? difficulty, string? tag, string? search)
        {
            var query = _context.Courses
                .Include(c => c.Difficulty)
                .Include(c => c.Instructor)
                    .ThenInclude(i => i!.User)
                        .ThenInclude(u => u!.Person)
                .Include(c => c.CourseTags)
                    .ThenInclude(ct => ct.Tag)
                .Include(c => c.Lessons)
                .Include(c => c.Reviews)
                .Include(c => c.Enrollments)
                .Include(c => c.Prerequisites)
                    .ThenInclude(cp => cp.Prerequisite)
                .AsQueryable();

            if (!string.IsNullOrEmpty(difficulty))
                query = query.Where(c => c.Difficulty != null && c.Difficulty.Value == difficulty);

            if (!string.IsNullOrEmpty(tag))
                query = query.Where(c => c.CourseTags.Any(ct => ct.Tag != null && ct.Tag.Name == tag));

            if (!string.IsNullOrEmpty(search))
                query = query.Where(c => c.Title.Contains(search) ||
                    (c.Description != null && c.Description.Contains(search)));

            return await query.ToListAsync();
        }
        public async Task<Course?> GetByIDAsync(int courseID)
        {
            return await _context.Courses
                .Include(c => c.Difficulty)
                .Include(c => c.Instructor)
                    .ThenInclude(i => i!.User)
                        .ThenInclude(u => u!.Person)
                .Include(c => c.CourseTags)
                    .ThenInclude(ct => ct.Tag)
                .Include(c => c.Lessons)
                .Include(c => c.Reviews)
                .Include(c => c.Enrollments)
                .Include(c => c.Prerequisites)
                    .ThenInclude(cp => cp.Prerequisite)
                .FirstOrDefaultAsync(c => c.CourseID == courseID);
        }
        public async Task<Course> CreateAsync(Course course, List<int>? tagIDs, List<int>? prerequisiteIDs)
        {
            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            // Add tags
            if (tagIDs != null)
            {
                foreach (var tagID in tagIDs.Distinct())
                {
                    _context.CourseTags.Add(new CourseTag
                    {
                        CourseID = course.CourseID,
                        TagID = tagID
                    });
                }
            }

            // Add prerequisites
            if (prerequisiteIDs != null)
            {
                foreach (var prereqID in prerequisiteIDs.Distinct())
                {
                    if (prereqID != course.CourseID)
                    {
                        _context.CoursePrerequisites.Add(new CoursePrerequisite
                        {
                            CourseID = course.CourseID,
                            PrerequisiteID = prereqID
                        });
                    }
                }
            }

            await _context.SaveChangesAsync();
            return course;
        }

        public async Task<Course?> UpdateAsync(int courseID, List<int>? tagIDs, List<int>? prerequisiteIDs, Action<Course> updateAction)
        {
            var course = await _context.Courses
                .Include(c => c.CourseTags)
                .Include(c => c.Prerequisites)
                .FirstOrDefaultAsync(c => c.CourseID == courseID);

            if (course == null) return null;

            updateAction(course);

            if (tagIDs != null)
            {
                _context.CourseTags.RemoveRange(course.CourseTags);
                foreach (var tagID in tagIDs.Distinct())
                {
                    _context.CourseTags.Add(new CourseTag
                    {
                        CourseID = course.CourseID,
                        TagID = tagID
                    });
                }
            }

            if (prerequisiteIDs != null)
            {
                _context.CoursePrerequisites.RemoveRange(course.Prerequisites);
                foreach (var prereqID in prerequisiteIDs.Distinct())
                {
                    if (prereqID != course.CourseID)
                    {
                        _context.CoursePrerequisites.Add(new CoursePrerequisite
                        {
                            CourseID = course.CourseID,
                            PrerequisiteID = prereqID
                        });
                    }
                }
            }

            await _context.SaveChangesAsync();
            return course;
        }

        public async Task<bool> DeleteAsync(int courseID)
        {
            var course = await _context.Courses.FindAsync(courseID);
            if (course == null) return false;

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> EnrollStudentAsync(int studentID, int courseID)
        {
            var alreadyEnrolled = await _context.CourseEnrollments
                .AnyAsync(ce => ce.StudentID == studentID && ce.CourseID == courseID);

            if (alreadyEnrolled) return false;

            _context.CourseEnrollments.Add(new CourseEnrollment
            {
                StudentID = studentID,
                CourseID = courseID,
                EnrolledAt = DateTime.UtcNow,
                CompletionPercentage = 0
            });

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> IsEnrolledAsync(int studentID, int courseID) =>
            await _context.CourseEnrollments
                .AnyAsync(ce => ce.StudentID == studentID && ce.CourseID == courseID);

        public async Task<bool> ExistsAsync(int courseID) =>
            await _context.Courses.AnyAsync(c => c.CourseID == courseID);
    }
}

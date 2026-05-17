using CrochetHub.Data;
using CrochetHub.DTOs.Admin;
using CrochetHub.Models;
using CrochetHub.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CrochetHub.Controllers
{
    [Authorize]
    public class AdminController : BaseApiController
    {
        private readonly AppDbContext _context;
        private readonly IAuditService _auditService;

        public AdminController(AppDbContext context, IAuditService auditService)
        {
            _context = context;
            _auditService = auditService;
        }

        // GET api/admin/dashboard
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            if (!IsAdmin()) return Forbid();

            var dashboard = new AdminDashboardDto
            {
                TotalUsers = await _context.Users.CountAsync(),
                TotalStudents = await _context.Students.CountAsync(),
                TotalInstructors = await _context.Instructors.CountAsync(),
                TotalCourses = await _context.Courses.CountAsync(),
                TotalPatterns = await _context.Patterns.CountAsync(),
                TotalEnrollments = await _context.CourseEnrollments.CountAsync(),
                TotalForumThreads = await _context.ForumThreads.CountAsync(),
                TotalForumReplies = await _context.ForumReplies.CountAsync()
            };

            return Ok(dashboard);
        }

        // GET api/admin/users
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers(
            [FromQuery] string? role,
            [FromQuery] string? search)
        {
            if (!IsAdmin()) return Forbid();

            var query = _context.Users
                .Include(u => u.Person)
                .Include(u => u.Role)
                .AsQueryable();

            if (!string.IsNullOrEmpty(role))
            {
                var validRoles = new[] { "Student", "Instructor", "Admin" };
                if (!validRoles.Contains(role))
                    return BadRequest(new { message = "Invalid role filter. Use Student, Instructor, or Admin." });

                query = query.Where(u => u.Role != null && u.Role.Value == role);
            }

            if (!string.IsNullOrEmpty(search))
                query = query.Where(u =>
                    (u.Person != null && u.Person.FirstName.Contains(search)) ||
                    (u.Person != null && u.Person.LastName.Contains(search)) ||
                    u.Email.Contains(search));

            var users = await query.Select(u => new AdminUserDto
            {
                UserID = u.UserID,
                FirstName = u.Person != null ? u.Person.FirstName : string.Empty,
                LastName = u.Person != null ? u.Person.LastName : string.Empty,
                Email = u.Email,
                Role = u.Role != null ? u.Role.Value : string.Empty,
                CreatedAt = u.CreatedAt
            }).ToListAsync();

            return Ok(users);
        }

        // GET api/admin/users/{id}
        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUserByID(int id)
        {
            if (!IsAdmin()) return Forbid();

            if (id <= 0)
                return BadRequest(new { message = "Invalid user ID." });

            var user = await _context.Users
                .Include(u => u.Person)
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserID == id);

            if (user == null)
                return NotFound(new { message = $"User with ID {id} not found." });

            return Ok(new AdminUserDto
            {
                UserID = user.UserID,
                FirstName = user.Person?.FirstName ?? string.Empty,
                LastName = user.Person?.LastName ?? string.Empty,
                Email = user.Email,
                Role = user.Role?.Value ?? string.Empty,
                CreatedAt = user.CreatedAt
            });
        }

        // PUT api/admin/users/{id}/role
        [HttpPut("users/{id}/role")]
        public async Task<IActionResult> ChangeUserRole(int id, [FromBody] ChangeUserRoleDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (!IsAdmin()) return Forbid();

            if (id <= 0)
                return BadRequest(new { message = "Invalid user ID." });

            // Prevent changing own role
            var adminID = GetUserID();
            if (adminID == null) return Unauthorized();

            if (adminID == id)
                return BadRequest(new { message = "You cannot change your own role." });

            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserID == id);
            if (user == null)
                return NotFound(new { message = $"User with ID {id} not found." });

            var newRole = await _context.Lookups
               .FirstOrDefaultAsync(l => l.LookupID == dto.RoleID && l.Category == "ROLE");
            if (newRole == null)
                return BadRequest(new { message = "Invalid role ID. Must reference a valid role in the system." });

            if (user.RoleID == dto.RoleID)
                return BadRequest(new { message = $"User already has the role '{newRole.Value}'." });

            var oldRoleName = user.Role?.Value ?? "Unknown";
            user.RoleID = dto.RoleID;
            await _context.SaveChangesAsync();

            // AUDIT LOG
            await _auditService.LogAsync(
                adminID.Value, "UPDATE", "User", id,
                oldValue: $"Role: {oldRoleName}",
                newValue: $"Role: {newRole.Value}"
            );

            if (newRole.Value == "Instructor")
            {
                // Remove student row if exists
                var student = await _context.Students.FindAsync(id);
                if (student != null) _context.Students.Remove(student);

                // Add instructor row if not exists
                if (!await _context.Instructors.AnyAsync(i => i.InstructorID == id))
                    _context.Instructors.Add(new Instructor { InstructorID = id });

                await _context.SaveChangesAsync();
            }
            else if (newRole.Value == "Student")
            {
                var instructor = await _context.Instructors
                    .Include(i => i.Courses)
                    .FirstOrDefaultAsync(i => i.InstructorID == id);

                // Block if instructor has courses
                if (instructor != null && instructor.Courses.Any())
                    return BadRequest(new
                    {
                        message = $"Cannot change role. Instructor has {instructor.Courses.Count} active course(s). Delete or reassign courses first."
                    });

                if (instructor != null) _context.Instructors.Remove(instructor);

                if (!await _context.Students.AnyAsync(s => s.StudentID == id))
                    _context.Students.Add(new Student { StudentID = id, EnrollmentDate = DateTime.UtcNow });

                await _context.SaveChangesAsync();
            }
            return Ok(new { message = $"User role updated to '{newRole.Value}' successfully." });

        }

        // DELETE api/admin/users/{id}
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (!IsAdmin()) return Forbid();

            if (id <= 0)
                return BadRequest(new { message = "Invalid user ID." });

            // Prevent deleting self
            var adminID = GetUserID();
            if (adminID == null) return Unauthorized();
            if (adminID == id)
                return BadRequest(new { message = "You cannot delete your own account." });

            var user = await _context.Users
                 .Include(u => u.Person)
                 .Include(u => u.Student)
                     .ThenInclude(s => s!.CourseEnrollments)
                 .Include(u => u.Instructor)
                     .ThenInclude(i => i!.Courses)
                 .FirstOrDefaultAsync(u => u.UserID == id);

            if (user == null)
                return NotFound(new { message = $"User with ID {id} not found." });

            // Block if student has enrollments
            if (user.Student != null && user.Student.CourseEnrollments.Any())
                return BadRequest(new
                {
                    message = $"Cannot delete this student. They are enrolled in " +
                              $"{user.Student.CourseEnrollments.Count} course(s). " +
                              $"Remove enrollments first."
                });

            // Block if instructor has courses
            if (user.Instructor != null && user.Instructor.Courses.Any())
                return BadRequest(new
                {
                    message = $"Cannot delete this instructor. They have " +
                              $"{user.Instructor.Courses.Count} course(s) assigned. " +
                              $"Delete or reassign courses first."
                });

            var userName = $"{user.Person?.FirstName} {user.Person?.LastName}".Trim();

            await _auditService.LogAsync(
                adminID.Value, "DELETE", "User", id,
                oldValue: $"User '{userName}' ({user.Email}) deleted",
                newValue: null
            );

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"User '{user.Person?.FirstName} {user.Person?.LastName}' deleted successfully." });
        }

        // GET api/admin/forum
        [HttpGet("forum")]
        public async Task<IActionResult> GetAllThreads()
        {
            if (!IsAdmin()) return Forbid();

            var threads = await _context.ForumThreads
                .Include(t => t.User)
                    .ThenInclude(u => u!.Person)
                .Include(t => t.Replies)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new
                {
                    t.ThreadID,
                    t.Title,
                    AuthorFirstName = t.User != null && t.User.Person != null
                        ? t.User.Person.FirstName : string.Empty,
                    AuthorLastName = t.User != null && t.User.Person != null
                        ? t.User.Person.LastName : string.Empty,
                    ReplyCount = t.Replies.Count,
                    t.CreatedAt
                })
                .ToListAsync();

            return Ok(threads);
        }

        // DELETE api/admin/forum/{id}
        [HttpDelete("forum/{id}")]
        public async Task<IActionResult> DeleteThread(int id)
        {
            if (!IsAdmin()) return Forbid();

            if (id <= 0)
                return BadRequest(new { message = "Invalid thread ID." });

            var adminID = GetUserID();
            if (adminID == null) return Unauthorized();

            var thread = await _context.ForumThreads
                .Include(t => t.Replies)
                .FirstOrDefaultAsync(t => t.ThreadID == id);

            if (thread == null)
                return NotFound(new { message = $"Thread with ID {id} not found." });

            var replyCount = thread.Replies.Count;
            var threadTitle = thread.Title;

            // AUDIT LOG — log before deletion
            await _auditService.LogAsync(
                adminID.Value, "DELETE", "ForumThread", id,
                oldValue: $"Thread '{threadTitle}' with {replyCount} replies deleted",
                newValue: null
            );

            _context.ForumThreads.Remove(thread);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Thread '{thread.Title}' and its {thread.Replies.Count} replies deleted successfully." });
        }

        // GET api/admin/stats/forum
        [HttpGet("stats/forum")]
        public async Task<IActionResult> GetForumStats()
        {
            if (!IsAdmin()) return Forbid();

            var stats = await _context.ForumActivityViews.ToListAsync();
            return Ok(stats);
        }

        // GET api/admin/stats/patterns
        [HttpGet("stats/patterns")]
        public async Task<IActionResult> GetPatternStats()
        {
            if (!IsAdmin()) return Forbid();

            var stats = await _context.PatternDifficultyStatsViews.ToListAsync();
            return Ok(stats);
        }

        // GET api/admin/courses
        [HttpGet("courses")]
        public async Task<IActionResult> GetAllCourses()
        {
            if (!IsAdmin()) return Forbid();

            var stats = await _context.InstructorStatsViews.ToListAsync();
            return Ok(stats);
        }
    }
}

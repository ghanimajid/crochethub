using CrochetHub.Data;
using CrochetHub.DTOs.Student;
using CrochetHub.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CrochetHub.Controllers
{
    [Authorize]
    public class StudentController : BaseApiController
    {
        private readonly AppDbContext _context;
        private readonly IAuditService _auditService;
        public StudentController(AppDbContext context, IAuditService auditService)
        {
            _context = context;
            _auditService = auditService;
        }

        // GET api/student/profile
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            if (!IsStudent()) return Forbid();

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var student = await _context.Students
                .Include(s => s.User)
                    .ThenInclude(u => u!.Person)
                        .ThenInclude(p => p!.Gender)
                .Include(s => s.CourseEnrollments)
                .FirstOrDefaultAsync(s => s.StudentID == userID.Value);

            if (student == null)
                return NotFound(new { message = "Student profile not found. Your account may not be set up as a student." });

            var completedCourses = student.CourseEnrollments
                .Count(ce => ce.CompletionPercentage == 100);

            var avgCompletion = student.CourseEnrollments.Any()
                ? Math.Round(student.CourseEnrollments.Average(ce => (double)ce.CompletionPercentage), 2)
                : 0;

            return Ok(new StudentProfileDto
            {
                StudentID = student.StudentID,
                FirstName = student.User?.Person?.FirstName ?? string.Empty,
                LastName = student.User?.Person?.LastName ?? string.Empty,
                Email = student.User?.Email ?? string.Empty,
                ProfilePicture = student.User?.ProfilePicture,
                Bio = student.User?.Bio,
                DateOfBirth = student.User?.Person?.DateOfBirth,
                Gender = student.User?.Person?.Gender?.Value,
                EnrollmentDate = student.EnrollmentDate,
                TotalEnrolled = student.CourseEnrollments.Count,
                CompletedCourses = completedCourses,
                AverageCompletion = avgCompletion
            });
        }

        // PUT api/student/profile
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateStudentProfileDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (!IsStudent()) return Forbid();

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            // Check at least one field provided
            if (dto.FirstName == null && dto.LastName == null && dto.Bio == null &&
                dto.ProfilePicture == null && dto.DateOfBirth == null && dto.GenderID == null)
                return BadRequest(new { message = "No fields provided to update." });

            var student = await _context.Students
                .Include(s => s.User)
                    .ThenInclude(u => u!.Person)
                .FirstOrDefaultAsync(s => s.StudentID == userID.Value);

            if (student == null)
                return NotFound(new { message = "Student not found." });

            // Validate GenderID if provided
            if (dto.GenderID.HasValue)
            {
                var gender = await _context.Lookups
                    .FirstOrDefaultAsync(l => l.LookupID == dto.GenderID.Value && l.Category == "GENDER");
                if (gender == null)
                    return BadRequest(new { message = "Invalid gender ID." });
            }

            // Validate DateOfBirth not in the future
            if (dto.DateOfBirth.HasValue && dto.DateOfBirth.Value > DateTime.UtcNow)
                return BadRequest(new { message = "Date of birth cannot be in the future." });

            if (dto.FirstName != null && dto.FirstName.Trim().Length == 0)
                return BadRequest(new { message = "First name cannot be empty." });
            if (dto.LastName != null && dto.LastName.Trim().Length == 0)
                return BadRequest(new { message = "Last name cannot be empty." });

            if (student.User != null)
            {
                if (dto.Bio != null) student.User.Bio = dto.Bio.Trim();
                if (dto.ProfilePicture != null) student.User.ProfilePicture = dto.ProfilePicture;

                if (student.User.Person != null)
                {
                    if (dto.FirstName != null) student.User.Person.FirstName = dto.FirstName.Trim();
                    if (dto.LastName != null) student.User.Person.LastName = dto.LastName.Trim();
                    if (dto.DateOfBirth.HasValue) student.User.Person.DateOfBirth = dto.DateOfBirth;
                    if (dto.GenderID.HasValue) student.User.Person.GenderID = dto.GenderID;
                }
            }

            await _context.SaveChangesAsync();
            await _auditService.LogAsync(
               userID.Value,
               "UPDATE",
               "Student",
               student.StudentID,
               null,
               $"Student profile updated"
           );
            return Ok(new { message = "Student profile updated successfully." });
        }

        // GET api/student/dashboard
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            if (!IsStudent()) return Forbid();

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var progress = await _context.StudentProgressViews
                .Where(v => v.StudentID == userID.Value)
                .ToListAsync();

            var nextCourses = await _context.StudentNextCoursesViews
                .Where(v => v.StudentID == userID.Value)
                .ToListAsync();

            return Ok(new
            {
                enrolledCourses = progress,
                recommendedCourses = nextCourses
            });
        }

        // GET api/student/enrollments
        [HttpGet("enrollments")]
        public async Task<IActionResult> GetEnrollments()
        {
            if (!IsStudent()) return Forbid();

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var enrollments = await _context.CourseEnrollments
                .Include(ce => ce.Course)
                    .ThenInclude(c => c!.Difficulty)
                .Where(ce => ce.StudentID == userID.Value)
                .OrderByDescending(ce => ce.EnrolledAt)
                .Select(ce => new
                {
                    ce.EnrollmentID,
                    ce.CourseID,
                    CourseTitle = ce.Course != null ? ce.Course.Title : string.Empty,
                    Difficulty = ce.Course != null && ce.Course.Difficulty != null
                        ? ce.Course.Difficulty.Value : null,
                    ce.CompletionPercentage,
                    ce.EnrolledAt
                })
                .ToListAsync();

            if (!enrollments.Any())
                return Ok(new { message = "You are not enrolled in any courses yet.", enrollments });

            return Ok(enrollments);
        }
    }
}

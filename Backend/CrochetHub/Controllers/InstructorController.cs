using CrochetHub.Data;
using CrochetHub.DTOs.Instructor;
using CrochetHub.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CrochetHub.Controllers
{
    [Authorize]
    public class InstructorController : BaseApiController
    {
        private readonly AppDbContext _context;
        private readonly IAuditService _auditService;
        public InstructorController(AppDbContext context, IAuditService auditService)
        {
            _context = context;
            _auditService = auditService;
        }

        // GET api/instructor/profile — own profile
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            if (!IsInstructor())
                return Forbid();

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var instructor = await _context.Instructors
                .Include(i => i.User)
                    .ThenInclude(u => u!.Person)
                .Include(i => i.Courses)
                    .ThenInclude(c => c.Enrollments)
                .Include(i => i.Courses)
                    .ThenInclude(c => c.Reviews)
                .FirstOrDefaultAsync(i => i.InstructorID == userID.Value);

            if (instructor == null)
                return NotFound(new { message = "Instructor profile not found. Your account may not be set up as an instructor." });

            var totalStudents = instructor.Courses
                .SelectMany(c => c.Enrollments)
                .Select(e => e.StudentID)
                .Distinct()
                .Count();

            var allRatings = instructor.Courses
                .SelectMany(c => c.Reviews)
                .Select(r => r.Rating)
                .ToList();

            return Ok(new InstructorProfileDto
            {
                InstructorID = instructor.InstructorID,
                FirstName = instructor.User?.Person?.FirstName ?? string.Empty,
                LastName = instructor.User?.Person?.LastName ?? string.Empty,
                Email = instructor.User?.Email ?? string.Empty,
                Bio = instructor.Bio,
                ProfilePicture = instructor.User?.ProfilePicture,
                ExperienceYears = instructor.ExperienceYears,
                TotalCourses = instructor.Courses.Count,
                TotalStudents = totalStudents,
                OverallRating = allRatings.Any() ? Math.Round(allRatings.Average(), 2) : 0,
                CreatedAt = instructor.User?.CreatedAt ?? DateTime.UtcNow
            });
        }

        // PUT api/instructor/profile
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateInstructorProfileDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (!IsInstructor()) return Forbid();

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            // Validate GenderID if would be added later
            var instructor = await _context.Instructors
                .Include(i => i.User)
                    .ThenInclude(u => u!.Person)
                .FirstOrDefaultAsync(i => i.InstructorID == userID.Value);

            if (instructor == null)
                return NotFound(new { message = "Instructor not found." });

            // Check at least one field is being updated
            if (dto.Bio == null && dto.ExperienceYears == null &&
                dto.ProfilePicture == null && dto.FirstName == null && dto.LastName == null)
                return BadRequest(new { message = "No fields provided to update." });

            if (dto.FirstName != null && dto.FirstName.Trim().Length == 0)
                return BadRequest(new { message = "First name cannot be empty." });
            if (dto.LastName != null && dto.LastName.Trim().Length == 0)
                return BadRequest(new { message = "Last name cannot be empty." });

            if (dto.Bio != null) instructor.Bio = dto.Bio.Trim();
            if (dto.ExperienceYears.HasValue) instructor.ExperienceYears = dto.ExperienceYears.Value;

            if (instructor.User != null)
            {
                if (dto.ProfilePicture != null) instructor.User.ProfilePicture = dto.ProfilePicture;

                if (instructor.User.Person != null)
                {
                    if (dto.FirstName != null) instructor.User.Person.FirstName = dto.FirstName.Trim();
                    if (dto.LastName != null) instructor.User.Person.LastName = dto.LastName.Trim();
                }
            }

            await _context.SaveChangesAsync();

            await _auditService.LogAsync(
                userID.Value,
                "UPDATE",
                "Instructor",
                instructor.InstructorID,
                null,
                $"Instructor profile updated"
            );

            return Ok(new { message = "Instructor profile updated successfully." });
        }

        // GET api/instructor/courses — own courses with stats
        [HttpGet("courses")]
        public async Task<IActionResult> GetMyCourses()
        {
            if (!IsInstructor()) return Forbid();

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var stats = await _context.InstructorStatsViews
                .Where(v => v.InstructorID == userID.Value)
                .ToListAsync();

            if (!stats.Any())
                return Ok(new { message = "You have not created any courses yet.", courses = stats });

            return Ok(stats);
        }

        // GET api/instructor/{id}/profile — public view of any instructor
        [HttpGet("{id}/profile")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublicProfile(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid instructor ID." });

            var instructor = await _context.Instructors
                .Include(i => i.User)
                    .ThenInclude(u => u!.Person)
                .Include(i => i.Courses)
                    .ThenInclude(c => c.Enrollments)
                .Include(i => i.Courses)
                    .ThenInclude(c => c.Reviews)
                .FirstOrDefaultAsync(i => i.InstructorID == id);

            if (instructor == null)
                return NotFound(new { message = $"Instructor with ID {id} not found." });

            var totalStudents = instructor.Courses
                .SelectMany(c => c.Enrollments)
                .Select(e => e.StudentID)
                .Distinct()
                .Count();

            var allRatings = instructor.Courses
                .SelectMany(c => c.Reviews)
                .Select(r => r.Rating)
                .ToList();

            return Ok(new InstructorProfileDto
            {
                InstructorID = instructor.InstructorID,
                FirstName = instructor.User?.Person?.FirstName ?? string.Empty,
                LastName = instructor.User?.Person?.LastName ?? string.Empty,
                Email = instructor.User?.Email ?? string.Empty,
                Bio = instructor.Bio,
                ProfilePicture = instructor.User?.ProfilePicture,
                ExperienceYears = instructor.ExperienceYears,
                TotalCourses = instructor.Courses.Count,
                TotalStudents = totalStudents,
                OverallRating = allRatings.Any() ? Math.Round(allRatings.Average(), 2) : 0,
                CreatedAt = instructor.User?.CreatedAt ?? DateTime.UtcNow
            });
        }
    }
}

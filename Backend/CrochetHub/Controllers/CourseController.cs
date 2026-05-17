using CrochetHub.DTOs.Course;
using CrochetHub.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CrochetHub.Controllers
{
    public class CourseController : BaseApiController
    {
        private readonly ICourseService _courseService;

        public CourseController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        // GET api/course
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? difficulty,
            [FromQuery] string? tag,
            [FromQuery] string? search)
        {
            var courses = await _courseService.GetAllCoursesAsync(difficulty, tag, search);
            return Ok(courses);
        }

        // GET api/course/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {
            var course = await _courseService.GetCourseByIDAsync(id);
            if (course == null) return NotFound(new { message = "Course not found." });
            return Ok(course);
        }

        // POST api/course
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateCourseDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!IsInstructor())
                return Forbid();

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var course = await _courseService.CreateCourseAsync(userID.Value, dto);
            if (course == null)
                return BadRequest(new { message = "Failed to create course. Invalid instructor, tags, difficulty, or prerequisites." });

            return CreatedAtAction(nameof(GetByID), new { id = course.CourseID }, course);
        }

        // PUT api/course/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCourseDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!IsInstructor() && !IsAdmin())
                return Forbid();

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var course = await _courseService.UpdateCourseAsync(id, userID.Value, GetUserRole(), dto);
            if (course == null)
                return NotFound(new { message = "Course not found, unauthorized, or invalid data." });

            return Ok(course);
        }

        // DELETE api/course/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            if (!IsInstructor() && !IsAdmin()) return Forbid();

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            // Check enrollments before attempting delete
            var course = await _courseService.GetCourseByIDAsync(id);
            if (course == null) return NotFound(new { message = "Course not found." });

            if (course.TotalEnrollments > 0)
                return BadRequest(new { message = "Cannot delete a course with enrolled students." });

            var (success, message) = await _courseService.DeleteCourseAsync(id, userID.Value, GetUserRole());
            if (!success) return BadRequest(new { message });

            return Ok(new { message });
        }

        // POST api/course/{id}/enroll
        [HttpPost("{id}/enroll")]
        [Authorize]
        public async Task<IActionResult> Enroll(int id)
        {
            if (!IsStudent())
                return Forbid();

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (success, message) = await _courseService.EnrollStudentAsync(userID.Value, id);
            if (!success) return BadRequest(new { message });

            return Ok(new { message });
        }

        // GET api/course/{id}/progress
        [HttpGet("{id}/progress")]
        [Authorize]
        public async Task<IActionResult> GetProgress(int id)
        {
            if (!IsStudent())
                return Forbid();

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var progress = await _courseService.GetStudentProgressAsync(userID.Value, id);
            if (progress == null)
                return NotFound(new { message = "No progress found for this course." });

            return Ok(progress);
        }
    }
}

using CrochetHub.DTOs.Lesson;
using CrochetHub.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CrochetHub.Controllers
{
    public class LessonController : BaseApiController
    {
        private readonly ILessonService _lessonService;

        public LessonController(ILessonService lessonService)
        {
            _lessonService = lessonService;
        }

        // GET api/lesson/course/{courseID}
        // anyoen can view lessons but progress only shown if authenticated student
        [HttpGet("course/{courseID}")]
        public async Task<IActionResult> GetByCourse(int courseID)
        {
            if (courseID <= 0)
                return BadRequest(new { message = "Invalid course ID." });

            int? studentID = IsStudent() ? GetUserID() : null;
            var lessons = await _lessonService.GetByCourseIDAsync(courseID, studentID);

            return Ok(lessons);
        }

        // GET api/lesson/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid lesson ID." });

            int? studentID = IsStudent() ? GetUserID() : null;
            var lesson = await _lessonService.GetByIDAsync(id, studentID);

            if (lesson == null)
                return NotFound(new { message = $"Lesson with ID {id} not found." });

            return Ok(lesson);
        }

        // POST api/lesson
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateLessonDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!IsInstructor())
                return Forbid();

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (lesson, error) = await _lessonService.CreateAsync(userID.Value, dto);
            if (error != null)
                return BadRequest(new { message = error });

            return CreatedAtAction(nameof(GetByID), new { id = lesson!.LessonID }, lesson);
        }

        // PUT api/lesson/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateLessonDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!IsInstructor() && !IsAdmin())
                return Forbid();

            if (id <= 0)
                return BadRequest(new { message = "Invalid lesson ID." });

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (lesson, error) = await _lessonService.UpdateAsync(id, userID.Value, GetUserRole(), dto);
            if (error != null)
                return error.Contains("not found")
                    ? NotFound(new { message = error })
                    : BadRequest(new { message = error });

            return Ok(lesson);
        }

        // DELETE api/lesson/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            if (!IsInstructor() && !IsAdmin())
                return Forbid();

            if (id <= 0)
                return BadRequest(new { message = "Invalid lesson ID." });

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (success, message) = await _lessonService.DeleteAsync(id, userID.Value, GetUserRole());
            if (!success)
                return message.Contains("not found")
                    ? NotFound(new { message })
                    : BadRequest(new { message });

            return Ok(new { message });
        }

        // POST api/lesson/{id}/complete
        [HttpPost("{id}/complete")]
        [Authorize]
        public async Task<IActionResult> MarkComplete(int id, [FromBody] MarkLessonCompleteDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!IsStudent())
                return Forbid();

            if (id <= 0)
                return BadRequest(new { message = "Invalid lesson ID." });

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (success, message) = await _lessonService.MarkCompleteAsync(id, userID.Value, dto.TimeSpent);
            if (!success)
                return message.Contains("not found")
                    ? NotFound(new { message })
                    : BadRequest(new { message });

            return Ok(new { message });
        }
    }
}

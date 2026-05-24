using CrochetHub.DTOs.CourseReview;
using CrochetHub.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CrochetHub.Controllers
{
    public class CourseReviewController : BaseApiController
    {
        private readonly ICourseReviewService _reviewService;

        public CourseReviewController(ICourseReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        // GET api/coursereview/course/{courseID}
        [HttpGet("course/{courseID}")]
        public async Task<IActionResult> GetByCourse(int courseID)
        {
            if (courseID <= 0)
                return BadRequest(new { message = "Invalid course ID." });

            var reviews = await _reviewService.GetByCourseIDAsync(courseID);
            return Ok(reviews);
        }

        // POST api/coursereview/course/{courseID}
        [HttpPost("course/{courseID}")]
        [Authorize]
        public async Task<IActionResult> Create(int courseID, [FromBody] CreateCourseReviewDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (courseID <= 0)
                return BadRequest(new { message = "Invalid course ID." });

            if (!IsStudent())
                return Forbid();

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (review, error) = await _reviewService.CreateAsync(courseID, userID.Value, dto);
            if (error != null)
                return error.Contains("not found")
                    ? NotFound(new { message = error })
                    : BadRequest(new { message = error });

            return CreatedAtAction(nameof(GetByCourse), new { courseID }, review);
        }

        // DELETE api/coursereview/{reviewID}
        [HttpDelete("{reviewID}")]
        [Authorize]
        public async Task<IActionResult> Delete(int reviewID)
        {
            if (reviewID <= 0)
                return BadRequest(new { message = "Invalid review ID." });

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (success, message) = await _reviewService.DeleteAsync(reviewID, userID.Value, GetUserRole());
            if (!success)
                return message.Contains("not found")
                    ? NotFound(new { message })
                    : BadRequest(new { message });

            return Ok(new { message });
        }
    }
}

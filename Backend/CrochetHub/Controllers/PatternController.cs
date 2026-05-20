using CrochetHub.DTOs.Pattern;
using CrochetHub.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CrochetHub.Controllers
{
    public class PatternController : BaseApiController
    {
        private readonly IPatternService _patternService;

        public PatternController(IPatternService patternService)
        {
            _patternService = patternService;
        }

        // GET api/pattern
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? difficulty,
            [FromQuery] string? tag,
            [FromQuery] string? search)
        {
            var patterns = await _patternService.GetAllAsync(difficulty, tag, search);
            return Ok(patterns);
        }

        // GET api/pattern/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid pattern ID." });

            var pattern = await _patternService.GetByIDAsync(id);
            if (pattern == null)
                return NotFound(new { message = $"Pattern with ID {id} not found." });

            return Ok(pattern);
        }

        // POST api/pattern
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreatePatternDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (pattern, error) = await _patternService.CreateAsync(userID.Value, dto);
            if (error != null)
                return BadRequest(new { message = error });

            return CreatedAtAction(nameof(GetByID), new { id = pattern!.PatternID }, pattern);
        }

        // PUT api/pattern/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePatternDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (id <= 0)
                return BadRequest(new { message = "Invalid pattern ID." });

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (pattern, error) = await _patternService.UpdateAsync(id, userID.Value, GetUserRole(), dto);
            if (error != null)
                return error.Contains("not found")
                    ? NotFound(new { message = error })
                    : BadRequest(new { message = error });

            return Ok(pattern);
        }

        // DELETE api/pattern/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid pattern ID." });

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (success, message) = await _patternService.DeleteAsync(id, userID.Value, GetUserRole());
            if (!success)
                return message.Contains("not found")
                    ? NotFound(new { message })
                    : BadRequest(new { message });

            return Ok(new { message });
        }

        // GET api/pattern/{id}/reviews
        [HttpGet("{id}/reviews")]
        public async Task<IActionResult> GetReviews(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid pattern ID." });

            var reviews = await _patternService.GetReviewsAsync(id);
            return Ok(reviews);
        }

        // POST api/pattern/{id}/reviews
        [HttpPost("{id}/reviews")]
        [Authorize]
        public async Task<IActionResult> AddReview(int id, [FromBody] CreatePatternReviewDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (id <= 0)
                return BadRequest(new { message = "Invalid pattern ID." });

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (review, error) = await _patternService.AddReviewAsync(id, userID.Value, dto);
            if (error != null)
                return error.Contains("not found")
                    ? NotFound(new { message = error })
                    : BadRequest(new { message = error });

            return CreatedAtAction(nameof(GetReviews), new { id }, review);
        }

        // DELETE api/pattern/{id}/reviews/{reviewID}
        [HttpDelete("{id}/reviews/{reviewID}")]
        [Authorize]
        public async Task<IActionResult> DeleteReview(int id, int reviewID)
        {
            if (id <= 0 || reviewID <= 0)
                return BadRequest(new { message = "Invalid pattern or review ID." });

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (success, message) = await _patternService.DeleteReviewAsync(reviewID, userID.Value, GetUserRole());
            if (!success)
                return message.Contains("not found")
                    ? NotFound(new { message })
                    : BadRequest(new { message });

            return Ok(new { message });
        }
    }
}

using CrochetHub.DTOs.Forum;
using CrochetHub.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CrochetHub.Controllers
{
    public class ForumController : BaseApiController
    {
        private readonly IForumService _forumService;

        public ForumController(IForumService forumService)
        {
            _forumService = forumService;
        }

        // GET api/forum
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? category,
            [FromQuery] string? search)
        {
            var threads = await _forumService.GetAllThreadsAsync(category, search);
            return Ok(threads);
        }

        // GET api/forum/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid thread ID." });

            var thread = await _forumService.GetThreadByIDAsync(id);
            if (thread == null)
                return NotFound(new { message = $"Thread with ID {id} not found." });

            return Ok(thread);
        }

        // POST api/forum
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateThread([FromBody] CreateForumThreadDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (thread, error) = await _forumService.CreateThreadAsync(userID.Value, dto);
            if (error != null)
                return BadRequest(new { message = error });

            return CreatedAtAction(nameof(GetByID), new { id = thread!.ThreadID }, thread);
        }

        // PUT api/forum/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateThread(int id, [FromBody] UpdateForumThreadDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (id <= 0)
                return BadRequest(new { message = "Invalid thread ID." });

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (thread, error) = await _forumService.UpdateThreadAsync(id, userID.Value, GetUserRole(), dto);
            if (error != null)
                return error.Contains("not found")
                    ? NotFound(new { message = error })
                    : BadRequest(new { message = error });

            return Ok(thread);
        }

        // DELETE api/forum/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteThread(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid thread ID." });

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (success, message) = await _forumService.DeleteThreadAsync(id, userID.Value, GetUserRole());
            if (!success)
                return message.Contains("not found")
                    ? NotFound(new { message })
                    : BadRequest(new { message });

            return Ok(new { message });
        }

        // POST api/forum/{id}/replies
        [HttpPost("{id}/replies")]
        [Authorize]
        public async Task<IActionResult> CreateReply(int id, [FromBody] CreateForumReplyDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (id <= 0)
                return BadRequest(new { message = "Invalid thread ID." });

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (reply, error) = await _forumService.CreateReplyAsync(id, userID.Value, dto);
            if (error != null)
                return error.Contains("not found")
                    ? NotFound(new { message = error })
                    : BadRequest(new { message = error });

            return CreatedAtAction(nameof(GetByID), new { id }, reply);
        }

        // PUT api/forum/replies/{replyID}
        [HttpPut("replies/{replyID}")]
        [Authorize]
        public async Task<IActionResult> UpdateReply(int replyID, [FromBody] UpdateForumReplyDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (replyID <= 0)
                return BadRequest(new { message = "Invalid reply ID." });

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (reply, error) = await _forumService.UpdateReplyAsync(replyID, userID.Value, GetUserRole(), dto);
            if (error != null)
                return error.Contains("not found")
                    ? NotFound(new { message = error })
                    : BadRequest(new { message = error });

            return Ok(reply);
        }

        // DELETE api/forum/replies/{replyID}
        [HttpDelete("replies/{replyID}")]
        [Authorize]
        public async Task<IActionResult> DeleteReply(int replyID)
        {
            if (replyID <= 0)
                return BadRequest(new { message = "Invalid reply ID." });

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (success, message) = await _forumService.DeleteReplyAsync(replyID, userID.Value, GetUserRole());
            if (!success)
                return message.Contains("not found")
                    ? NotFound(new { message })
                    : BadRequest(new { message });

            return Ok(new { message });
        }

        // POST api/forum/replies/{replyID}/upvote
        [HttpPost("replies/{replyID}/upvote")]
        [Authorize]
        public async Task<IActionResult> UpvoteReply(int replyID)
        {
            if (replyID <= 0)
                return BadRequest(new { message = "Invalid reply ID." });

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (success, message) = await _forumService.UpvoteReplyAsync(replyID, userID.Value);
            if (!success)
                return message.Contains("not found")
                    ? NotFound(new { message })
                    : BadRequest(new { message });

            return Ok(new { message });
        }
    }
}

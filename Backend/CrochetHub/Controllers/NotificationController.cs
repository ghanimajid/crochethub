using CrochetHub.DTOs.Notificaton;
using CrochetHub.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CrochetHub.Controllers
{
    [Authorize]
    public class NotificationController : BaseApiController
    {
        private readonly INotificationService _notifService;

        public NotificationController(INotificationService notifService)
        {
            _notifService = notifService;
        }

        // GET api/notification
        [HttpGet]
        public async Task<IActionResult> GetMyNotifications([FromQuery] bool? isRead)
        {
            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var notifications = await _notifService.GetMyNotificationsAsync(userID.Value, isRead);
            return Ok(notifications);
        }

        // GET api/notification/unread-count
        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var count = await _notifService.GetUnreadCountAsync(userID.Value);
            return Ok(new { unreadCount = count });
        }

        // PUT api/notification/{id}/read
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid notification ID." });

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (success, message) = await _notifService.MarkAsReadAsync(id, userID.Value);
            if (!success)
                return message.Contains("not found")
                    ? NotFound(new { message })
                    : BadRequest(new { message });

            return Ok(new { message });
        }

        // PUT api/notification/read-all
        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (success, message) = await _notifService.MarkAllAsReadAsync(userID.Value);
            if (!success)
                return BadRequest(new { message });

            return Ok(new { message });
        }

        // DELETE api/notification/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid notification ID." });

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (success, message) = await _notifService.DeleteAsync(id, userID.Value);
            if (!success)
                return message.Contains("not found")
                    ? NotFound(new { message })
                    : BadRequest(new { message });

            return Ok(new { message });
        }

        // POST api/notification — Admin only, send notification to any user
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateNotificationDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!IsAdmin())
                return Forbid();

            var result = await _notifService.CreateAsync(dto);
            if (result == null)
                return BadRequest(new { message = "Failed to create notification. Check user ID and type ID." });

            return Ok(result);
        }
    }
}

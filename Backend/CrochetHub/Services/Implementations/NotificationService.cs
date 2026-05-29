using CrochetHub.Data;
using CrochetHub.DTOs.Notificaton;
using CrochetHub.Models;
using CrochetHub.Repositories.Interfaces;
using CrochetHub.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CrochetHub.Services.Implementations
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notifRepo;
        private readonly AppDbContext _context;

        public NotificationService(INotificationRepository notifRepo, AppDbContext context)
        {
            _notifRepo = notifRepo;
            _context = context;
        }

        public async Task<List<NotificationDto>> GetMyNotificationsAsync(int userID, bool? isRead)
        {
            var notifications = await _notifRepo.GetByUserIDAsync(userID, isRead);
            return notifications.Select(MapToDto).ToList();
        }

        public async Task<int> GetUnreadCountAsync(int userID)
        {
            return await _notifRepo.GetUnreadCountAsync(userID);
        }

        public async Task<(bool Success, string Message)> MarkAsReadAsync(int notificationID, int userID)
        {
            var notification = await _notifRepo.GetByIDAsync(notificationID);
            if (notification == null)
                return (false, "Notification not found.");

            if (notification.UserID != userID)
                return (false, "You are not authorized to update this notification.");

            if (notification.IsRead)
                return (false, "Notification is already marked as read.");

            var success = await _notifRepo.MarkAsReadAsync(notificationID);
            if (!success)
                return (false, "Failed to mark notification as read.");

            return (true, "Notification marked as read.");
        }

        public async Task<(bool Success, string Message)> MarkAllAsReadAsync(int userID)
        {
            var success = await _notifRepo.MarkAllAsReadAsync(userID);
            if (!success)
                return (false, "No unread notifications found.");

            return (true, "All notifications marked as read.");
        }

        public async Task<(bool Success, string Message)> DeleteAsync(int notificationID, int userID)
        {
            var notification = await _notifRepo.GetByIDAsync(notificationID);
            if (notification == null)
                return (false, "Notification not found.");

            if (notification.UserID != userID)
                return (false, "You are not authorized to delete this notification.");

            var success = await _notifRepo.DeleteAsync(notificationID);
            if (!success)
                return (false, "Failed to delete notification.");

            return (true, "Notification deleted successfully.");
        }

        public async Task<NotificationDto?> CreateAsync(CreateNotificationDto dto)
        {
            var userExists = await _context.Users.AnyAsync(u => u.UserID == dto.UserID);
            if (!userExists) return null;

            if (dto.TypeID.HasValue)
            {
                var type = await _context.Lookups
                    .FirstOrDefaultAsync(l => l.LookupID == dto.TypeID.Value
                                           && l.Category == "NOTIFICATION_TYPE");
                if (type == null) return null;
            }

            var notification = new Notification
            {
                UserID = dto.UserID,
                Message = dto.Message.Trim(),
                TypeID = dto.TypeID,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _notifRepo.CreateAsync(notification);
            var full = await _notifRepo.GetByIDAsync(created.NotificationID);
            return MapToDto(full!);
        }

        private NotificationDto MapToDto(Notification n) => new NotificationDto
        {
            NotificationID = n.NotificationID,
            UserID = n.UserID,
            Message = n.Message,
            Type = n.Type?.Value,
            IsRead = n.IsRead,
            CreatedAt = n.CreatedAt
        };
    }
}

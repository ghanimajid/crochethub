using CrochetHub.DTOs.Notificaton;

namespace CrochetHub.Services.Interfaces
{
    public interface INotificationService
    {
        Task<List<NotificationDto>> GetMyNotificationsAsync(int userID, bool? isRead);
        Task<int> GetUnreadCountAsync(int userID);
        Task<(bool Success, string Message)> MarkAsReadAsync(int notificationID, int userID);
        Task<(bool Success, string Message)> MarkAllAsReadAsync(int userID);
        Task<(bool Success, string Message)> DeleteAsync(int notificationID, int userID);
        Task<NotificationDto?> CreateAsync(CreateNotificationDto dto);
    }
}

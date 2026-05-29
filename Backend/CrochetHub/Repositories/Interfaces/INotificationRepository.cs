using CrochetHub.Models;

namespace CrochetHub.Repositories.Interfaces
{
    public interface INotificationRepository
    {
        Task<List<Notification>> GetByUserIDAsync(int userID, bool? isRead);
        Task<Notification?> GetByIDAsync(int notificationID);
        Task<Notification> CreateAsync(Notification notification);
        Task<bool> MarkAsReadAsync(int notificationID);
        Task<bool> MarkAllAsReadAsync(int userID);
        Task<bool> DeleteAsync(int notificationID);
        Task<int> GetUnreadCountAsync(int userID);
    }
}

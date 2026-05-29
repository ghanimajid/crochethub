using CrochetHub.Data;
using CrochetHub.Models;
using CrochetHub.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CrochetHub.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly AppDbContext _context;

        public NotificationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Notification>> GetByUserIDAsync(int userID, bool? isRead)
        {
            var query = _context.Notifications
                .Include(n => n.Type)
                .Where(n => n.UserID == userID)
                .AsQueryable();

            if (isRead.HasValue)
                query = query.Where(n => n.IsRead == isRead.Value);

            return await query
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        public async Task<Notification?> GetByIDAsync(int notificationID)
        {
            return await _context.Notifications
                .Include(n => n.Type)
                .FirstOrDefaultAsync(n => n.NotificationID == notificationID);
        }

        public async Task<Notification> CreateAsync(Notification notification)
        {
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
            return notification;
        }

        public async Task<bool> MarkAsReadAsync(int notificationID)
        {
            var notification = await _context.Notifications.FindAsync(notificationID);
            if (notification == null) return false;

            notification.IsRead = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> MarkAllAsReadAsync(int userID)
        {
            var unread = await _context.Notifications
                .Where(n => n.UserID == userID && !n.IsRead)
                .ToListAsync();

            if (!unread.Any()) return false;

            unread.ForEach(n => n.IsRead = true);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int notificationID)
        {
            var notification = await _context.Notifications.FindAsync(notificationID);
            if (notification == null) return false;

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<int> GetUnreadCountAsync(int userID)
        {
            return await _context.Notifications
                .CountAsync(n => n.UserID == userID && !n.IsRead);
        }
    }
}

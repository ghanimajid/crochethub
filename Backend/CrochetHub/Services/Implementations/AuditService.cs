using CrochetHub.Data;
using CrochetHub.Models;
using CrochetHub.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CrochetHub.Services.Implementations
{
    public class AuditService : IAuditService
    {
        private readonly AppDbContext _context;

        public AuditService(AppDbContext context)
        {
            _context = context;
        }

        public async Task LogAsync(int userID, string action, string entityType,
            int entityID, string? oldValue = null, string? newValue = null)
        {
            var actionLookup = await _context.Lookups
                .FirstOrDefaultAsync(l => l.Value == action && l.Category == "ACTION");

            if (actionLookup == null) return;

            _context.AuditLogs.Add(new AuditLog
            {
                UserID = userID,
                ActionID = actionLookup.LookupID,
                EntityType = entityType,
                EntityID = entityID,
                OldValue = oldValue,
                NewValue = newValue,
                Timestamp = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
        }
    }
}

namespace CrochetHub.Services.Interfaces
{
    public interface IAuditService
    {
        Task LogAsync(int userID, string action, string entityType, int entityID,
            string? oldValue = null, string? newValue = null);
    }
}

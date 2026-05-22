using CrochetHub.Data;
using CrochetHub.DTOs.Forum;
using CrochetHub.Models;
using CrochetHub.Repositories.Interfaces;
using CrochetHub.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CrochetHub.Services.Implementations
{
    public class ForumService : IForumService
    {
        private readonly IForumRepository _forumRepo;
        private readonly AppDbContext _context;
        private readonly IAuditService _auditService;

        public ForumService(IForumRepository forumRepo, AppDbContext context, IAuditService auditService)
        {
            _forumRepo = forumRepo;
            _context = context;
            _auditService = auditService;
        }

        public async Task<List<ForumThreadDto>> GetAllThreadsAsync(string? category, string? search)
        {
            if (!string.IsNullOrEmpty(category))
            {
                var validCategory = await _context.Lookups
                    .AnyAsync(l => l.Value == category && l.Category == "FORUM_CATEGORY");
                if (!validCategory)
                    return new List<ForumThreadDto>();
            }

            var threads = await _forumRepo.GetAllThreadsAsync(category, search);
            return threads.Select(MapThreadToDto).ToList();
        }

        public async Task<ForumThreadDetailDto?> GetThreadByIDAsync(int threadID)
        {
            var thread = await _forumRepo.GetThreadByIDAsync(threadID);
            if (thread == null) return null;

            return new ForumThreadDetailDto
            {
                ThreadID = thread.ThreadID,
                UserID = thread.UserID,
                AuthorName = thread.User?.Person != null
                    ? $"{thread.User.Person.FirstName} {thread.User.Person.LastName}"
                    : "Unknown",
                Title = thread.Title,
                Content = thread.Content,
                Category = thread.Category?.Value,
                ReplyCount = thread.Replies.Count,
                CreatedAt = thread.CreatedAt,
                Replies = thread.Replies
                    .OrderBy(r => r.CreatedAt)
                    .Select(MapReplyToDto)
                    .ToList()
            };
        }

        public async Task<(ForumThreadDto? Thread, string? Error)> CreateThreadAsync(int userID, CreateForumThreadDto dto)
        {
            if (dto.CategoryID.HasValue)
            {
                var category = await _context.Lookups
                    .FirstOrDefaultAsync(l => l.LookupID == dto.CategoryID.Value && l.Category == "FORUM_CATEGORY");
                if (category == null)
                    return (null, "Invalid category ID. Must be a valid forum category.");
            }

            if (dto.Content != null && dto.Content.Trim().Length == 0)
                return (null, "Content cannot be empty.");

            var thread = new ForumThread
            {
                UserID = userID,
                Title = dto.Title.Trim(),
                Content = dto.Content?.Trim(),
                CategoryID = dto.CategoryID,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _forumRepo.CreateThreadAsync(thread);

            await _auditService.LogAsync(
                userID, "INSERT", "ForumThread", created.ThreadID,
                null, $"Thread '{created.Title}' created");

            var full = await _forumRepo.GetThreadByIDAsync(created.ThreadID);
            return (MapThreadToDto(full!), null);
        }

        public async Task<(ForumThreadDto? Thread, string? Error)> UpdateThreadAsync(int threadID, int userID, string role, UpdateForumThreadDto dto)
        {
            var thread = await _forumRepo.GetThreadByIDAsync(threadID);
            if (thread == null)
                return (null, "Thread not found.");

            if (role != "Admin" && thread.UserID != userID)
                return (null, "You are not authorized to update this thread.");

            if (dto.Title == null && dto.Content == null && dto.CategoryID == null)
                return (null, "No fields provided to update.");

            if (dto.Title != null && dto.Title.Trim().Length == 0)
                return (null, "Title cannot be empty.");

            if (dto.Content != null && dto.Content.Trim().Length == 0)
                return (null, "Content cannot be empty.");

            if (dto.CategoryID.HasValue)
            {
                var category = await _context.Lookups
                    .FirstOrDefaultAsync(l => l.LookupID == dto.CategoryID.Value && l.Category == "FORUM_CATEGORY");
                if (category == null)
                    return (null, "Invalid category ID.");
            }

            var oldTitle = thread.Title;
            var updated = await _forumRepo.UpdateThreadAsync(threadID, t =>
            {
                if (dto.Title != null) t.Title = dto.Title.Trim();
                if (dto.Content != null) t.Content = dto.Content.Trim();
                if (dto.CategoryID.HasValue) t.CategoryID = dto.CategoryID;
            });

            if (updated == null)
                return (null, "Failed to update thread.");

            await _auditService.LogAsync(
                userID, "UPDATE", "ForumThread", threadID,
                $"Title: {oldTitle}",
                $"Title: {updated.Title}");

            var full = await _forumRepo.GetThreadByIDAsync(threadID);
            return (MapThreadToDto(full!), null);
        }

        public async Task<(bool Success, string Message)> DeleteThreadAsync(int threadID, int userID, string role)
        {
            var thread = await _forumRepo.GetThreadByIDAsync(threadID);
            if (thread == null)
                return (false, "Thread not found.");

            if (role != "Admin" && thread.UserID != userID)
                return (false, "You are not authorized to delete this thread.");

            var title = thread.Title;
            var replyCount = thread.Replies.Count;

            await _auditService.LogAsync(
                userID, "DELETE", "ForumThread", threadID,
                $"Thread '{title}' with {replyCount} replies deleted", null);

            var deleted = await _forumRepo.DeleteThreadAsync(threadID);
            if (!deleted)
                return (false, "Failed to delete thread.");

            return (true, $"Thread '{title}' and its {replyCount} replies deleted successfully.");
        }

        public async Task<(ForumReplyDto? Reply, string? Error)> CreateReplyAsync(int threadID, int userID, CreateForumReplyDto dto)
        {
            if (!await _forumRepo.ThreadExistsAsync(threadID))
                return (null, "Thread not found.");

            if (dto.Content.Trim().Length == 0)
                return (null, "Reply content cannot be empty.");

            var reply = new ForumReply
            {
                ThreadID = threadID,
                UserID = userID,
                Content = dto.Content.Trim(),
                Upvotes = 0,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _forumRepo.CreateReplyAsync(reply);

            await _auditService.LogAsync(
                userID, "INSERT", "ForumReply", created.ReplyID,
                null, $"Reply added to Thread {threadID}");

            var full = await _forumRepo.GetReplyByIDAsync(created.ReplyID);
            return (MapReplyToDto(full!), null);
        }

        public async Task<(ForumReplyDto? Reply, string? Error)> UpdateReplyAsync(int replyID, int userID, string role, UpdateForumReplyDto dto)
        {
            var reply = await _forumRepo.GetReplyByIDAsync(replyID);
            if (reply == null)
                return (null, "Reply not found.");

            if (reply.UserID != userID)
                return (null, "You are not authorized to update this reply.");

            if (dto.Content.Trim().Length == 0)
                return (null, "Reply content cannot be empty.");

            var updated = await _forumRepo.UpdateReplyAsync(replyID, r =>
            {
                r.Content = dto.Content.Trim();
            });

            if (updated == null)
                return (null, "Failed to update reply.");

            await _auditService.LogAsync(
                userID, "UPDATE", "ForumReply", replyID,
                "Content updated", $"New content length: {dto.Content.Length} chars");

            var full = await _forumRepo.GetReplyByIDAsync(replyID);
            return (MapReplyToDto(full!), null);
        }

        public async Task<(bool Success, string Message)> DeleteReplyAsync(int replyID, int userID, string role)
        {
            var reply = await _forumRepo.GetReplyByIDAsync(replyID);
            if (reply == null)
                return (false, "Reply not found.");

            if (role != "Admin" && reply.UserID != userID)
                return (false, "You are not authorized to delete this reply.");

            await _auditService.LogAsync(
                userID, "DELETE", "ForumReply", replyID,
                $"Reply deleted from Thread {reply.ThreadID}", null);

            var deleted = await _forumRepo.DeleteReplyAsync(replyID);
            if (!deleted)
                return (false, "Failed to delete reply.");

            return (true, "Reply deleted successfully.");
        }

        public async Task<(bool Success, string Message)> UpvoteReplyAsync(int replyID, int userID)
        {
            var reply = await _forumRepo.GetReplyByIDAsync(replyID);
            if (reply == null)
                return (false, "Reply not found.");

            if (reply.UserID == userID)
                return (false, "You cannot upvote your own reply.");

            var success = await _forumRepo.UpvoteReplyAsync(replyID);
            if (!success)
                return (false, "Failed to upvote reply.");

            return (true, "Reply upvoted successfully.");
        }

        private ForumThreadDto MapThreadToDto(ForumThread t) => new ForumThreadDto
        {
            ThreadID = t.ThreadID,
            UserID = t.UserID,
            AuthorName = t.User?.Person != null
                ? $"{t.User.Person.FirstName} {t.User.Person.LastName}"
                : "Unknown",
            Title = t.Title,
            Content = t.Content,
            Category = t.Category?.Value,
            ReplyCount = t.Replies?.Count ?? 0,
            CreatedAt = t.CreatedAt
        };

        private ForumReplyDto MapReplyToDto(ForumReply r) => new ForumReplyDto
        {
            ReplyID = r.ReplyID,
            UserID = r.UserID,
            AuthorName = r.User?.Person != null
                ? $"{r.User.Person.FirstName} {r.User.Person.LastName}"
                : "Unknown",
            Content = r.Content,
            Upvotes = r.Upvotes,
            CreatedAt = r.CreatedAt
        };
    }
}

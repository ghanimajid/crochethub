using CrochetHub.Data;
using CrochetHub.Models;
using CrochetHub.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CrochetHub.Repositories
{
    public class ForumRepository : IForumRepository
    {
        private readonly AppDbContext _context;

        public ForumRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ForumThread>> GetAllThreadsAsync(string? category, string? search)
        {
            var query = _context.ForumThreads
                .Include(t => t.User)
                    .ThenInclude(u => u!.Person)
                .Include(t => t.Category)
                .Include(t => t.Replies)
                .AsQueryable();

            if (!string.IsNullOrEmpty(category))
                query = query.Where(t => t.Category != null && t.Category.Value == category);

            if (!string.IsNullOrEmpty(search))
                query = query.Where(t => t.Title.Contains(search) ||
                    (t.Content != null && t.Content.Contains(search)));

            return await query
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task<ForumThread?> GetThreadByIDAsync(int threadID)
        {
            return await _context.ForumThreads
                .Include(t => t.User)
                    .ThenInclude(u => u!.Person)
                .Include(t => t.Category)
                .Include(t => t.Replies)
                    .ThenInclude(r => r.User)
                        .ThenInclude(u => u!.Person)
                .FirstOrDefaultAsync(t => t.ThreadID == threadID);
        }

        public async Task<ForumThread> CreateThreadAsync(ForumThread thread)
        {
            _context.ForumThreads.Add(thread);
            await _context.SaveChangesAsync();
            return thread;
        }

        public async Task<ForumThread?> UpdateThreadAsync(int threadID, Action<ForumThread> updateAction)
        {
            var thread = await _context.ForumThreads.FindAsync(threadID);
            if (thread == null) return null;

            updateAction(thread);
            await _context.SaveChangesAsync();
            return thread;
        }

        public async Task<bool> DeleteThreadAsync(int threadID)
        {
            var thread = await _context.ForumThreads.FindAsync(threadID);
            if (thread == null) return false;

            _context.ForumThreads.Remove(thread);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<ForumReply?> GetReplyByIDAsync(int replyID)
        {
            return await _context.ForumReplies
                .Include(r => r.User)
                    .ThenInclude(u => u!.Person)
                .Include(r => r.Thread)
                .FirstOrDefaultAsync(r => r.ReplyID == replyID);
        }

        public async Task<ForumReply> CreateReplyAsync(ForumReply reply)
        {
            _context.ForumReplies.Add(reply);
            await _context.SaveChangesAsync();
            return reply;
        }

        public async Task<ForumReply?> UpdateReplyAsync(int replyID, Action<ForumReply> updateAction)
        {
            var reply = await _context.ForumReplies.FindAsync(replyID);
            if (reply == null) return null;

            updateAction(reply);
            await _context.SaveChangesAsync();
            return reply;
        }

        public async Task<bool> DeleteReplyAsync(int replyID)
        {
            var reply = await _context.ForumReplies.FindAsync(replyID);
            if (reply == null) return false;

            _context.ForumReplies.Remove(reply);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpvoteReplyAsync(int replyID)
        {
            var reply = await _context.ForumReplies.FindAsync(replyID);
            if (reply == null) return false;

            reply.Upvotes += 1;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ThreadExistsAsync(int threadID) =>
            await _context.ForumThreads.AnyAsync(t => t.ThreadID == threadID);
    }
}

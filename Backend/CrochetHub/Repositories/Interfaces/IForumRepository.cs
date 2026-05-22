using CrochetHub.Models;

namespace CrochetHub.Repositories.Interfaces
{
    public interface IForumRepository
    {
        Task<List<ForumThread>> GetAllThreadsAsync(string? category, string? search);
        Task<ForumThread?> GetThreadByIDAsync(int threadID);
        Task<ForumThread> CreateThreadAsync(ForumThread thread);
        Task<ForumThread?> UpdateThreadAsync(int threadID, Action<ForumThread> updateAction);
        Task<bool> DeleteThreadAsync(int threadID);
        Task<ForumReply?> GetReplyByIDAsync(int replyID);
        Task<ForumReply> CreateReplyAsync(ForumReply reply);
        Task<ForumReply?> UpdateReplyAsync(int replyID, Action<ForumReply> updateAction);
        Task<bool> DeleteReplyAsync(int replyID);
        Task<bool> UpvoteReplyAsync(int replyID);
        Task<bool> ThreadExistsAsync(int threadID);
    }
}

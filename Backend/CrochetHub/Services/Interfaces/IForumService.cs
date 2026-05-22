using CrochetHub.DTOs.Forum;

namespace CrochetHub.Services.Interfaces
{
    public interface IForumService
    {
        Task<List<ForumThreadDto>> GetAllThreadsAsync(string? category, string? search);
        Task<ForumThreadDetailDto?> GetThreadByIDAsync(int threadID);
        Task<(ForumThreadDto? Thread, string? Error)> CreateThreadAsync(int userID, CreateForumThreadDto dto);
        Task<(ForumThreadDto? Thread, string? Error)> UpdateThreadAsync(int threadID, int userID, string role, UpdateForumThreadDto dto);
        Task<(bool Success, string Message)> DeleteThreadAsync(int threadID, int userID, string role);
        Task<(ForumReplyDto? Reply, string? Error)> CreateReplyAsync(int threadID, int userID, CreateForumReplyDto dto);
        Task<(ForumReplyDto? Reply, string? Error)> UpdateReplyAsync(int replyID, int userID, string role, UpdateForumReplyDto dto);
        Task<(bool Success, string Message)> DeleteReplyAsync(int replyID, int userID, string role);
        Task<(bool Success, string Message)> UpvoteReplyAsync(int replyID, int userID);
    }
}

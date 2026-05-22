namespace CrochetHub.DTOs.Forum
{
    public class ForumThreadDto
    {
        public int ThreadID { get; set; }
        public int UserID { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Content { get; set; }
        public string? Category { get; set; }
        public int ReplyCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

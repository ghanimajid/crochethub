namespace CrochetHub.DTOs.Forum
{
    public class ForumReplyDto
    {
        public int ReplyID { get; set; }
        public int UserID { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int Upvotes { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

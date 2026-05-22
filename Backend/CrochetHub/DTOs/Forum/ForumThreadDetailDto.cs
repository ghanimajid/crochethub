namespace CrochetHub.DTOs.Forum
{
    public class ForumThreadDetailDto : ForumThreadDto
    {
        public List<ForumReplyDto> Replies { get; set; } = new();
    }
}

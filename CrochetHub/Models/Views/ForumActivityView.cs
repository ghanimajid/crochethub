using Microsoft.EntityFrameworkCore;

namespace CrochetHub.Models.Views
{
    [Keyless]
    public class ForumActivityView
    {
        public int UserID { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public int ThreadsCreated { get; set; }
        public int RepliesPosted { get; set; }
        public int TotalUpvotes { get; set; }
        public decimal AvgUpvotesPerReply { get; set; }
    }
}

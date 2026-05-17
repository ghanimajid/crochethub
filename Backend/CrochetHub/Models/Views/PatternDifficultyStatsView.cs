using Microsoft.EntityFrameworkCore;

namespace CrochetHub.Models.Views
{
    [Keyless]
    public class PatternDifficultyStatsView
    {
        public string DifficultyLevel { get; set; } = string.Empty;
        public int PatternCount { get; set; }
        public decimal? AvgRating { get; set; }
        public int CreatorCount { get; set; }
    }
}

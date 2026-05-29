namespace CrochetHub.DTOs.Favorite
{
    public class FavouritePatternDto
    {
        public class FavoritePatternDto
        {
            public int PatternID { get; set; }
            public string Title { get; set; } = string.Empty;
            public string? Description { get; set; }
            public string? Difficulty { get; set; }
            public string CreatorName { get; set; } = string.Empty;
            public double AverageRating { get; set; }
            public int TotalReviews { get; set; }
            public DateTime SavedAt { get; set; }
        }
    }
}

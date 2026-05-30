namespace CrochetHub.DTOs.Report
{

    // admin dtos
    public record PlatformStatsDto(
        int TotalUsers,
        int Students,
        int Instructors,
        int Admins,
        int TotalCourses,
        int TotalPatterns,
        int TotalEnrollments,
        int TotalThreads,
        int TotalReplies,
        int TotalReviews);

    public record UserGrowthItemDto(
        int Year,
        int Month,
        string Role,
        int Count);

    public record ForumActivityItemDto(
        string ThreadTitle,
        string AuthorName,
        string Category,
        int ReplyCount,
        int TotalUpvotes,
        DateTime CreatedAt);

    public record TopContributorDto(
        string UserName,
        int ThreadsCount,
        int RepliesCount,
        int TotalUpvotes);

    public record CourseAuditItemDto(
        string Title,
        string InstructorName,
        string? Difficulty,
        int EnrolledCount,
        double AvgRating,
        int ReviewCount,
        DateTime CreatedAt);

    public record PatternAuditItemDto(
        string Title,
        string CreatorName,
        string? Difficulty,
        int FavoriteCount,
        double AvgRating,
        int ReviewCount,
        DateTime CreatedAt);

    // instructor dtos
    public record CoursePerformanceItemDto(
        string CourseTitle,
        string? Difficulty,
        int EnrolledCount,
        double AvgCompletion,
        double AvgRating,
        int ReviewCount);

    public record StudentProgressItemDto(
        string StudentName,
        string CourseTitle,
        double CompletionPercentage,
        DateTime EnrolledAt);

    public record LessonEngagementItemDto(
        string CourseTitle,
        string LessonTitle,
        int LessonOrder,
        int CompletedCount,
        int TotalEnrolled,
        double AvgTimeMinutes);

    public record PopularPatternItemDto(
        string Title,
        double AvgRating,
        int ReviewCount,
        int FavoriteCount,
        DateTime CreatedAt);

    public record PopularCourseItemDto(
        string Title,
        int EnrolledCount,
        double AvgRating,
        double AvgCompletion);

    // students
    public record MyLearningItemDto(
        string CourseTitle,
        string InstructorName,
        string? Difficulty,
        double CompletionPercentage,
        DateTime EnrolledAt);

    public record MyProgressItemDto(
        string CourseTitle,
        string LessonTitle,
        int LessonOrder,
        bool Completed,
        DateTime? CompletedAt,
        int? TimeSpent);

    public record MyPatternItemDto(
        string Title,
        string? Difficulty,
        double AvgRating,
        int ReviewCount,
        int FavoriteCount,
        DateTime CreatedAt);

    public record ActivitySummaryItemDto(
        int ForumThreads,
        int ForumReplies,
        int CourseReviews,
        int PatternReviews,
        int CoursesEnrolled,
        int PatternsCreated,
        int PatternsFavorited);
}

namespace CrochetHub.Services.Interfaces
{
    public interface IReportService
    {
        // Admin reports
        Task<byte[]> GeneratePlatformOverviewAsync();
        Task<byte[]> GenerateUserGrowthAsync();
        Task<byte[]> GenerateForumActivityAsync();
        Task<byte[]> GenerateContentAuditAsync();

        // Instructor reports
        Task<byte[]> GenerateCoursePerformanceAsync(int instructorID);
        Task<byte[]> GenerateStudentProgressReportAsync(int instructorID);
        Task<byte[]> GenerateLessonEngagementAsync(int instructorID);
        Task<byte[]> GeneratePopularityReportAsync(int instructorID);

        // Student reports
        Task<byte[]> GenerateMyLearningAsync(int studentID);
        Task<byte[]> GenerateMyProgressAsync(int studentID);
        Task<byte[]> GenerateMyPatternsAsync(int studentID);
        Task<byte[]> GenerateActivitySummaryAsync(int studentID);

        // Certificates
        Task<(byte[]? Pdf, string? Error)> GenerateCourseCompletionCertAsync(int studentID, int courseID);
        Task<(byte[]? Pdf, string? Error)> GenerateInstructorAchievementCertAsync(int instructorID);
        Task<(byte[]? Pdf, string? Error)> GenerateTopContributorCertAsync(int userID);
    }
}

using CrochetHub.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CrochetHub.Controllers
{
    public class ReportController : BaseApiController
    {
        private readonly IReportService _reportService;

        public ReportController(IReportService reportService)
        {
            _reportService = reportService;
        }


        [HttpGet("admin/platform-overview")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PlatformOverview()
        {
            var pdf = await _reportService.GeneratePlatformOverviewAsync();
            return File(pdf, "application/pdf",
                $"CrochetHub_Platform_Overview_{DateTime.Now:yyyyMMdd}.pdf");
        }

        [HttpGet("admin/user-growth")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UserGrowth()
        {
            var pdf = await _reportService.GenerateUserGrowthAsync();
            return File(pdf, "application/pdf",
                $"CrochetHub_User_Growth_{DateTime.Now:yyyyMMdd}.pdf");
        }

        [HttpGet("admin/forum-activity")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ForumActivity()
        {
            var pdf = await _reportService.GenerateForumActivityAsync();
            return File(pdf, "application/pdf",
                $"CrochetHub_Forum_Activity_{DateTime.Now:yyyyMMdd}.pdf");
        }

        [HttpGet("admin/content-audit")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ContentAudit()
        {
            var pdf = await _reportService.GenerateContentAuditAsync();
            return File(pdf, "application/pdf",
                $"CrochetHub_Content_Audit_{DateTime.Now:yyyyMMdd}.pdf");
        }

        [HttpGet("instructor/course-performance")]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> CoursePerformance()
        {
            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var pdf = await _reportService.GenerateCoursePerformanceAsync(userID.Value);
            return File(pdf, "application/pdf",
                $"CrochetHub_Course_Performance_{DateTime.Now:yyyyMMdd}.pdf");
        }

        [HttpGet("instructor/student-progress")]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> StudentProgressReport()
        {
            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var pdf = await _reportService.GenerateStudentProgressReportAsync(userID.Value);
            return File(pdf, "application/pdf",
                $"CrochetHub_Student_Progress_{DateTime.Now:yyyyMMdd}.pdf");
        }

        [HttpGet("instructor/lesson-engagement")]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> LessonEngagement()
        {
            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var pdf = await _reportService.GenerateLessonEngagementAsync(userID.Value);
            return File(pdf, "application/pdf",
                $"CrochetHub_Lesson_Engagement_{DateTime.Now:yyyyMMdd}.pdf");
        }

        [HttpGet("instructor/popularity")]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> PopularityReport()
        {
            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var pdf = await _reportService.GeneratePopularityReportAsync(userID.Value);
            return File(pdf, "application/pdf",
                $"CrochetHub_Popularity_{DateTime.Now:yyyyMMdd}.pdf");
        }


        [HttpGet("student/my-learning")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> MyLearning()
        {
            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var pdf = await _reportService.GenerateMyLearningAsync(userID.Value);
            return File(pdf, "application/pdf",
                $"CrochetHub_My_Learning_{DateTime.Now:yyyyMMdd}.pdf");
        }

        [HttpGet("student/my-progress")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> MyProgress()
        {
            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var pdf = await _reportService.GenerateMyProgressAsync(userID.Value);
            return File(pdf, "application/pdf",
                $"CrochetHub_My_Progress_{DateTime.Now:yyyyMMdd}.pdf");
        }

        [HttpGet("student/my-patterns")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> MyPatterns()
        {
            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var pdf = await _reportService.GenerateMyPatternsAsync(userID.Value);
            return File(pdf, "application/pdf",
                $"CrochetHub_My_Patterns_{DateTime.Now:yyyyMMdd}.pdf");
        }

        [HttpGet("student/activity-summary")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> ActivitySummary()
        {
            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var pdf = await _reportService.GenerateActivitySummaryAsync(userID.Value);
            return File(pdf, "application/pdf",
                $"CrochetHub_Activity_Summary_{DateTime.Now:yyyyMMdd}.pdf");
        }


        [HttpGet("certificate/course-completion/{courseID}")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> CourseCompletionCert(int courseID)
        {
            if (courseID <= 0)
                return BadRequest(new { message = "Invalid course ID." });

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (pdf, error) = await _reportService.GenerateCourseCompletionCertAsync(userID.Value, courseID);
            if (error != null)
                return BadRequest(new { message = error });

            return File(pdf!, "application/pdf",
                $"CrochetHub_Certificate_Completion_{courseID}_{DateTime.Now:yyyyMMdd}.pdf");
        }

        [HttpGet("certificate/instructor-achievement")]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> InstructorAchievementCert()
        {
            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (pdf, error) = await _reportService.GenerateInstructorAchievementCertAsync(userID.Value);
            if (error != null)
                return BadRequest(new { message = error });

            return File(pdf!, "application/pdf",
                $"CrochetHub_Instructor_Achievement_{DateTime.Now:yyyyMMdd}.pdf");
        }

        [HttpGet("certificate/top-contributor/{targetUserID}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> TopContributorCert(int targetUserID)
        {
            if (targetUserID <= 0)
                return BadRequest(new { message = "Invalid user ID." });

            var (pdf, error) = await _reportService.GenerateTopContributorCertAsync(targetUserID);
            if (error != null)
                return BadRequest(new { message = error });

            return File(pdf!, "application/pdf",
                $"CrochetHub_Top_Contributor_{targetUserID}_{DateTime.Now:yyyyMMdd}.pdf");
        }
    }
}

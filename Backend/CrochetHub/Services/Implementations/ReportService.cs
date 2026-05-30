using CrochetHub.Data;
using CrochetHub.DTOs.Report;
using CrochetHub.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace CrochetHub.Services.Implementations
{
    public class ReportService : IReportService
    {
        private readonly AppDbContext _context;

        public ReportService(AppDbContext context)
        {
            _context = context;
        }

        // admin reports
        public async Task<byte[]> GeneratePlatformOverviewAsync()
        {
            var allUsers = await _context.Users
                .Include(u => u.Role)
                .ToListAsync();

            var stats = new PlatformStatsDto(
                TotalUsers: allUsers.Count,
                Students: allUsers.Count(u => u.Role?.Value == "Student"),
                Instructors: allUsers.Count(u => u.Role?.Value == "Instructor"),
                Admins: allUsers.Count(u => u.Role?.Value == "Admin"),
                TotalCourses: await _context.Courses.CountAsync(),
                TotalPatterns: await _context.Patterns.CountAsync(),
                TotalEnrollments: await _context.CourseEnrollments.CountAsync(),
                TotalThreads: await _context.ForumThreads.CountAsync(),
                TotalReplies: await _context.ForumReplies.CountAsync(),
                TotalReviews: await _context.CourseReviews.CountAsync()
                                + await _context.PatternReviews.CountAsync()
            );

            var topCourses = await _context.Courses
                .Include(c => c.Enrollments)
                .Include(c => c.Reviews)
                .OrderByDescending(c => c.Enrollments.Count)
                .Take(5)
                .Select(c => new
                {
                    c.Title,
                    EnrolledCount = c.Enrollments.Count,
                    AvgRating = c.Reviews.Any()
                        ? c.Reviews.Average(r => (double)r.Rating) : 0.0
                })
                .ToListAsync();

            return BuildDocument("Platform Overview Report", col =>
            {
                col.Item().PaddingBottom(10).Text("Platform Summary").SemiBold().FontSize(13);
                col.Item().Table(table =>
                {
                    table.ColumnsDefinition(c => { for (int i = 0; i < 4; i++) c.RelativeColumn(); });
                    void Card(string label, string value)
                    {
                        table.Cell().Border(1).BorderColor(Colors.Purple.Lighten3)
                            .Background(Colors.Purple.Lighten5).Padding(8).Column(cc =>
                            {
                                cc.Item().Text(value).Bold().FontSize(22).FontColor(Colors.Purple.Medium);
                                cc.Item().Text(label).FontSize(9).FontColor(Colors.Grey.Darken1);
                            });
                    }
                    Card("Total Users", stats.TotalUsers.ToString());
                    Card("Students", stats.Students.ToString());
                    Card("Instructors", stats.Instructors.ToString());
                    Card("Admins", stats.Admins.ToString());
                    Card("Courses", stats.TotalCourses.ToString());
                    Card("Patterns", stats.TotalPatterns.ToString());
                    Card("Enrollments", stats.TotalEnrollments.ToString());
                    Card("Forum Threads", stats.TotalThreads.ToString());
                    Card("Forum Replies", stats.TotalReplies.ToString());
                    Card("Total Reviews", stats.TotalReviews.ToString());
                });

                col.Item().PaddingTop(18).PaddingBottom(6)
                    .Text("Top 5 Courses by Enrollment").SemiBold().FontSize(12);
                col.Item().Table(table =>
                {
                    table.ColumnsDefinition(c =>
                    {
                        c.RelativeColumn(4); c.RelativeColumn(1); c.RelativeColumn(1);
                    });
                    table.Header(h =>
                    {
                        foreach (var label in new[] { "Course Title", "Enrolled", "Avg Rating" })
                            h.Cell().Background(Colors.Purple.Lighten3).Padding(5)
                                .Text(label).SemiBold().FontSize(10);
                    });
                    bool alt = false;
                    foreach (var c in topCourses)
                    {
                        var bg = alt ? Colors.Grey.Lighten4 : Colors.White;
                        table.Cell().Background(bg).Padding(5).Text(c.Title);
                        table.Cell().Background(bg).Padding(5).Text(c.EnrolledCount.ToString());
                        table.Cell().Background(bg).Padding(5)
                            .Text(c.AvgRating > 0 ? $"{c.AvgRating:F1}" : "—");
                        alt = !alt;
                    }
                });
            }).GeneratePdf();
        }

        public async Task<byte[]> GenerateUserGrowthAsync()
        {
            var growth = _context.Users
                .Include(u => u.Role)
                .AsEnumerable()
                .GroupBy(u => new
                {
                    u.CreatedAt.Year,
                    u.CreatedAt.Month,
                    Role = u.Role?.Value ?? "Unknown"
                })
                .Select(g => new UserGrowthItemDto(g.Key.Year, g.Key.Month, g.Key.Role, g.Count()))
                .OrderBy(g => g.Year).ThenBy(g => g.Month).ThenBy(g => g.Role)
                .ToList();

            return BuildDocument("User Growth Report", col =>
            {
                col.Item().PaddingBottom(8)
                    .Text($"Total Records: {growth.Count}").FontSize(10).FontColor(Colors.Grey.Darken1);
                col.Item().Table(table =>
                {
                    table.ColumnsDefinition(c =>
                    {
                        c.RelativeColumn(2); c.RelativeColumn(2); c.RelativeColumn(2); c.RelativeColumn(1);
                    });
                    table.Header(h =>
                    {
                        foreach (var label in new[] { "Year", "Month", "Role", "New Users" })
                            h.Cell().Background(Colors.Purple.Lighten3).Padding(5)
                                .Text(label).SemiBold().FontSize(10);
                    });
                    bool alt = false;
                    foreach (var item in growth)
                    {
                        var bg = alt ? Colors.Grey.Lighten4 : Colors.White;
                        table.Cell().Background(bg).Padding(5).Text(item.Year.ToString());
                        table.Cell().Background(bg).Padding(5)
                            .Text(System.Globalization.CultureInfo.CurrentCulture
                                .DateTimeFormat.GetMonthName(item.Month));
                        table.Cell().Background(bg).Padding(5).Text(item.Role);
                        table.Cell().Background(bg).Padding(5).Text(item.Count.ToString());
                        alt = !alt;
                    }
                });
            }).GeneratePdf();
        }

        public async Task<byte[]> GenerateForumActivityAsync()
        {
            var threads = await _context.ForumThreads
                .Include(t => t.User).ThenInclude(u => u!.Person)
                .Include(t => t.Category)
                .Include(t => t.Replies)
                .OrderByDescending(t => t.Replies.Count)
                .Take(20)
                .ToListAsync();

            var threadDtos = threads.Select(t => new ForumActivityItemDto(
                t.Title,
                t.User?.Person != null
                    ? $"{t.User.Person.FirstName} {t.User.Person.LastName}" : "Unknown",
                t.Category?.Value ?? "General",
                t.Replies.Count,
                t.Replies.Sum(r => r.Upvotes),
                t.CreatedAt)).ToList();

            var contributors = await _context.Users
                .Include(u => u.Person)
                .Include(u => u.ForumThreads)
                .Include(u => u.ForumReplies)
                .Where(u => u.ForumThreads.Any() || u.ForumReplies.Any())
                .ToListAsync();

            var topContributors = contributors
                .Select(u => new TopContributorDto(
                    u.Person != null ? $"{u.Person.FirstName} {u.Person.LastName}" : "Unknown",
                    u.ForumThreads.Count,
                    u.ForumReplies.Count,
                    u.ForumReplies.Sum(r => r.Upvotes)))
                .OrderByDescending(x => x.ThreadsCount + x.RepliesCount)
                .Take(10)
                .ToList();

            return BuildDocument("Forum Activity Report", col =>
            {
                col.Item().PaddingBottom(6).Text("Top 20 Threads by Replies").SemiBold().FontSize(12);
                col.Item().Table(table =>
                {
                    table.ColumnsDefinition(c =>
                    {
                        c.RelativeColumn(4); c.RelativeColumn(2); c.RelativeColumn(2);
                        c.RelativeColumn(1); c.RelativeColumn(1);
                    });
                    table.Header(h =>
                    {
                        foreach (var label in new[] { "Thread Title", "Author", "Category", "Replies", "Upvotes" })
                            h.Cell().Background(Colors.Purple.Lighten3).Padding(5)
                                .Text(label).SemiBold().FontSize(9);
                    });
                    bool alt = false;
                    foreach (var t in threadDtos)
                    {
                        var bg = alt ? Colors.Grey.Lighten4 : Colors.White;
                        table.Cell().Background(bg).Padding(5).Text(t.ThreadTitle).FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(t.AuthorName).FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(t.Category).FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(t.ReplyCount.ToString()).FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(t.TotalUpvotes.ToString()).FontSize(9);
                        alt = !alt;
                    }
                });

                col.Item().PaddingTop(18).PaddingBottom(6).Text("Top 10 Contributors").SemiBold().FontSize(12);
                col.Item().Table(table =>
                {
                    table.ColumnsDefinition(c =>
                    {
                        c.RelativeColumn(3); c.RelativeColumn(1); c.RelativeColumn(1); c.RelativeColumn(1);
                    });
                    table.Header(h =>
                    {
                        foreach (var label in new[] { "User", "Threads", "Replies", "Upvotes" })
                            h.Cell().Background(Colors.Purple.Lighten3).Padding(5)
                                .Text(label).SemiBold().FontSize(10);
                    });
                    bool alt = false;
                    foreach (var u in topContributors)
                    {
                        var bg = alt ? Colors.Grey.Lighten4 : Colors.White;
                        table.Cell().Background(bg).Padding(5).Text(u.UserName);
                        table.Cell().Background(bg).Padding(5).Text(u.ThreadsCount.ToString());
                        table.Cell().Background(bg).Padding(5).Text(u.RepliesCount.ToString());
                        table.Cell().Background(bg).Padding(5).Text(u.TotalUpvotes.ToString());
                        alt = !alt;
                    }
                });
            }).GeneratePdf();
        }

        public async Task<byte[]> GenerateContentAuditAsync()
        {
            var courses = await _context.Courses
                .Include(c => c.Instructor).ThenInclude(i => i!.User).ThenInclude(u => u!.Person)
                .Include(c => c.Difficulty)
                .Include(c => c.Enrollments)
                .Include(c => c.Reviews)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            var courseDtos = courses.Select(c => new CourseAuditItemDto(
                c.Title,
                c.Instructor?.User?.Person != null
                    ? $"{c.Instructor.User.Person.FirstName} {c.Instructor.User.Person.LastName}"
                    : "Unknown",
                c.Difficulty?.Value,
                c.Enrollments.Count,
                c.Reviews.Any() ? Math.Round(c.Reviews.Average(r => (double)r.Rating), 1) : 0,
                c.Reviews.Count,
                c.CreatedAt)).ToList();

            var patterns = await _context.Patterns
                .Include(p => p.Creator).ThenInclude(u => u!.Person)
                .Include(p => p.Difficulty)
                .Include(p => p.Reviews)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            var patternIDs = patterns.Select(p => p.PatternID).ToList();
            var favoriteCounts = await _context.UserFavoritePatterns
                .Where(f => patternIDs.Contains(f.PatternID))
                .GroupBy(f => f.PatternID)
                .Select(g => new { PatternID = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.PatternID, x => x.Count);

            var patternDtos = patterns.Select(p => new PatternAuditItemDto(
                p.Title,
                p.Creator?.Person != null
                    ? $"{p.Creator.Person.FirstName} {p.Creator.Person.LastName}" : "Unknown",
                p.Difficulty?.Value,
                favoriteCounts.GetValueOrDefault(p.PatternID, 0),
                p.Reviews.Any() ? Math.Round(p.Reviews.Average(r => (double)r.Rating), 1) : 0,
                p.Reviews.Count,
                p.CreatedAt)).ToList();

            return BuildDocument("Content Audit Report", col =>
            {
                col.Item().PaddingBottom(6)
                    .Text($"Courses ({courseDtos.Count} total)").SemiBold().FontSize(12);
                col.Item().Table(table =>
                {
                    table.ColumnsDefinition(c =>
                    {
                        c.RelativeColumn(3); c.RelativeColumn(2); c.RelativeColumn(1);
                        c.RelativeColumn(1); c.RelativeColumn(1); c.RelativeColumn(1);
                    });
                    table.Header(h =>
                    {
                        foreach (var label in new[] { "Title", "Instructor", "Difficulty", "Enrolled", "Avg Rating", "Reviews" })
                            h.Cell().Background(Colors.Purple.Lighten3).Padding(5)
                                .Text(label).SemiBold().FontSize(9);
                    });
                    bool alt = false;
                    foreach (var c in courseDtos)
                    {
                        var bg = alt ? Colors.Grey.Lighten4 : Colors.White;
                        table.Cell().Background(bg).Padding(5).Text(c.Title).FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(c.InstructorName).FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(c.Difficulty ?? "—").FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(c.EnrolledCount.ToString()).FontSize(9);
                        table.Cell().Background(bg).Padding(5)
                            .Text(c.AvgRating > 0 ? $"{c.AvgRating:F1}" : "—").FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(c.ReviewCount.ToString()).FontSize(9);
                        alt = !alt;
                    }
                });

                col.Item().PaddingTop(18).PaddingBottom(6)
                    .Text($"Patterns ({patternDtos.Count} total)").SemiBold().FontSize(12);
                col.Item().Table(table =>
                {
                    table.ColumnsDefinition(c =>
                    {
                        c.RelativeColumn(3); c.RelativeColumn(2); c.RelativeColumn(1);
                        c.RelativeColumn(1); c.RelativeColumn(1); c.RelativeColumn(1);
                    });
                    table.Header(h =>
                    {
                        foreach (var label in new[] { "Title", "Creator", "Difficulty", "Favorites", "Avg Rating", "Reviews" })
                            h.Cell().Background(Colors.Purple.Lighten3).Padding(5)
                                .Text(label).SemiBold().FontSize(9);
                    });
                    bool alt = false;
                    foreach (var p in patternDtos)
                    {
                        var bg = alt ? Colors.Grey.Lighten4 : Colors.White;
                        table.Cell().Background(bg).Padding(5).Text(p.Title).FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(p.CreatorName).FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(p.Difficulty ?? "—").FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(p.FavoriteCount.ToString()).FontSize(9);
                        table.Cell().Background(bg).Padding(5)
                            .Text(p.AvgRating > 0 ? $"{p.AvgRating:F1}" : "—").FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(p.ReviewCount.ToString()).FontSize(9);
                        alt = !alt;
                    }
                });
            }).GeneratePdf();
        }

        // instructor reports

        public async Task<byte[]> GenerateCoursePerformanceAsync(int instructorID)
        {
            var courses = await _context.Courses
                .Include(c => c.Difficulty)
                .Include(c => c.Enrollments)
                .Include(c => c.Reviews)
                .Where(c => c.InstructorID == instructorID)
                .OrderByDescending(c => c.Enrollments.Count)
                .ToListAsync();

            var courseDtos = courses.Select(c => new CoursePerformanceItemDto(
                c.Title,
                c.Difficulty?.Value,
                c.Enrollments.Count,
                c.Enrollments.Any()
                    ? Math.Round(c.Enrollments.Average(e => (double)e.CompletionPercentage), 1) : 0,
                c.Reviews.Any()
                    ? Math.Round(c.Reviews.Average(r => (double)r.Rating), 1) : 0,
                c.Reviews.Count)).ToList();

            var instructor = await _context.Users
                .Include(u => u.Person)
                .FirstOrDefaultAsync(u => u.UserID == instructorID);
            var instructorName = instructor?.Person != null
                ? $"{instructor.Person.FirstName} {instructor.Person.LastName}" : "Instructor";

            return BuildDocument($"Course Performance Report — {instructorName}", col =>
            {
                col.Item().PaddingBottom(8)
                    .Text($"Total Courses: {courseDtos.Count}").FontSize(10).FontColor(Colors.Grey.Darken1);
                col.Item().Table(table =>
                {
                    table.ColumnsDefinition(c =>
                    {
                        c.RelativeColumn(3); c.RelativeColumn(1); c.RelativeColumn(1);
                        c.RelativeColumn(1); c.RelativeColumn(1); c.RelativeColumn(1);
                    });
                    table.Header(h =>
                    {
                        foreach (var label in new[] { "Course Title", "Difficulty", "Enrolled", "Avg Completion %", "Avg Rating", "Reviews" })
                            h.Cell().Background(Colors.Purple.Lighten3).Padding(5)
                                .Text(label).SemiBold().FontSize(9);
                    });
                    bool alt = false;
                    foreach (var c in courseDtos)
                    {
                        var bg = alt ? Colors.Grey.Lighten4 : Colors.White;
                        table.Cell().Background(bg).Padding(5).Text(c.CourseTitle).FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(c.Difficulty ?? "—").FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(c.EnrolledCount.ToString()).FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text($"{c.AvgCompletion}%").FontSize(9);
                        table.Cell().Background(bg).Padding(5)
                            .Text(c.AvgRating > 0 ? $"{c.AvgRating:F1}" : "—").FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(c.ReviewCount.ToString()).FontSize(9);
                        alt = !alt;
                    }
                });
            }).GeneratePdf();
        }

        public async Task<byte[]> GenerateStudentProgressReportAsync(int instructorID)
        {
            var data = await _context.CourseEnrollments
                .Include(e => e.Course)
                .Include(e => e.Student)
                    .ThenInclude(s => s!.User)
                        .ThenInclude(u => u!.Person)
                .Where(e => e.Course.InstructorID == instructorID)
                .OrderBy(e => e.Course.Title)
                .ThenBy(e => e.CompletionPercentage)
                .ToListAsync();

            var dtos = data.Select(e => new StudentProgressItemDto(
                e.Student?.User?.Person != null
                    ? $"{e.Student.User.Person.FirstName} {e.Student.User.Person.LastName}" : "Unknown",
                e.Course.Title,
                Math.Round((double)e.CompletionPercentage, 1),
                e.EnrolledAt)).ToList();

            var instructor = await _context.Users.Include(u => u.Person)
                .FirstOrDefaultAsync(u => u.UserID == instructorID);
            var instructorName = instructor?.Person != null
                ? $"{instructor.Person.FirstName} {instructor.Person.LastName}" : "Instructor";

            return BuildDocument($"Student Progress Report — {instructorName}", col =>
            {
                col.Item().PaddingBottom(8)
                    .Text($"Total Enrollments: {dtos.Count}").FontSize(10).FontColor(Colors.Grey.Darken1);
                col.Item().Table(table =>
                {
                    table.ColumnsDefinition(c =>
                    {
                        c.RelativeColumn(2); c.RelativeColumn(3); c.RelativeColumn(1); c.RelativeColumn(2);
                    });
                    table.Header(h =>
                    {
                        foreach (var label in new[] { "Student", "Course", "Completion %", "Enrolled On" })
                            h.Cell().Background(Colors.Purple.Lighten3).Padding(5)
                                .Text(label).SemiBold().FontSize(10);
                    });
                    bool alt = false;
                    foreach (var item in dtos)
                    {
                        var bg = alt ? Colors.Grey.Lighten4 : Colors.White;
                        table.Cell().Background(bg).Padding(5).Text(item.StudentName).FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(item.CourseTitle).FontSize(9);
                        table.Cell().Background(bg).Padding(5)
                            .Text($"{item.CompletionPercentage}%").FontSize(9);
                        table.Cell().Background(bg).Padding(5)
                            .Text(item.EnrolledAt.ToString("dd MMM yyyy")).FontSize(9);
                        alt = !alt;
                    }
                });
            }).GeneratePdf();
        }

        public async Task<byte[]> GenerateLessonEngagementAsync(int instructorID)
        {
            var courseIDs = await _context.Courses
                .Where(c => c.InstructorID == instructorID)
                .Select(c => c.CourseID)
                .ToListAsync();

            var lessons = await _context.Lessons
                .Include(l => l.Course)
                .Include(l => l.StudentProgresses)
                .Where(l => courseIDs.Contains(l.CourseID))
                .OrderBy(l => l.Course.Title).ThenBy(l => l.SequenceOrder)
                .ToListAsync();

            var enrollmentCounts = await _context.CourseEnrollments
                .Where(e => courseIDs.Contains(e.CourseID))
                .GroupBy(e => e.CourseID)
                .Select(g => new { CourseID = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.CourseID, x => x.Count);

            var dtos = lessons.Select(l => new LessonEngagementItemDto(
                l.Course.Title,
                l.Title,
                l.SequenceOrder,
                l.StudentProgresses.Count(sp => sp.Completed),
                enrollmentCounts.GetValueOrDefault(l.CourseID, 0),
                l.StudentProgresses.Any(sp => sp.TimeSpent > 0)
                    ? Math.Round(l.StudentProgresses.Where(sp => sp.TimeSpent > 0)
                        .Average(sp => (double)sp.TimeSpent), 1)
                    : 0)).ToList();

            var instructor = await _context.Users.Include(u => u.Person)
                .FirstOrDefaultAsync(u => u.UserID == instructorID);
            var instructorName = instructor?.Person != null
                ? $"{instructor.Person.FirstName} {instructor.Person.LastName}" : "Instructor";

            return BuildDocument($"Lesson Engagement Report — {instructorName}", col =>
            {
                col.Item().PaddingBottom(8)
                    .Text($"Total Lessons: {dtos.Count}").FontSize(10).FontColor(Colors.Grey.Darken1);
                col.Item().Table(table =>
                {
                    table.ColumnsDefinition(c =>
                    {
                        c.RelativeColumn(2); c.RelativeColumn(2); c.RelativeColumn(1);
                        c.RelativeColumn(1); c.RelativeColumn(1); c.RelativeColumn(1);
                    });
                    table.Header(h =>
                    {
                        foreach (var label in new[] { "Course", "Lesson", "Order", "Completed", "Enrolled", "Avg Time (sec)" })
                            h.Cell().Background(Colors.Purple.Lighten3).Padding(5)
                                .Text(label).SemiBold().FontSize(9);
                    });
                    bool alt = false;
                    foreach (var item in dtos)
                    {
                        var bg = alt ? Colors.Grey.Lighten4 : Colors.White;
                        table.Cell().Background(bg).Padding(5).Text(item.CourseTitle).FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(item.LessonTitle).FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(item.LessonOrder.ToString()).FontSize(9);
                        table.Cell().Background(bg).Padding(5)
                            .Text($"{item.CompletedCount}/{item.TotalEnrolled}").FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(item.TotalEnrolled.ToString()).FontSize(9);
                        table.Cell().Background(bg).Padding(5)
                            .Text(item.AvgTimeMinutes > 0 ? $"{item.AvgTimeMinutes}" : "—").FontSize(9);
                        alt = !alt;
                    }
                });
            }).GeneratePdf();
        }

        public async Task<byte[]> GeneratePopularityReportAsync(int instructorID)
        {
            var patterns = await _context.Patterns
                .Include(p => p.Reviews)
                .Where(p => p.CreatedBy == instructorID)
                .OrderByDescending(p => p.Reviews.Count)
                .ToListAsync();

            var patternIDs = patterns.Select(p => p.PatternID).ToList();
            var favCounts = await _context.UserFavoritePatterns
                .Where(f => patternIDs.Contains(f.PatternID))
                .GroupBy(f => f.PatternID)
                .Select(g => new { PatternID = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.PatternID, x => x.Count);

            var patternDtos = patterns.Select(p => new PopularPatternItemDto(
                p.Title,
                p.Reviews.Any() ? Math.Round(p.Reviews.Average(r => (double)r.Rating), 1) : 0,
                p.Reviews.Count,
                favCounts.GetValueOrDefault(p.PatternID, 0),
                p.CreatedAt)).ToList();

            var courses = await _context.Courses
                .Include(c => c.Enrollments)
                .Include(c => c.Reviews)
                .Where(c => c.InstructorID == instructorID)
                .OrderByDescending(c => c.Enrollments.Count)
                .ToListAsync();

            var courseDtos = courses.Select(c => new PopularCourseItemDto(
                c.Title,
                c.Enrollments.Count,
                c.Reviews.Any() ? Math.Round(c.Reviews.Average(r => (double)r.Rating), 1) : 0,
                c.Enrollments.Any()
                    ? Math.Round(c.Enrollments.Average(e => (double)e.CompletionPercentage), 1) : 0
            )).ToList();

            var instructor = await _context.Users.Include(u => u.Person)
                .FirstOrDefaultAsync(u => u.UserID == instructorID);
            var instructorName = instructor?.Person != null
                ? $"{instructor.Person.FirstName} {instructor.Person.LastName}" : "Instructor";

            return BuildDocument($"Popularity Report — {instructorName}", col =>
            {
                col.Item().PaddingBottom(6).Text("Courses by Enrollment").SemiBold().FontSize(12);
                col.Item().Table(table =>
                {
                    table.ColumnsDefinition(c =>
                    {
                        c.RelativeColumn(3); c.RelativeColumn(1); c.RelativeColumn(1); c.RelativeColumn(1);
                    });
                    table.Header(h =>
                    {
                        foreach (var label in new[] { "Course Title", "Enrolled", "Avg Rating", "Avg Completion %" })
                            h.Cell().Background(Colors.Purple.Lighten3).Padding(5)
                                .Text(label).SemiBold().FontSize(10);
                    });
                    bool alt = false;
                    foreach (var c in courseDtos)
                    {
                        var bg = alt ? Colors.Grey.Lighten4 : Colors.White;
                        table.Cell().Background(bg).Padding(5).Text(c.Title);
                        table.Cell().Background(bg).Padding(5).Text(c.EnrolledCount.ToString());
                        table.Cell().Background(bg).Padding(5)
                            .Text(c.AvgRating > 0 ? $"{c.AvgRating:F1}" : "—");
                        table.Cell().Background(bg).Padding(5).Text($"{c.AvgCompletion}%");
                        alt = !alt;
                    }
                });

                col.Item().PaddingTop(18).PaddingBottom(6).Text("Patterns by Reviews").SemiBold().FontSize(12);
                col.Item().Table(table =>
                {
                    table.ColumnsDefinition(c =>
                    {
                        c.RelativeColumn(3); c.RelativeColumn(1); c.RelativeColumn(1); c.RelativeColumn(1);
                    });
                    table.Header(h =>
                    {
                        foreach (var label in new[] { "Pattern Title", "Favorites", "Avg Rating", "Reviews" })
                            h.Cell().Background(Colors.Purple.Lighten3).Padding(5)
                                .Text(label).SemiBold().FontSize(10);
                    });
                    bool alt = false;
                    foreach (var p in patternDtos)
                    {
                        var bg = alt ? Colors.Grey.Lighten4 : Colors.White;
                        table.Cell().Background(bg).Padding(5).Text(p.Title);
                        table.Cell().Background(bg).Padding(5).Text(p.FavoriteCount.ToString());
                        table.Cell().Background(bg).Padding(5)
                            .Text(p.AvgRating > 0 ? $"{p.AvgRating:F1}" : "—");
                        table.Cell().Background(bg).Padding(5).Text(p.ReviewCount.ToString());
                        alt = !alt;
                    }
                });
            }).GeneratePdf();
        }

        // student reports

        public async Task<byte[]> GenerateMyLearningAsync(int studentID)
        {
            var enrollments = await _context.CourseEnrollments
                .Include(e => e.Course).ThenInclude(c => c.Difficulty)
                .Include(e => e.Course).ThenInclude(c => c.Instructor)
                    .ThenInclude(i => i!.User).ThenInclude(u => u!.Person)
                .Where(e => e.StudentID == studentID)
                .OrderByDescending(e => e.EnrolledAt)
                .ToListAsync();

            var dtos = enrollments.Select(e => new MyLearningItemDto(
                e.Course.Title,
                e.Course.Instructor?.User?.Person != null
                    ? $"{e.Course.Instructor.User.Person.FirstName} {e.Course.Instructor.User.Person.LastName}"
                    : "Unknown",
                e.Course.Difficulty?.Value,
                Math.Round((double)e.CompletionPercentage, 1),
                e.EnrolledAt)).ToList();

            var student = await _context.Users.Include(u => u.Person)
                .FirstOrDefaultAsync(u => u.UserID == studentID);
            var studentName = student?.Person != null
                ? $"{student.Person.FirstName} {student.Person.LastName}" : "Student";

            return BuildDocument($"My Learning Report — {studentName}", col =>
            {
                col.Item().PaddingBottom(8)
                    .Text($"Total Courses Enrolled: {dtos.Count}").FontSize(10).FontColor(Colors.Grey.Darken1);
                col.Item().Table(table =>
                {
                    table.ColumnsDefinition(c =>
                    {
                        c.RelativeColumn(3); c.RelativeColumn(2); c.RelativeColumn(1);
                        c.RelativeColumn(1); c.RelativeColumn(2);
                    });
                    table.Header(h =>
                    {
                        foreach (var label in new[] { "Course Title", "Instructor", "Difficulty", "Completion %", "Enrolled On" })
                            h.Cell().Background(Colors.Purple.Lighten3).Padding(5)
                                .Text(label).SemiBold().FontSize(9);
                    });
                    bool alt = false;
                    foreach (var e in dtos)
                    {
                        var bg = alt ? Colors.Grey.Lighten4 : Colors.White;
                        table.Cell().Background(bg).Padding(5).Text(e.CourseTitle).FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(e.InstructorName).FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(e.Difficulty ?? "—").FontSize(9);
                        table.Cell().Background(bg).Padding(5)
                            .Text($"{e.CompletionPercentage}%").FontSize(9);
                        table.Cell().Background(bg).Padding(5)
                            .Text(e.EnrolledAt.ToString("dd MMM yyyy")).FontSize(9);
                        alt = !alt;
                    }
                });
            }).GeneratePdf();
        }

        public async Task<byte[]> GenerateMyProgressAsync(int studentID)
        {
            var enrolledCourseIDs = await _context.CourseEnrollments
                .Where(e => e.StudentID == studentID)
                .Select(e => e.CourseID)
                .ToListAsync();

            var lessons = await _context.Lessons
                .Include(l => l.Course)
                .Where(l => enrolledCourseIDs.Contains(l.CourseID))
                .OrderBy(l => l.Course.Title).ThenBy(l => l.SequenceOrder)
                .ToListAsync();

            var progressMap = await _context.StudentProgresses
                .Where(sp => sp.StudentID == studentID)
                .ToDictionaryAsync(sp => sp.LessonID, sp => sp);

            var dtos = lessons.Select(l =>
            {
                progressMap.TryGetValue(l.LessonID, out var progress);
                return new MyProgressItemDto(
                    l.Course.Title,
                    l.Title,
                    l.SequenceOrder,
                    progress?.Completed ?? false,
                    progress?.CompletedAt,
                    progress?.TimeSpent);
            }).ToList();

            var student = await _context.Users.Include(u => u.Person)
                .FirstOrDefaultAsync(u => u.UserID == studentID);
            var studentName = student?.Person != null
                ? $"{student.Person.FirstName} {student.Person.LastName}" : "Student";

            return BuildDocument($"My Progress Report — {studentName}", col =>
            {
                var completedCount = dtos.Count(d => d.Completed);
                col.Item().PaddingBottom(8)
                    .Text($"Lessons Completed: {completedCount} / {dtos.Count}")
                    .FontSize(10).FontColor(Colors.Grey.Darken1);

                col.Item().Table(table =>
                {
                    table.ColumnsDefinition(c =>
                    {
                        c.RelativeColumn(2); c.RelativeColumn(3); c.RelativeColumn(1);
                        c.RelativeColumn(1); c.RelativeColumn(2); c.RelativeColumn(1);
                    });
                    table.Header(h =>
                    {
                        foreach (var label in new[] { "Course", "Lesson", "Order", "Status", "Completed On", "Time (min)" })
                            h.Cell().Background(Colors.Purple.Lighten3).Padding(5)
                                .Text(label).SemiBold().FontSize(9);
                    });
                    bool alt = false;
                    foreach (var item in dtos)
                    {
                        var bg = alt ? Colors.Grey.Lighten4 : Colors.White;
                        table.Cell().Background(bg).Padding(5).Text(item.CourseTitle).FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(item.LessonTitle).FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(item.LessonOrder.ToString()).FontSize(9);
                        table.Cell().Background(bg).Padding(5)
                            .Text(item.Completed ? "✓ Done" : "Pending").FontSize(9)
                            .FontColor(item.Completed ? Colors.Green.Darken1 : Colors.Orange.Medium);
                        table.Cell().Background(bg).Padding(5)
                            .Text(item.CompletedAt.HasValue
                                ? item.CompletedAt.Value.ToString("dd MMM yyyy") : "—").FontSize(9);
                        table.Cell().Background(bg).Padding(5)
                            .Text(item.TimeSpent.HasValue ? item.TimeSpent.Value.ToString() : "—").FontSize(9);
                        alt = !alt;
                    }
                });
            }).GeneratePdf();
        }

        public async Task<byte[]> GenerateMyPatternsAsync(int userID)
        {
            var patterns = await _context.Patterns
                .Include(p => p.Difficulty)
                .Include(p => p.Reviews)
                .Where(p => p.CreatedBy == userID)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            var patternIDs = patterns.Select(p => p.PatternID).ToList();
            var favCounts = await _context.UserFavoritePatterns
                .Where(f => patternIDs.Contains(f.PatternID))
                .GroupBy(f => f.PatternID)
                .Select(g => new { PatternID = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.PatternID, x => x.Count);

            var dtos = patterns.Select(p => new MyPatternItemDto(
                p.Title,
                p.Difficulty?.Value,
                p.Reviews.Any() ? Math.Round(p.Reviews.Average(r => (double)r.Rating), 1) : 0,
                p.Reviews.Count,
                favCounts.GetValueOrDefault(p.PatternID, 0),
                p.CreatedAt)).ToList();

            var user = await _context.Users.Include(u => u.Person)
                .FirstOrDefaultAsync(u => u.UserID == userID);
            var userName = user?.Person != null
                ? $"{user.Person.FirstName} {user.Person.LastName}" : "User";

            return BuildDocument($"My Patterns Report — {userName}", col =>
            {
                col.Item().PaddingBottom(8)
                    .Text($"Total Patterns Created: {dtos.Count}").FontSize(10).FontColor(Colors.Grey.Darken1);
                col.Item().Table(table =>
                {
                    table.ColumnsDefinition(c =>
                    {
                        c.RelativeColumn(3); c.RelativeColumn(1); c.RelativeColumn(1);
                        c.RelativeColumn(1); c.RelativeColumn(1); c.RelativeColumn(2);
                    });
                    table.Header(h =>
                    {
                        foreach (var label in new[] { "Pattern Title", "Difficulty", "Avg Rating", "Reviews", "Favorites", "Created On" })
                            h.Cell().Background(Colors.Purple.Lighten3).Padding(5)
                                .Text(label).SemiBold().FontSize(9);
                    });
                    bool alt = false;
                    foreach (var p in dtos)
                    {
                        var bg = alt ? Colors.Grey.Lighten4 : Colors.White;
                        table.Cell().Background(bg).Padding(5).Text(p.Title).FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(p.Difficulty ?? "—").FontSize(9);
                        table.Cell().Background(bg).Padding(5)
                            .Text(p.AvgRating > 0 ? $"{p.AvgRating:F1}" : "—").FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(p.ReviewCount.ToString()).FontSize(9);
                        table.Cell().Background(bg).Padding(5).Text(p.FavoriteCount.ToString()).FontSize(9);
                        table.Cell().Background(bg).Padding(5)
                            .Text(p.CreatedAt.ToString("dd MMM yyyy")).FontSize(9);
                        alt = !alt;
                    }
                });
            }).GeneratePdf();
        }

        public async Task<byte[]> GenerateActivitySummaryAsync(int userID)
        {
            var summary = new ActivitySummaryItemDto(
                ForumThreads: await _context.ForumThreads.CountAsync(t => t.UserID == userID),
                ForumReplies: await _context.ForumReplies.CountAsync(r => r.UserID == userID),
                CourseReviews: await _context.CourseReviews.CountAsync(r => r.StudentID == userID),
                PatternReviews: await _context.PatternReviews.CountAsync(r => r.UserID == userID),
                CoursesEnrolled: await _context.CourseEnrollments.CountAsync(e => e.StudentID == userID),
                PatternsCreated: await _context.Patterns.CountAsync(p => p.CreatedBy == userID),
                PatternsFavorited: await _context.UserFavoritePatterns.CountAsync(f => f.UserID == userID)
            );

            var recentThreads = await _context.ForumThreads
                .Include(t => t.Replies)
                .Where(t => t.UserID == userID)
                .OrderByDescending(t => t.CreatedAt)
                .Take(10)
                .ToListAsync();

            var user = await _context.Users.Include(u => u.Person)
                .FirstOrDefaultAsync(u => u.UserID == userID);
            var userName = user?.Person != null
                ? $"{user.Person.FirstName} {user.Person.LastName}" : "User";

            return BuildDocument($"Activity Summary — {userName}", col =>
            {
                col.Item().PaddingBottom(10).Text("Activity Overview").SemiBold().FontSize(13);
                col.Item().Table(table =>
                {
                    table.ColumnsDefinition(c => { c.RelativeColumn(3); c.RelativeColumn(1); });
                    void Row(string label, string value)
                    {
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten3).Padding(7)
                            .Text(label).FontSize(10);
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten3).Padding(7)
                            .Text(value).SemiBold().FontSize(10).FontColor(Colors.Purple.Medium);
                    }
                    Row("Courses Enrolled", summary.CoursesEnrolled.ToString());
                    Row("Patterns Created", summary.PatternsCreated.ToString());
                    Row("Patterns Favorited", summary.PatternsFavorited.ToString());
                    Row("Forum Threads Posted", summary.ForumThreads.ToString());
                    Row("Forum Replies Posted", summary.ForumReplies.ToString());
                    Row("Course Reviews Written", summary.CourseReviews.ToString());
                    Row("Pattern Reviews Written", summary.PatternReviews.ToString());
                });

                if (recentThreads.Any())
                {
                    col.Item().PaddingTop(18).PaddingBottom(6)
                        .Text("Recent Forum Threads").SemiBold().FontSize(12);
                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.RelativeColumn(4); c.RelativeColumn(1); c.RelativeColumn(2);
                        });
                        table.Header(h =>
                        {
                            foreach (var label in new[] { "Thread Title", "Replies", "Posted On" })
                                h.Cell().Background(Colors.Purple.Lighten3).Padding(5)
                                    .Text(label).SemiBold().FontSize(10);
                        });
                        bool alt = false;
                        foreach (var t in recentThreads)
                        {
                            var bg = alt ? Colors.Grey.Lighten4 : Colors.White;
                            table.Cell().Background(bg).Padding(5).Text(t.Title).FontSize(9);
                            table.Cell().Background(bg).Padding(5).Text(t.Replies.Count.ToString()).FontSize(9);
                            table.Cell().Background(bg).Padding(5)
                                .Text(t.CreatedAt.ToString("dd MMM yyyy")).FontSize(9);
                            alt = !alt;
                        }
                    });
                }
            }).GeneratePdf();
        }

        // certificates

        public async Task<(byte[]? Pdf, string? Error)> GenerateCourseCompletionCertAsync(int studentID, int courseID)
        {
            var enrollment = await _context.CourseEnrollments
                .Include(e => e.Course)
                .FirstOrDefaultAsync(e => e.StudentID == studentID && e.CourseID == courseID);

            if (enrollment == null)
                return (null, "Enrollment not found.");

            if (enrollment.CompletionPercentage < 100)
                return (null, $"Course is only {enrollment.CompletionPercentage:F0}% complete. Certificate requires 100%.");

            var student = await _context.Users.Include(u => u.Person)
                .FirstOrDefaultAsync(u => u.UserID == studentID);
            var studentName = student?.Person != null
                ? $"{student.Person.FirstName} {student.Person.LastName}" : "Student";

            var completedDate = await _context.StudentProgresses
                .Where(sp => sp.StudentID == studentID &&
                    _context.Lessons.Where(l => l.CourseID == courseID)
                        .Select(l => l.LessonID).Contains(sp.LessonID))
                .OrderByDescending(sp => sp.CompletedAt)
                .Select(sp => sp.CompletedAt)
                .FirstOrDefaultAsync();

            var pdf = BuildCertificate(
                title: "Certificate of Completion",
                recipientLabel: "This certifies that",
                recipientName: studentName,
                bodyText: "has successfully completed the course",
                subjectName: enrollment.Course.Title,
                date: completedDate ?? DateTime.UtcNow
            );

            return (pdf, null);
        }

        public async Task<(byte[]? Pdf, string? Error)> GenerateInstructorAchievementCertAsync(int instructorID)
        {
            var instructor = await _context.Users
                .Include(u => u.Person)
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserID == instructorID
                    && u.Role != null && u.Role.Value == "Instructor");

            if (instructor == null)
                return (null, "Instructor not found.");

            var totalStudents = await _context.CourseEnrollments
                .Where(e => e.Course.InstructorID == instructorID)
                .Select(e => e.StudentID)
                .Distinct()
                .CountAsync();

            var totalCourses = await _context.Courses
                .CountAsync(c => c.InstructorID == instructorID);

            if (totalStudents < 1)
                return (null, "Instructor has no enrolled students yet. Certificate requires at least 1 student.");

            var instructorName = instructor.Person != null
                ? $"{instructor.Person.FirstName} {instructor.Person.LastName}" : "Instructor";

            var milestone = totalStudents switch
            {
                >= 100 => "Outstanding Educator — 100+ Students Reached",
                >= 50 => "Expert Instructor — 50+ Students Reached",
                >= 10 => "Rising Instructor — 10+ Students Reached",
                _ => "Dedicated Instructor — First Students Reached"
            };

            var pdf = BuildCertificate(
                title: "Instructor Achievement Award",
                recipientLabel: "Awarded to",
                recipientName: instructorName,
                bodyText: $"in recognition of teaching {totalCourses} course(s) and reaching {totalStudents} student(s)",
                subjectName: milestone,
                date: DateTime.UtcNow
            );

            return (pdf, null);
        }

        public async Task<(byte[]? Pdf, string? Error)> GenerateTopContributorCertAsync(int userID)
        {
            var user = await _context.Users.Include(u => u.Person)
                .FirstOrDefaultAsync(u => u.UserID == userID);

            if (user == null)
                return (null, "User not found.");

            var threadCount = await _context.ForumThreads.CountAsync(t => t.UserID == userID);
            var replyCount = await _context.ForumReplies.CountAsync(r => r.UserID == userID);
            var totalUpvotes = await _context.ForumReplies
                .Where(r => r.UserID == userID).SumAsync(r => r.Upvotes);

            if (threadCount + replyCount < 1)
                return (null, "User has no forum activity yet.");

            var userName = user.Person != null
                ? $"{user.Person.FirstName} {user.Person.LastName}" : "Community Member";

            var pdf = BuildCertificate(
                title: "Top Community Contributor",
                recipientLabel: "Awarded to",
                recipientName: userName,
                bodyText: $"for outstanding forum participation — {threadCount} thread(s), {replyCount} reply/replies, {totalUpvotes} upvote(s)",
                subjectName: "CrochetHub Community Champion",
                date: DateTime.UtcNow
            );

            return (pdf, null);
        }

        // helpers

        private IDocument BuildDocument(string title, Action<ColumnDescriptor> buildContent)
        {
            return Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.DefaultTextStyle(x => x.FontSize(10).FontFamily(Fonts.Arial));

                    page.Header().Column(col =>
                    {
                        col.Item().Row(row =>
                        {
                            row.RelativeItem().Column(c =>
                            {
                                c.Item().Text("CrochetHub")
                                    .SemiBold().FontSize(20).FontColor(Colors.Purple.Medium);
                                c.Item().Text(title)
                                    .FontSize(12).FontColor(Colors.Grey.Darken2);
                            });
                            row.ConstantItem(130).AlignRight().Column(c =>
                            {
                                c.Item().Text($"Generated: {DateTime.Now:dd MMM yyyy}")
                                    .FontSize(8).FontColor(Colors.Grey.Medium);
                                c.Item().Text($"Time: {DateTime.Now:HH:mm UTC}")
                                    .FontSize(8).FontColor(Colors.Grey.Medium);
                            });
                        });
                        col.Item().PaddingTop(4).LineHorizontal(1.5f).LineColor(Colors.Purple.Medium);
                        col.Item().Height(6);
                    });

                    page.Content().PaddingTop(6).Column(buildContent);

                    page.Footer().AlignCenter().Text(x =>
                    {
                        x.Span("CrochetHub  |  Page ").FontSize(8).FontColor(Colors.Grey.Medium);
                        x.CurrentPageNumber().FontSize(8).FontColor(Colors.Grey.Medium);
                        x.Span(" of ").FontSize(8).FontColor(Colors.Grey.Medium);
                        x.TotalPages().FontSize(8).FontColor(Colors.Grey.Medium);
                    });
                });
            });
        }

        private byte[] BuildCertificate(string title, string recipientLabel, string recipientName,
            string bodyText, string subjectName, DateTime date)
        {
            return Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4.Landscape());
                    page.Margin(1.5f, Unit.Centimetre);
                    page.DefaultTextStyle(x => x.FontFamily(Fonts.Arial));

                    page.Content()
                        .Border(4).BorderColor(Colors.Purple.Medium)
                        .Padding(30)
                        .Column(col =>
                        {
                            col.Item().AlignCenter().Text("✦  CrochetHub  ✦")
                                .FontSize(13).FontColor(Colors.Purple.Lighten2).LetterSpacing(0.2f);
                            col.Item().Height(18);
                            col.Item().AlignCenter().Text(title)
                                .Bold().FontSize(32).FontColor(Colors.Purple.Darken2);
                            col.Item().Height(6);
                            col.Item().AlignCenter().LineHorizontal(1).LineColor(Colors.Purple.Lighten2);
                            col.Item().Height(24);
                            col.Item().AlignCenter().Text(recipientLabel)
                                .FontSize(14).FontColor(Colors.Grey.Darken2);
                            col.Item().Height(8);
                            col.Item().AlignCenter().Text(recipientName)
                                .Bold().FontSize(28).FontColor(Colors.Purple.Darken1);
                            col.Item().Height(20);
                            col.Item().AlignCenter().Text(bodyText)
                                .FontSize(14).FontColor(Colors.Grey.Darken2);
                            col.Item().Height(10);
                            col.Item().AlignCenter().Text(subjectName)
                                .SemiBold().FontSize(18).FontColor(Colors.Purple.Medium);
                            col.Item().Height(30);
                            col.Item().AlignCenter()
                                .Text($"Issued on {date:MMMM dd, yyyy}")
                                .FontSize(11).FontColor(Colors.Grey.Medium);
                            col.Item().Height(20);
                            col.Item().AlignCenter().LineHorizontal(0.5f).LineColor(Colors.Grey.Lighten3);
                            col.Item().Height(6);
                            col.Item().AlignCenter()
                                .Text("This certificate is issued by CrochetHub — the online crochet learning platform.")
                                .FontSize(8).FontColor(Colors.Grey.Lighten1);
                        });
                });
            }).GeneratePdf();
        }
    }
}

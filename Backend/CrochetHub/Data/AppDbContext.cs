using CrochetHub.Models;
using CrochetHub.Models.Views;
using Microsoft.EntityFrameworkCore;
using BC = BCrypt.Net.BCrypt;
namespace CrochetHub.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // core users
        public DbSet<Person> Persons { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Instructor> Instructors { get; set; }

        // lookup and tags
        public DbSet<Lookup> Lookups { get; set; }
        public DbSet<Tag> Tags { get; set; }

        // course domains
        public DbSet<Course> Courses { get; set; }
        public DbSet<CoursePrerequisite> CoursePrerequisites { get; set; }
        public DbSet<CourseTag> CourseTags { get; set; }
        public DbSet<Lesson> Lessons { get; set; }

        // enrollments and progress
        public DbSet<CourseEnrollment> CourseEnrollments { get; set; }
        public DbSet<StudentProgress> StudentProgresses { get; set; }

        // Reviews
        public DbSet<CourseReview> CourseReviews { get; set; }

        // Pattern Domain
        public DbSet<Pattern> Patterns { get; set; }
        public DbSet<PatternMaterial> PatternMaterials { get; set; }
        public DbSet<PatternReview> PatternReviews { get; set; }
        public DbSet<PatternTag> PatternTags { get; set; }

        // Forum
        public DbSet<ForumThread> ForumThreads { get; set; }
        public DbSet<ForumReply> ForumReplies { get; set; }

        // Notifications & Audit
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        public DbSet<UserFavoritePattern> UserFavoritePatterns { get; set; }

        // viewa
        public DbSet<StudentProgressView> StudentProgressViews { get; set; }
        public DbSet<InstructorStatsView> InstructorStatsViews { get; set; }
        public DbSet<ForumActivityView> ForumActivityViews { get; set; }
        public DbSet<CoursePrerequisitesView> CoursePrerequisitesViews { get; set; }
        public DbSet<PatternDifficultyStatsView> PatternDifficultyStatsViews { get; set; }
        public DbSet<StudentNextCoursesView> StudentNextCoursesViews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Person>().ToTable("person");
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<Student>().ToTable("student");
            modelBuilder.Entity<Instructor>().ToTable("instructor");
            modelBuilder.Entity<Lookup>().ToTable("lookup");
            modelBuilder.Entity<Course>().ToTable("course");
            modelBuilder.Entity<CoursePrerequisite>().ToTable("courseprerequisites");
            modelBuilder.Entity<Lesson>().ToTable("lesson");
            modelBuilder.Entity<CourseEnrollment>().ToTable("courseenrollment");
            modelBuilder.Entity<StudentProgress>().ToTable("studentprogress");
            modelBuilder.Entity<CourseReview>().ToTable("coursereview");
            modelBuilder.Entity<Pattern>().ToTable("pattern");
            modelBuilder.Entity<PatternMaterial>().ToTable("patternmaterial");
            modelBuilder.Entity<PatternReview>().ToTable("patternreview");
            modelBuilder.Entity<Tag>().ToTable("tag");
            modelBuilder.Entity<CourseTag>().ToTable("coursetag");
            modelBuilder.Entity<PatternTag>().ToTable("patterntag");
            modelBuilder.Entity<ForumThread>().ToTable("forumthread");
            modelBuilder.Entity<ForumReply>().ToTable("forumreply");
            modelBuilder.Entity<Notification>().ToTable("notification");
            modelBuilder.Entity<AuditLog>().ToTable("auditlog");
            modelBuilder.Entity<UserFavoritePattern>().ToTable("userfavoritepattern");

            // Person -> User (1-to-1)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Person)
                .WithOne(p => p.User)
                .HasForeignKey<User>(u => u.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            // User -> Student (1-to-1, optional)
            modelBuilder.Entity<Student>()
                .HasOne(s => s.User)
                .WithOne(u => u.Student)
                .HasForeignKey<Student>(s => s.StudentID)
                .OnDelete(DeleteBehavior.Cascade);

            // User -> Instructor (1-to-1, optional)
            modelBuilder.Entity<Instructor>()
                .HasOne(i => i.User)
                .WithOne(u => u.Instructor)
                .HasForeignKey<Instructor>(i => i.InstructorID)
                .OnDelete(DeleteBehavior.Cascade);

            // Instructor -> Course (1-to-Many)
            modelBuilder.Entity<Course>()
                .HasOne(c => c.Instructor)
                .WithMany(i => i.Courses)
                .HasForeignKey(c => c.InstructorID)
                .OnDelete(DeleteBehavior.Restrict);

            // Course -> Lesson (1-to-Many)
            modelBuilder.Entity<Lesson>()
                .HasOne(l => l.Course)
                .WithMany(c => c.Lessons)
                .HasForeignKey(l => l.CourseID)
                .OnDelete(DeleteBehavior.Cascade);

            // course prerequisites (self-join)
            modelBuilder.Entity<CoursePrerequisite>()
               .HasKey(cp => new { cp.CourseID, cp.PrerequisiteID });

            modelBuilder.Entity<CoursePrerequisite>()
                .HasOne(cp => cp.Course)
                .WithMany(c => c.Prerequisites)
                .HasForeignKey(cp => cp.CourseID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CoursePrerequisite>()
                .HasOne(cp => cp.Prerequisite)
                .WithMany()
                .HasForeignKey(cp => cp.PrerequisiteID)
                .OnDelete(DeleteBehavior.Restrict);

            // course tags (many-to-many)
            modelBuilder.Entity<CourseTag>()
               .HasKey(ct => new { ct.CourseID, ct.TagID });

            modelBuilder.Entity<CourseTag>()
                .HasOne(ct => ct.Course)
                .WithMany(c => c.CourseTags)
                .HasForeignKey(ct => ct.CourseID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CourseTag>()
                .HasOne(ct => ct.Tag)
                .WithMany(t => t.CourseTags)
                .HasForeignKey(ct => ct.TagID)
                .OnDelete(DeleteBehavior.Cascade);

            // Student -> CourseEnrollment -> Course
            modelBuilder.Entity<CourseEnrollment>()
                .HasOne(ce => ce.Student)
                .WithMany(s => s.CourseEnrollments)
                .HasForeignKey(ce => ce.StudentID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CourseEnrollment>()
                .HasOne(ce => ce.Course)
                .WithMany(c => c.Enrollments)
                .HasForeignKey(ce => ce.CourseID)
                .OnDelete(DeleteBehavior.Cascade);

            // Unique constraint: Student can enroll in course only once
            modelBuilder.Entity<CourseEnrollment>()
                .HasIndex(ce => new { ce.StudentID, ce.CourseID })
                .IsUnique();

            // Student -> StudentProgress -> Lesson
            modelBuilder.Entity<StudentProgress>()
                .HasOne(sp => sp.Student)
                .WithMany(s => s.StudentProgresses)
                .HasForeignKey(sp => sp.StudentID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<StudentProgress>()
                .HasOne(sp => sp.Lesson)
                .WithMany(l => l.StudentProgresses)
                .HasForeignKey(sp => sp.LessonID)
                .OnDelete(DeleteBehavior.Cascade);

            // Unique constraint: Student can progress on lesson only once
            modelBuilder.Entity<StudentProgress>()
                .HasIndex(sp => new { sp.StudentID, sp.LessonID })
                .IsUnique();

            // course reviews
            modelBuilder.Entity<CourseReview>()
                .HasOne(cr => cr.Student)
                .WithMany(s => s.CourseReviews)
                .HasForeignKey(cr => cr.StudentID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CourseReview>()
                .HasOne(cr => cr.Course)
                .WithMany(c => c.Reviews)
                .HasForeignKey(cr => cr.CourseID)
                .OnDelete(DeleteBehavior.Cascade);

            // Unique constraint: Student can review course only once
            modelBuilder.Entity<CourseReview>()
                .HasIndex(cr => new { cr.StudentID, cr.CourseID })
                .IsUnique();

            // pattern doomain

            // Course -> Pattern (1-to-Many, optional)
            modelBuilder.Entity<Pattern>()
                .HasOne(p => p.Course)
                .WithMany(c => c.Patterns)
                .HasForeignKey(p => p.CourseID)
                .OnDelete(DeleteBehavior.SetNull);

            // User -> Pattern (Created by)
            modelBuilder.Entity<Pattern>()
                .HasOne(p => p.Creator)
                .WithMany(u => u.Patterns)
                .HasForeignKey(p => p.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            // Pattern -> PatternMaterial (1-to-Many)
            modelBuilder.Entity<PatternMaterial>()
                .HasOne(pm => pm.Pattern)
                .WithMany(p => p.Materials)
                .HasForeignKey(pm => pm.PatternID)
                .OnDelete(DeleteBehavior.Cascade);

            // Pattern -> PatternReview (1-to-Many)
            modelBuilder.Entity<PatternReview>()
                .HasOne(pr => pr.User)
                .WithMany(u => u.PatternReviews)
                .HasForeignKey(pr => pr.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PatternReview>()
                .HasOne(pr => pr.Pattern)
                .WithMany(p => p.Reviews)
                .HasForeignKey(pr => pr.PatternID)
                .OnDelete(DeleteBehavior.Cascade);

            // Unique constraint: User can review pattern only once
            modelBuilder.Entity<PatternReview>()
                .HasIndex(pr => new { pr.UserID, pr.PatternID })
                .IsUnique();

            // Pattern tags (Many-to-Many)
            modelBuilder.Entity<PatternTag>()
               .HasKey(pt => new { pt.PatternID, pt.TagID });

            modelBuilder.Entity<PatternTag>()
                .HasOne(pt => pt.Pattern)
                .WithMany(p => p.PatternTags)
                .HasForeignKey(pt => pt.PatternID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PatternTag>()
                .HasOne(pt => pt.Tag)
                .WithMany(t => t.PatternTags)
                .HasForeignKey(pt => pt.TagID)
                .OnDelete(DeleteBehavior.Cascade);

            // forums
            // User -> ForumThread (1-to-Many)
            modelBuilder.Entity<ForumThread>()
                .HasOne(ft => ft.User)
                .WithMany(u => u.ForumThreads)
                .HasForeignKey(ft => ft.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            // ForumThread -> ForumReply (1-to-Many)
            modelBuilder.Entity<ForumReply>()
                .HasOne(fr => fr.Thread)
                .WithMany(ft => ft.Replies)
                .HasForeignKey(fr => fr.ThreadID)
                .OnDelete(DeleteBehavior.Cascade);

            // User -> ForumReply (1-to-Many)
            modelBuilder.Entity<ForumReply>()
                .HasOne(fr => fr.User)
                .WithMany(u => u.ForumReplies)
                .HasForeignKey(fr => fr.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            // notifications and audit 
            // User -> Notification (1-to-Many)
            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            // User -> AuditLog (1-to-Many)
            modelBuilder.Entity<AuditLog>()
                .HasOne(al => al.User)
                .WithMany(u => u.AuditLogs)
                .HasForeignKey(al => al.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserFavoritePattern>()
                .HasKey(uf => new { uf.UserID, uf.PatternID });

            modelBuilder.Entity<UserFavoritePattern>()
                .HasOne(uf => uf.User)
                .WithMany(u => u.FavoritePatterns)
                .HasForeignKey(uf => uf.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserFavoritePattern>()
                .HasOne(uf => uf.Pattern)
                .WithMany()
                .HasForeignKey(uf => uf.PatternID)
                .OnDelete(DeleteBehavior.Cascade);

            // unique constraints 
            // User email unique
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Tag name unique
            modelBuilder.Entity<Tag>()
                .HasIndex(t => t.Name)
                .IsUnique();
            modelBuilder.Entity<StudentProgressView>()
               .HasNoKey()
               .ToView("v_student_progress");

            modelBuilder.Entity<InstructorStatsView>()
                .HasNoKey()
                .ToView("v_instructor_stats");

            modelBuilder.Entity<ForumActivityView>()
                .HasNoKey()
                .ToView("v_forum_activity");

            modelBuilder.Entity<CoursePrerequisitesView>()
                .HasNoKey()
                .ToView("v_course_prerequisites");

            modelBuilder.Entity<PatternDifficultyStatsView>()
                .HasNoKey()
                .ToView("v_pattern_difficulty_stats");

            modelBuilder.Entity<StudentNextCoursesView>()
                .HasNoKey()
                .ToView("v_student_next_courses");

            // SEED DATA
            SeedData(modelBuilder);
        }
        private void SeedData(ModelBuilder modelBuilder)
        {
            // Lookup Data
            modelBuilder.Entity<Lookup>().HasData(
                new Lookup { LookupID = 1, Value = "Male", Category = "GENDER" },
                new Lookup { LookupID = 2, Value = "Female", Category = "GENDER" },
                new Lookup { LookupID = 3, Value = "Beginner", Category = "DIFFICULTY" },
                new Lookup { LookupID = 4, Value = "Intermediate", Category = "DIFFICULTY" },
                new Lookup { LookupID = 5, Value = "Advanced", Category = "DIFFICULTY" },
                new Lookup { LookupID = 6, Value = "Student", Category = "ROLE" },
                new Lookup { LookupID = 7, Value = "Instructor", Category = "ROLE" },
                new Lookup { LookupID = 8, Value = "Admin", Category = "ROLE" },
                new Lookup { LookupID = 9, Value = "Beginner Help", Category = "FORUM_CATEGORY" },
                new Lookup { LookupID = 10, Value = "Pattern Sharing", Category = "FORUM_CATEGORY" },
                new Lookup { LookupID = 11, Value = "Tools and Materials", Category = "FORUM_CATEGORY" },
                new Lookup { LookupID = 12, Value = "General Discussion", Category = "FORUM_CATEGORY" },
                new Lookup { LookupID = 13, Value = "Enrollment", Category = "NOTIFICATION_TYPE" },
                new Lookup { LookupID = 14, Value = "Reply", Category = "NOTIFICATION_TYPE" },
                new Lookup { LookupID = 15, Value = "Achievement", Category = "NOTIFICATION_TYPE" },
                new Lookup { LookupID = 16, Value = "System", Category = "NOTIFICATION_TYPE" },
                new Lookup { LookupID = 17, Value = "INSERT", Category = "ACTION" },
                new Lookup { LookupID = 18, Value = "UPDATE", Category = "ACTION" },
                new Lookup { LookupID = 19, Value = "DELETE", Category = "ACTION" }
            );

            // Admin + user
            modelBuilder.Entity<Person>().HasData(
                new Person
                {
                    PersonID = 1,
                    FirstName = "Admin",
                    LastName = "User",
                    DateOfBirth = new DateTime(1990, 1, 1),
                    GenderID = 1,
                    CreatedAt = new DateTime(2025, 1, 1)
                }
            );

            // Admin User
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    UserID = 1,
                    Email = "admin@crochethub.com",
                    PasswordHash = BC.HashPassword("Admin@123"),
                    ProfilePicture = null,
                    Bio = null,
                    RoleID = 8,
                    CreatedAt = new DateTime(2025, 1, 1)
                }
            );
        }
    }

}
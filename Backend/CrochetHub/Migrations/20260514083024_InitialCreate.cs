using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CrochetHub.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "lookup",
                columns: table => new
                {
                    LookupID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Value = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Category = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lookup", x => x.LookupID);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "tag",
                columns: table => new
                {
                    TagID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tag", x => x.TagID);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "person",
                columns: table => new
                {
                    PersonID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    FirstName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LastName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DateOfBirth = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    GenderID = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_person", x => x.PersonID);
                    table.ForeignKey(
                        name: "FK_person_lookup_GenderID",
                        column: x => x.GenderID,
                        principalTable: "lookup",
                        principalColumn: "LookupID");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "int", nullable: false),
                    Email = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PasswordHash = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ProfilePicture = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Bio = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RoleID = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.UserID);
                    table.ForeignKey(
                        name: "FK_users_lookup_RoleID",
                        column: x => x.RoleID,
                        principalTable: "lookup",
                        principalColumn: "LookupID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_users_person_UserID",
                        column: x => x.UserID,
                        principalTable: "person",
                        principalColumn: "PersonID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "auditlog",
                columns: table => new
                {
                    LogID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    ActionID = table.Column<int>(type: "int", nullable: true),
                    EntityType = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EntityID = table.Column<int>(type: "int", nullable: true),
                    OldValue = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    NewValue = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Timestamp = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_auditlog", x => x.LogID);
                    table.ForeignKey(
                        name: "FK_auditlog_lookup_ActionID",
                        column: x => x.ActionID,
                        principalTable: "lookup",
                        principalColumn: "LookupID");
                    table.ForeignKey(
                        name: "FK_auditlog_users_UserID",
                        column: x => x.UserID,
                        principalTable: "users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "forumthread",
                columns: table => new
                {
                    ThreadID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Content = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CategoryID = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_forumthread", x => x.ThreadID);
                    table.ForeignKey(
                        name: "FK_forumthread_lookup_CategoryID",
                        column: x => x.CategoryID,
                        principalTable: "lookup",
                        principalColumn: "LookupID");
                    table.ForeignKey(
                        name: "FK_forumthread_users_UserID",
                        column: x => x.UserID,
                        principalTable: "users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "instructor",
                columns: table => new
                {
                    InstructorID = table.Column<int>(type: "int", nullable: false),
                    Bio = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ExperienceYears = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_instructor", x => x.InstructorID);
                    table.ForeignKey(
                        name: "FK_instructor_users_InstructorID",
                        column: x => x.InstructorID,
                        principalTable: "users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "notification",
                columns: table => new
                {
                    NotificationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    Message = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TypeID = table.Column<int>(type: "int", nullable: true),
                    IsRead = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notification", x => x.NotificationID);
                    table.ForeignKey(
                        name: "FK_notification_lookup_TypeID",
                        column: x => x.TypeID,
                        principalTable: "lookup",
                        principalColumn: "LookupID");
                    table.ForeignKey(
                        name: "FK_notification_users_UserID",
                        column: x => x.UserID,
                        principalTable: "users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "student",
                columns: table => new
                {
                    StudentID = table.Column<int>(type: "int", nullable: false),
                    EnrollmentDate = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_student", x => x.StudentID);
                    table.ForeignKey(
                        name: "FK_student_users_StudentID",
                        column: x => x.StudentID,
                        principalTable: "users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "forumreply",
                columns: table => new
                {
                    ReplyID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ThreadID = table.Column<int>(type: "int", nullable: false),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Upvotes = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_forumreply", x => x.ReplyID);
                    table.ForeignKey(
                        name: "FK_forumreply_forumthread_ThreadID",
                        column: x => x.ThreadID,
                        principalTable: "forumthread",
                        principalColumn: "ThreadID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_forumreply_users_UserID",
                        column: x => x.UserID,
                        principalTable: "users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "course",
                columns: table => new
                {
                    CourseID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Title = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DifficultyID = table.Column<int>(type: "int", nullable: true),
                    InstructorID = table.Column<int>(type: "int", nullable: false),
                    ThumbnailURL = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_course", x => x.CourseID);
                    table.ForeignKey(
                        name: "FK_course_instructor_InstructorID",
                        column: x => x.InstructorID,
                        principalTable: "instructor",
                        principalColumn: "InstructorID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_course_lookup_DifficultyID",
                        column: x => x.DifficultyID,
                        principalTable: "lookup",
                        principalColumn: "LookupID");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "courseenrollment",
                columns: table => new
                {
                    EnrollmentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    StudentID = table.Column<int>(type: "int", nullable: false),
                    CourseID = table.Column<int>(type: "int", nullable: false),
                    EnrolledAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CompletionPercentage = table.Column<decimal>(type: "decimal(65,30)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_courseenrollment", x => x.EnrollmentID);
                    table.ForeignKey(
                        name: "FK_courseenrollment_course_CourseID",
                        column: x => x.CourseID,
                        principalTable: "course",
                        principalColumn: "CourseID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_courseenrollment_student_StudentID",
                        column: x => x.StudentID,
                        principalTable: "student",
                        principalColumn: "StudentID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "courseprerequisites",
                columns: table => new
                {
                    CourseID = table.Column<int>(type: "int", nullable: false),
                    PrerequisiteID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_courseprerequisites", x => new { x.CourseID, x.PrerequisiteID });
                    table.ForeignKey(
                        name: "FK_courseprerequisites_course_CourseID",
                        column: x => x.CourseID,
                        principalTable: "course",
                        principalColumn: "CourseID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_courseprerequisites_course_PrerequisiteID",
                        column: x => x.PrerequisiteID,
                        principalTable: "course",
                        principalColumn: "CourseID",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "coursereview",
                columns: table => new
                {
                    ReviewID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    StudentID = table.Column<int>(type: "int", nullable: false),
                    CourseID = table.Column<int>(type: "int", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_coursereview", x => x.ReviewID);
                    table.ForeignKey(
                        name: "FK_coursereview_course_CourseID",
                        column: x => x.CourseID,
                        principalTable: "course",
                        principalColumn: "CourseID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_coursereview_student_StudentID",
                        column: x => x.StudentID,
                        principalTable: "student",
                        principalColumn: "StudentID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "coursetag",
                columns: table => new
                {
                    CourseID = table.Column<int>(type: "int", nullable: false),
                    TagID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_coursetag", x => new { x.CourseID, x.TagID });
                    table.ForeignKey(
                        name: "FK_coursetag_course_CourseID",
                        column: x => x.CourseID,
                        principalTable: "course",
                        principalColumn: "CourseID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_coursetag_tag_TagID",
                        column: x => x.TagID,
                        principalTable: "tag",
                        principalColumn: "TagID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "lesson",
                columns: table => new
                {
                    LessonID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CourseID = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    VideoURL = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Content = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SequenceOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lesson", x => x.LessonID);
                    table.ForeignKey(
                        name: "FK_lesson_course_CourseID",
                        column: x => x.CourseID,
                        principalTable: "course",
                        principalColumn: "CourseID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "pattern",
                columns: table => new
                {
                    PatternID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Title = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DifficultyID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CourseID = table.Column<int>(type: "int", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pattern", x => x.PatternID);
                    table.ForeignKey(
                        name: "FK_pattern_course_CourseID",
                        column: x => x.CourseID,
                        principalTable: "course",
                        principalColumn: "CourseID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_pattern_lookup_DifficultyID",
                        column: x => x.DifficultyID,
                        principalTable: "lookup",
                        principalColumn: "LookupID");
                    table.ForeignKey(
                        name: "FK_pattern_users_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "studentprogress",
                columns: table => new
                {
                    ProgressID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    StudentID = table.Column<int>(type: "int", nullable: false),
                    LessonID = table.Column<int>(type: "int", nullable: false),
                    Completed = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    TimeSpent = table.Column<int>(type: "int", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_studentprogress", x => x.ProgressID);
                    table.ForeignKey(
                        name: "FK_studentprogress_lesson_LessonID",
                        column: x => x.LessonID,
                        principalTable: "lesson",
                        principalColumn: "LessonID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_studentprogress_student_StudentID",
                        column: x => x.StudentID,
                        principalTable: "student",
                        principalColumn: "StudentID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "patternmaterial",
                columns: table => new
                {
                    MaterialID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    PatternID = table.Column<int>(type: "int", nullable: false),
                    MaterialName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Quantity = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_patternmaterial", x => x.MaterialID);
                    table.ForeignKey(
                        name: "FK_patternmaterial_pattern_PatternID",
                        column: x => x.PatternID,
                        principalTable: "pattern",
                        principalColumn: "PatternID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "patternreview",
                columns: table => new
                {
                    ReviewID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    PatternID = table.Column<int>(type: "int", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_patternreview", x => x.ReviewID);
                    table.ForeignKey(
                        name: "FK_patternreview_pattern_PatternID",
                        column: x => x.PatternID,
                        principalTable: "pattern",
                        principalColumn: "PatternID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_patternreview_users_UserID",
                        column: x => x.UserID,
                        principalTable: "users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "patterntag",
                columns: table => new
                {
                    PatternID = table.Column<int>(type: "int", nullable: false),
                    TagID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_patterntag", x => new { x.PatternID, x.TagID });
                    table.ForeignKey(
                        name: "FK_patterntag_pattern_PatternID",
                        column: x => x.PatternID,
                        principalTable: "pattern",
                        principalColumn: "PatternID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_patterntag_tag_TagID",
                        column: x => x.TagID,
                        principalTable: "tag",
                        principalColumn: "TagID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "lookup",
                columns: new[] { "LookupID", "Category", "Value" },
                values: new object[,]
                {
                    { 1, "GENDER", "Male" },
                    { 2, "GENDER", "Female" },
                    { 3, "DIFFICULTY", "Beginner" },
                    { 4, "DIFFICULTY", "Intermediate" },
                    { 5, "DIFFICULTY", "Advanced" },
                    { 6, "ROLE", "Student" },
                    { 7, "ROLE", "Instructor" },
                    { 8, "ROLE", "Admin" },
                    { 9, "FORUM_CATEGORY", "Beginner Help" },
                    { 10, "FORUM_CATEGORY", "Pattern Sharing" },
                    { 11, "FORUM_CATEGORY", "Tools and Materials" },
                    { 12, "FORUM_CATEGORY", "General Discussion" },
                    { 13, "NOTIFICATION_TYPE", "Enrollment" },
                    { 14, "NOTIFICATION_TYPE", "Reply" },
                    { 15, "NOTIFICATION_TYPE", "Achievement" },
                    { 16, "NOTIFICATION_TYPE", "System" },
                    { 17, "ACTION", "INSERT" },
                    { 18, "ACTION", "UPDATE" },
                    { 19, "ACTION", "DELETE" }
                });

            migrationBuilder.InsertData(
                table: "person",
                columns: new[] { "PersonID", "CreatedAt", "DateOfBirth", "FirstName", "GenderID", "LastName" },
                values: new object[] { 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1990, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Admin", 1, "User" });

            migrationBuilder.InsertData(
                table: "users",
                columns: new[] { "UserID", "Bio", "CreatedAt", "Email", "PasswordHash", "ProfilePicture", "RoleID" },
                values: new object[] { 1, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "admin@crochethub.com", "$2a$11$0ftU8Iyoqqem5Ezf7zGKe.qPNNjJipaENcVTopn5zjNoC9exiT.6q", null, 8 });

            migrationBuilder.CreateIndex(
                name: "IX_auditlog_ActionID",
                table: "auditlog",
                column: "ActionID");

            migrationBuilder.CreateIndex(
                name: "IX_auditlog_UserID",
                table: "auditlog",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_course_DifficultyID",
                table: "course",
                column: "DifficultyID");

            migrationBuilder.CreateIndex(
                name: "IX_course_InstructorID",
                table: "course",
                column: "InstructorID");

            migrationBuilder.CreateIndex(
                name: "IX_courseenrollment_CourseID",
                table: "courseenrollment",
                column: "CourseID");

            migrationBuilder.CreateIndex(
                name: "IX_courseenrollment_StudentID_CourseID",
                table: "courseenrollment",
                columns: new[] { "StudentID", "CourseID" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_courseprerequisites_PrerequisiteID",
                table: "courseprerequisites",
                column: "PrerequisiteID");

            migrationBuilder.CreateIndex(
                name: "IX_coursereview_CourseID",
                table: "coursereview",
                column: "CourseID");

            migrationBuilder.CreateIndex(
                name: "IX_coursereview_StudentID_CourseID",
                table: "coursereview",
                columns: new[] { "StudentID", "CourseID" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_coursetag_TagID",
                table: "coursetag",
                column: "TagID");

            migrationBuilder.CreateIndex(
                name: "IX_forumreply_ThreadID",
                table: "forumreply",
                column: "ThreadID");

            migrationBuilder.CreateIndex(
                name: "IX_forumreply_UserID",
                table: "forumreply",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_forumthread_CategoryID",
                table: "forumthread",
                column: "CategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_forumthread_UserID",
                table: "forumthread",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_lesson_CourseID",
                table: "lesson",
                column: "CourseID");

            migrationBuilder.CreateIndex(
                name: "IX_notification_TypeID",
                table: "notification",
                column: "TypeID");

            migrationBuilder.CreateIndex(
                name: "IX_notification_UserID",
                table: "notification",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_pattern_CourseID",
                table: "pattern",
                column: "CourseID");

            migrationBuilder.CreateIndex(
                name: "IX_pattern_CreatedBy",
                table: "pattern",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_pattern_DifficultyID",
                table: "pattern",
                column: "DifficultyID");

            migrationBuilder.CreateIndex(
                name: "IX_patternmaterial_PatternID",
                table: "patternmaterial",
                column: "PatternID");

            migrationBuilder.CreateIndex(
                name: "IX_patternreview_PatternID",
                table: "patternreview",
                column: "PatternID");

            migrationBuilder.CreateIndex(
                name: "IX_patternreview_UserID_PatternID",
                table: "patternreview",
                columns: new[] { "UserID", "PatternID" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_patterntag_TagID",
                table: "patterntag",
                column: "TagID");

            migrationBuilder.CreateIndex(
                name: "IX_person_GenderID",
                table: "person",
                column: "GenderID");

            migrationBuilder.CreateIndex(
                name: "IX_studentprogress_LessonID",
                table: "studentprogress",
                column: "LessonID");

            migrationBuilder.CreateIndex(
                name: "IX_studentprogress_StudentID_LessonID",
                table: "studentprogress",
                columns: new[] { "StudentID", "LessonID" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tag_Name",
                table: "tag",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_Email",
                table: "users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_RoleID",
                table: "users",
                column: "RoleID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "auditlog");

            migrationBuilder.DropTable(
                name: "courseenrollment");

            migrationBuilder.DropTable(
                name: "courseprerequisites");

            migrationBuilder.DropTable(
                name: "coursereview");

            migrationBuilder.DropTable(
                name: "coursetag");

            migrationBuilder.DropTable(
                name: "forumreply");

            migrationBuilder.DropTable(
                name: "notification");

            migrationBuilder.DropTable(
                name: "patternmaterial");

            migrationBuilder.DropTable(
                name: "patternreview");

            migrationBuilder.DropTable(
                name: "patterntag");

            migrationBuilder.DropTable(
                name: "studentprogress");

            migrationBuilder.DropTable(
                name: "forumthread");

            migrationBuilder.DropTable(
                name: "pattern");

            migrationBuilder.DropTable(
                name: "tag");

            migrationBuilder.DropTable(
                name: "lesson");

            migrationBuilder.DropTable(
                name: "student");

            migrationBuilder.DropTable(
                name: "course");

            migrationBuilder.DropTable(
                name: "instructor");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "person");

            migrationBuilder.DropTable(
                name: "lookup");
        }
    }
}

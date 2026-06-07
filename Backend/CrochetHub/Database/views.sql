-- ============================================
-- VIEWS
-- ============================================

-- View 1

CREATE VIEW v_student_progress AS
SELECT 
    s.StudentID,
    p.FirstName,
    p.LastName,
    c.CourseID,
    c.Title AS CourseName,
    ce.CompletionPercentage,
    COUNT(DISTINCT l.LessonID) AS TotalLessons,
    SUM(CASE WHEN sp.Completed = TRUE THEN 1 ELSE 0 END) AS CompletedLessons,
    ce.EnrolledAt
FROM student s
JOIN person p ON s.StudentID = p.PersonID
JOIN courseenrollment ce ON s.StudentID = ce.StudentID
JOIN course c ON ce.CourseID = c.CourseID
LEFT JOIN lesson l ON c.CourseID = l.CourseID
LEFT JOIN studentprogress sp ON s.StudentID = sp.StudentID AND l.LessonID = sp.LessonID
GROUP BY s.StudentID, p.FirstName, p.LastName, c.CourseID, c.Title, ce.CompletionPercentage, ce.EnrolledAt;

-- View 2

CREATE VIEW v_instructor_stats AS
SELECT 
    i.InstructorID,
    p.FirstName,
    p.LastName,
    c.CourseID,
    c.Title,
    COUNT(DISTINCT ce.StudentID) AS TotalEnrolled,
    ROUND(AVG(ce.CompletionPercentage), 2) AS AvgCompletion,
    ROUND(AVG(cr.Rating), 2) AS AvgRating,
    c.CreatedAt
FROM instructor i
JOIN person p ON i.InstructorID = p.PersonID
JOIN course c ON i.InstructorID = c.InstructorID
LEFT JOIN courseenrollment ce ON c.CourseID = ce.CourseID
LEFT JOIN coursereview cr ON c.CourseID = cr.CourseID
GROUP BY i.InstructorID, p.FirstName, p.LastName, c.CourseID, c.Title, c.CreatedAt;

-- View 3

CREATE VIEW v_forum_activity AS
SELECT 
    u.UserID,
    p.FirstName,
    p.LastName,
    COUNT(DISTINCT ft.ThreadID) AS ThreadsCreated,
    COUNT(DISTINCT fr.ReplyID) AS RepliesPosted,
    SUM(COALESCE(fr.Upvotes, 0)) AS TotalUpvotes,
    ROUND(AVG(COALESCE(fr.Upvotes, 0)), 2) AS AvgUpvotesPerReply
FROM users u
JOIN person p ON u.UserID = p.PersonID
LEFT JOIN forumthread ft ON u.UserID = ft.UserID
LEFT JOIN forumreply fr ON u.UserID = fr.UserID
GROUP BY u.UserID, p.FirstName, p.LastName
HAVING COUNT(DISTINCT ft.ThreadID) > 0 OR COUNT(DISTINCT fr.ReplyID) > 0;

-- View 4

CREATE VIEW v_course_prerequisites AS
SELECT 
    c.CourseID,
    c.Title AS CourseTitle,
    l.Value AS Difficulty,
    GROUP_CONCAT(CONCAT(pr.CourseID, ':', pr.Title) SEPARATOR ' -> ') AS PrerequisiteChain
FROM course c
LEFT JOIN lookup l ON c.DifficultyID = l.LookupID
LEFT JOIN courseprerequisites cp ON c.CourseID = cp.CourseID
LEFT JOIN course pr ON cp.PrerequisiteID = pr.CourseID
GROUP BY c.CourseID, c.Title;

-- View 5

CREATE VIEW v_pattern_difficulty_stats AS
SELECT 
    l.Value AS DifficultyLevel,
    COUNT(p.PatternID) AS PatternCount,
    ROUND(AVG(pr.Rating), 2) AS AvgRating,
    COUNT(DISTINCT p.CreatedBy) AS CreatorCount
FROM lookup l
LEFT JOIN pattern p ON l.LookupID = p.DifficultyID AND l.Category = 'DIFFICULTY'
LEFT JOIN patternreview pr ON p.PatternID = pr.PatternID
WHERE l.Category = 'DIFFICULTY'
GROUP BY l.Value;

-- View 6

CREATE VIEW v_student_next_courses AS
SELECT 
    s.StudentID,
    p.FirstName,
    p.LastName,
    c.CourseID,
    c.Title AS NextCourse,
    l.Value AS Difficulty,
    COUNT(DISTINCT cp.PrerequisiteID) AS PrerequisitesRequired
FROM student s
JOIN person p ON s.StudentID = p.PersonID
JOIN course c ON 1=1
LEFT JOIN lookup l ON c.DifficultyID = l.LookupID
LEFT JOIN courseprerequisites cp ON c.CourseID = cp.CourseID
WHERE c.CourseID NOT IN (
    SELECT ce.CourseID FROM courseenrollment ce WHERE ce.StudentID = s.StudentID
)
AND (
    SELECT COUNT(*) FROM courseprerequisites cp2 WHERE cp2.CourseID = c.CourseID
) <= (
    SELECT COUNT(*) FROM courseprerequisites cp3
    JOIN courseenrollment ce2 ON cp3.PrerequisiteID = ce2.CourseID
    WHERE cp3.CourseID = c.CourseID
    AND ce2.StudentID = s.StudentID
    AND ce2.CompletionPercentage = 100
)
GROUP BY s.StudentID, c.CourseID;

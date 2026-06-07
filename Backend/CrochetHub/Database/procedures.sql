-- ============================================
-- STORED PROCEDURES
-- ============================================

-- Procedure 1
DELIMITER $$

CREATE PROCEDURE sp_enroll_student_in_course(
    IN p_StudentID INT,
    IN p_CourseID INT,
    OUT p_Success INT,
    OUT p_Message VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_Success = 0;
        SET p_Message = 'Enrollment failed';
    END;
    
    START TRANSACTION;
    
    IF EXISTS (SELECT 1 FROM courseenrollment WHERE StudentID = p_StudentID AND CourseID = p_CourseID) THEN
        SET p_Success = 0;
        SET p_Message = 'Already enrolled';
        ROLLBACK;
    ELSE
        INSERT INTO courseenrollment (StudentID, CourseID, CompletionPercentage, EnrolledAt)
        VALUES (p_StudentID, p_CourseID, 0, NOW());
        
        COMMIT;
        SET p_Success = 1;
        SET p_Message = 'Enrollment successful';
    END IF;
END$$

-- Procedure 2

CREATE PROCEDURE sp_mark_lesson_complete(
    IN p_StudentID INT,
    IN p_LessonID INT,
    IN p_TimeSpent INT,
    OUT p_Success INT,
    OUT p_Message VARCHAR(255)
)
BEGIN
    DECLARE courseID INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_Success = 0;
        SET p_Message = 'Error updating progress';
    END;
    
    START TRANSACTION;
    
    SELECT CourseID INTO courseID FROM lesson WHERE LessonID = p_LessonID;
    
    INSERT INTO studentprogress (StudentID, LessonID, Completed, TimeSpent, StartedAt, CompletedAt)
    VALUES (p_StudentID, p_LessonID, TRUE, p_TimeSpent, NOW(), NOW())
    ON DUPLICATE KEY UPDATE
        Completed = TRUE,
        TimeSpent = p_TimeSpent,
        CompletedAt = NOW();
    
    COMMIT;
    SET p_Success = 1;
    SET p_Message = 'Lesson marked complete';
END$$

-- Procedure 3

CREATE PROCEDURE sp_get_recommended_courses(
    IN p_StudentID INT
)
BEGIN
    SELECT
        c.CourseID,
        c.Title,
        l.Value AS Difficulty,
        COUNT(DISTINCT cp.PrerequisiteID) AS PrerequisitesMet,
        i.InstructorID,
        CONCAT(p.FirstName, ' ', p.LastName) AS InstructorName
    FROM Course c
    JOIN Lookup l ON c.DifficultyID = l.LookupID
    JOIN Instructor i ON c.InstructorID = i.InstructorID
    JOIN Person p ON i.InstructorID = p.PersonID
    LEFT JOIN CoursePrerequisites cp ON c.CourseID = cp.CourseID
    WHERE c.CourseID NOT IN (
        SELECT ce.CourseID
        FROM CourseEnrollment ce
        WHERE ce.StudentID = p_StudentID
    )
    AND (
        -- Include courses with no prerequisites at all
        c.CourseID NOT IN (SELECT CourseID FROM CoursePrerequisites)
        OR
        -- Include courses where all prerequisites are completed
        (
            SELECT COUNT(*)
            FROM CoursePrerequisites cp2
            WHERE cp2.CourseID = c.CourseID
        )
        =
        (
            SELECT COUNT(*)
            FROM CoursePrerequisites cp3
            JOIN CourseEnrollment ce2 ON cp3.PrerequisiteID = ce2.CourseID
            WHERE cp3.CourseID = c.CourseID
            AND ce2.StudentID = p_StudentID
            AND ce2.CompletionPercentage = 100
        )
    )
    GROUP BY c.CourseID
    ORDER BY Difficulty ASC;
END$$

-- Procedure 4

CREATE PROCEDURE sp_get_student_statistics(
    IN p_StudentID INT
)
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM courseenrollment WHERE StudentID = p_StudentID) AS TotalCoursesEnrolled,
        (SELECT COUNT(*) FROM courseenrollment WHERE StudentID = p_StudentID AND CompletionPercentage = 100) AS CompletedCourses,
        (SELECT ROUND(AVG(CompletionPercentage), 2) FROM courseenrollment WHERE StudentID = p_StudentID) AS AvgCompletion,
        (SELECT SUM(TimeSpent) FROM studentprogress WHERE StudentID = p_StudentID) AS TotalLearningMinutes;
END$$

DELIMITER ;
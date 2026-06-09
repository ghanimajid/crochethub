-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: crochethub
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary view structure for view `v_course_prerequisites`
--

DROP TABLE IF EXISTS `v_course_prerequisites`;
/*!50001 DROP VIEW IF EXISTS `v_course_prerequisites`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_course_prerequisites` AS SELECT 
 1 AS `CourseID`,
 1 AS `CourseTitle`,
 1 AS `Difficulty`,
 1 AS `PrerequisiteChain`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_forum_activity`
--

DROP TABLE IF EXISTS `v_forum_activity`;
/*!50001 DROP VIEW IF EXISTS `v_forum_activity`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_forum_activity` AS SELECT 
 1 AS `UserID`,
 1 AS `FirstName`,
 1 AS `LastName`,
 1 AS `ThreadsCreated`,
 1 AS `RepliesPosted`,
 1 AS `TotalUpvotes`,
 1 AS `AvgUpvotesPerReply`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_instructor_stats`
--

DROP TABLE IF EXISTS `v_instructor_stats`;
/*!50001 DROP VIEW IF EXISTS `v_instructor_stats`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_instructor_stats` AS SELECT 
 1 AS `InstructorID`,
 1 AS `FirstName`,
 1 AS `LastName`,
 1 AS `CourseID`,
 1 AS `Title`,
 1 AS `TotalEnrolled`,
 1 AS `AvgCompletion`,
 1 AS `AvgRating`,
 1 AS `CreatedAt`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_pattern_difficulty_stats`
--

DROP TABLE IF EXISTS `v_pattern_difficulty_stats`;
/*!50001 DROP VIEW IF EXISTS `v_pattern_difficulty_stats`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_pattern_difficulty_stats` AS SELECT 
 1 AS `DifficultyLevel`,
 1 AS `PatternCount`,
 1 AS `AvgRating`,
 1 AS `CreatorCount`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_student_next_courses`
--

DROP TABLE IF EXISTS `v_student_next_courses`;
/*!50001 DROP VIEW IF EXISTS `v_student_next_courses`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_student_next_courses` AS SELECT 
 1 AS `StudentID`,
 1 AS `FirstName`,
 1 AS `LastName`,
 1 AS `CourseID`,
 1 AS `NextCourse`,
 1 AS `Difficulty`,
 1 AS `PrerequisitesRequired`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_student_progress`
--

DROP TABLE IF EXISTS `v_student_progress`;
/*!50001 DROP VIEW IF EXISTS `v_student_progress`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_student_progress` AS SELECT 
 1 AS `StudentID`,
 1 AS `FirstName`,
 1 AS `LastName`,
 1 AS `CourseID`,
 1 AS `CourseName`,
 1 AS `CompletionPercentage`,
 1 AS `TotalLessons`,
 1 AS `CompletedLessons`,
 1 AS `EnrolledAt`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping routines for database 'crochethub'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_delete_user` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_user`(
    IN p_UserID INT,
    IN p_AdminID INT,
    OUT p_Success INT,
    OUT p_Message VARCHAR(255)
)
BEGIN
    DECLARE v_EnrollmentCount INT DEFAULT 0;
    DECLARE v_CourseCount INT DEFAULT 0;
    DECLARE v_FirstName VARCHAR(100);
    DECLARE v_LastName VARCHAR(100);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_Success = 0;
        SET p_Message = 'Delete failed. Transaction rolled back.';
    END;

    -- Pre-checks outside transaction
    IF p_UserID = p_AdminID THEN
        SET p_Success = 0;
        SET p_Message = 'Cannot delete your own account.';
    ELSEIF NOT EXISTS (SELECT 1 FROM user WHERE UserID = p_UserID) THEN
        SET p_Success = 0;
        SET p_Message = 'User not found.';
    ELSE
        SELECT COUNT(*) INTO v_EnrollmentCount
        FROM courseenrollment WHERE StudentID = p_UserID;

        SELECT COUNT(*) INTO v_CourseCount
        FROM course WHERE InstructorID = p_UserID;

        IF v_EnrollmentCount > 0 THEN
            SET p_Success = 0;
            SET p_Message = CONCAT('Cannot delete. Student has ', v_EnrollmentCount, ' active enrollment(s).');
        ELSEIF v_CourseCount > 0 THEN
            SET p_Success = 0;
            SET p_Message = CONCAT('Cannot delete. Instructor has ', v_CourseCount, ' active course(s).');
        ELSE
            START TRANSACTION;

            -- Backup user (person backup handled by trigger)
            INSERT INTO user_backup
                (UserID, Email, PasswordHash, ProfilePicture, Bio, RoleID, CreatedAt, BackupAction)
            SELECT UserID, Email, PasswordHash, ProfilePicture, Bio, RoleID, CreatedAt, 'DELETE'
            FROM user WHERE UserID = p_UserID;

            -- Delete person (cascades to user)
            DELETE FROM person WHERE PersonID = p_UserID;

            COMMIT;
            SET p_Success = 1;
            SET p_Message = 'User deleted successfully.';
        END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_enroll_student_in_course` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_enroll_student_in_course`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_recommended_courses` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_recommended_courses`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_student_statistics` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_student_statistics`(
    IN p_StudentID INT
)
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM courseenrollment WHERE StudentID = p_StudentID) AS TotalCoursesEnrolled,
        (SELECT COUNT(*) FROM courseenrollment WHERE StudentID = p_StudentID AND CompletionPercentage = 100) AS CompletedCourses,
        (SELECT ROUND(AVG(CompletionPercentage), 2) FROM courseenrollment WHERE StudentID = p_StudentID) AS AvgCompletion,
        (SELECT SUM(TimeSpent) FROM studentprogress WHERE StudentID = p_StudentID) AS TotalLearningMinutes;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_mark_lesson_complete` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_mark_lesson_complete`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_register_user` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_register_user`(
    IN p_FirstName VARCHAR(100),
    IN p_LastName VARCHAR(100),
    IN p_DateOfBirth DATE,
    IN p_GenderID INT,
    IN p_Email VARCHAR(150),
    IN p_PasswordHash VARCHAR(255),
    IN p_RoleID INT,
    OUT p_Success INT,
    OUT p_Message VARCHAR(255)
)
BEGIN
    DECLARE v_PersonID INT;
    DECLARE v_RoleValue VARCHAR(50);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_Success = 0;
        SET p_Message = 'Registration failed. Transaction rolled back.';
    END;

    -- Check email uniqueness before starting transaction
    IF EXISTS (SELECT 1 FROM user WHERE Email = p_Email) THEN
        SET p_Success = 0;
        SET p_Message = 'Email already exists.';
    ELSE
        START TRANSACTION;

        -- Step 1: Insert Person
        INSERT INTO person (FirstName, LastName, DateOfBirth, GenderID)
        VALUES (p_FirstName, p_LastName, p_DateOfBirth, p_GenderID);

        SET v_PersonID = LAST_INSERT_ID();

        -- Step 2: Insert User
        INSERT INTO user (UserID, Email, PasswordHash, RoleID)
        VALUES (v_PersonID, p_Email, p_PasswordHash, p_RoleID);

        -- Step 3: Insert Student or Instructor subtype
        SELECT Value INTO v_RoleValue
        FROM lookup WHERE LookupID = p_RoleID AND Category = 'ROLE';

        IF v_RoleValue = 'Student' THEN
            INSERT INTO student (StudentID, EnrollmentDate)
            VALUES (v_PersonID, CURDATE());
        ELSEIF v_RoleValue = 'Instructor' THEN
            INSERT INTO instructor (InstructorID)
            VALUES (v_PersonID);
        END IF;

        COMMIT;
        SET p_Success = 1;
        SET p_Message = 'Registration successful.';
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_transfer_course` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_transfer_course`(
    IN p_CourseID INT,
    IN p_NewInstructorID INT,
    OUT p_Success INT,
    OUT p_Message VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_Success = 0;
        SET p_Message = 'Transfer failed. Transaction rolled back.';
    END;

    IF NOT EXISTS (SELECT 1 FROM course WHERE CourseID = p_CourseID) THEN
        SET p_Success = 0;
        SET p_Message = 'Course not found.';
    ELSEIF NOT EXISTS (SELECT 1 FROM instructor WHERE InstructorID = p_NewInstructorID) THEN
        SET p_Success = 0;
        SET p_Message = 'New instructor not found.';
    ELSE
        START TRANSACTION;

        -- Backup triggers automatically
        UPDATE course
        SET InstructorID = p_NewInstructorID
        WHERE CourseID = p_CourseID;

        COMMIT;
        SET p_Success = 1;
        SET p_Message = 'Course transferred successfully.';
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_course` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_course`(
    IN p_CourseID INT,
    IN p_Title VARCHAR(200),
    IN p_Description TEXT,
    IN p_DifficultyID INT,
    OUT p_Success INT,
    OUT p_Message VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_Success = 0;
        SET p_Message = 'Course update failed. Transaction rolled back.';
    END;

    IF NOT EXISTS (SELECT 1 FROM course WHERE CourseID = p_CourseID) THEN
        SET p_Success = 0;
        SET p_Message = 'Course not found.';
    ELSE
        START TRANSACTION;

        -- Backup is handled automatically by trg_course_before_update trigger
        UPDATE course
        SET
            Title       = COALESCE(p_Title, Title),
            Description = COALESCE(p_Description, Description),
            DifficultyID = COALESCE(p_DifficultyID, DifficultyID)
        WHERE CourseID = p_CourseID;

        COMMIT;
        SET p_Success = 1;
        SET p_Message = 'Course updated successfully.';
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `v_course_prerequisites`
--

/*!50001 DROP VIEW IF EXISTS `v_course_prerequisites`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_course_prerequisites` AS select `c`.`CourseID` AS `CourseID`,`c`.`Title` AS `CourseTitle`,`l`.`Value` AS `Difficulty`,group_concat(concat(`pr`.`CourseID`,':',`pr`.`Title`) separator ' -> ') AS `PrerequisiteChain` from (((`course` `c` left join `lookup` `l` on((`c`.`DifficultyID` = `l`.`LookupID`))) left join `courseprerequisites` `cp` on((`c`.`CourseID` = `cp`.`CourseID`))) left join `course` `pr` on((`cp`.`PrerequisiteID` = `pr`.`CourseID`))) group by `c`.`CourseID`,`c`.`Title` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_forum_activity`
--

/*!50001 DROP VIEW IF EXISTS `v_forum_activity`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_forum_activity` AS select `u`.`UserID` AS `UserID`,`p`.`FirstName` AS `FirstName`,`p`.`LastName` AS `LastName`,count(distinct `ft`.`ThreadID`) AS `ThreadsCreated`,count(distinct `fr`.`ReplyID`) AS `RepliesPosted`,sum(coalesce(`fr`.`Upvotes`,0)) AS `TotalUpvotes`,round(avg(coalesce(`fr`.`Upvotes`,0)),2) AS `AvgUpvotesPerReply` from (((`users` `u` join `person` `p` on((`u`.`UserID` = `p`.`PersonID`))) left join `forumthread` `ft` on((`u`.`UserID` = `ft`.`UserID`))) left join `forumreply` `fr` on((`u`.`UserID` = `fr`.`UserID`))) group by `u`.`UserID`,`p`.`FirstName`,`p`.`LastName` having ((count(distinct `ft`.`ThreadID`) > 0) or (count(distinct `fr`.`ReplyID`) > 0)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_instructor_stats`
--

/*!50001 DROP VIEW IF EXISTS `v_instructor_stats`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_instructor_stats` AS select `i`.`InstructorID` AS `InstructorID`,`p`.`FirstName` AS `FirstName`,`p`.`LastName` AS `LastName`,`c`.`CourseID` AS `CourseID`,`c`.`Title` AS `Title`,count(distinct `ce`.`StudentID`) AS `TotalEnrolled`,round(avg(`ce`.`CompletionPercentage`),2) AS `AvgCompletion`,round(avg(`cr`.`Rating`),2) AS `AvgRating`,`c`.`CreatedAt` AS `CreatedAt` from ((((`instructor` `i` join `person` `p` on((`i`.`InstructorID` = `p`.`PersonID`))) join `course` `c` on((`i`.`InstructorID` = `c`.`InstructorID`))) left join `courseenrollment` `ce` on((`c`.`CourseID` = `ce`.`CourseID`))) left join `coursereview` `cr` on((`c`.`CourseID` = `cr`.`CourseID`))) group by `i`.`InstructorID`,`p`.`FirstName`,`p`.`LastName`,`c`.`CourseID`,`c`.`Title`,`c`.`CreatedAt` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_pattern_difficulty_stats`
--

/*!50001 DROP VIEW IF EXISTS `v_pattern_difficulty_stats`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_pattern_difficulty_stats` AS select `l`.`Value` AS `DifficultyLevel`,count(`p`.`PatternID`) AS `PatternCount`,round(avg(`pr`.`Rating`),2) AS `AvgRating`,count(distinct `p`.`CreatedBy`) AS `CreatorCount` from ((`lookup` `l` left join `pattern` `p` on(((`l`.`LookupID` = `p`.`DifficultyID`) and (`l`.`Category` = 'DIFFICULTY')))) left join `patternreview` `pr` on((`p`.`PatternID` = `pr`.`PatternID`))) where (`l`.`Category` = 'DIFFICULTY') group by `l`.`Value` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_student_next_courses`
--

/*!50001 DROP VIEW IF EXISTS `v_student_next_courses`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_student_next_courses` AS select `s`.`StudentID` AS `StudentID`,`p`.`FirstName` AS `FirstName`,`p`.`LastName` AS `LastName`,`c`.`CourseID` AS `CourseID`,`c`.`Title` AS `NextCourse`,`l`.`Value` AS `Difficulty`,count(distinct `cp`.`PrerequisiteID`) AS `PrerequisitesRequired` from ((((`student` `s` join `person` `p` on((`s`.`StudentID` = `p`.`PersonID`))) join `course` `c` on((1 = 1))) left join `lookup` `l` on((`c`.`DifficultyID` = `l`.`LookupID`))) left join `courseprerequisites` `cp` on((`c`.`CourseID` = `cp`.`CourseID`))) where (`c`.`CourseID` in (select `ce`.`CourseID` from `courseenrollment` `ce` where (`ce`.`StudentID` = `s`.`StudentID`)) is false and ((select count(0) from `courseprerequisites` `cp2` where (`cp2`.`CourseID` = `c`.`CourseID`)) <= (select count(0) from (`courseprerequisites` `cp3` join `courseenrollment` `ce2` on((`cp3`.`PrerequisiteID` = `ce2`.`CourseID`))) where ((`cp3`.`CourseID` = `c`.`CourseID`) and (`ce2`.`StudentID` = `s`.`StudentID`) and (`ce2`.`CompletionPercentage` = 100))))) group by `s`.`StudentID`,`c`.`CourseID` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_student_progress`
--

/*!50001 DROP VIEW IF EXISTS `v_student_progress`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_student_progress` AS select `s`.`StudentID` AS `StudentID`,`p`.`FirstName` AS `FirstName`,`p`.`LastName` AS `LastName`,`c`.`CourseID` AS `CourseID`,`c`.`Title` AS `CourseName`,`ce`.`CompletionPercentage` AS `CompletionPercentage`,count(distinct `l`.`LessonID`) AS `TotalLessons`,sum((case when (`sp`.`Completed` = true) then 1 else 0 end)) AS `CompletedLessons`,`ce`.`EnrolledAt` AS `EnrolledAt` from (((((`student` `s` join `person` `p` on((`s`.`StudentID` = `p`.`PersonID`))) join `courseenrollment` `ce` on((`s`.`StudentID` = `ce`.`StudentID`))) join `course` `c` on((`ce`.`CourseID` = `c`.`CourseID`))) left join `lesson` `l` on((`c`.`CourseID` = `l`.`CourseID`))) left join `studentprogress` `sp` on(((`s`.`StudentID` = `sp`.`StudentID`) and (`l`.`LessonID` = `sp`.`LessonID`)))) group by `s`.`StudentID`,`p`.`FirstName`,`p`.`LastName`,`c`.`CourseID`,`c`.`Title`,`ce`.`CompletionPercentage`,`ce`.`EnrolledAt` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-10  0:55:07

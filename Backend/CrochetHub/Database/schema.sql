CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `ProductVersion` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
) CHARACTER SET=utf8mb4;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE TABLE `lookup` (
        `LookupID` int NOT NULL AUTO_INCREMENT,
        `Value` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
        `Category` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
        CONSTRAINT `PK_lookup` PRIMARY KEY (`LookupID`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE TABLE `tag` (
        `TagID` int NOT NULL AUTO_INCREMENT,
        `Name` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
        CONSTRAINT `PK_tag` PRIMARY KEY (`TagID`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE TABLE `person` (
        `PersonID` int NOT NULL AUTO_INCREMENT,
        `FirstName` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
        `LastName` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
        `DateOfBirth` datetime(6) NULL,
        `GenderID` int NULL,
        `CreatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_person` PRIMARY KEY (`PersonID`),
        CONSTRAINT `FK_person_lookup_GenderID` FOREIGN KEY (`GenderID`) REFERENCES `lookup` (`LookupID`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE TABLE `users` (
        `UserID` int NOT NULL,
        `Email` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
        `PasswordHash` longtext CHARACTER SET utf8mb4 NOT NULL,
        `ProfilePicture` longtext CHARACTER SET utf8mb4 NULL,
        `Bio` longtext CHARACTER SET utf8mb4 NULL,
        `RoleID` int NOT NULL,
        `CreatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_users` PRIMARY KEY (`UserID`),
        CONSTRAINT `FK_users_lookup_RoleID` FOREIGN KEY (`RoleID`) REFERENCES `lookup` (`LookupID`) ON DELETE CASCADE,
        CONSTRAINT `FK_users_person_UserID` FOREIGN KEY (`UserID`) REFERENCES `person` (`PersonID`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE TABLE `auditlog` (
        `LogID` int NOT NULL AUTO_INCREMENT,
        `UserID` int NOT NULL,
        `ActionID` int NULL,
        `EntityType` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
        `EntityID` int NULL,
        `OldValue` longtext CHARACTER SET utf8mb4 NULL,
        `NewValue` longtext CHARACTER SET utf8mb4 NULL,
        `Timestamp` datetime(6) NOT NULL,
        CONSTRAINT `PK_auditlog` PRIMARY KEY (`LogID`),
        CONSTRAINT `FK_auditlog_lookup_ActionID` FOREIGN KEY (`ActionID`) REFERENCES `lookup` (`LookupID`),
        CONSTRAINT `FK_auditlog_users_UserID` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE TABLE `forumthread` (
        `ThreadID` int NOT NULL AUTO_INCREMENT,
        `UserID` int NOT NULL,
        `Title` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
        `Content` longtext CHARACTER SET utf8mb4 NULL,
        `CategoryID` int NULL,
        `CreatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_forumthread` PRIMARY KEY (`ThreadID`),
        CONSTRAINT `FK_forumthread_lookup_CategoryID` FOREIGN KEY (`CategoryID`) REFERENCES `lookup` (`LookupID`),
        CONSTRAINT `FK_forumthread_users_UserID` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE TABLE `instructor` (
        `InstructorID` int NOT NULL,
        `Bio` longtext CHARACTER SET utf8mb4 NULL,
        `ExperienceYears` int NULL,
        CONSTRAINT `PK_instructor` PRIMARY KEY (`InstructorID`),
        CONSTRAINT `FK_instructor_users_InstructorID` FOREIGN KEY (`InstructorID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE TABLE `notification` (
        `NotificationID` int NOT NULL AUTO_INCREMENT,
        `UserID` int NOT NULL,
        `Message` longtext CHARACTER SET utf8mb4 NOT NULL,
        `TypeID` int NULL,
        `IsRead` tinyint(1) NOT NULL,
        `CreatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_notification` PRIMARY KEY (`NotificationID`),
        CONSTRAINT `FK_notification_lookup_TypeID` FOREIGN KEY (`TypeID`) REFERENCES `lookup` (`LookupID`),
        CONSTRAINT `FK_notification_users_UserID` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE TABLE `student` (
        `StudentID` int NOT NULL,
        `EnrollmentDate` datetime(6) NULL,
        CONSTRAINT `PK_student` PRIMARY KEY (`StudentID`),
        CONSTRAINT `FK_student_users_StudentID` FOREIGN KEY (`StudentID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE TABLE `forumreply` (
        `ReplyID` int NOT NULL AUTO_INCREMENT,
        `ThreadID` int NOT NULL,
        `UserID` int NOT NULL,
        `Content` longtext CHARACTER SET utf8mb4 NOT NULL,
        `Upvotes` int NOT NULL,
        `CreatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_forumreply` PRIMARY KEY (`ReplyID`),
        CONSTRAINT `FK_forumreply_forumthread_ThreadID` FOREIGN KEY (`ThreadID`) REFERENCES `forumthread` (`ThreadID`) ON DELETE CASCADE,
        CONSTRAINT `FK_forumreply_users_UserID` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE TABLE `course` (
        `CourseID` int NOT NULL AUTO_INCREMENT,
        `Title` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
        `Description` longtext CHARACTER SET utf8mb4 NULL,
        `DifficultyID` int NULL,
        `InstructorID` int NOT NULL,
        `ThumbnailURL` longtext CHARACTER SET utf8mb4 NULL,
        `CreatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_course` PRIMARY KEY (`CourseID`),
        CONSTRAINT `FK_course_instructor_InstructorID` FOREIGN KEY (`InstructorID`) REFERENCES `instructor` (`InstructorID`) ON DELETE RESTRICT,
        CONSTRAINT `FK_course_lookup_DifficultyID` FOREIGN KEY (`DifficultyID`) REFERENCES `lookup` (`LookupID`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE TABLE `courseenrollment` (
        `EnrollmentID` int NOT NULL AUTO_INCREMENT,
        `StudentID` int NOT NULL,
        `CourseID` int NOT NULL,
        `EnrolledAt` datetime(6) NOT NULL,
        `CompletionPercentage` decimal(65,30) NOT NULL,
        CONSTRAINT `PK_courseenrollment` PRIMARY KEY (`EnrollmentID`),
        CONSTRAINT `FK_courseenrollment_course_CourseID` FOREIGN KEY (`CourseID`) REFERENCES `course` (`CourseID`) ON DELETE CASCADE,
        CONSTRAINT `FK_courseenrollment_student_StudentID` FOREIGN KEY (`StudentID`) REFERENCES `student` (`StudentID`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE TABLE `courseprerequisites` (
        `CourseID` int NOT NULL,
        `PrerequisiteID` int NOT NULL,
        CONSTRAINT `PK_courseprerequisites` PRIMARY KEY (`CourseID`, `PrerequisiteID`),
        CONSTRAINT `FK_courseprerequisites_course_CourseID` FOREIGN KEY (`CourseID`) REFERENCES `course` (`CourseID`) ON DELETE CASCADE,
        CONSTRAINT `FK_courseprerequisites_course_PrerequisiteID` FOREIGN KEY (`PrerequisiteID`) REFERENCES `course` (`CourseID`) ON DELETE RESTRICT
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE TABLE `coursereview` (
        `ReviewID` int NOT NULL AUTO_INCREMENT,
        `StudentID` int NOT NULL,
        `CourseID` int NOT NULL,
        `Rating` int NOT NULL,
        `Comment` longtext CHARACTER SET utf8mb4 NULL,
        `CreatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_coursereview` PRIMARY KEY (`ReviewID`),
        CONSTRAINT `FK_coursereview_course_CourseID` FOREIGN KEY (`CourseID`) REFERENCES `course` (`CourseID`) ON DELETE CASCADE,
        CONSTRAINT `FK_coursereview_student_StudentID` FOREIGN KEY (`StudentID`) REFERENCES `student` (`StudentID`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE TABLE `coursetag` (
        `CourseID` int NOT NULL,
        `TagID` int NOT NULL,
        CONSTRAINT `PK_coursetag` PRIMARY KEY (`CourseID`, `TagID`),
        CONSTRAINT `FK_coursetag_course_CourseID` FOREIGN KEY (`CourseID`) REFERENCES `course` (`CourseID`) ON DELETE CASCADE,
        CONSTRAINT `FK_coursetag_tag_TagID` FOREIGN KEY (`TagID`) REFERENCES `tag` (`TagID`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE TABLE `lesson` (
        `LessonID` int NOT NULL AUTO_INCREMENT,
        `CourseID` int NOT NULL,
        `Title` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
        `VideoURL` longtext CHARACTER SET utf8mb4 NULL,
        `Content` longtext CHARACTER SET utf8mb4 NULL,
        `SequenceOrder` int NOT NULL,
        CONSTRAINT `PK_lesson` PRIMARY KEY (`LessonID`),
        CONSTRAINT `FK_lesson_course_CourseID` FOREIGN KEY (`CourseID`) REFERENCES `course` (`CourseID`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE TABLE `pattern` (
        `PatternID` int NOT NULL AUTO_INCREMENT,
        `Title` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
        `DifficultyID` int NULL,
        `Description` longtext CHARACTER SET utf8mb4 NULL,
        `CourseID` int NULL,
        `CreatedBy` int NOT NULL,
        `CreatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_pattern` PRIMARY KEY (`PatternID`),
        CONSTRAINT `FK_pattern_course_CourseID` FOREIGN KEY (`CourseID`) REFERENCES `course` (`CourseID`) ON DELETE SET NULL,
        CONSTRAINT `FK_pattern_lookup_DifficultyID` FOREIGN KEY (`DifficultyID`) REFERENCES `lookup` (`LookupID`),
        CONSTRAINT `FK_pattern_users_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `users` (`UserID`) ON DELETE RESTRICT
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE TABLE `studentprogress` (
        `ProgressID` int NOT NULL AUTO_INCREMENT,
        `StudentID` int NOT NULL,
        `LessonID` int NOT NULL,
        `Completed` tinyint(1) NOT NULL,
        `TimeSpent` int NOT NULL,
        `StartedAt` datetime(6) NULL,
        `CompletedAt` datetime(6) NULL,
        CONSTRAINT `PK_studentprogress` PRIMARY KEY (`ProgressID`),
        CONSTRAINT `FK_studentprogress_lesson_LessonID` FOREIGN KEY (`LessonID`) REFERENCES `lesson` (`LessonID`) ON DELETE CASCADE,
        CONSTRAINT `FK_studentprogress_student_StudentID` FOREIGN KEY (`StudentID`) REFERENCES `student` (`StudentID`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE TABLE `patternmaterial` (
        `MaterialID` int NOT NULL AUTO_INCREMENT,
        `PatternID` int NOT NULL,
        `MaterialName` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
        `Quantity` longtext CHARACTER SET utf8mb4 NULL,
        CONSTRAINT `PK_patternmaterial` PRIMARY KEY (`MaterialID`),
        CONSTRAINT `FK_patternmaterial_pattern_PatternID` FOREIGN KEY (`PatternID`) REFERENCES `pattern` (`PatternID`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE TABLE `patternreview` (
        `ReviewID` int NOT NULL AUTO_INCREMENT,
        `UserID` int NOT NULL,
        `PatternID` int NOT NULL,
        `Rating` int NOT NULL,
        `Comment` longtext CHARACTER SET utf8mb4 NULL,
        `CreatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_patternreview` PRIMARY KEY (`ReviewID`),
        CONSTRAINT `FK_patternreview_pattern_PatternID` FOREIGN KEY (`PatternID`) REFERENCES `pattern` (`PatternID`) ON DELETE CASCADE,
        CONSTRAINT `FK_patternreview_users_UserID` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE TABLE `patterntag` (
        `PatternID` int NOT NULL,
        `TagID` int NOT NULL,
        CONSTRAINT `PK_patterntag` PRIMARY KEY (`PatternID`, `TagID`),
        CONSTRAINT `FK_patterntag_pattern_PatternID` FOREIGN KEY (`PatternID`) REFERENCES `pattern` (`PatternID`) ON DELETE CASCADE,
        CONSTRAINT `FK_patterntag_tag_TagID` FOREIGN KEY (`TagID`) REFERENCES `tag` (`TagID`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    INSERT INTO `lookup` (`LookupID`, `Category`, `Value`)
    VALUES (1, 'GENDER', 'Male'),
    (2, 'GENDER', 'Female'),
    (3, 'DIFFICULTY', 'Beginner'),
    (4, 'DIFFICULTY', 'Intermediate'),
    (5, 'DIFFICULTY', 'Advanced'),
    (6, 'ROLE', 'Student'),
    (7, 'ROLE', 'Instructor'),
    (8, 'ROLE', 'Admin'),
    (9, 'FORUM_CATEGORY', 'Beginner Help'),
    (10, 'FORUM_CATEGORY', 'Pattern Sharing'),
    (11, 'FORUM_CATEGORY', 'Tools and Materials'),
    (12, 'FORUM_CATEGORY', 'General Discussion'),
    (13, 'NOTIFICATION_TYPE', 'Enrollment'),
    (14, 'NOTIFICATION_TYPE', 'Reply'),
    (15, 'NOTIFICATION_TYPE', 'Achievement'),
    (16, 'NOTIFICATION_TYPE', 'System'),
    (17, 'ACTION', 'INSERT'),
    (18, 'ACTION', 'UPDATE'),
    (19, 'ACTION', 'DELETE');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    INSERT INTO `person` (`PersonID`, `CreatedAt`, `DateOfBirth`, `FirstName`, `GenderID`, `LastName`)
    VALUES (1, '2025-01-01 00:00:00', '1990-01-01 00:00:00', 'Admin', 1, 'User');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    INSERT INTO `users` (`UserID`, `Bio`, `CreatedAt`, `Email`, `PasswordHash`, `ProfilePicture`, `RoleID`)
    VALUES (1, NULL, '2025-01-01 00:00:00', 'admin@crochethub.com', '$2a$11$0ftU8Iyoqqem5Ezf7zGKe.qPNNjJipaENcVTopn5zjNoC9exiT.6q', NULL, 8);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE INDEX `IX_auditlog_ActionID` ON `auditlog` (`ActionID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE INDEX `IX_auditlog_UserID` ON `auditlog` (`UserID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE INDEX `IX_course_DifficultyID` ON `course` (`DifficultyID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE INDEX `IX_course_InstructorID` ON `course` (`InstructorID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE INDEX `IX_courseenrollment_CourseID` ON `courseenrollment` (`CourseID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_courseenrollment_StudentID_CourseID` ON `courseenrollment` (`StudentID`, `CourseID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE INDEX `IX_courseprerequisites_PrerequisiteID` ON `courseprerequisites` (`PrerequisiteID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE INDEX `IX_coursereview_CourseID` ON `coursereview` (`CourseID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_coursereview_StudentID_CourseID` ON `coursereview` (`StudentID`, `CourseID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE INDEX `IX_coursetag_TagID` ON `coursetag` (`TagID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE INDEX `IX_forumreply_ThreadID` ON `forumreply` (`ThreadID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE INDEX `IX_forumreply_UserID` ON `forumreply` (`UserID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE INDEX `IX_forumthread_CategoryID` ON `forumthread` (`CategoryID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE INDEX `IX_forumthread_UserID` ON `forumthread` (`UserID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE INDEX `IX_lesson_CourseID` ON `lesson` (`CourseID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE INDEX `IX_notification_TypeID` ON `notification` (`TypeID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE INDEX `IX_notification_UserID` ON `notification` (`UserID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE INDEX `IX_pattern_CourseID` ON `pattern` (`CourseID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE INDEX `IX_pattern_CreatedBy` ON `pattern` (`CreatedBy`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE INDEX `IX_pattern_DifficultyID` ON `pattern` (`DifficultyID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE INDEX `IX_patternmaterial_PatternID` ON `patternmaterial` (`PatternID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE INDEX `IX_patternreview_PatternID` ON `patternreview` (`PatternID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_patternreview_UserID_PatternID` ON `patternreview` (`UserID`, `PatternID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE INDEX `IX_patterntag_TagID` ON `patterntag` (`TagID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE INDEX `IX_person_GenderID` ON `person` (`GenderID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE INDEX `IX_studentprogress_LessonID` ON `studentprogress` (`LessonID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_studentprogress_StudentID_LessonID` ON `studentprogress` (`StudentID`, `LessonID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_tag_Name` ON `tag` (`Name`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_users_Email` ON `users` (`Email`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    CREATE INDEX `IX_users_RoleID` ON `users` (`RoleID`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260514083024_InitialCreate') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20260514083024_InitialCreate', '8.0.2');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;


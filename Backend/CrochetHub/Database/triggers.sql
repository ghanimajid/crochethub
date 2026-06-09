-- ============================================
-- BACKUP TABLES
-- ============================================

CREATE TABLE person_backup (
    BackupID INT PRIMARY KEY AUTO_INCREMENT,
    PersonID INT,
    FirstName VARCHAR(100),
    LastName VARCHAR(100),
    DateOfBirth DATE,
    GenderID INT,
    CreatedAt TIMESTAMP,
    BackupAction VARCHAR(10),        -- 'DELETE' or 'UPDATE'
    BackupTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_backup (
    BackupID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    Email VARCHAR(150),
    PasswordHash VARCHAR(255),
    ProfilePicture VARCHAR(500),
    Bio TEXT,
    RoleID INT,
    CreatedAt TIMESTAMP,
    BackupAction VARCHAR(10),
    BackupTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE course_backup (
    BackupID INT PRIMARY KEY AUTO_INCREMENT,
    CourseID INT,
    Title VARCHAR(200),
    Description TEXT,
    DifficultyID INT,
    InstructorID INT,
    ThumbnailURL VARCHAR(500),
    CreatedAt TIMESTAMP,
    BackupAction VARCHAR(10),
    BackupTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lesson_backup (
    BackupID INT PRIMARY KEY AUTO_INCREMENT,
    LessonID INT,
    CourseID INT,
    Title VARCHAR(200),
    VideoURL VARCHAR(500),
    Content TEXT,
    SequenceOrder INT,
    BackupAction VARCHAR(10),
    BackupTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pattern_backup (
    BackupID INT PRIMARY KEY AUTO_INCREMENT,
    PatternID INT,
    Title VARCHAR(200),
    DifficultyID INT,
    Description TEXT,
    CourseID INT,
    CreatedBy INT,
    CreatedAt TIMESTAMP,
    BackupAction VARCHAR(10),
    ThumbnailURL varchar(500),
    BackupTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courseenrollment_backup (
    BackupID INT PRIMARY KEY AUTO_INCREMENT,
    EnrollmentID INT,
    StudentID INT,
    CourseID INT,
    EnrolledAt TIMESTAMP,
    CompletionPercentage DECIMAL(5,2),
    BackupAction VARCHAR(10),
    BackupTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
DELIMITER $$


-- ============================================
-- PERSON TRIGGERS
-- ============================================
DROP TRIGGER IF EXISTS trg_person_before_delete$$
CREATE TRIGGER trg_person_before_delete
BEFORE DELETE ON person FOR EACH ROW
BEGIN
    -- Backup user row FIRST before cascade kills it
    INSERT INTO user_backup
        (UserID, Email, PasswordHash, ProfilePicture, Bio, RoleID, CreatedAt, BackupAction)
    SELECT UserID, Email, PasswordHash, ProfilePicture, Bio, RoleID, CreatedAt, 'DELETE'
    FROM users WHERE UserID = OLD.PersonID;

    -- Backup person row
    INSERT INTO person_backup
        (PersonID, FirstName, LastName, DateOfBirth, GenderID, CreatedAt, BackupAction)
    VALUES
        (OLD.PersonID, OLD.FirstName, OLD.LastName, OLD.DateOfBirth,
         OLD.GenderID, OLD.CreatedAt, 'DELETE');
END$$

DROP TRIGGER IF EXISTS trg_person_before_update$$
CREATE TRIGGER trg_person_before_update
BEFORE UPDATE ON person FOR EACH ROW
BEGIN
    INSERT INTO person_backup
        (PersonID, FirstName, LastName, DateOfBirth, GenderID, CreatedAt, BackupAction)
    VALUES
        (OLD.PersonID, OLD.FirstName, OLD.LastName, OLD.DateOfBirth,
         OLD.GenderID, OLD.CreatedAt, 'UPDATE');
END$$

-- ============================================
-- USER TRIGGERS
-- ============================================
DROP TRIGGER IF EXISTS trg_user_before_delete$$
CREATE TRIGGER trg_user_before_delete
BEFORE DELETE ON users FOR EACH ROW
BEGIN
    INSERT INTO user_backup
        (UserID, Email, PasswordHash, ProfilePicture, Bio, RoleID, CreatedAt, BackupAction)
    VALUES
        (OLD.UserID, OLD.Email, OLD.PasswordHash, OLD.ProfilePicture,
         OLD.Bio, OLD.RoleID, OLD.CreatedAt, 'DELETE');
END$$

DROP TRIGGER IF EXISTS trg_user_before_update$$
CREATE TRIGGER trg_user_before_update
BEFORE UPDATE ON users FOR EACH ROW
BEGIN
    INSERT INTO user_backup
        (UserID, Email, PasswordHash, ProfilePicture, Bio, RoleID, CreatedAt, BackupAction)
    VALUES
        (OLD.UserID, OLD.Email, OLD.PasswordHash, OLD.ProfilePicture,
         OLD.Bio, OLD.RoleID, OLD.CreatedAt, 'UPDATE');
END$$

-- ============================================
-- COURSE TRIGGERS
-- ============================================
DROP TRIGGER IF EXISTS trg_course_before_delete$$
CREATE TRIGGER trg_course_before_delete
BEFORE DELETE ON course FOR EACH ROW
BEGIN
    INSERT INTO course_backup
        (CourseID, Title, Description, DifficultyID, InstructorID,
         ThumbnailURL, CreatedAt, BackupAction)
    VALUES
        (OLD.CourseID, OLD.Title, OLD.Description, OLD.DifficultyID,
         OLD.InstructorID, OLD.ThumbnailURL, OLD.CreatedAt, 'DELETE');
END$$

DROP TRIGGER IF EXISTS trg_course_before_update$$
CREATE TRIGGER trg_course_before_update
BEFORE UPDATE ON course FOR EACH ROW
BEGIN
    INSERT INTO course_backup
        (CourseID, Title, Description, DifficultyID, InstructorID,
         ThumbnailURL, CreatedAt, BackupAction)
    VALUES
        (OLD.CourseID, OLD.Title, OLD.Description, OLD.DifficultyID,
         OLD.InstructorID, OLD.ThumbnailURL, OLD.CreatedAt, 'UPDATE');
END$$

-- ============================================
-- LESSON TRIGGERS
-- ============================================
DROP TRIGGER IF EXISTS trg_lesson_before_delete$$
CREATE TRIGGER trg_lesson_before_delete
BEFORE DELETE ON lesson FOR EACH ROW
BEGIN
    INSERT INTO lesson_backup
        (LessonID, CourseID, Title, VideoURL, Content, SequenceOrder, BackupAction)
    VALUES
        (OLD.LessonID, OLD.CourseID, OLD.Title, OLD.VideoURL,
         OLD.Content, OLD.SequenceOrder, 'DELETE');
END$$

DROP TRIGGER IF EXISTS trg_lesson_before_update$$
CREATE TRIGGER trg_lesson_before_update
BEFORE UPDATE ON lesson FOR EACH ROW
BEGIN
    INSERT INTO lesson_backup
        (LessonID, CourseID, Title, VideoURL, Content, SequenceOrder, BackupAction)
    VALUES
        (OLD.LessonID, OLD.CourseID, OLD.Title, OLD.VideoURL,
         OLD.Content, OLD.SequenceOrder, 'UPDATE');
END$$

-- ============================================
-- PATTERN TRIGGERS
-- ============================================
DROP TRIGGER IF EXISTS trg_pattern_before_delete$$
CREATE TRIGGER trg_pattern_before_delete
BEFORE DELETE ON pattern FOR EACH ROW
BEGIN
    INSERT INTO pattern_backup
        (PatternID, Title, DifficultyID, Description, CourseID,
         CreatedBy, CreatedAt, ThumbnailURL, BackupAction)
    VALUES
        (OLD.PatternID, OLD.Title, OLD.DifficultyID, OLD.Description,
         OLD.CourseID, OLD.CreatedBy, OLD.CreatedAt, OLD.ThumbnailURL, 'DELETE');
END$$

DROP TRIGGER IF EXISTS trg_pattern_before_update$$
CREATE TRIGGER trg_pattern_before_update
BEFORE UPDATE ON pattern FOR EACH ROW
BEGIN
    INSERT INTO pattern_backup
        (PatternID, Title, DifficultyID, Description, CourseID,
         CreatedBy, CreatedAt, ThumbnailURL, BackupAction)
    VALUES
        (OLD.PatternID, OLD.Title, OLD.DifficultyID, OLD.Description,
         OLD.CourseID, OLD.CreatedBy, OLD.CreatedAt, OLD.ThumbnailURL, 'UPDATE');
END$$

-- ============================================
-- COURSEENROLLMENT TRIGGERS
-- ============================================
DROP TRIGGER IF EXISTS trg_courseenrollment_before_delete$$
CREATE TRIGGER trg_courseenrollment_before_delete
BEFORE DELETE ON courseenrollment FOR EACH ROW
BEGIN
    INSERT INTO courseenrollment_backup
        (EnrollmentID, StudentID, CourseID, EnrolledAt,
         CompletionPercentage, BackupAction)
    VALUES
        (OLD.EnrollmentID, OLD.StudentID, OLD.CourseID,
         OLD.EnrolledAt, OLD.CompletionPercentage, 'DELETE');
END$$

DROP TRIGGER IF EXISTS trg_courseenrollment_before_update$$
CREATE TRIGGER trg_courseenrollment_before_update
BEFORE UPDATE ON courseenrollment FOR EACH ROW
BEGIN
    INSERT INTO courseenrollment_backup
        (EnrollmentID, StudentID, CourseID, EnrolledAt,
         CompletionPercentage, BackupAction)
    VALUES
        (OLD.EnrollmentID, OLD.StudentID, OLD.CourseID,
         OLD.EnrolledAt, OLD.CompletionPercentage, 'UPDATE');
END$$

DELIMITER ;


-- ============================================
-- TRIGGERS
-- ============================================

DELIMITER $$
-- TRIGGER 1: Prevent enrolling without completed prerequisites
CREATE TRIGGER trg_check_prerequisites
BEFORE INSERT ON courseenrollment
FOR EACH ROW
BEGIN
    DECLARE prereqCount INT;
    DECLARE completedCount INT;

    SELECT COUNT(*) INTO prereqCount
    FROM courseprerequisites
    WHERE CourseID = NEW.CourseID;

    IF prereqCount > 0 THEN
        SELECT COUNT(*) INTO completedCount
        FROM courseprerequisites cp
        JOIN courseenrollment ce ON cp.PrerequisiteID = ce.CourseID
        WHERE cp.CourseID = NEW.CourseID
        AND ce.StudentID = NEW.StudentID
        AND ce.CompletionPercentage = 100;

        IF completedCount < prereqCount THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Student has not completed all prerequisites';
        END IF;
    END IF;
END$$

-- TRIGGER 2: Auto-update completion percentage when lesson marked complete
CREATE TRIGGER trg_update_completion
AFTER UPDATE ON studentprogress
FOR EACH ROW
BEGIN
    DECLARE totalLessons INT;
    DECLARE completedLessons INT;
    DECLARE courseID INT;

    IF NEW.Completed = TRUE AND OLD.Completed = FALSE THEN
        SELECT CourseID INTO courseID FROM lesson WHERE LessonID = NEW.LessonID;
        
        SELECT COUNT(*) INTO totalLessons FROM lesson WHERE CourseID = courseID;
        
        SELECT COUNT(*) INTO completedLessons
        FROM studentprogress sp
        JOIN lesson l ON sp.LessonID = l.LessonID
        WHERE l.CourseID = courseID AND sp.StudentID = NEW.StudentID AND sp.Completed = TRUE;
        
        IF totalLessons > 0 THEN
            UPDATE courseenrollment
            SET CompletionPercentage = ROUND((completedLessons / totalLessons) * 100, 2)
            WHERE StudentID = NEW.StudentID AND CourseID = courseID;
        END IF;
    END IF;
END$$

-- TRIGGER 3: Prevent reviewing without enrollment
CREATE TRIGGER trg_review_enrollment_check
BEFORE INSERT ON coursereview
FOR EACH ROW
BEGIN
    DECLARE isEnrolled INT;
    
    SELECT COUNT(*) INTO isEnrolled
    FROM courseenrollment
    WHERE StudentID = NEW.StudentID AND CourseID = NEW.CourseID;
    
    IF isEnrolled = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Student must be enrolled to review course';
    END IF;
END$$

-- TRIGGER 4: Notify thread owner on reply
CREATE TRIGGER trg_notify_thread_reply
AFTER INSERT ON forumreply
FOR EACH ROW
BEGIN
    DECLARE threadOwner INT;
    
    SELECT UserID INTO threadOwner FROM forumthread WHERE ThreadID = NEW.ThreadID;
    
    IF threadOwner != NEW.UserID THEN
        INSERT INTO notification (UserID, Message, TypeID, IsRead, CreatedAt)
        VALUES (threadOwner, CONCAT('New reply to your thread'), 15, FALSE, NOW());
    END IF;
END$$

-- TRIGGER 5 Log every course enrollment in AuditLog
CREATE TRIGGER trg_audit_enrollment
AFTER INSERT ON courseenrollment
FOR EACH ROW
BEGIN
    DECLARE actionID INT;

    SELECT LookupID INTO actionID
    FROM lookup WHERE Value = 'INSERT' AND Category = 'ACTION';

    INSERT INTO AuditLog (UserID, ActionID, EntityType, EntityID, NewValue, Timestamp)
    VALUES (
        NEW.StudentID,
        actionID,
        'CourseEnrollment',
        NEW.EnrollmentID,
        CONCAT('Enrolled in Course ', NEW.CourseID),
        NOW()
    );
END$$

-- TRIGGER 6 Prevent completion percentage from decreasing
CREATE TRIGGER trg_prevent_completion_downgrade
BEFORE UPDATE ON courseenrollment
FOR EACH ROW
BEGIN
    IF NEW.CompletionPercentage < OLD.CompletionPercentage THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Completion percentage cannot decrease';
    END IF;
END$$

-- TRIGGER 7 Auto create Student subtype record when a user registers as Student
CREATE TRIGGER trg_auto_create_student
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    DECLARE studentRoleID INT;

    SELECT LookupID INTO studentRoleID
    FROM lookup WHERE Value = 'Student' AND Category = 'ROLE';

    IF NEW.RoleID = studentRoleID THEN
        INSERT INTO Student (StudentID, EnrollmentDate)
        VALUES (NEW.UserID, CURDATE());
    END IF;
END$$

-- TRIGGER 8 - Validate pattern material quantity is not empty
CREATE TRIGGER trg_validate_material_quantity
BEFORE INSERT ON patternmaterial
FOR EACH ROW
BEGIN
    IF NEW.Quantity IS NULL OR CHAR_LENGTH(TRIM(NEW.Quantity)) = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Material quantity cannot be empty';
    END IF;
END$$

DELIMITER ;
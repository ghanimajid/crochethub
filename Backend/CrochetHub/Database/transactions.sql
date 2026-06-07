DELIMITER $$

-- ============================================
-- TRANSACTION 1: Register User (atomic)
-- Person + User + Student/Instructor must all
-- succeed or all rollback
-- ============================================
CREATE PROCEDURE sp_register_user(
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
    IF EXISTS (SELECT 1 FROM usera WHERE Email = p_Email) THEN
        SET p_Success = 0;
        SET p_Message = 'Email already exists.';
    ELSE
        START TRANSACTION;

        -- Step 1: Insert Person
        INSERT INTO person (FirstName, LastName, DateOfBirth, GenderID)
        VALUES (p_FirstName, p_LastName, p_DateOfBirth, p_GenderID);

        SET v_PersonID = LAST_INSERT_ID();

        -- Step 2: Insert User
        INSERT INTO usera (UserID, Email, PasswordHash, RoleID)
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
END$$


-- ============================================
-- TRANSACTION 2: Delete User (atomic)
-- Backup → Delete user → Delete person
-- All or nothing
-- ============================================
CREATE PROCEDURE sp_delete_user(
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
    ELSEIF NOT EXISTS (SELECT 1 FROM users WHERE UserID = p_UserID) THEN
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
            FROM users WHERE UserID = p_UserID;

            -- Delete person (cascades to user)
            DELETE FROM person WHERE PersonID = p_UserID;

            COMMIT;
            SET p_Success = 1;
            SET p_Message = 'User deleted successfully.';
        END IF;
    END IF;
END$$


-- ============================================
-- TRANSACTION 3: Update Course (atomic)
-- Backup old values → update course →
-- replace tags → replace prerequisites
-- ============================================
CREATE PROCEDURE sp_update_course(
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
END$$


-- ============================================
-- TRANSACTION 4: Transfer Course Ownership
-- Atomic instructor reassignment
-- Old instructor loses course, new one gets it
-- ============================================
CREATE PROCEDURE sp_transfer_course(
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
END$$

DELIMITER ;
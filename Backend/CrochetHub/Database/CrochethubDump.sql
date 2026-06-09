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
-- Table structure for table `__efmigrationshistory`
--

DROP TABLE IF EXISTS `__efmigrationshistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProductVersion` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__efmigrationshistory`
--

LOCK TABLES `__efmigrationshistory` WRITE;
/*!40000 ALTER TABLE `__efmigrationshistory` DISABLE KEYS */;
INSERT INTO `__efmigrationshistory` VALUES ('20260514083024_InitialCreate','8.0.2');
/*!40000 ALTER TABLE `__efmigrationshistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auditlog`
--

DROP TABLE IF EXISTS `auditlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditlog` (
  `LogID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `ActionID` int DEFAULT NULL,
  `EntityType` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `EntityID` int DEFAULT NULL,
  `OldValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `NewValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Timestamp` datetime(6) NOT NULL,
  PRIMARY KEY (`LogID`),
  KEY `IX_auditlog_ActionID` (`ActionID`),
  KEY `IX_auditlog_UserID` (`UserID`),
  CONSTRAINT `FK_auditlog_lookup_ActionID` FOREIGN KEY (`ActionID`) REFERENCES `lookup` (`LookupID`),
  CONSTRAINT `FK_auditlog_users_UserID` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditlog`
--

LOCK TABLES `auditlog` WRITE;
/*!40000 ALTER TABLE `auditlog` DISABLE KEYS */;
INSERT INTO `auditlog` VALUES (1,4,17,'Course',1,NULL,'Course \'Beginner Crochet\' created','2026-05-15 20:11:15.220491'),(2,4,18,'Course',1,'Title: Beginner Crochet','Title: Beginner Crochet','2026-05-15 20:16:41.933623'),(3,2,17,'CourseEnrollment',1,NULL,'Student 2 enrolled in Course 1','2026-05-15 20:22:35.830314'),(4,1,18,'Course',1,'Title: Beginner Crochet','Title: Beginner Crochet','2026-05-15 20:35:23.162142'),(5,4,17,'Course',2,NULL,'Course \'test course\' created','2026-05-15 20:39:35.309341'),(6,4,19,'Course',2,'Course \'test course\' deleted',NULL,'2026-05-15 20:40:26.521543'),(7,1,17,'Tag',1,NULL,'Tag \'beginner\' created','2026-05-16 11:25:14.826518'),(8,1,17,'Tag',2,NULL,'Tag \'amigurumi\' created','2026-05-16 11:25:57.430463'),(9,1,18,'Course',1,'Title: Beginner Crochet','Title: Beginner Crochet','2026-05-16 11:27:02.531075'),(10,1,17,'Tag',3,NULL,'Tag \'advanced\' created','2026-05-16 11:29:16.185499'),(11,1,17,'Tag',4,NULL,'Tag \'keychain\' created','2026-05-16 11:29:25.635852'),(12,1,17,'Tag',5,NULL,'Tag \'test\' created','2026-05-16 11:29:34.420441'),(13,1,19,'Tag',5,'Tag \'test\' deleted',NULL,'2026-05-16 11:29:55.541171'),(14,4,17,'Course',3,NULL,'Course \'test crochet\' created','2026-05-16 11:36:17.938510'),(15,4,19,'Course',3,'Course \'test crochet\' deleted',NULL,'2026-05-16 11:37:12.969765'),(16,1,18,'User',3,'Role: Student','Role: Instructor','2026-05-17 11:36:11.107651'),(17,1,19,'User',3,'User \'Test User2\' (testuser1@gmail.com) deleted',NULL,'2026-05-17 11:37:41.938542'),(19,4,18,'Instructor',4,NULL,'Instructor profile updated','2026-05-17 13:58:44.171475'),(20,4,17,'Lesson',1,NULL,'Lesson \'Introduction to Crochet\' created in Course 1','2026-05-20 06:16:28.295294'),(21,4,18,'Lesson',1,'Title: Introduction to Crochet','Title: Introduction to Crochet','2026-05-20 06:19:26.372781'),(22,4,18,'Lesson',1,'Title: Introduction to Crochet','Title: Introduction to Crochet','2026-05-20 06:20:11.264785'),(23,4,17,'Lesson',2,NULL,'Lesson \'Test\' created in Course 1','2026-05-20 06:20:42.634503'),(24,4,19,'Lesson',2,'Lesson \'Test\' deleted from Course 1',NULL,'2026-05-20 06:22:27.088319'),(25,2,17,'Pattern',1,NULL,'Pattern \'Simple Granny Square\' created','2026-05-21 10:23:53.887384'),(26,2,17,'Pattern',2,NULL,'Pattern \'test\' created','2026-05-21 10:26:45.694681'),(27,2,19,'Pattern',2,'Pattern \'test\' deleted',NULL,'2026-05-21 10:27:02.701651'),(28,4,17,'Pattern',3,NULL,'Pattern \'Amigurumi Teddy Bear\' created','2026-05-21 10:31:08.423591'),(29,4,17,'PatternReview',1,NULL,'Review added for Pattern 1 with Rating 5','2026-05-21 10:33:00.627631'),(30,4,19,'PatternReview',1,'Review deleted for Pattern 1',NULL,'2026-05-21 10:33:46.266392'),(31,4,17,'PatternReview',2,NULL,'Review added for Pattern 1 with Rating 5','2026-05-21 10:33:55.923903'),(32,2,17,'ForumThread',1,NULL,'Thread \'Need help with crochet hooks\' created','2026-05-22 09:13:22.104783'),(33,2,17,'ForumThread',2,NULL,'Thread \'test forum\' created','2026-05-22 09:16:01.254304'),(34,2,18,'ForumThread',2,'Title: test forum','Title: Yarn Recommendations','2026-05-22 09:16:42.634798'),(35,2,17,'ForumReply',1,NULL,'Reply added to Thread 1','2026-05-22 09:17:39.108279'),(36,2,18,'ForumReply',1,'Content updated','New content length: 9 chars','2026-05-22 09:18:18.482719'),(37,2,19,'ForumReply',1,'Reply deleted from Thread 1',NULL,'2026-05-22 09:18:33.228330'),(38,4,17,'ForumReply',2,NULL,'Reply added to Thread 1','2026-05-22 09:19:38.819859'),(39,2,18,'Student',2,NULL,'Student profile updated','2026-05-24 15:31:02.478920'),(40,1,19,'User',8,'User \'testt testt\' (user@gmail.com) deleted',NULL,'2026-05-24 15:52:23.071549'),(41,1,19,'User',9,'User \'testtt testtt\' (testttusersss@gmail.com) deleted',NULL,'2026-05-24 15:52:31.190902'),(42,2,17,'CourseReview',1,NULL,'Review added for Course 1 with Rating 5','2026-05-25 13:33:33.847465'),(43,2,17,'Pattern',4,NULL,'Pattern \'test pattern\' created','2026-05-29 14:34:19.386482'),(44,2,18,'Pattern',4,'Title: test pattern','Title: test pattern','2026-05-29 14:43:43.715756'),(45,2,19,'Pattern',4,'Pattern \'test pattern\' deleted',NULL,'2026-05-29 14:49:57.800843'),(46,4,18,'Instructor',4,NULL,'Instructor profile updated','2026-05-30 20:16:03.629602'),(47,4,18,'Instructor',4,NULL,'Instructor profile updated','2026-05-30 20:16:40.370290'),(48,10,17,'PatternReview',3,NULL,'Review added for Pattern 3 with Rating 4','2026-06-06 11:56:44.053215'),(49,10,17,'ForumReply',3,NULL,'Reply added to Thread 2','2026-06-06 11:57:38.776577');
/*!40000 ALTER TABLE `auditlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `CourseID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `DifficultyID` int DEFAULT NULL,
  `InstructorID` int NOT NULL,
  `ThumbnailURL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `CreatedAt` datetime(6) NOT NULL,
  PRIMARY KEY (`CourseID`),
  KEY `IX_course_DifficultyID` (`DifficultyID`),
  KEY `IX_course_InstructorID` (`InstructorID`),
  CONSTRAINT `FK_course_instructor_InstructorID` FOREIGN KEY (`InstructorID`) REFERENCES `instructor` (`InstructorID`) ON DELETE RESTRICT,
  CONSTRAINT `FK_course_lookup_DifficultyID` FOREIGN KEY (`DifficultyID`) REFERENCES `lookup` (`LookupID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (1,'Crochet for Beginners','This is a course for beginners who want to get a hang of crochet. It is very beginner friendly. Have fun Crocheting!',3,4,'https://th.bing.com/th/id/OIP.WS4Uy7ouJI-YEPFHzx5oogHaEK?w=202&h=113&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3','2026-05-15 20:11:15.179224');
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_backup`
--

DROP TABLE IF EXISTS `course_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_backup` (
  `BackupID` int NOT NULL AUTO_INCREMENT,
  `CourseID` int DEFAULT NULL,
  `Title` varchar(200) DEFAULT NULL,
  `Description` text,
  `DifficultyID` int DEFAULT NULL,
  `InstructorID` int DEFAULT NULL,
  `ThumbnailURL` varchar(500) DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT NULL,
  `BackupAction` varchar(10) DEFAULT NULL,
  `BackupTimestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`BackupID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_backup`
--

LOCK TABLES `course_backup` WRITE;
/*!40000 ALTER TABLE `course_backup` DISABLE KEYS */;
INSERT INTO `course_backup` VALUES (1,1,'Beginner Crochet','---',3,4,'https://placehold.co/600x400','2026-05-15 15:11:15','UPDATE','2026-06-06 11:43:25'),(2,1,'Beginner Crochet','---',3,4,'https://th.bing.com/th/id/OIP.WS4Uy7ouJI-YEPFHzx5oogHaEK?w=202&h=113&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3','2026-05-15 15:11:15','UPDATE','2026-06-06 11:45:53');
/*!40000 ALTER TABLE `course_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courseenrollment`
--

DROP TABLE IF EXISTS `courseenrollment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courseenrollment` (
  `EnrollmentID` int NOT NULL AUTO_INCREMENT,
  `StudentID` int NOT NULL,
  `CourseID` int NOT NULL,
  `EnrolledAt` datetime(6) NOT NULL,
  `CompletionPercentage` decimal(65,30) NOT NULL,
  PRIMARY KEY (`EnrollmentID`),
  UNIQUE KEY `IX_courseenrollment_StudentID_CourseID` (`StudentID`,`CourseID`),
  KEY `IX_courseenrollment_CourseID` (`CourseID`),
  CONSTRAINT `FK_courseenrollment_course_CourseID` FOREIGN KEY (`CourseID`) REFERENCES `course` (`CourseID`) ON DELETE CASCADE,
  CONSTRAINT `FK_courseenrollment_student_StudentID` FOREIGN KEY (`StudentID`) REFERENCES `student` (`StudentID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courseenrollment`
--

LOCK TABLES `courseenrollment` WRITE;
/*!40000 ALTER TABLE `courseenrollment` DISABLE KEYS */;
INSERT INTO `courseenrollment` VALUES (1,2,1,'2026-05-15 20:22:35.771473',100.000000000000000000000000000000);
/*!40000 ALTER TABLE `courseenrollment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courseenrollment_backup`
--

DROP TABLE IF EXISTS `courseenrollment_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courseenrollment_backup` (
  `BackupID` int NOT NULL AUTO_INCREMENT,
  `EnrollmentID` int DEFAULT NULL,
  `StudentID` int DEFAULT NULL,
  `CourseID` int DEFAULT NULL,
  `EnrolledAt` timestamp NULL DEFAULT NULL,
  `CompletionPercentage` decimal(5,2) DEFAULT NULL,
  `BackupAction` varchar(10) DEFAULT NULL,
  `BackupTimestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`BackupID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courseenrollment_backup`
--

LOCK TABLES `courseenrollment_backup` WRITE;
/*!40000 ALTER TABLE `courseenrollment_backup` DISABLE KEYS */;
/*!40000 ALTER TABLE `courseenrollment_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courseprerequisites`
--

DROP TABLE IF EXISTS `courseprerequisites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courseprerequisites` (
  `CourseID` int NOT NULL,
  `PrerequisiteID` int NOT NULL,
  PRIMARY KEY (`CourseID`,`PrerequisiteID`),
  KEY `IX_courseprerequisites_PrerequisiteID` (`PrerequisiteID`),
  CONSTRAINT `FK_courseprerequisites_course_CourseID` FOREIGN KEY (`CourseID`) REFERENCES `course` (`CourseID`) ON DELETE CASCADE,
  CONSTRAINT `FK_courseprerequisites_course_PrerequisiteID` FOREIGN KEY (`PrerequisiteID`) REFERENCES `course` (`CourseID`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courseprerequisites`
--

LOCK TABLES `courseprerequisites` WRITE;
/*!40000 ALTER TABLE `courseprerequisites` DISABLE KEYS */;
/*!40000 ALTER TABLE `courseprerequisites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coursereview`
--

DROP TABLE IF EXISTS `coursereview`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coursereview` (
  `ReviewID` int NOT NULL AUTO_INCREMENT,
  `StudentID` int NOT NULL,
  `CourseID` int NOT NULL,
  `Rating` int NOT NULL,
  `Comment` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `CreatedAt` datetime(6) NOT NULL,
  PRIMARY KEY (`ReviewID`),
  UNIQUE KEY `IX_coursereview_StudentID_CourseID` (`StudentID`,`CourseID`),
  KEY `IX_coursereview_CourseID` (`CourseID`),
  CONSTRAINT `FK_coursereview_course_CourseID` FOREIGN KEY (`CourseID`) REFERENCES `course` (`CourseID`) ON DELETE CASCADE,
  CONSTRAINT `FK_coursereview_student_StudentID` FOREIGN KEY (`StudentID`) REFERENCES `student` (`StudentID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coursereview`
--

LOCK TABLES `coursereview` WRITE;
/*!40000 ALTER TABLE `coursereview` DISABLE KEYS */;
INSERT INTO `coursereview` VALUES (1,2,1,5,'This is a very helpful course','2026-05-25 13:33:33.430268');
/*!40000 ALTER TABLE `coursereview` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coursetag`
--

DROP TABLE IF EXISTS `coursetag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coursetag` (
  `CourseID` int NOT NULL,
  `TagID` int NOT NULL,
  PRIMARY KEY (`CourseID`,`TagID`),
  KEY `IX_coursetag_TagID` (`TagID`),
  CONSTRAINT `FK_coursetag_course_CourseID` FOREIGN KEY (`CourseID`) REFERENCES `course` (`CourseID`) ON DELETE CASCADE,
  CONSTRAINT `FK_coursetag_tag_TagID` FOREIGN KEY (`TagID`) REFERENCES `tag` (`TagID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coursetag`
--

LOCK TABLES `coursetag` WRITE;
/*!40000 ALTER TABLE `coursetag` DISABLE KEYS */;
INSERT INTO `coursetag` VALUES (1,1);
/*!40000 ALTER TABLE `coursetag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forumreply`
--

DROP TABLE IF EXISTS `forumreply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forumreply` (
  `ReplyID` int NOT NULL AUTO_INCREMENT,
  `ThreadID` int NOT NULL,
  `UserID` int NOT NULL,
  `Content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Upvotes` int NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  PRIMARY KEY (`ReplyID`),
  KEY `IX_forumreply_ThreadID` (`ThreadID`),
  KEY `IX_forumreply_UserID` (`UserID`),
  CONSTRAINT `FK_forumreply_forumthread_ThreadID` FOREIGN KEY (`ThreadID`) REFERENCES `forumthread` (`ThreadID`) ON DELETE CASCADE,
  CONSTRAINT `FK_forumreply_users_UserID` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forumreply`
--

LOCK TABLES `forumreply` WRITE;
/*!40000 ALTER TABLE `forumreply` DISABLE KEYS */;
INSERT INTO `forumreply` VALUES (2,1,4,'I found the 4mm hook easiest to work with in the beginning.',2,'2026-05-22 09:19:38.788393'),(3,2,10,'For beginners, acrylic yarn is the best but then you can try out others',0,'2026-06-06 11:57:38.638497');
/*!40000 ALTER TABLE `forumreply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forumthread`
--

DROP TABLE IF EXISTS `forumthread`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forumthread` (
  `ThreadID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `Title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `CategoryID` int DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  PRIMARY KEY (`ThreadID`),
  KEY `IX_forumthread_CategoryID` (`CategoryID`),
  KEY `IX_forumthread_UserID` (`UserID`),
  CONSTRAINT `FK_forumthread_lookup_CategoryID` FOREIGN KEY (`CategoryID`) REFERENCES `lookup` (`LookupID`),
  CONSTRAINT `FK_forumthread_users_UserID` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forumthread`
--

LOCK TABLES `forumthread` WRITE;
/*!40000 ALTER TABLE `forumthread` DISABLE KEYS */;
INSERT INTO `forumthread` VALUES (1,2,'Need help with crochet hooks','Which hook size is best for beginners?',9,'2026-05-22 09:13:21.972558'),(2,2,'Yarn Recommendations','Which yarn is easiest to work with?',11,'2026-05-22 09:16:01.216058');
/*!40000 ALTER TABLE `forumthread` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instructor`
--

DROP TABLE IF EXISTS `instructor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instructor` (
  `InstructorID` int NOT NULL,
  `Bio` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ExperienceYears` int DEFAULT NULL,
  PRIMARY KEY (`InstructorID`),
  CONSTRAINT `FK_instructor_users_InstructorID` FOREIGN KEY (`InstructorID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructor`
--

LOCK TABLES `instructor` WRITE;
/*!40000 ALTER TABLE `instructor` DISABLE KEYS */;
INSERT INTO `instructor` VALUES (4,'Im a crochet enthusiast who wants to spread their knowledge with others.',10),(11,NULL,NULL);
/*!40000 ALTER TABLE `instructor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lesson`
--

DROP TABLE IF EXISTS `lesson`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lesson` (
  `LessonID` int NOT NULL AUTO_INCREMENT,
  `CourseID` int NOT NULL,
  `Title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `VideoURL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `SequenceOrder` int NOT NULL,
  PRIMARY KEY (`LessonID`),
  KEY `IX_lesson_CourseID` (`CourseID`),
  CONSTRAINT `FK_lesson_course_CourseID` FOREIGN KEY (`CourseID`) REFERENCES `course` (`CourseID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lesson`
--

LOCK TABLES `lesson` WRITE;
/*!40000 ALTER TABLE `lesson` DISABLE KEYS */;
INSERT INTO `lesson` VALUES (1,1,'Introduction to Crochet','https://youtube.com/watch?v=test','Welcome to crochet basics.',1);
/*!40000 ALTER TABLE `lesson` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lesson_backup`
--

DROP TABLE IF EXISTS `lesson_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lesson_backup` (
  `BackupID` int NOT NULL AUTO_INCREMENT,
  `LessonID` int DEFAULT NULL,
  `CourseID` int DEFAULT NULL,
  `Title` varchar(200) DEFAULT NULL,
  `VideoURL` varchar(500) DEFAULT NULL,
  `Content` text,
  `SequenceOrder` int DEFAULT NULL,
  `BackupAction` varchar(10) DEFAULT NULL,
  `BackupTimestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`BackupID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lesson_backup`
--

LOCK TABLES `lesson_backup` WRITE;
/*!40000 ALTER TABLE `lesson_backup` DISABLE KEYS */;
/*!40000 ALTER TABLE `lesson_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lookup`
--

DROP TABLE IF EXISTS `lookup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lookup` (
  `LookupID` int NOT NULL AUTO_INCREMENT,
  `Value` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`LookupID`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lookup`
--

LOCK TABLES `lookup` WRITE;
/*!40000 ALTER TABLE `lookup` DISABLE KEYS */;
INSERT INTO `lookup` VALUES (1,'Male','GENDER'),(2,'Female','GENDER'),(3,'Beginner','DIFFICULTY'),(4,'Intermediate','DIFFICULTY'),(5,'Advanced','DIFFICULTY'),(6,'Student','ROLE'),(7,'Instructor','ROLE'),(8,'Admin','ROLE'),(9,'Beginner Help','FORUM_CATEGORY'),(10,'Pattern Sharing','FORUM_CATEGORY'),(11,'Tools and Materials','FORUM_CATEGORY'),(12,'General Discussion','FORUM_CATEGORY'),(13,'Enrollment','NOTIFICATION_TYPE'),(14,'Reply','NOTIFICATION_TYPE'),(15,'Achievement','NOTIFICATION_TYPE'),(16,'System','NOTIFICATION_TYPE'),(17,'INSERT','ACTION'),(18,'UPDATE','ACTION'),(19,'DELETE','ACTION');
/*!40000 ALTER TABLE `lookup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `NotificationID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `Message` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `TypeID` int DEFAULT NULL,
  `IsRead` tinyint(1) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  PRIMARY KEY (`NotificationID`),
  KEY `IX_notification_TypeID` (`TypeID`),
  KEY `IX_notification_UserID` (`UserID`),
  CONSTRAINT `FK_notification_lookup_TypeID` FOREIGN KEY (`TypeID`) REFERENCES `lookup` (`LookupID`),
  CONSTRAINT `FK_notification_users_UserID` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,2,'New reply to your thread',15,0,'2026-05-22 14:19:38.000000'),(2,2,'New reply to your thread',15,0,'2026-06-06 16:57:38.000000');
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pattern`
--

DROP TABLE IF EXISTS `pattern`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pattern` (
  `PatternID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `DifficultyID` int DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `CourseID` int DEFAULT NULL,
  `CreatedBy` int NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `ThumbnailURL` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`PatternID`),
  KEY `IX_pattern_CourseID` (`CourseID`),
  KEY `IX_pattern_CreatedBy` (`CreatedBy`),
  KEY `IX_pattern_DifficultyID` (`DifficultyID`),
  CONSTRAINT `FK_pattern_course_CourseID` FOREIGN KEY (`CourseID`) REFERENCES `course` (`CourseID`) ON DELETE SET NULL,
  CONSTRAINT `FK_pattern_lookup_DifficultyID` FOREIGN KEY (`DifficultyID`) REFERENCES `lookup` (`LookupID`),
  CONSTRAINT `FK_pattern_users_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `users` (`UserID`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pattern`
--

LOCK TABLES `pattern` WRITE;
/*!40000 ALTER TABLE `pattern` DISABLE KEYS */;
INSERT INTO `pattern` VALUES (1,'Simple Granny Square',3,'A classic granny square pattern perfect for beginners. Start with a magic ring, chain 3, work 2 double crochets into the ring. Chain 2, work 3 double crochets into the ring. Repeat 2 more times. Chain 2, slip stitch to top of beginning chain 3 to close. Round 2: Slip stitch to corner space, chain 3, work 2 double crochets in same space. Chain 1, work 3 double crochets in next corner space. Repeat around. Fasten off and weave in ends.',NULL,2,'2026-05-21 10:23:53.458916','https://tse2.mm.bing.net/th/id/OIP.eWXAYT4DG2UbnrxFXNbinwHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'),(3,'Amigurumi Teddy Bear',5,'An adorable stuffed teddy bear using amigurumi techniques. Magic ring, 6 single crochets. Round 2: 2 single crochets in each stitch around — 12 stitches. Round 3: Single crochet, 2 single crochets in next stitch, repeat around — 18 stitches. Continue increasing until 36 stitches for the head. Work even for 6 rounds. Begin decreasing. Stuff firmly before closing. For ears, make two small circles of 12 stitches and sew onto head. Embroider face with black yarn.',NULL,4,'2026-05-21 10:31:08.343481','https://th.bing.com/th/id/OIP.8h3oyyvsI8Ls5OaQO21aGgHaHa?w=195&h=195&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3');
/*!40000 ALTER TABLE `pattern` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pattern_backup`
--

DROP TABLE IF EXISTS `pattern_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pattern_backup` (
  `BackupID` int NOT NULL AUTO_INCREMENT,
  `PatternID` int DEFAULT NULL,
  `Title` varchar(200) DEFAULT NULL,
  `DifficultyID` int DEFAULT NULL,
  `Description` text,
  `CourseID` int DEFAULT NULL,
  `CreatedBy` int DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT NULL,
  `BackupAction` varchar(10) DEFAULT NULL,
  `ThumbnailURL` varchar(500) DEFAULT NULL,
  `BackupTimestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`BackupID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pattern_backup`
--

LOCK TABLES `pattern_backup` WRITE;
/*!40000 ALTER TABLE `pattern_backup` DISABLE KEYS */;
INSERT INTO `pattern_backup` VALUES (2,1,'Simple Granny Square',3,'A classic granny square pattern perfect for beginners. Start with a magic ring, chain 3, work 2 double crochets into the ring. Chain 2, work 3 double crochets into the ring. Repeat 2 more times. Chain 2, slip stitch to top of beginning chain 3 to close. Round 2: Slip stitch to corner space, chain 3, work 2 double crochets in same space. Chain 1, work 3 double crochets in next corner space. Repeat around. Fasten off and weave in ends.',NULL,2,'2026-05-21 05:23:53','UPDATE',NULL,'2026-06-06 11:39:56'),(3,3,'Amigurumi Teddy Bear',5,'An adorable stuffed teddy bear using amigurumi techniques. Magic ring, 6 single crochets. Round 2: 2 single crochets in each stitch around — 12 stitches. Round 3: Single crochet, 2 single crochets in next stitch, repeat around — 18 stitches. Continue increasing until 36 stitches for the head. Work even for 6 rounds. Begin decreasing. Stuff firmly before closing. For ears, make two small circles of 12 stitches and sew onto head. Embroider face with black yarn.',NULL,4,'2026-05-21 05:31:08','UPDATE',NULL,'2026-06-06 11:39:56'),(4,1,'Simple Granny Square',3,'A classic granny square pattern perfect for beginners. Start with a magic ring, chain 3, work 2 double crochets into the ring. Chain 2, work 3 double crochets into the ring. Repeat 2 more times. Chain 2, slip stitch to top of beginning chain 3 to close. Round 2: Slip stitch to corner space, chain 3, work 2 double crochets in same space. Chain 1, work 3 double crochets in next corner space. Repeat around. Fasten off and weave in ends.',NULL,2,'2026-05-21 05:23:53','UPDATE','','2026-06-06 11:41:50');
/*!40000 ALTER TABLE `pattern_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patternmaterial`
--

DROP TABLE IF EXISTS `patternmaterial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patternmaterial` (
  `MaterialID` int NOT NULL AUTO_INCREMENT,
  `PatternID` int NOT NULL,
  `MaterialName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Quantity` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`MaterialID`),
  KEY `IX_patternmaterial_PatternID` (`PatternID`),
  CONSTRAINT `FK_patternmaterial_pattern_PatternID` FOREIGN KEY (`PatternID`) REFERENCES `pattern` (`PatternID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patternmaterial`
--

LOCK TABLES `patternmaterial` WRITE;
/*!40000 ALTER TABLE `patternmaterial` DISABLE KEYS */;
INSERT INTO `patternmaterial` VALUES (1,1,'Worsted Weight Yarn','100g'),(2,1,'Crochet Hook','5mm'),(3,1,'Scissors','1'),(4,1,'Yarn Needle','1'),(9,3,'Worsted Weight Yarn (Brown)','150g'),(10,3,'Crochet Hook','4mm'),(11,3,'Safety Eyes','2 x 12mm'),(12,3,'Polyfill Stuffing','50g'),(13,3,'Yarn Needle','1'),(14,3,'Stitch Markers','2');
/*!40000 ALTER TABLE `patternmaterial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patternreview`
--

DROP TABLE IF EXISTS `patternreview`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patternreview` (
  `ReviewID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `PatternID` int NOT NULL,
  `Rating` int NOT NULL,
  `Comment` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `CreatedAt` datetime(6) NOT NULL,
  PRIMARY KEY (`ReviewID`),
  UNIQUE KEY `IX_patternreview_UserID_PatternID` (`UserID`,`PatternID`),
  KEY `IX_patternreview_PatternID` (`PatternID`),
  CONSTRAINT `FK_patternreview_pattern_PatternID` FOREIGN KEY (`PatternID`) REFERENCES `pattern` (`PatternID`) ON DELETE CASCADE,
  CONSTRAINT `FK_patternreview_users_UserID` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patternreview`
--

LOCK TABLES `patternreview` WRITE;
/*!40000 ALTER TABLE `patternreview` DISABLE KEYS */;
INSERT INTO `patternreview` VALUES (2,4,1,5,'The best pattern I\'ve tried yet. Easy to make.','2026-05-21 10:33:55.837439'),(3,10,3,4,'I loved this pattern! it was so easy to follow and it turned out great.','2026-06-06 11:56:43.969402');
/*!40000 ALTER TABLE `patternreview` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patterntag`
--

DROP TABLE IF EXISTS `patterntag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patterntag` (
  `PatternID` int NOT NULL,
  `TagID` int NOT NULL,
  PRIMARY KEY (`PatternID`,`TagID`),
  KEY `IX_patterntag_TagID` (`TagID`),
  CONSTRAINT `FK_patterntag_pattern_PatternID` FOREIGN KEY (`PatternID`) REFERENCES `pattern` (`PatternID`) ON DELETE CASCADE,
  CONSTRAINT `FK_patterntag_tag_TagID` FOREIGN KEY (`TagID`) REFERENCES `tag` (`TagID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patterntag`
--

LOCK TABLES `patterntag` WRITE;
/*!40000 ALTER TABLE `patterntag` DISABLE KEYS */;
INSERT INTO `patterntag` VALUES (1,1),(3,2),(3,3);
/*!40000 ALTER TABLE `patterntag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person` (
  `PersonID` int NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `LastName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `DateOfBirth` datetime(6) DEFAULT NULL,
  `GenderID` int DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  PRIMARY KEY (`PersonID`),
  KEY `IX_person_GenderID` (`GenderID`),
  CONSTRAINT `FK_person_lookup_GenderID` FOREIGN KEY (`GenderID`) REFERENCES `lookup` (`LookupID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
INSERT INTO `person` VALUES (1,'Admin','User','1990-01-01 00:00:00.000000',1,'2025-01-01 00:00:00.000000'),(2,'Ghania','Majid','2026-05-21 00:00:00.000000',2,'2026-05-14 15:58:48.576085'),(4,'Zainab','Aftab','2003-05-15 19:56:16.569000',2,'2026-05-15 19:57:52.145846'),(10,'Sarah ','Ahmed','2006-06-13 00:00:00.000000',2,'2026-06-06 11:25:06.830920'),(11,'Seemal','Majid','2004-06-09 17:25:54.259000',2,'2026-06-09 17:26:52.994074');
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person_backup`
--

DROP TABLE IF EXISTS `person_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person_backup` (
  `BackupID` int NOT NULL AUTO_INCREMENT,
  `PersonID` int DEFAULT NULL,
  `FirstName` varchar(100) DEFAULT NULL,
  `LastName` varchar(100) DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `GenderID` int DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT NULL,
  `BackupAction` varchar(10) DEFAULT NULL,
  `BackupTimestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`BackupID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person_backup`
--

LOCK TABLES `person_backup` WRITE;
/*!40000 ALTER TABLE `person_backup` DISABLE KEYS */;
INSERT INTO `person_backup` VALUES (1,9,'testtt','testtt','2026-05-24',2,'2026-05-24 10:51:16','DELETE','2026-06-05 16:31:48'),(2,8,'testt','testt','2026-05-24',3,'2026-05-24 10:36:16','DELETE','2026-06-05 16:32:19'),(3,3,'Test','User2','2004-05-14',1,'2026-05-14 12:20:46','DELETE','2026-06-05 16:32:26'),(4,6,'test','user','2016-05-17',2,'2026-05-17 08:23:05','DELETE','2026-06-05 16:33:17'),(5,5,'test','user','2016-05-17',2,'2026-05-17 08:22:40','DELETE','2026-06-05 17:58:48');
/*!40000 ALTER TABLE `person_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `StudentID` int NOT NULL,
  `EnrollmentDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`StudentID`),
  CONSTRAINT `FK_student_users_StudentID` FOREIGN KEY (`StudentID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (2,'2026-05-14 15:58:49.143730'),(10,'2026-06-06 11:25:07.558718');
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentprogress`
--

DROP TABLE IF EXISTS `studentprogress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentprogress` (
  `ProgressID` int NOT NULL AUTO_INCREMENT,
  `StudentID` int NOT NULL,
  `LessonID` int NOT NULL,
  `Completed` tinyint(1) NOT NULL,
  `TimeSpent` int NOT NULL,
  `StartedAt` datetime(6) DEFAULT NULL,
  `CompletedAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`ProgressID`),
  UNIQUE KEY `IX_studentprogress_StudentID_LessonID` (`StudentID`,`LessonID`),
  KEY `IX_studentprogress_LessonID` (`LessonID`),
  CONSTRAINT `FK_studentprogress_lesson_LessonID` FOREIGN KEY (`LessonID`) REFERENCES `lesson` (`LessonID`) ON DELETE CASCADE,
  CONSTRAINT `FK_studentprogress_student_StudentID` FOREIGN KEY (`StudentID`) REFERENCES `student` (`StudentID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentprogress`
--

LOCK TABLES `studentprogress` WRITE;
/*!40000 ALTER TABLE `studentprogress` DISABLE KEYS */;
INSERT INTO `studentprogress` VALUES (1,2,1,1,25,'2026-05-20 06:27:55.960823','2026-05-20 06:27:55.960897');
/*!40000 ALTER TABLE `studentprogress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tag` (
  `TagID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`TagID`),
  UNIQUE KEY `IX_tag_Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag`
--

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
INSERT INTO `tag` VALUES (3,'advanced'),(2,'amigurumi'),(1,'beginner'),(4,'keychain');
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_backup`
--

DROP TABLE IF EXISTS `user_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_backup` (
  `BackupID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `Email` varchar(150) DEFAULT NULL,
  `PasswordHash` varchar(255) DEFAULT NULL,
  `ProfilePicture` varchar(500) DEFAULT NULL,
  `Bio` text,
  `RoleID` int DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT NULL,
  `BackupAction` varchar(10) DEFAULT NULL,
  `BackupTimestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`BackupID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_backup`
--

LOCK TABLES `user_backup` WRITE;
/*!40000 ALTER TABLE `user_backup` DISABLE KEYS */;
INSERT INTO `user_backup` VALUES (1,7,'majid@gmail.com','$2a$11$6c4BrTrgCi8dGuyvk.PEveOXHKCNvAcT4kFYhKZvcH8DFHvYflu.S',NULL,NULL,6,'2026-05-21 11:27:24','DELETE','2026-06-05 17:37:19'),(2,10,'sarahahmed@gmail.com','$2a$11$KiMIbpBwsPSFpPRr4JU/7.pGh57hTj69wP5gVywINAcwdCSJIjlcS',NULL,NULL,6,'2026-06-06 06:25:08','UPDATE','2026-06-06 11:52:06'),(3,10,'sarahahmed@gmail.com','$2a$11$KiMIbpBwsPSFpPRr4JU/7.pGh57hTj69wP5gVywINAcwdCSJIjlcS','https://i.ibb.co/wr7mrvcZ/Whats-App-Image-2026-05-30-at-3-47-00-PM-1.jpg','I started crocheting as a distraction from my problems and fell in love with it and now i create different things.',6,'2026-06-06 06:25:08','UPDATE','2026-06-06 11:54:57');
/*!40000 ALTER TABLE `user_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userfavoritepattern`
--

DROP TABLE IF EXISTS `userfavoritepattern`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userfavoritepattern` (
  `UserID` int NOT NULL,
  `PatternID` int NOT NULL,
  `SavedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`,`PatternID`),
  KEY `PatternID` (`PatternID`),
  CONSTRAINT `userfavoritepattern_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `userfavoritepattern_ibfk_2` FOREIGN KEY (`PatternID`) REFERENCES `pattern` (`PatternID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userfavoritepattern`
--

LOCK TABLES `userfavoritepattern` WRITE;
/*!40000 ALTER TABLE `userfavoritepattern` DISABLE KEYS */;
INSERT INTO `userfavoritepattern` VALUES (2,1,'2026-05-30 15:06:51'),(4,1,'2026-05-30 15:11:55'),(10,3,'2026-06-06 06:56:04');
/*!40000 ALTER TABLE `userfavoritepattern` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `UserID` int NOT NULL,
  `Email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `PasswordHash` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProfilePicture` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Bio` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `RoleID` int NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `IX_users_Email` (`Email`),
  KEY `IX_users_RoleID` (`RoleID`),
  CONSTRAINT `FK_users_lookup_RoleID` FOREIGN KEY (`RoleID`) REFERENCES `lookup` (`LookupID`) ON DELETE CASCADE,
  CONSTRAINT `FK_users_person_UserID` FOREIGN KEY (`UserID`) REFERENCES `person` (`PersonID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@crochethub.com','$2a$11$0ftU8Iyoqqem5Ezf7zGKe.qPNNjJipaENcVTopn5zjNoC9exiT.6q',NULL,NULL,8,'2025-01-01 00:00:00.000000'),(2,'ghaniamajid@gmail.com','$2a$11$xwqlypQ1Iaocj2z0PEP18OdMnpFVkOJ5RwIQSxi6NJnMNADrh5xnW','https://i.pinimg.com/736x/8d/c0/34/8dc03475a87f5a83a86aeed9d72bff5a.jpg','I\'m a crochet enthusiast eager to grow and make friends with other crocheters',6,'2026-05-14 15:58:49.080618'),(4,'testuser2@gmail.com','$2a$11$e.pIudPa7elDnaZKwJzvouCRnya1MA.pYpKYwi6kV.i3qso6YLsum','https://placeholder.co/300x300',NULL,7,'2026-05-15 19:57:52.497182'),(10,'sarahahmed@gmail.com','$2a$11$KiMIbpBwsPSFpPRr4JU/7.pGh57hTj69wP5gVywINAcwdCSJIjlcS','https://th.bing.com/th/id/OIP.lHGNuCKo4R6ki-617U0FIgHaNN?w=202&h=328&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3','I started crocheting as a distraction from my problems and fell in love with it and now i create different things.',6,'2026-06-06 11:25:07.516076'),(11,'seemalmajid@gmail.com','$2a$11$s7LzG4KJ4GUrX58BF/hQx.NmYRyeuC8GpAZxys/uSJbaly5Cpj31u',NULL,NULL,7,'2026-06-09 17:26:53.498876');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-09 22:31:22

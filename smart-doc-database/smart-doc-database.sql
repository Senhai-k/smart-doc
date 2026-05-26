CREATE DATABASE  IF NOT EXISTS `smart_doc` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `smart_doc`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: smart_doc
-- ------------------------------------------------------
-- Server version	8.0.37

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
-- Table structure for table `alembic_version`
--

DROP TABLE IF EXISTS `alembic_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alembic_version` (
  `version_num` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`version_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alembic_version`
--

LOCK TABLES `alembic_version` WRITE;
/*!40000 ALTER TABLE `alembic_version` DISABLE KEYS */;
INSERT INTO `alembic_version` VALUES ('48d3ea8bbb80');
/*!40000 ALTER TABLE `alembic_version` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `histories`
--

DROP TABLE IF EXISTS `histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `histories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `type` enum('ocr','summary','sentiment','keywords','translate') COLLATE utf8mb4_unicode_ci NOT NULL,
  `input_text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `output_text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `histories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `histories`
--

LOCK TABLES `histories` WRITE;
/*!40000 ALTER TABLE `histories` DISABLE KEYS */;
INSERT INTO `histories` VALUES (1,1,'ocr','test.png','未识别到文字','2026-05-26 01:42:20'),(2,1,'ocr','word.jpg','无论身处何地，全然地安于当下\n试着觉察你自己是否用语言或是思想\n在抱怨一个你身处的状况，或是别人\n说的话、做的事，你的环境、你的生活\n情境甚至天气。抱怨通常是人们对本然\n不接受的表现。当你在抱怨时，你就便\n自己变成了一个受害者。当你大声说出\n自己的感受，你就是在行使你的力量。\n所以如果有必要或者有可能的话，你可\n以通过采取行动或大声说出你的想法\n来改变这种情况；要么离开这种情境，\n要么就接纳它，其他一切的行为都是疯\n狂的。\n普通的无意识状态通常与抗拒当下时\n刻有关。当下同样意味看此地。你在抗\n拒你所处的此时此地吗？有些人常常希\n望他们身在别处。他们的“此地”永远不\n够好。自我观察一下，看看这种情况是\n否发生在你的生活之中。不管你身处何\n个上滑显示工具栏\n164/417','2026-05-26 01:45:00'),(3,1,'summary','抱怨通常是人们对本然不接受的表现。当你在抱怨时，你就使自己变成了一个受害者。当你大声说出自己的感受，你就是在行使你的力量。','抱怨源于对现实的不接受，会让人陷入受害者心态。而勇敢表达感受，则是主动掌控力量的表现。','2026-05-26 02:16:57'),(4,1,'summary','抱怨通常是人们对本然不接受的表现。当你在抱怨时，你就使自己变成了一个受害者。当你大声说出自己的感受，你就是在行使你的力量。','抱怨是对现实的不满，使人沦为受害者；而表达感受则是主动行使力量。','2026-05-26 02:17:08'),(5,1,'sentiment','抱怨通常是人们对本然不接受的表现。当你在抱怨时，你就使自己变成了一个受害者。当你大声说出自己的感受，你就是在行使你的力量。','中性','2026-05-26 02:17:13'),(6,1,'keywords','抱怨通常是人们对本然不接受的表现。当你在抱怨时，你就使自己变成了一个受害者。当你大声说出自己的感受，你就是在行使你的力量。','接受,抱怨,受害者,感受,力量','2026-05-26 02:17:18'),(7,1,'translate','抱怨通常是人们对本然不接受的表现。当你在抱怨时，你就使自己变成了一个受害者。当你大声说出自己的感受，你就是在行使你的力量。','Complaining is usually a manifestation of people\'s refusal to accept what is. When you complain, you make yourself a victim. When you speak out your feelings, you are exercising your power.','2026-05-26 02:17:23'),(8,1,'ocr','test.png','未识别到文字','2026-05-26 02:22:45'),(9,1,'ocr','word.jpg','无论身处何地，全然地安于当下\n试着觉察你自己是否用语言或是思想\n在抱怨一个你身处的状况，或是别人\n说的话、做的事，你的环境、你的生活\n情境甚至天气。抱怨通常是人们对本然\n不接受的表现。当你在抱怨时，你就便\n自己变成了一个受害者。当你大声说出\n自己的感受，你就是在行使你的力量。\n所以如果有必要或者有可能的话，你可\n以通过采取行动或大声说出你的想法\n来改变这种情况；要么离开这种情境，\n要么就接纳它，其他一切的行为都是疯\n狂的。\n普通的无意识状态通常与抗拒当下时\n刻有关。当下同样意味看此地。你在抗\n拒你所处的此时此地吗？有些人常常希\n望他们身在别处。他们的“此地”永远不\n够好。自我观察一下，看看这种情况是\n否发生在你的生活之中。不管你身处何\n个上滑显示工具栏\n164/417','2026-05-26 02:23:00'),(10,1,'ocr','test.png','未识别到文字','2026-05-26 02:24:29'),(11,1,'ocr','test.png','未识别到文字','2026-05-26 02:24:49'),(12,1,'ocr','test.png','未识别到文字','2026-05-26 02:25:00'),(13,1,'ocr','test.png','未识别到文字','2026-05-26 02:26:05'),(14,1,'ocr','test.png','未识别到文字','2026-05-26 02:26:19');
/*!40000 ALTER TABLE `histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operation_logs`
--

DROP TABLE IF EXISTS `operation_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `operation_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `status` enum('success','failed') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `operation_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operation_logs`
--

LOCK TABLES `operation_logs` WRITE;
/*!40000 ALTER TABLE `operation_logs` DISABLE KEYS */;
INSERT INTO `operation_logs` VALUES (1,1,'admin','OCR识别','ocr','127.0.0.1','curl/7.61.0',3942,'failed','2026-05-26 01:36:15'),(2,1,'admin','OCR识别','ocr','127.0.0.1','curl/7.61.0',24,'failed','2026-05-26 01:37:56'),(3,1,'admin','OCR识别','ocr','127.0.0.1','curl/7.61.0',27757,'success','2026-05-26 01:42:20'),(4,1,'admin','OCR识别','ocr','127.0.0.1','curl/7.61.0',8422,'success','2026-05-26 01:45:00'),(5,1,'admin','OCR识别','ocr','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',15938,'success','2026-05-26 02:22:45'),(6,1,'admin','OCR识别','ocr','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',8384,'success','2026-05-26 02:23:00'),(7,1,'admin','OCR识别','ocr','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1587,'success','2026-05-26 02:24:29'),(8,1,'admin','OCR识别','ocr','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1535,'success','2026-05-26 02:24:49'),(9,1,'admin','OCR识别','ocr','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',1696,'success','2026-05-26 02:25:00'),(10,1,'admin','OCR识别','ocr','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',599,'success','2026-05-26 02:26:05'),(11,1,'admin','OCR识别','ocr','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',731,'success','2026-05-26 02:26:19');
/*!40000 ALTER TABLE `operation_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','user') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','disabled') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `last_login_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','scrypt:32768:8:1$BFO2YjQIdA39FDSy$99e4a29db1f428908de5792cb7bc992cc02a5a63facf8c1ace6fef5a793472ae641de0a270bc38b1dd8176fb006f4f84b1104847994a55d4852dad21567e64d2','admin@example.com','admin','active','2026-05-26 01:14:55','2026-05-26 02:16:39'),(2,'newname','scrypt:32768:8:1$rdUQ76jEaCqU9QH9$69b22b2369c3d0c2939fc04e3fabc4be0f27b870319f4afc97eff3bbbcd01e918f8c579f774e8c85f69c639d94b8ebc7ee580de7f5ef072c664b3060d360071f','test@example.com','user','active','2026-05-26 01:14:55',NULL),(4,'test01','scrypt:32768:8:1$elbEJAFJJEgFkd0F$31d2759aef4f8372bdfb32fc88a77ae7151c2649abb781aa8a8bf9e4a5af47ceb0b0f4c8884a00a116f2b81a8130ed12bf744641c37c205a5e29289c55863872','123@test.email','user','active','2026-05-26 02:27:13','2026-05-26 02:27:24');
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

-- Dump completed on 2026-05-26 13:53:51

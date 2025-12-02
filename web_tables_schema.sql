-- SQL Schema for Rank1 City Website Features
-- Run this on your Slave Database (Port 3307) to create necessary tables

CREATE DATABASE IF NOT EXISTS `rank1city_web`;
USE `rank1city_web`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for gangs
-- ----------------------------
DROP TABLE IF EXISTS `gangs`;
CREATE TABLE `gangs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `gang_code` varchar(50) NOT NULL,
  `leader_discord_id` varchar(50) NOT NULL,
  `member_count` int(11) DEFAULT 0,
  `max_members` int(11) DEFAULT 20,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `gang_code` (`gang_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for preregistrations
-- ----------------------------
DROP TABLE IF EXISTS `preregistrations`;
CREATE TABLE `preregistrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `discord_id` varchar(50) NOT NULL,
  `discord_name` varchar(255) NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `referral_code` varchar(50) NOT NULL,
  `referred_by` varchar(50) DEFAULT NULL,
  `gang_id` int(11) DEFAULT NULL,
  `invite_count` int(11) DEFAULT 0,
  `ticket_count` int(11) DEFAULT 0,
  `last_checkin` datetime DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `discord_id` (`discord_id`),
  UNIQUE KEY `referral_code` (`referral_code`),
  KEY `gang_id` (`gang_id`),
  CONSTRAINT `fk_gang` FOREIGN KEY (`gang_id`) REFERENCES `gangs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for lucky_draw_history
-- ----------------------------
DROP TABLE IF EXISTS `lucky_draw_history`;
CREATE TABLE `lucky_draw_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `discord_id` varchar(50) NOT NULL,
  `item_id` varchar(50) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `discord_id` (`discord_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for claim_queue
-- ----------------------------
DROP TABLE IF EXISTS `claim_queue`;
CREATE TABLE `claim_queue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `discord_id` varchar(50) NOT NULL,
  `item_id` varchar(50) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `amount` int(11) DEFAULT 1,
  `status` enum('pending','claimed') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `claimed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `discord_id` (`discord_id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

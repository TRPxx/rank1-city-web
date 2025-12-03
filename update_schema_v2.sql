-- Add transaction_logs table
DROP TABLE IF EXISTS `transaction_logs`;
CREATE TABLE `transaction_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `discord_id` varchar(50) NOT NULL,
  `action` varchar(50) NOT NULL,
  `amount` int(11) DEFAULT 0,
  `details` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `discord_id` (`discord_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add families table (similar to gangs for now)
DROP TABLE IF EXISTS `families`;
CREATE TABLE `families` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `family_code` varchar(50) NOT NULL,
  `leader_discord_id` varchar(50) NOT NULL,
  `member_count` int(11) DEFAULT 0,
  `max_members` int(11) DEFAULT 50,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `family_code` (`family_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
